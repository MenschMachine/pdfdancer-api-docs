#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {readSdkMetadata} = require('./sdk-metadata');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_DIR = path.join(ROOT, 'docs/capabilities/generated');
const JAVA_POLICY_SNAPSHOT = path.join(MANIFEST_DIR, 'java-public-api-v3.json');
const CHECK_MODE = process.argv.includes('--check');
const PUBLISHED_OUTPUT_DIR = path.join(ROOT, 'docs/reference');
const OUTPUT_DIR = CHECK_MODE
  ? path.join(ROOT, 'build', '.v3-reference-check')
  : PUBLISHED_OUTPUT_DIR;
const LANGUAGES = {
  python: {label: 'Python', repository: 'pdfdancer-client-python', packageName: 'pdfdancer-client-python', version: '3.0.2'},
  typescript: {label: 'TypeScript', repository: 'pdfdancer-client-typescript', packageName: 'pdfdancer-client-typescript', version: '3.0.1'},
  java: {label: 'Java', repository: 'pdfdancer-client-java', packageName: 'com.pdfdancer.client:pdfdancer-client-java', version: '3.0.1'},
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function relativeFiles(directory) {
  const files = [];
  function visit(current) {
    for (const entry of fs.readdirSync(current, {withFileTypes: true})) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else files.push(path.relative(directory, absolute));
    }
  }
  visit(directory);
  return files.sort();
}

function assertSameTree(expected, actual) {
  if (!fs.existsSync(actual)) throw new Error(`Generated reference is missing: ${actual}`);
  const expectedFiles = relativeFiles(expected);
  const actualFiles = relativeFiles(actual);
  if (JSON.stringify(expectedFiles) !== JSON.stringify(actualFiles)) {
    throw new Error('Generated API reference file list is stale. Run npm run generate:v3-reference.');
  }
  const changed = expectedFiles.filter((file) =>
    fs.readFileSync(path.join(expected, file), 'utf8') !==
    fs.readFileSync(path.join(actual, file), 'utf8'));
  if (changed.length) {
    throw new Error(`Generated API reference is stale: ${changed.join(', ')}. Run npm run generate:v3-reference.`);
  }
}

