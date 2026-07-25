#!/usr/bin/env node
'use strict';

/** Extracts authored Java examples from Markdown and verifies that they compile. */

const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {readSdkMetadata} = require('./sdk-metadata');

const REPO_ROOT = path.join(__dirname, '..');
const DOCS_DIR = process.env.PDFDANCER_DOCS_DIR
  ? path.resolve(REPO_ROOT, process.env.PDFDANCER_DOCS_DIR)
  : path.join(REPO_ROOT, 'docs');
const TEMP_DIR = path.join(REPO_ROOT, 'tests', '.java-temp');
const MAVEN_PLUGIN_VERSION = '3.7.0';

function commandAvailable(command, args) {
  try {
    execFileSync(command, args, {stdio: 'ignore'});
    return true;
  } catch {
    return false;
  }
}

function markdownFiles(directory) {
  // The v1 Java SDK examples are intentionally limited to the published
  // getting-started page; the other v1 pages contain legacy Java API snippets.
  if (path.relative(REPO_ROOT, DOCS_DIR).split(path.sep).includes('version-1')) {
    return [path.join(directory, 'getting-started-java.md')];
  }

  const files = [];
  function visit(current) {
    for (const entry of fs.readdirSync(current, {withFileTypes: true})) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(absolute);
      } else if (
        entry.isFile() &&
        entry.name.endsWith('.md') &&
        !path.relative(DOCS_DIR, absolute).split(path.sep).includes('reference') &&
        !path.relative(DOCS_DIR, absolute).split(path.sep).includes('generated')
      ) {
        files.push(absolute);
      }
    }
  }
  visit(directory);
  return files.sort();
}

