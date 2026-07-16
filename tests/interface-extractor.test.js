'use strict';

const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const {
  buildDiff,
  diffManifests,
  normalizeManifest,
  renderDiffMarkdown,
  renderSummaryMarkdown,
  replaceDirectoryAtomically,
  stableJson,
} = require('../scripts/interface-extractors/core');
const {parseJavap, parseJavapCollection, splitParameters} = require('../scripts/interface-extractors/java');
const {extract: extractTypeScript} = require('../scripts/interface-extractors/extract-typescript');

function manifest(symbols) {
  return normalizeManifest({
    language: 'test',
    repository: 'fixture',
    candidateRef: 'fixture',
    candidateCommit: '0000000000000000000000000000000000000000',
    symbols,
  });
}

test('diff pairs changed overloads and reports unmatched members', () => {
  const base = manifest([{id: 'Client', name: 'Client', kind: 'class', signature: 'class Client', members: [
    {id: 'method:find', name: 'find', kind: 'method', arity: 1, signature: 'find(id: string): Item'},
    {id: 'method:find', name: 'find', kind: 'method', arity: 2, signature: 'find(id: string, strict: boolean): Item'},
    {id: 'method:old', name: 'old', kind: 'method', arity: 0, signature: 'old(): void'},
  ]}]);
  const candidate = manifest([{id: 'Client', name: 'Client', kind: 'class', signature: 'class Client', members: [
    {id: 'method:find', name: 'find', kind: 'method', arity: 1, signature: 'find(id: number): Item'},
    {id: 'method:find', name: 'find', kind: 'method', arity: 2, signature: 'find(id: string, strict: boolean): Item'},
    {id: 'method:new', name: 'new', kind: 'method', arity: 0, signature: 'new(): void'},
  ]}]);
  assert.deepEqual(diffManifests(base, candidate), [
    {kind: 'added', symbol: 'Client', after: 'new(): void'},
    {kind: 'changed', symbol: 'Client', before: 'find(id: string): Item', after: 'find(id: number): Item'},
    {kind: 'removed', symbol: 'Client', before: 'old(): void'},
  ]);
});

