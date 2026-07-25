#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outputDir = path.resolve(process.argv[2] || '');

if (!process.argv[2]) {
    throw new Error('Usage: node scripts/prepare-search-content.js <output-directory>');
}

if (fs.existsSync(outputDir) && fs.readdirSync(outputDir).length > 0) {
    throw new Error(`Output directory must be empty: ${outputDir}`);
}

fs.mkdirSync(outputDir, {recursive: true});

function copyVersion(version, sourceDirectory) {
    const destinationDirectory = path.join(outputDir, version);
    fs.cpSync(path.join(root, sourceDirectory), destinationDirectory, {recursive: true});

    // The source home page uses slug: /, but its search route is versioned.
    const homePage = path.join(destinationDirectory, 'getting-started.md');
    let content = fs.readFileSync(homePage, 'utf8');
    content = content.replace(/^slug: \/$/m, `slug: /${version}`);
    fs.writeFileSync(homePage, content);
}

copyVersion('v1', 'versioned_docs/version-1');
copyVersion('v3', 'docs');
