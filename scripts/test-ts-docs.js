#!/usr/bin/env node
/**
 * Extracts TypeScript code blocks from markdown and verifies they compile.
 *
 * Usage: node scripts/test-ts-docs.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const DOCS_DIR = process.env.PDFDANCER_DOCS_DIR
  ? path.resolve(REPO_ROOT, process.env.PDFDANCER_DOCS_DIR)
  : path.join(REPO_ROOT, 'docs');
const TEMP_DIR = path.join(__dirname, '..', 'tests', '.ts-temp');

function filesToTest() {
  if (DOCS_DIR.includes(`${path.sep}versioned_docs${path.sep}`)) return ['getting-started-typescript.md'];
  return fs.readdirSync(DOCS_DIR).filter((file) => file.endsWith('.md')).sort();
}

// Extract TypeScript code blocks from markdown
function extractTsBlocks(markdownPath) {
  const content = fs.readFileSync(markdownPath, 'utf-8');
  const blocks = [];
  const regex = /```typescript\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

// Create temp directory
function ensureTempDir() {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  if (process.env.PDFDANCER_TYPESCRIPT_SDK_DIR) {
    const sdkDir = path.resolve(REPO_ROOT, process.env.PDFDANCER_TYPESCRIPT_SDK_DIR);
    const tempNodeModules = path.join(TEMP_DIR, 'node_modules');
    fs.mkdirSync(tempNodeModules);
    fs.symlinkSync(
      sdkDir,
      path.join(tempNodeModules, 'pdfdancer-client-typescript'),
      'dir'
    );
  }
}

// Clean up temp directory
function cleanupTempDir() {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }
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
  return `
import * as fs from 'node:fs';
${sdkImports}
${context}

async function docsExample(): Promise<void> {
${block}
}
`;
}

// Check if tsc is available
function checkTsc() {
  try {
    execSync('npx tsc --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function main() {
  console.log('Testing TypeScript code examples in documentation...\n');

  if (!checkTsc()) {
    console.log('Warning: tsc not found, skipping TypeScript compile check');
    process.exit(0);
  }

  ensureTempDir();
  let hasErrors = false;
  let totalBlocks = 0;

  // Create a tsconfig for the temp dir
  const tsconfig = {
    compilerOptions: {
      target: 'ES2020',
      module: 'commonjs',
      moduleResolution: 'node',
      esModuleInterop: true,
      strict: false,
      skipLibCheck: true,
      noEmit: true,
      types: ['node'],
    },
    include: ['*.ts'],
  };
  fs.writeFileSync(path.join(TEMP_DIR, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

  let fileNumber = 0;
  for (const file of filesToTest()) {
    const filePath = path.join(DOCS_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      hasErrors = true;
      continue;
    }

    console.log(`Checking: ${file}`);
    const blocks = extractTsBlocks(filePath);

    blocks.forEach((block, index) => {
      totalBlocks++;
      const tsFile = path.join(TEMP_DIR, `example${++fileNumber}-${index + 1}.ts`);

      // Add the import at the top if needed
      let code = testableCode(block);

      fs.writeFileSync(tsFile, code);

      try {
        const result = execSync(`npx tsc --noEmit ${tsFile} 2>&1; exit 0`, {
          cwd: TEMP_DIR,
          encoding: 'utf-8',
        });

        // Check for real errors in example files only
        // (ignore errors from node_modules type definitions)
        const lines = result.split('\n');
        const realErrors = lines.filter(
          (line) =>
            line.includes('error TS') &&
            line.includes('example')
        );

        if (realErrors.length > 0) {
          console.error(`  Block ${index + 1}: ERROR`);
          realErrors.forEach((err) => console.error(`    ${err}`));
          hasErrors = true;
        } else {
          console.log(`  Block ${index + 1}: OK`);
        }
      } catch (err) {
        console.error(`  Block ${index + 1}: ERROR`);
        console.error(`    ${err.message}`);
        hasErrors = true;
      }
    });

    console.log('');
  }

  cleanupTempDir();

  console.log(`\nTotal: ${totalBlocks} code blocks checked`);

  if (hasErrors) {
    console.error('\nSome TypeScript code blocks have errors!');
    process.exit(1);
  } else {
    console.log('\nAll TypeScript code blocks passed validation.');
    process.exit(0);
  }
}

main();
