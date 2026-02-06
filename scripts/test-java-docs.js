#!/usr/bin/env node
/**
 * Extracts Java code blocks from markdown and verifies they compile.
 *
 * Usage: node scripts/test-java-docs.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const TEMP_DIR = path.join(__dirname, '..', 'tests', '.java-temp');
const JAVA_SUBMODULE = path.join(__dirname, '..', 'external', 'pdfdancer-client-java');

// Files to test
const FILES_TO_TEST = ['getting-started-java.md'];

// Extract Java code blocks from markdown
function extractJavaBlocks(markdownPath) {
  const content = fs.readFileSync(markdownPath, 'utf-8');
  const blocks = [];
  const regex = /```java\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

// Check if code block needs a class wrapper
function needsClassWrapper(code) {
  return !code.includes('class ') && !code.includes('interface ');
}

// Extract class name from Java code
function extractClassName(code) {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : null;
}

// Wrap code in a compilable class if needed
function wrapInClass(code, className) {
  if (!needsClassWrapper(code)) {
    return code;
  }
  // Check if code has a main method
  if (code.includes('public static void main')) {
    return code;
  }
  // Wrap as a method body
  return `
public class ${className} {
    public void example() throws Exception {
        ${code}
    }
}
`;
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

// Check if javac is available
function checkJavac() {
  try {
    execSync('javac -version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Find SDK JAR for classpath
function findSdkJar() {
  if (!fs.existsSync(JAVA_SUBMODULE)) {
    return null;
  }

  const libsDir = path.join(JAVA_SUBMODULE, 'build', 'libs');

  // Helper to find JAR files
  function findJars() {
    if (!fs.existsSync(libsDir)) return [];
    return fs.readdirSync(libsDir)
      .filter(f => f.endsWith('.jar') && !f.includes('-sources') && !f.includes('-javadoc'))
      .map(f => path.join(libsDir, f));
  }

  let jars = findJars();

  if (jars.length === 0) {
    // Try building the JAR
    console.log('Building Java SDK...');
    try {
      execSync('./gradlew build -x test', { cwd: JAVA_SUBMODULE, stdio: 'pipe' });
      jars = findJars();
    } catch (e) {
      console.log('Warning: Could not build Java SDK, skipping semantic validation');
      return null;
    }
  }

  return jars.length > 0 ? jars[0] : null;
}

function main() {
  console.log('Testing Java code examples in documentation...\n');

  if (!checkJavac()) {
    console.log('Warning: javac not found, skipping Java compile check');
    process.exit(0);
  }

  const sdkJar = findSdkJar();
  const classpath = sdkJar ? `-cp "${sdkJar}"` : '';
  if (sdkJar) {
    console.log(`Using SDK JAR: ${path.basename(sdkJar)}\n`);
  } else {
    console.log('Warning: SDK JAR not found, semantic validation limited\n');
  }

  ensureTempDir();
  let hasErrors = false;
  let totalBlocks = 0;

  for (const file of FILES_TO_TEST) {
    const filePath = path.join(DOCS_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      hasErrors = true;
      continue;
    }

    console.log(`Checking: ${file}`);
    const blocks = extractJavaBlocks(filePath);

    blocks.forEach((block, index) => {
      totalBlocks++;
      let className = `Example${index + 1}`;

      // Check if code has its own class definition
      let code = block;
      const extractedName = extractClassName(code);
      if (extractedName) {
        className = extractedName;
      } else if (needsClassWrapper(code)) {
        code = wrapInClass(code, className);
      }

      const javaFile = path.join(TEMP_DIR, `${className}.java`);
      fs.writeFileSync(javaFile, code);

      try {
        const result = execSync(`javac -Xlint:none ${classpath} ${javaFile} 2>&1; exit 0`, {
          cwd: TEMP_DIR,
          encoding: 'utf-8',
        });

        if (result.includes('error:')) {
          console.error(`  Block ${index + 1}: ERROR`);
          result.split('\n').filter(l => l.includes('error:')).forEach(l => console.error(`    ${l}`));
          hasErrors = true;
        } else {
          console.log(`  Block ${index + 1}: OK`);
        }
      } catch (err) {
        const output = err.stdout || err.stderr || err.message || '';
        if (output.includes('error:')) {
          console.error(`  Block ${index + 1}: ERROR`);
          output.split('\n').filter(l => l.includes('error:')).forEach(l => console.error(`    ${l}`));
          hasErrors = true;
        } else {
          console.log(`  Block ${index + 1}: OK`);
        }
      }
    });

    console.log('');
  }

  cleanupTempDir();

  console.log(`\nTotal: ${totalBlocks} code blocks checked`);

  if (hasErrors) {
    console.error('\nSome Java code blocks have errors!');
    process.exit(1);
  } else {
    console.log('\nAll Java code blocks passed validation.');
    process.exit(0);
  }
}

main();
