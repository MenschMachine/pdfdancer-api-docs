#!/usr/bin/env node
'use strict';

const fs = require('node:fs');

function readSdkMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/<!--\s*sdk-pins\s*\n([\s\S]*?)\n\s*-->/);
  if (!match) throw new Error(`SDK metadata block not found in ${filePath}`);

  let metadata;
  try {
    metadata = JSON.parse(match[1]);
  } catch (error) {
    throw new Error(`Invalid SDK metadata JSON in ${filePath}: ${error.message}`);
  }

  for (const language of ['python', 'typescript', 'java']) {
    const sdk = metadata[language];
    if (!sdk || !sdk.version || !sdk.commit) {
      throw new Error(`Incomplete ${language} SDK metadata in ${filePath}`);
    }
  }

  const java = metadata.java;
  if (!java.groupId || !java.artifactId) {
    throw new Error(`Incomplete Java Maven coordinates in ${filePath}`);
  }

  return metadata;
}

if (require.main === module) {
  const [, , filePath, language, field] = process.argv;
  if (!filePath || !language || !field) {
    console.error('Usage: node scripts/sdk-metadata.js FILE LANGUAGE FIELD');
    process.exit(1);
  }

  try {
    const value = readSdkMetadata(filePath)?.[language]?.[field];
    if (!value) throw new Error(`Missing ${language}.${field} in ${filePath}`);
    process.stdout.write(`${value}\n`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {readSdkMetadata};
