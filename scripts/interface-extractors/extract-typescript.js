#!/usr/bin/env node
'use strict';

const path = require('node:path');
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

function extractSymbol(checker, exportedSymbol) {
  const exportName = exportedSymbol.getName();
  const symbol = (exportedSymbol.flags & ts.SymbolFlags.Alias)
    ? checker.getAliasedSymbol(exportedSymbol)
    : exportedSymbol;
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

  return {id: exportName, name: exportName, kind, signature: summary, members};
}

function extract(entryFile) {
  const options = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    skipLibCheck: true,
  };
  const program = ts.createProgram([entryFile], options);
  const diagnostics = ts.getPreEmitDiagnostics(program).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
  if (diagnostics.length > 0) {
    throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: process.cwd,
      getNewLine: () => '\n',
    }));
  }
  const source = program.getSourceFile(entryFile) || program.getSourceFile(path.resolve(entryFile));
  if (!source) throw new Error(`TypeScript declaration entry point not found: ${entryFile}`);
  const checker = program.getTypeChecker();
  const moduleSymbol = checker.getSymbolAtLocation(source);
  if (!moduleSymbol) throw new Error(`No module symbol found for: ${entryFile}`);
  const symbols = checker.getExportsOfModule(moduleSymbol)
    .map((symbol) => extractSymbol(checker, symbol))
    .filter(Boolean);
  return {symbols};
}

if (require.main === module) {
  const entryFile = process.argv[2];
  if (!entryFile) {
    process.stderr.write('Usage: extract-typescript.js <dist/index.d.ts>\n');
    process.exit(2);
  }
  process.stdout.write(`${JSON.stringify(extract(path.resolve(entryFile)), null, 2)}\n`);
}

module.exports = {extract};
