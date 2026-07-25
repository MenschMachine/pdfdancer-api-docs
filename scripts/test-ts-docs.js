#!/usr/bin/env node
/** Validate authored TypeScript documentation blocks against the pinned npm SDK. */

const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {readSdkMetadata} = require('./sdk-metadata');

const REPO_ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.resolve(REPO_ROOT, process.env.PDFDANCER_DOCS_DIR || 'docs');
const IS_V1 = DOCS_DIR.split(path.sep).includes('versioned_docs');
const METADATA = readSdkMetadata(path.join(DOCS_DIR, 'sdk-versions.md'));
const SDK_VERSION = METADATA.typescript.version;
const TEMP_DIR = path.join(REPO_ROOT, 'tests', '.ts-temp');
const NPM_ENV_DIR = path.join(
  REPO_ROOT,
  'node_modules',
  '.cache',
  'pdfdancer-typescript-tests',
  IS_V1 ? 'v1' : 'v3',
);
const TSC = path.join(
  NPM_ENV_DIR,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'tsc.cmd' : 'tsc',
);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    env: process.env,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function documentationFiles() {
  if (IS_V1) return [path.join(DOCS_DIR, 'getting-started-typescript.md')];
  return collectMarkdownFiles(DOCS_DIR).filter((file) => {
    const relativeParts = path.relative(DOCS_DIR, file).split(path.sep);
    return !relativeParts.includes('reference') && !relativeParts.includes('generated');
  });
}

function collectMarkdownFiles(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectMarkdownFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : [];
  }).sort();
}

function extractTsBlocks(markdownPath) {
  const content = fs.readFileSync(markdownPath, 'utf8');
  const blocks = [];
  const regex = /```typescript[ \t]*\r?\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) blocks.push(match[1]);
  return blocks;
}

function installEnvironment() {
  fs.mkdirSync(NPM_ENV_DIR, {recursive: true});
  console.log(`Installing TypeScript test environment: pdfdancer-client-typescript==${SDK_VERSION}`);
  run('npm', [
    'install',
    '--prefix', NPM_ENV_DIR,
    '--no-save',
    '--package-lock=false',
    'typescript@5.6.3',
    '@types/node@22',
    `pdfdancer-client-typescript@${SDK_VERSION}`,
  ]);
}

function testableCode(block) {
  const sdkImports = `
import * as SDK from 'pdfdancer-client-typescript';
import {
  PDFDancer, TextReplaceRequest, TextDeleteRequest, TextInsertRequest, TextStyleRequest,
  TextLayoutRequest, TextLayoutMode, TextLayoutProfile, PdfColorRequest, PdfColorSpace,
  Color, Font, PageSize, Orientation, ImageTransformType, FlipDirection, ModifyPathRequest,
  RateLimitException, PdfDancerException
} from 'pdfdancer-client-typescript';
`;
  const context = `
declare const pdf: SDK.PDFDancer;
declare const page: SDK.PageClient;
declare const image: SDK.ImageObject;
declare const path: SDK.PathObject;
declare const form: SDK.FormXObject;
declare const field: SDK.FormFieldObject;
declare const response: SDK.TextEditResponse;
declare const inputBytes: Uint8Array;
declare const imageBytes: Uint8Array;
declare const replacementBytes: Uint8Array;
declare const fontData: Uint8Array;
declare const request: any;
declare const selected: any;
declare const result: any;
`;
  const imports = block.match(/^\s*import[^;]+;\s*$/gm) || [];
  const body = imports.reduce((value, statement) => value.replace(statement, ''), block).trim();
  if (imports.length) {
    if (/^\s*(?:export\s+)?(?:class|interface)\s+\w+/m.test(body) || /\b(?:async\s+)?function\s+\w+\s*\(/.test(body)) {
      return `${imports.join('\n')}\n${body}\n`;
    }
    return `${imports.join('\n')}\nimport * as SDK from 'pdfdancer-client-typescript';\n${context}\nasync function docsExample(): Promise<void> {\n${body}\n}\n`;
  }
  if (/^\s*(?:export\s+)?(?:class|interface)\s+\w+/m.test(block) || /\b(?:async\s+)?function\s+\w+\s*\(/.test(block)) {
    return `${sdkImports}\n${block}`;
  }
  return `${sdkImports}\n${context}\nasync function docsExample(): Promise<void> {\n${block}\n}\n`;
}

function main() {
  installEnvironment();
  fs.rmSync(TEMP_DIR, {recursive: true, force: true});
  fs.mkdirSync(TEMP_DIR, {recursive: true});

  let fileNumber = 0;
  let totalBlocks = 0;
  for (const markdownPath of documentationFiles()) {
    for (const block of extractTsBlocks(markdownPath)) {
      totalBlocks += 1;
      const filename = `example-${++fileNumber}.ts`;
      fs.writeFileSync(path.join(TEMP_DIR, filename), testableCode(block));
    }
  }

  fs.writeFileSync(path.join(TEMP_DIR, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      target: 'ES2020',
      module: 'commonjs',
      moduleResolution: 'node',
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
      noEmit: true,
      types: ['node'],
    },
    include: ['*.ts'],
  }, null, 2));

  console.log(`Checking ${totalBlocks} TypeScript blocks with TypeScript ${SDK_VERSION}`);
  run(TSC, ['--project', path.join(TEMP_DIR, 'tsconfig.json')], {cwd: TEMP_DIR});
  fs.rmSync(TEMP_DIR, {recursive: true, force: true});
  console.log(`All ${totalBlocks} TypeScript blocks passed validation.`);
}

main();
