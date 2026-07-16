#!/usr/bin/env node

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build');

function readBuildFile(relativePath) {
  const filePath = path.join(BUILD_DIR, relativePath);
  assert.ok(fs.existsSync(filePath), `Missing build output: ${relativePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function hasNoIndex(html) {
  return /<meta[^>]+name="robots"[^>]+content="noindex, nofollow"/.test(html);
}

const rootRedirect = readBuildFile('index.html');
const v1Home = readBuildFile('v1/index.html');
const v2Home = readBuildFile('v2/index.html');
readBuildFile('roadmap/index.html');
readBuildFile('search-index-default.json');
readBuildFile('search-index-docs-default-1.json');
readBuildFile('search-index-docs-default-current.json');

const previewMode = rootRedirect.includes('url=/v1/');
const releaseMode = rootRedirect.includes('url=/v2/');
assert.notStrictEqual(previewMode, releaseMode, 'Root must redirect to exactly one API version');
assert.ok(!hasNoIndex(v1Home), 'Supported API v1 documentation must remain indexable');
assert.strictEqual(
  hasNoIndex(v2Home),
  previewMode,
  'API v2 noindex metadata must match the release state'
);

const legacyRoute = readBuildFile('working-with-text/index.html');
assert.ok(
  legacyRoute.includes('url=/v1/working-with-text'),
  'Legacy documentation routes must preserve their API v1 meaning'
);

const legacyTemplatingRoute = readBuildFile('sdk/templating/index.html');
assert.ok(
  legacyTemplatingRoute.includes('url=/v1/working-with-templates'),
  'The legacy templating route must redirect directly to API v1'
);

console.log(`Versioned build verified in ${previewMode ? 'preview' : 'release'} mode.`);
