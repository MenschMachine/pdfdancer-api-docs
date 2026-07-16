#!/usr/bin/env node
'use strict';

const path = require('node:path');
const fs = require('node:fs');
const ts = require('typescript');

function modifiers(declaration) {
  return new Set((declaration?.modifiers || []).map((modifier) => modifier.kind));
}

function isPublic(symbol) {
  return (symbol.declarations || []).every((declaration) =>
    !modifiers(declaration).has(ts.SyntaxKind.PrivateKeyword) &&
    !modifiers(declaration).has(ts.SyntaxKind.ProtectedKeyword));
}

function signatureText(checker, signature, name) {
  const text = checker.signatureToString(
    signature,
    undefined,
    ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
    ts.SignatureKind.Call,
  );
  return `${name}${text}`;
}

function signatureArity(signature) {
  return signature.parameters.length;
}

function declarationKind(symbol) {
  const flags = symbol.flags;
  if (flags & ts.SymbolFlags.Class) return 'class';
  if (flags & ts.SymbolFlags.Interface) return 'interface';
  if (flags & ts.SymbolFlags.Enum) return 'enum';
  if (flags & ts.SymbolFlags.TypeAlias) return 'type';
  if (flags & ts.SymbolFlags.Function) return 'function';
  return 'value';
}

function compactSourceText(node) {
  return node.getText().replace(/\s+/g, ' ').replace(/\s*([<>,])\s*/g, '$1').trim();
}

function declaredTypeHeader(kind, exportName, declaration) {
  const typeParameters = declaration.typeParameters?.length
    ? `<${declaration.typeParameters.map(compactSourceText).join(',')}>`
    : '';
  const heritage = declaration.heritageClauses?.length
    ? ` ${declaration.heritageClauses.map(compactSourceText).join(' ')}`
    : '';
  return `${kind} ${exportName}${typeParameters}${heritage}`;
}

function membersForType(checker, ownerName, type, isStatic) {
  const result = [];
  for (const property of checker.getPropertiesOfType(type)) {
    const name = property.getName();
    if (!isPublic(property) || (isStatic && ['length', 'name', 'prototype'].includes(name))) continue;
    const declaration = property.valueDeclaration || property.declarations?.[0];
    if (!declaration) continue;
    const propertyType = checker.getTypeOfSymbolAtLocation(property, declaration);
    const signatures = checker.getSignaturesOfType(propertyType, ts.SignatureKind.Call);
    if (signatures.length > 0) {
      for (const signature of signatures) {
        result.push({
          id: `method:${name}`,
          name,
          kind: 'method',
          signature: signatureText(checker, signature, name),
          arity: signatureArity(signature),
          static: isStatic,
        });
      }
      continue;
    }
    const optional = (property.flags & ts.SymbolFlags.Optional) !== 0 ? '?' : '';
    result.push({
      id: `property:${name}`,
      name,
      kind: 'property',
      signature: `${name}${optional}: ${checker.typeToString(propertyType, declaration, ts.TypeFormatFlags.NoTruncation)}`,
      static: isStatic,
    });
  }
  return result;
}

