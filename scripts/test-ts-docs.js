#!/usr/bin/env node
/**
 * Extracts TypeScript code blocks from markdown and verifies they compile.
 *
 * Usage: node scripts/test-ts-docs.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const TEMP_DIR = path.join(__dirname, '..', 'tests', '.ts-temp');

// Files to test
const FILES_TO_TEST = ['getting-started-typescript.md'];

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
}

// Clean up temp directory
function cleanupTempDir() {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }
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

  for (const file of FILES_TO_TEST) {
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
      const tsFile = path.join(TEMP_DIR, `example${index + 1}.ts`);

      // Add the import at the top if needed
      let code = block;

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