test('review reports list new symbols once and detail only retained-symbol members', () => {
  const base = manifest([
    {id: 'Client', name: 'Client', kind: 'class', signature: 'class Client', members: [
      {id: 'method:find', name: 'find', kind: 'method', arity: 1, signature: 'find(id: string): Item'},
    ]},
    {id: 'Legacy', name: 'Legacy', kind: 'class', signature: 'class Legacy', members: [
      {id: 'method:old', name: 'old', kind: 'method', arity: 0, signature: 'old(): void'},
    ]},
  ]);
  const candidate = manifest([
    {id: 'Client', name: 'Client', kind: 'class', signature: 'class Client', members: [
      {id: 'method:find', name: 'find', kind: 'method', arity: 1, signature: 'find(id: number): Item'},
    ]},
    {id: 'NewApi', name: 'NewApi', kind: 'class', signature: 'class NewApi', members: [
      {id: 'method:create', name: 'create', kind: 'method', arity: 0, signature: 'create(): NewApi'},
    ]},
  ]);
  const refs = {test: {
    repository: 'fixture', baseRef: 'v1', baseCommit: '111', candidateRef: 'v2', candidateCommit: '222',
  }};
  const diff = buildDiff({test: base}, {test: candidate}, refs);
  assert.deepEqual(diff.languages.test.counts.symbols, {added: 1, promoted: 0, removed: 1, changed: 1});
  assert.deepEqual(diff.languages.test.counts.retainedSymbolMembers, {added: 0, promoted: 0, removed: 0, changed: 1});
  const report = renderDiffMarkdown(diff);
  assert.match(report, /Added public symbols \(1\)/);
  assert.match(report, /`NewApi` — class/);
  assert.match(report, /find\(id: string\): Item.*find\(id: number\): Item/);
  assert.doesNotMatch(report, /create\(\): NewApi/);
  const summary = renderSummaryMarkdown(diff);
  assert.match(summary, /\| Public symbols \| 1 \| 0 \| 1 \| 1 \|/);
  assert.match(summary, /### Changed symbols \(1\)[\s\S]*`Client`/);
});

test('review model distinguishes an existing declaration promoted to the package root', () => {
  const base = manifest([{id: 'BaseObject', name: 'BaseObject', module: 'types', kind: 'class', signature: 'class BaseObject', members: []}]);
  const candidate = manifest([{id: 'BaseObject', name: 'BaseObject', module: 'types', kind: 'class', signature: 'class BaseObject', members: []}]);
  const refs = {test: {
    repository: 'fixture', baseRef: 'v1', baseCommit: '111', candidateRef: 'v2', candidateCommit: '222',
    promotedSymbols: ['BaseObject'],
  }};
  const diff = buildDiff({test: base}, {test: candidate}, refs);
  assert.deepEqual(diff.languages.test.counts.symbols, {added: 0, promoted: 1, removed: 0, changed: 0});
  assert.equal(diff.languages.test.symbolChanges[0].status, 'promoted');
  assert.match(renderSummaryMarkdown(diff), /### Promoted symbols \(1\)[\s\S]*`BaseObject`/);
});

test('manifest serialization is deterministic', () => {
  const first = manifest([
    {id: 'Z', name: 'Z', kind: 'class', signature: 'Z', members: []},
    {id: 'A', name: 'A', kind: 'class', signature: 'A', members: []},
  ]);
  const second = manifest([...first.symbols].reverse());
  assert.equal(stableJson(first), stableJson(second));
});

test('atomic directory replacement preserves the complete staged set', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'interface-atomic-test-'));
  try {
    const output = path.join(root, 'generated');
    const staging = path.join(root, 'staging');
    fs.mkdirSync(output);
    fs.mkdirSync(staging);
    fs.writeFileSync(path.join(output, 'old.txt'), 'old');
    fs.writeFileSync(path.join(staging, 'new.txt'), 'new');
    replaceDirectoryAtomically(staging, output);
    assert.deepEqual(fs.readdirSync(output), ['new.txt']);
    assert.equal(fs.readFileSync(path.join(output, 'new.txt'), 'utf8'), 'new');
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});

test('atomic directory replacement restores existing output when activation fails', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'interface-rollback-test-'));
  try {
    const output = path.join(root, 'generated');
    fs.mkdirSync(output);
    fs.writeFileSync(path.join(output, 'current.txt'), 'current');
    assert.throws(() => replaceDirectoryAtomically(path.join(root, 'missing-staging'), output));
    assert.equal(fs.readFileSync(path.join(output, 'current.txt'), 'utf8'), 'current');
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});

test('Python extractor honors __all__ and includes SDK-defined inherited members', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'interface-python-test-'));
  try {
    const packageDirectory = path.join(root, 'pdfdancer');
    fs.mkdirSync(packageDirectory);
    fs.writeFileSync(path.join(packageDirectory, '__init__.py'), [
      'from enum import Enum',
      '__all__ = ["Client", "Mode", "helper"]',
      'class Base:',
      '    def inherited(self, value: int = 3) -> str: return str(value)',
      'class Client(Base):',
      '    @property',
      '    def name(self) -> str: return "client"',
      'class Mode(Enum):',
      '    FAST = "fast"',
      'def helper(optional: str | None = None) -> bool: return optional is None',
      'class Internal: pass',
      '',
    ].join('\n'));
    fs.writeFileSync(path.join(packageDirectory, 'types.py'), 'class DeepObject:\n    def edit(self) -> None: pass\n');
    const helper = path.resolve(__dirname, '../scripts/interface-extractors/extract-python.py');
    const output = childProcess.execFileSync('python3', [helper], {
      encoding: 'utf8',
      env: {...process.env, PYTHONPATH: root},
    });
    const extracted = JSON.parse(output);
    assert.deepEqual(extracted.symbols.map((symbol) => symbol.id), ['Client', 'Mode', 'helper']);
    assert.ok(extracted.allModuleSymbols.some((symbol) => symbol.id === 'DeepObject' && symbol.module === 'types'));
    const client = extracted.symbols.find((symbol) => symbol.id === 'Client');
    assert.ok(client.members.some((member) => member.name === 'inherited' && member.signature.includes('value: int = 3')));
    assert.ok(client.members.some((member) => member.name === 'name' && member.kind === 'property'));
    const mode = extracted.symbols.find((symbol) => symbol.id === 'Mode');
    assert.ok(mode.members.some((member) => member.signature === "FAST = 'fast'"));
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});

