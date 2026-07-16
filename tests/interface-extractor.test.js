'use strict';

const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const {
  diffManifests,
  normalizeManifest,
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
    const helper = path.resolve(__dirname, '../scripts/interface-extractors/extract-python.py');
    const output = childProcess.execFileSync('python3', [helper], {
      encoding: 'utf8',
      env: {...process.env, PYTHONPATH: root},
    });
    const extracted = JSON.parse(output);
    assert.deepEqual(extracted.symbols.map((symbol) => symbol.id), ['Client', 'Mode', 'helper']);
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