function stableSlug(value) {
  return value
    .replaceAll('$', '-')
    .replaceAll('#', '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function mdxText(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('{', '&#123;')
    .replaceAll('}', '&#125;');
}

function codeFence(value, language = 'text') {
  return `\`\`\`${language}\n${String(value).trim()}\n\`\`\``;
}

function groupName(language, symbol) {
  if (language === 'java') return symbol.id.includes('.') ? symbol.id.slice(0, symbol.id.lastIndexOf('.')) : 'default package';
  return symbol.module || 'package root';
}

function sourceUrl(language, manifest, symbol) {
  const base = `https://github.com/MenschMachine/${manifest.repository}/blob/${manifest.candidateCommit}`;
  if (language === 'python') {
    const modulePath = symbol.module === 'pdfdancer' || !symbol.module
      ? '__init__.py'
      : `${symbol.module.replaceAll('.', '/')}.py`;
    return `${base}/src/pdfdancer/${modulePath}`;
  }
  if (language === 'typescript') {
    const modulePath = !symbol.module || symbol.module === 'index' ? 'index' : symbol.module;
    return `${base}/src/${modulePath}.ts`;
  }
  const topLevel = symbol.id.split('$')[0];
  return `${base}/src/main/java/${topLevel.replaceAll('.', '/')}.java`;
}

function guideLinks(symbol) {
  const name = symbol.name.toLowerCase();
  const links = [];
  if (/text|color|affine/.test(name)) links.push('[Working with Text](../../working-with-text)', '[Text Layout and Reflow](../../text-layout)');
  if (/image/.test(name)) links.push('[Working with Images](../../working-with-images)');
  if (/page/.test(name)) links.push('[Working with Pages](../../working-with-pages)');
  if (/path|line|bezier|rectangle/.test(name)) links.push('[Working with Vector Graphics](../../working-with-vector-graphics)');
  if (/font/.test(name)) links.push('[Working with Fonts](../../working-with-fonts)');
  if (/formfield/.test(name)) links.push('[Working with AcroForms](../../working-with-acroforms)');
  else if (/form/.test(name)) links.push('[Working with Form XObjects](../../working-with-formxobjects)');
  if (/exception|error|result|response|diagnostic/.test(name)) links.push('[Error Handling](../../error-handling)');
  return [...new Set(links)];
}

function referenceDescription(language, symbol) {
  const config = LANGUAGES[language];
  const subject = `${config.label} API reference for ${symbol.name}`;
  const detail = String(symbol.description || '').replace(/\s+/g, ' ').trim();
  const group = groupName(language, symbol);
  const description = detail ? `${subject}. ${detail}` : subject;
  if (description.length >= 110) return description;

  return `${description} This public ${symbol.kind} belongs to the ${group} package and documents API behavior used for PDF document editing and inspection in PDFDancer SDK ${config.version}.`;
}

function renderSymbol(language, manifest, symbol) {
  const config = LANGUAGES[language];
  const lines = [
    '---',
    `id: ${stableSlug(symbol.id)}`,
    `title: ${JSON.stringify(symbol.name)}`,
    `description: ${JSON.stringify(referenceDescription(language, symbol))}`,
    'pagination_next: null',
    'pagination_prev: null',
    '---',
    '',
    '<!-- Generated by scripts/generate-v3-reference.js. Do not edit manually. -->',
    '',
    `# \`${symbol.name}\``,
    '',
    `**Kind:** ${symbol.kind}  `,
    `**Module/package:** \`${groupName(language, symbol)}\`  `,
    `**SDK:** \`${config.packageName} ${config.version}\``,
    '',
  ];
  if (symbol.description) lines.push(mdxText(symbol.description), '');
  if (symbol.deprecated) lines.push(`:::warning Deprecated\n${mdxText(symbol.deprecated)}\n:::`, '');
  lines.push('## Declaration', '', codeFence(symbol.signature, language === 'typescript' ? 'typescript' : language), '');
  if (symbol.members.length) {
    lines.push('## Members', '');
    for (const member of symbol.members) {
      lines.push(`### \`${member.name}\``, '', codeFence(member.signature, language === 'typescript' ? 'typescript' : language), '');
      if (member.description) lines.push(mdxText(member.description), '');
      if (member.deprecated) lines.push(`**Deprecated:** ${mdxText(member.deprecated)}`, '');
    }
  }
  const guides = guideLinks(symbol);
  if (guides.length) lines.push('## Related guides', '', ...guides.map((link) => `- ${link}`), '');
  lines.push(`[View source at \`${manifest.candidateCommit.slice(0, 12)}\`](${sourceUrl(language, manifest, symbol)})`, '');
  return `${lines.join('\n')}\n`;
}

function javaSupportedSymbols(manifest) {
  const configured = process.env.PDFDANCER_JAVA_SDK_DIR
    ? path.resolve(ROOT, process.env.PDFDANCER_JAVA_SDK_DIR, 'docs/public-api-v3.json')
    : path.resolve(ROOT, '../client-sdks/pdfdancer-client-java/docs/public-api-v3.json');
  const policyFile = fs.existsSync(configured) ? configured : JAVA_POLICY_SNAPSHOT;
  if (!fs.existsSync(policyFile)) {
    throw new Error(`Java public API manifest not found at ${configured} or ${JAVA_POLICY_SNAPSHOT}`);
  }
  const policy = readJson(policyFile);
  if (!CHECK_MODE && policyFile === configured) {
    fs.writeFileSync(JAVA_POLICY_SNAPSHOT, `${JSON.stringify(policy, null, 2)}\n`);
  }
  if (policy.schemaVersion !== 1) throw new Error(`Unsupported Java public API manifest schema: ${policy.schemaVersion}`);
  const symbolsById = new Map(manifest.symbols.map((symbol) => [symbol.id, symbol]));
  const classifications = new Map();
  for (const entry of policy.types) {
    if (!['supported', 'internal'].includes(entry.status)) throw new Error(`Invalid Java API status for ${entry.name}: ${entry.status}`);
    if (classifications.has(entry.name)) throw new Error(`Duplicate Java API classification: ${entry.name}`);
    classifications.set(entry.name, entry.status);
  }
  const unclassified = manifest.symbols.filter((symbol) => !classifications.has(symbol.id)).map((symbol) => symbol.id);
  const stale = [...classifications.keys()].filter((name) => !symbolsById.has(name));
  if (unclassified.length || stale.length) {
    throw new Error(`Java API classification drift. Unclassified: ${unclassified.join(', ') || 'none'}. Stale: ${stale.join(', ') || 'none'}.`);
  }
  return manifest.symbols.filter((symbol) => classifications.get(symbol.id) === 'supported');
}

function renderIndex(language, manifest, symbols) {
  const config = LANGUAGES[language];
  const groups = new Map();
  for (const symbol of symbols) {
    const group = groupName(language, symbol);
    const list = groups.get(group) || [];
    list.push(symbol);
    groups.set(group, list);
  }
  const lines = [
    '---',
    'id: index',
    `title: ${config.label} API Reference`,
    `description: Public ${config.label} types and members in PDFDancer SDK ${config.version}.`,
    '---',
    '',
    '<!-- Generated by scripts/generate-v3-reference.js. Do not edit manually. -->',
    '',
    `# ${config.label} API Reference`,
    '',
    `This reference covers the supported public surface of \`${config.packageName} ${config.version}\`, extracted from commit [\`${manifest.candidateCommit.slice(0, 12)}\`](https://github.com/MenschMachine/${manifest.repository}/tree/${manifest.candidateCommit}).`,
    '',
  ];
  for (const group of [...groups.keys()].sort()) {
    lines.push(`## \`${group}\``, '', '| Symbol | Kind |', '|---|---|');
    for (const symbol of groups.get(group).sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(`| [\`${symbol.name}\`](./${stableSlug(symbol.id)}) | ${symbol.kind} |`);
    }
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

function main() {
  const sdkMetadata = readSdkMetadata(path.join(ROOT, 'docs/sdk-versions.md'));
  for (const language of Object.keys(LANGUAGES)) {
    LANGUAGES[language].version = sdkMetadata[language].version;
  }

  fs.rmSync(OUTPUT_DIR, {recursive: true, force: true});
  fs.mkdirSync(OUTPUT_DIR, {recursive: true});
  const root = `---
id: index
title: SDK API Reference
description: Version-pinned PDFDancer API v3 references for Python, TypeScript, and Java.
---

# SDK API Reference

The reference pages list the supported public types and members for the documented SDK releases: Python \`${LANGUAGES.python.version}\`, TypeScript \`${LANGUAGES.typescript.version}\`, and Java \`${LANGUAGES.java.version}\`. Use the task guides to learn a workflow and the reference to confirm exact names, signatures, return types, and exceptions.

- [Python API reference](./python/)
- [TypeScript API reference](./typescript/)
- [Java API reference](./java/)

Python coverage follows \`pdfdancer.__all__\`. TypeScript coverage follows exports from the package entry point. Java coverage follows the reviewed public API manifest owned by the Java SDK.
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.md'), root);

  for (const language of Object.keys(LANGUAGES)) {
    const manifest = readJson(path.join(MANIFEST_DIR, `${language}-v3.json`));
    const symbols = language === 'java' ? javaSupportedSymbols(manifest) : manifest.symbols;
    const directory = path.join(OUTPUT_DIR, language);
    fs.mkdirSync(directory, {recursive: true});
    fs.writeFileSync(path.join(directory, 'index.md'), renderIndex(language, manifest, symbols));
    for (const symbol of symbols) {
      fs.writeFileSync(path.join(directory, `${stableSlug(symbol.id)}.md`), renderSymbol(language, manifest, symbol));
    }
    process.stdout.write(`${language}: generated ${symbols.length} symbol pages\n`);
  }

  if (CHECK_MODE) {
    assertSameTree(OUTPUT_DIR, PUBLISHED_OUTPUT_DIR);
    fs.rmSync(OUTPUT_DIR, {recursive: true, force: true});
    process.stdout.write('Generated API reference matches the checked-in pages.\n');
  }
}

main();