function extractJavaBlocks(markdownPath) {
  const content = fs.readFileSync(markdownPath, 'utf8');
  const blocks = [];
  const regex = /```java[ \t]*\r?\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      code: match[1],
      line: content.slice(0, match.index).split(/\r?\n/).length,
    });
  }
  return blocks;
}

function needsClassWrapper(code) {
  return !code.includes('class ') && !code.includes('interface ');
}

function extractClassName(code) {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : null;
}

function wrapInClass(code, className) {
  if (!needsClassWrapper(code) || code.includes('public static void main')) return code;

  const imports = code.match(/^\s*import[^;]+;\s*$/gm) || [];
  const body = imports.reduce((value, statement) => value.replace(statement, ''), code).trim();
  return `
import java.io.*;
import java.nio.file.*;
import java.util.*;
import com.pdfdancer.client.rest.*;
import com.pdfdancer.common.model.*;
import com.pdfdancer.common.model.path.*;
import com.pdfdancer.common.request.*;
import com.pdfdancer.common.response.*;
import com.pdfdancer.common.util.*;
${imports.join('\n')}
public class ${className} {
    private PDFDancer pdf;
    private PDFDancer.PageClient page;
    private ImageReference image;
    private PathReference path;
    private FormXObjectReference form;
    private FormFieldReference field;
    private TextEditResponse response;
    private byte[] inputBytes;
    private byte[] imageBytes;
    private byte[] replacementBytes;
    private Object request;
    private Object selected;
    private Object result;

    public void example() throws Exception {
        ${body}
    }
}
`;
}

function ensureTempDir() {
  if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, {recursive: true});
  fs.mkdirSync(TEMP_DIR, {recursive: true});
}

function cleanupTempDir() {
  if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, {recursive: true});
}

function resolveMavenDependencies(javaSdk) {
  if (!commandAvailable('mvn', ['-version'])) {
    throw new Error('Maven (mvn) is required to resolve the Java SDK from Maven Central');
  }

  const dependenciesDir = path.join(TEMP_DIR, 'dependencies');
  const pomPath = path.join(TEMP_DIR, 'documentation-examples-pom.xml');
  fs.mkdirSync(dependenciesDir, {recursive: true});
  fs.writeFileSync(pomPath, `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.pdfdancer.documentation</groupId>
  <artifactId>documentation-examples</artifactId>
  <version>1.0.0</version>
  <dependencies>
    <dependency>
      <groupId>${javaSdk.groupId}</groupId>
      <artifactId>${javaSdk.artifactId}</artifactId>
      <version>${javaSdk.version}</version>
    </dependency>
  </dependencies>
</project>
`);

  try {
    execFileSync('mvn', [
      '-B', '-ntp', '-q',
      '-f', pomPath,
      `org.apache.maven.plugins:maven-dependency-plugin:${MAVEN_PLUGIN_VERSION}:copy-dependencies`,
      '-DincludeScope=runtime',
      `-DoutputDirectory=${dependenciesDir}`,
    ], {cwd: TEMP_DIR, stdio: ['ignore', 'pipe', 'pipe']});
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`Could not resolve ${javaSdk.groupId}:${javaSdk.artifactId}:${javaSdk.version} from Maven Central${output ? `\n${output}` : ''}`);
  }

  const jars = fs.readdirSync(dependenciesDir).filter((file) => file.endsWith('.jar'));
  if (jars.length === 0) {
    throw new Error(`Maven resolved no JARs for ${javaSdk.groupId}:${javaSdk.artifactId}:${javaSdk.version}`);
  }
  return dependenciesDir;
}

function compileExample(javaFile, dependenciesDir) {
  try {
    execFileSync('javac', [
      '-Xlint:none',
      '-cp', path.join(dependenciesDir, '*'),
      javaFile,
    ], {cwd: TEMP_DIR, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']});
    return null;
  } catch (error) {
    return [error.stdout, error.stderr, error.message].filter(Boolean).join('\n');
  }
}

function main() {
  console.log('Testing Java code examples in documentation...\n');
  if (!commandAvailable('javac', ['-version'])) throw new Error('javac is required to compile Java documentation examples');

  const metadata = readSdkMetadata(path.join(DOCS_DIR, 'sdk-versions.md'));
  const javaSdk = metadata.java;
  console.log(`Using Maven artifact: ${javaSdk.groupId}:${javaSdk.artifactId}:${javaSdk.version}\n`);

  ensureTempDir();
  let hasErrors = false;
  let totalBlocks = 0;
  let fileNumber = 0;

  try {
    const dependenciesDir = resolveMavenDependencies(javaSdk);
    for (const markdownPath of markdownFiles(DOCS_DIR)) {
      const blocks = extractJavaBlocks(markdownPath);
      if (blocks.length === 0) continue;
      console.log(`Checking: ${path.relative(REPO_ROOT, markdownPath)}`);

      blocks.forEach((block, index) => {
        totalBlocks++;
        const generatedName = `Example${++fileNumber}_${index + 1}`;
        const className = extractClassName(block.code) || generatedName;
        const code = extractClassName(block.code) || !needsClassWrapper(block.code)
          ? block.code
          : wrapInClass(block.code, generatedName);
        const javaFile = path.join(TEMP_DIR, `${className}.java`);
        fs.writeFileSync(javaFile, code);
        const output = compileExample(javaFile, dependenciesDir);

        if (output) {
          console.error(`  Block ${index + 1} (line ${block.line}): ERROR`);
          output.split(/\r?\n/).filter((line) => /error:|\.java:\d+/.test(line)).forEach((line) => console.error(`    ${line}`));
          hasErrors = true;
        } else {
          console.log(`  Block ${index + 1}: OK`);
        }
      });
      console.log('');
    }
  } finally {
    cleanupTempDir();
  }

  console.log(`\nTotal: ${totalBlocks} code blocks checked`);
  if (hasErrors) throw new Error('Some Java code blocks have errors');
  console.log('\nAll Java code blocks passed validation.');
}

try {
  main();
} catch (error) {
  console.error(`\nJava documentation validation failed: ${error.message}`);
  process.exit(1);
}