function extractSymbol(checker, symbol, exportName, moduleName) {
  const declaration = symbol.valueDeclaration || symbol.declarations?.[0];
  if (!declaration) return null;
  const kind = declarationKind(symbol);
  const members = [];
  let summary = `${kind} ${exportName}`;

  if (kind === 'class' || kind === 'interface') {
    summary = declaredTypeHeader(kind, exportName, declaration);
    const declaredType = checker.getDeclaredTypeOfSymbol(symbol);
    members.push(...membersForType(checker, exportName, declaredType, false));
    if (kind === 'class') {
      const staticType = checker.getTypeOfSymbolAtLocation(symbol, declaration);
      const constructors = checker.getSignaturesOfType(staticType, ts.SignatureKind.Construct);
      for (const constructor of constructors) {
        members.push({
          id: 'constructor:constructor',
          name: 'constructor',
          kind: 'constructor',
          signature: signatureText(checker, constructor, 'constructor'),
          arity: signatureArity(constructor),
          static: true,
        });
      }
      members.push(...membersForType(checker, exportName, staticType, true));
    }
  } else if (kind === 'enum') {
    for (const enumMember of symbol.exports?.values() || []) {
      const enumDeclaration = enumMember.valueDeclaration || enumMember.declarations?.[0];
      const constant = enumDeclaration ? checker.getConstantValue(enumDeclaration) : undefined;
      members.push({
        id: `enum-value:${enumMember.getName()}`,
        name: enumMember.getName(),
        kind: 'enum-value',
        signature: constant === undefined ? enumMember.getName() : `${enumMember.getName()} = ${JSON.stringify(constant)}`,
        static: true,
      });
    }
  } else if (kind === 'type' && ts.isTypeAliasDeclaration(declaration)) {
    const type = checker.getTypeFromTypeNode(declaration.type);
    summary = `type ${exportName} = ${checker.typeToString(type, declaration, ts.TypeFormatFlags.NoTruncation)}`;
  } else {
    const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
    const calls = checker.getSignaturesOfType(type, ts.SignatureKind.Call);
    if (calls.length > 0) {
      summary = calls.map((call) => signatureText(checker, call, exportName)).join(' | ');
    } else {
      summary = `${exportName}: ${checker.typeToString(type, declaration, ts.TypeFormatFlags.NoTruncation)}`;
    }
  }

  return {id: exportName, name: exportName, module: moduleName, kind, signature: summary, members};
}

function declarationFiles(input) {
  const stat = fs.statSync(input);
  if (stat.isFile()) return [input];
  const result = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true}).sort((a, b) => a.name.localeCompare(b.name))) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (entry.name.endsWith('.d.ts')) result.push(fullPath);
    }
  };
  visit(input);
  return result;
}

function moduleName(root, sourceFile) {
  const relative = path.relative(root, sourceFile).replaceAll(path.sep, '/').replace(/\.d\.ts$/, '');
  return relative || 'index';
}

function extract(input) {
  const absoluteInput = path.resolve(input);
  const files = declarationFiles(absoluteInput).map((file) => path.resolve(file));
  const root = fs.statSync(absoluteInput).isDirectory() ? absoluteInput : path.dirname(absoluteInput);
  const options = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    skipLibCheck: true,
  };
  const program = ts.createProgram(files, options);
  const diagnostics = ts.getPreEmitDiagnostics(program).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
  if (diagnostics.length > 0) {
    throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: process.cwd,
      getNewLine: () => '\n',
    }));
  }
  const checker = program.getTypeChecker();
  const targets = new Map();
  for (const file of files) {
    const source = program.getSourceFile(file);
    if (!source) throw new Error(`TypeScript declaration file not found in compiler program: ${file}`);
    const sourceModule = checker.getSymbolAtLocation(source);
    if (!sourceModule) continue;
    for (const exported of checker.getExportsOfModule(sourceModule)) {
      const target = (exported.flags & ts.SymbolFlags.Alias) ? checker.getAliasedSymbol(exported) : exported;
      const declaration = target.valueDeclaration || target.declarations?.[0];
      if (!declaration) continue;
      const declarationFile = path.resolve(declaration.getSourceFile().fileName);
      if (declarationFile !== root && !declarationFile.startsWith(`${root}${path.sep}`)) continue;
      const current = targets.get(target) || {
        names: new Set(),
        module: moduleName(root, declarationFile),
      };
      current.names.add(exported.getName());
      targets.set(target, current);
    }
  }

  const extracted = [];
  for (const [target, details] of targets) {
    for (const name of [...details.names].sort()) {
      const symbol = extractSymbol(checker, target, name, details.module);
      if (symbol) extracted.push(symbol);
    }
  }
  const nameCounts = new Map();
  for (const symbol of extracted) nameCounts.set(symbol.name, (nameCounts.get(symbol.name) || 0) + 1);
  for (const symbol of extracted) {
    if (nameCounts.get(symbol.name) > 1) symbol.id = `${symbol.module}#${symbol.name}`;
  }
  const symbols = extracted;
  return {symbols};
}

if (require.main === module) {
  const input = process.argv[2];
  if (!input) {
    process.stderr.write('Usage: extract-typescript.js <dist-directory-or-declaration-file>\n');
    process.exit(2);
  }
  process.stdout.write(`${JSON.stringify(extract(path.resolve(input)), null, 2)}\n`);
}

module.exports = {extract};
