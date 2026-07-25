#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {readSdkMetadata} = require('./sdk-metadata');

const repoRoot = path.resolve(__dirname, '..');
const docsDir = path.resolve(repoRoot, process.env.PDFDANCER_DOCS_DIR || 'docs');
const isV1 = docsDir.split(path.sep).includes('versioned_docs');
const metadataPath = path.join(docsDir, 'sdk-versions.md');
const metadata = readSdkMetadata(metadataPath);
const pythonVersion = metadata.python.version;
const environmentName = isV1 ? 'v1' : 'v3';
const cacheRoot = path.join(repoRoot, 'node_modules', '.cache', 'pdfdancer-python-tests');
const environmentDir = path.join(cacheRoot, environmentName);
const pythonCommand = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const venvPython = process.platform === 'win32'
  ? path.join(environmentDir, 'Scripts', 'python.exe')
  : path.join(environmentDir, 'bin', 'python');

function run(command, args) {
  const result = spawnSync(command, args, {cwd: repoRoot, stdio: 'inherit', env: process.env});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

fs.mkdirSync(cacheRoot, {recursive: true});
if (!fs.existsSync(venvPython)) {
  console.log(`Creating isolated Python environment: ${environmentName}`);
  run(pythonCommand, ['-m', 'venv', environmentDir]);
}

console.log(`Installing Python test dependencies for ${environmentName}: pdfdancer-client-python==${pythonVersion}`);
run(venvPython, [
  '-m', 'pip', 'install',
  'mktestdocs',
  'pytest',
  `pdfdancer-client-python==${pythonVersion}`,
]);

run(venvPython, ['-m', 'pytest', 'tests', '-v']);
