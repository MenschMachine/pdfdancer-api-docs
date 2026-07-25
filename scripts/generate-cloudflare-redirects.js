#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const docsDirectory = path.join(ROOT, 'docs');
const redirectsContentPath = path.join(ROOT, 'public', '_redirects');

function collectMarkdownFiles(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectMarkdownFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : [];
  });
}

function routeFor(filePath) {
  const relativePath = path.relative(docsDirectory, filePath).replace(/\\/g, '/');
  if (relativePath.startsWith('capabilities/')) return null;

  const withoutExtension = relativePath.slice(0, -'.md'.length);
  if (withoutExtension === 'getting-started') return '/';
  if (withoutExtension.endsWith('/index')) {
    return `/${withoutExtension.slice(0, -'/index'.length)}/`;
  }
  return `/${withoutExtension}`;
}

const routes = collectMarkdownFiles(docsDirectory)
  .map(routeFor)
  .filter((route) => route && route !== '/')
  .sort();

const lines = [
  '# Cloudflare Pages native redirects for unversioned API v3 documentation routes.',
  '# Keep explicit /v1/ and /v3/ URLs unchanged.',
  '/ /v3/ 301',
  '/sdk/templating /v3/ 301',
];

for (const route of routes) {
  const v3Route = `/v3${route}`;
  lines.push(`${route} ${v3Route} 301`);
  if (route.endsWith('/')) {
    lines.push(`${route.slice(0, -1)} ${v3Route} 301`);
  }
}

fs.mkdirSync(path.dirname(redirectsContentPath), {recursive: true});
const redirects = `${lines.join('\n')}\n`;
fs.writeFileSync(redirectsContentPath, redirects);

const buildDirectory = path.join(ROOT, 'build');
if (fs.existsSync(buildDirectory)) {
  fs.writeFileSync(path.join(buildDirectory, '_redirects'), redirects);
}