test('TypeScript extractor resolves entry-point re-exports and overloads', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'interface-typescript-test-'));
  try {
    fs.writeFileSync(path.join(root, 'api.d.ts'), [
      'export declare class Api {',
      '  readonly label?: string;',
      '  find(id: string): string;',
      '  find(id: number): string;',
      '}',
      'export interface Options { strict?: boolean; }',
      '',
    ].join('\n'));
    const entry = path.join(root, 'index.d.ts');
    fs.writeFileSync(entry, "export { Api as Client, Options } from './api';\n");
    const extracted = extractTypeScript(entry);
    assert.deepEqual(extracted.symbols.map((symbol) => symbol.id).sort(), ['Client', 'Options']);
    const client = extracted.symbols.find((symbol) => symbol.id === 'Client');
    assert.equal(client.kind, 'class');
    assert.equal(client.members.filter((member) => member.name === 'find').length, 2);
    assert.ok(client.members.some((member) => member.signature.includes('id: string')));
    assert.ok(client.members.some((member) => member.signature === 'label?: string'));
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});

test('TypeScript module scan does not label an existing deep export as new when it gains a root re-export', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'interface-typescript-reexport-test-'));
  try {
    const base = path.join(root, 'base');
    const candidate = path.join(root, 'candidate');
    fs.mkdirSync(base);
    fs.mkdirSync(candidate);
    fs.writeFileSync(path.join(base, 'types.d.ts'), 'export declare class BaseObject { delete(): Promise<boolean>; }\n');
    fs.writeFileSync(path.join(base, 'index.d.ts'), 'export declare const VERSION = "1";\n');
    fs.writeFileSync(path.join(candidate, 'types.d.ts'), 'export declare class BaseObject { delete(): Promise<boolean>; }\n');
    fs.writeFileSync(path.join(candidate, 'index.d.ts'), [
      'export { BaseObject } from "./types";',
      'export declare const VERSION = "2";',
      '',
    ].join('\n'));
    const baseManifest = manifest(extractTypeScript(base).symbols);
    const candidateManifest = manifest(extractTypeScript(candidate).symbols);
    assert.ok(baseManifest.symbols.some((symbol) => symbol.id === 'BaseObject'));
    assert.ok(candidateManifest.symbols.some((symbol) => symbol.id === 'BaseObject'));
    assert.ok(!diffManifests(baseManifest, candidateManifest)
      .some((change) => change.symbol === 'BaseObject'));
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});

test('javap parser distinguishes constructors, methods, fields, and enum values', () => {
  const output = [
    'Compiled from "Mode.java"',
    'public final class com.example.Mode extends java.lang.Enum<com.example.Mode> {',
    '  public static final com.example.Mode FAST;',
    '  public static com.example.Mode valueOf(java.lang.String);',
    '  public void apply(java.util.Map<java.lang.String, java.lang.Integer>, int);',
    '}',
  ].join('\n');
  const symbol = parseJavap(output, 'com.example.Mode');
  assert.equal(symbol.kind, 'enum');
  assert.ok(symbol.members.some((member) => member.kind === 'enum-value' && member.name === 'FAST'));
  assert.ok(symbol.members.some((member) => member.name === 'apply' && member.arity === 2));
  assert.equal(splitParameters('java.util.Map<java.lang.String, java.lang.Integer>, int').length, 2);
  assert.deepEqual(parseJavapCollection(`${output}\n${output.replaceAll('com.example.Mode', 'com.example.Other')}`)
    .map((item) => item.id), ['com.example.Mode', 'com.example.Other']);
});
