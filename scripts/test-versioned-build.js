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
const v3Home = readBuildFile('v3/index.html');
readBuildFile('roadmap/index.html');
readBuildFile('search-index-default.json');
readBuildFile('search-index-docs-default-current.json');

assert.ok(rootRedirect.includes('url=/v3/'), 'Root must redirect to API v3');
assert.ok(!hasNoIndex(v3Home), 'API v3 documentation must be indexable');
assert.ok(!fs.existsSync(path.join(BUILD_DIR, 'v1')), 'Retired API v1 documentation must not be built');
assert.ok(
  !fs.existsSync(path.join(BUILD_DIR, 'search-index-docs-default-1.json')),
  'Retired API v1 documentation must not have a search index'
);

const legacyRoute = readBuildFile('working-with-text/index.html');
assert.ok(
  legacyRoute.includes('url=/v3/working-with-text'),
  'Legacy documentation routes must redirect to API v3'
);

const legacyTemplatingRoute = readBuildFile('sdk/templating/index.html');
assert.ok(
  legacyTemplatingRoute.includes('url=/v3/'),
  'The legacy templating route must redirect to API v3'
);

const cloudflareRedirects = readBuildFile('_redirects');
assert.ok(
  cloudflareRedirects.includes('/getting-started-java /v3/getting-started-java 301'),
  'Cloudflare native redirects must target API v3'
);
assert.ok(
  cloudflareRedirects.includes('/v1/* /v3/migrating-from-v1/ 301'),
  'Retired API v1 documentation routes must redirect to the migration guide'
);

console.log('V3-only documentation build verified.');
