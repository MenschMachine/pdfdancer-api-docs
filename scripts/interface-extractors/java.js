'use strict';

function splitParameters(parameters) {
  if (!parameters.trim()) return [];
  const result = [];
  let start = 0;
  let depth = 0;
  for (let index = 0; index < parameters.length; index += 1) {
    const character = parameters[index];
    if (character === '<' || character === '(' || character === '[') depth += 1;
    if (character === '>' || character === ')' || character === ']') depth -= 1;
    if (character === ',' && depth === 0) {
      result.push(parameters.slice(start, index).trim());
      start = index + 1;
    }
  }
  result.push(parameters.slice(start).trim());
  return result;
}

function parseJavap(text, className) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const header = lines.find((line) => /^public\s/.test(line) && line.endsWith('{'));
  if (!header) throw new Error(`javap did not emit a public declaration for ${className}`);
  const isEnum = /extends java\.lang\.Enum</.test(header) || /\benum\b/.test(header);
  const kind = isEnum ? 'enum' : /\binterface\b/.test(header) ? 'interface' : /\brecord\b/.test(header) ? 'record' : 'class';
  const simpleName = className.split('.').pop();
  const members = [];

  for (const original of lines) {
    if (!original.startsWith('public ') || original === header) continue;
    const declaration = original.replace(/;$/, '').replace(/\s+/g, ' ');
    const staticMember = /\bstatic\b/.test(declaration);
    const open = declaration.indexOf('(');
    if (open !== -1) {
      const close = declaration.lastIndexOf(')');
      if (close === -1) continue;
      const prefix = declaration.slice(0, open).trim();
      const callableName = prefix.split(' ').pop();
      const name = callableName === className || callableName === simpleName ? 'constructor' : callableName.split('.').pop();
      const kindName = name === 'constructor' ? 'constructor' : 'method';
      members.push({
        id: `${kindName}:${name}`,
        name,
        kind: kindName,
        signature: declaration,
        arity: splitParameters(declaration.slice(open + 1, close)).length,
        static: staticMember,
      });
      continue;
    }
    const name = declaration.split(/[ =]/).pop();
    const enumValue = isEnum && staticMember && declaration.includes(` ${className} `);
    members.push({
      id: `${enumValue ? 'enum-value' : 'field'}:${name}`,
      name,
      kind: enumValue ? 'enum-value' : 'field',
      signature: declaration,
      static: staticMember,
    });
  }

  return {
    id: className,
    name: simpleName,
    kind,
    signature: header.slice(0, -1).trim(),
    members,
  };
}

function parseJavapCollection(text) {
  const symbols = [];
  for (const section of text.split(/(?=Compiled from ")/)) {
    const header = section.split(/\r?\n/).map((line) => line.trim())
      .find((line) => /^public\s/.test(line) && line.endsWith('{'));
    if (!header) continue;
    const match = header.match(/\b(?:class|interface|record|enum)\s+([^\s<{]+)/);
    if (!match) throw new Error(`Unable to identify the class in javap declaration: ${header}`);
    symbols.push(parseJavap(section, match[1]));
  }
  return symbols;
}

module.exports = {parseJavap, parseJavapCollection, splitParameters};
