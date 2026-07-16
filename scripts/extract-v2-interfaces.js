#!/usr/bin/env node
'use strict';

const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const cheerio = require('cheerio');
const {
  buildDiff,
  normalizeManifest,
  renderDiffMarkdown,
  renderSummaryMarkdown,
  replaceDirectoryAtomically,
  stableJson,
} = require('./interface-extractors/core');
const {parseJavapCollection, splitParameters} = require('./interface-extractors/java');

const ROOT = path.resolve(__dirname, '..');
const MAX_BUFFER = 100 * 1024 * 1024;

function parseArguments(argv) {
  const result = {
    config: path.join(ROOT, 'scripts/interface-extractor.config.json'),
    keepTemp: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--keep-temp') result.keepTemp = true;
    else if (['--config', '--sdk-root', '--output'].includes(argument)) {
      if (!argv[index + 1]) throw new Error(`${argument} requires a value`);
      result[argument.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = argv[++index];
    } else if (argument === '--help') {
      process.stdout.write('Usage: node scripts/extract-v2-interfaces.js [--config FILE] [--sdk-root DIR] [--output DIR] [--keep-temp]\n');
      process.exit(0);
    } else throw new Error(`Unknown argument: ${argument}`);
  }
  return result;
}

function command(commandName, args, options = {}) {
  try {
    return childProcess.execFileSync(commandName, args, {
      cwd: options.cwd || ROOT,
      env: {...process.env, ...options.env},
      encoding: 'utf8',
      maxBuffer: MAX_BUFFER,
      stdio: options.quiet ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'pipe', 'inherit'],
    }).trim();
  } catch (error) {
    const stderr = error.stderr ? String(error.stderr).trim() : '';
    const stdout = error.stdout ? String(error.stdout).trim() : '';
    const details = [stdout, stderr].filter(Boolean).join('\n');
    throw new Error(`Command failed: ${commandName} ${args.join(' ')}${details ? `\n${details}` : ''}`, {cause: error});
  }
}

function requireCommands(names) {
  for (const name of names) command(name, ['--version'], {quiet: true});
  command('javap', ['-version'], {quiet: true});
}

function archiveRef(repository, ref, destination, tempRoot) {
  fs.mkdirSync(destination, {recursive: true});
  const archive = path.join(tempRoot, `${path.basename(repository)}-${path.basename(destination)}.tar`);
  command('git', ['-C', repository, 'archive', '--format=tar', `--output=${archive}`, ref], {quiet: true});
  command('tar', ['-xf', archive, '-C', destination], {quiet: true});
  fs.rmSync(archive, {force: true});
}

function runJson(executable, args, options) {
  const output = command(executable, args, {...options, quiet: true});
  try {
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`Extractor emitted invalid JSON: ${executable} ${args.join(' ')}\n${output.slice(0, 2000)}`, {cause: error});
  }
}

function extractPython(snapshot) {
  const venv = path.join(snapshot, '.interface-extractor-venv');
  command('python3', ['-m', 'venv', venv], {quiet: true});
  const python = path.join(venv, 'bin', 'python');
  // Both refs can declare the same package version. Disabling pip's wheel cache
  // prevents a wheel built from one committed ref from being reused for the other.
  command(python, ['-m', 'pip', 'install', '--disable-pip-version-check', '--no-cache-dir', snapshot], {quiet: true});
  return runJson(python, [path.join(ROOT, 'scripts/interface-extractors/extract-python.py')], {cwd: snapshot});
}

function extractTypeScript(snapshot) {
  command('npm', ['ci', '--ignore-scripts'], {cwd: snapshot, quiet: true});
  command('npm', ['run', 'build'], {cwd: snapshot, quiet: true});
  const declarations = path.join(snapshot, 'dist');
  const entry = path.join(declarations, 'index.d.ts');
  if (!fs.existsSync(entry)) throw new Error(`TypeScript build did not create ${entry}`);
  const extractor = path.join(ROOT, 'scripts/interface-extractors/extract-typescript.js');
  const publicEntry = runJson(process.execPath, [extractor, entry], {cwd: snapshot});
  const allModules = runJson(process.execPath, [extractor, declarations], {cwd: snapshot});
  return {symbols: publicEntry.symbols, allModuleSymbols: allModules.symbols};
}

function extractJava(snapshot) {
  const gradlew = path.join(snapshot, 'gradlew');
  fs.chmodSync(gradlew, 0o755);
  command(gradlew, ['jar', 'javadoc', '-x', 'test', '--no-daemon'], {cwd: snapshot, quiet: true});
  const libraries = path.join(snapshot, 'build/libs');
  const jarName = fs.readdirSync(libraries)
    .filter((name) => name.endsWith('.jar') && !name.endsWith('-sources.jar') && !name.endsWith('-javadoc.jar'))
    .sort()[0];
  if (!jarName) throw new Error(`Java build did not create a binary JAR in ${libraries}`);
  const jarPath = path.join(libraries, jarName);
  const classes = command('jar', ['tf', jarPath], {quiet: true}).split(/\r?\n/)
    .filter((name) => name.endsWith('.class'))
    .filter((name) => !/(^|\/)(module-info|package-info)\.class$/.test(name))
    .filter((name) => !/\$\d+(?:\D|$)/.test(name))
    .map((name) => name.slice(0, -6).replaceAll('/', '.'))
    .sort();
  const output = command('javap', ['-public', '-classpath', jarPath, ...classes], {quiet: true});
  const symbols = parseJavapCollection(output);
  const javadocRoot = path.join(snapshot, 'build/docs/javadoc');
  for (const symbol of symbols) attachJavaDocumentation(symbol, javadocRoot);
  return {symbols};
}

function javaDocumentationFile(javadocRoot, symbolId) {
  const separator = symbolId.lastIndexOf('.');
  const packagePath = symbolId.slice(0, separator).replaceAll('.', '/');
  const typeName = symbolId.slice(separator + 1).replaceAll('$', '.');
  return path.join(javadocRoot, packagePath, `${typeName}.html`);
}

function javadocArity(section) {
  const id = section.attr('id') || '';
  const open = id.indexOf('(');
  const close = id.lastIndexOf(')');
  if (open === -1 || close === -1) return undefined;
  return splitParameters(id.slice(open + 1, close)).length;
}

function cleanJavadocText(value) {
  return value.replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function attachJavaDocumentation(symbol, javadocRoot) {
  const file = javaDocumentationFile(javadocRoot, symbol.id);
  if (!fs.existsSync(file)) return;
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  const overview = cleanJavadocText($('section.class-description .block').first().text());
  if (overview) symbol.description = overview;
  const descriptions = new Map();
  $('section.detail').each((_, element) => {
    const section = $(element);
    let name = section.find('.element-name').first().text().trim();
    if (!name) return;
    if (name === symbol.name.split('$').pop()) name = 'constructor';
    const description = cleanJavadocText(section.find('.block').first().text());
    const deprecated = cleanJavadocText(section.find('.deprecation-comment').first().text());
    if (!description && !deprecated) return;
    const entries = descriptions.get(name) || [];
    entries.push({arity: javadocArity(section), description, deprecated});
    descriptions.set(name, entries);
  });
  for (const member of symbol.members) {
    const entries = descriptions.get(member.name) || [];
    const documentation = entries.find((entry) => entry.arity === member.arity) || entries[0];
    if (!documentation) continue;
    if (documentation.description) member.description = documentation.description;
    if (documentation.deprecated) member.deprecated = documentation.deprecated;
  }
}

function extractLanguage(language, snapshot) {
  if (language === 'python') return extractPython(snapshot);
  if (language === 'typescript') return extractTypeScript(snapshot);
  if (language === 'java') return extractJava(snapshot);
  throw new Error(`Unsupported language in extractor configuration: ${language}`);
}

function resolvePath(value, fallback) {
  return path.resolve(ROOT, value || fallback);
}

function main() {
  const started = Date.now();
  const options = parseArguments(process.argv.slice(2));
  const configPath = resolvePath(options.config);
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (config.schemaVersion !== 1) throw new Error(`Unsupported configuration schemaVersion: ${config.schemaVersion}`);
  const sdkRoot = resolvePath(options.sdkRoot, config.sdkRoot);
  const output = resolvePath(options.output, config.outputDirectory);
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfdancer-v2-interfaces-'));
  const refs = {};
  const baseManifests = {};
  const candidateManifests = {};

  try {
    requireCommands(['git', 'tar', 'python3', 'npm', 'java', 'jar']);
    for (const language of Object.keys(config.languages).sort()) {
      const settings = config.languages[language];
      const repository = path.join(sdkRoot, settings.repository);
      if (!fs.existsSync(path.join(repository, '.git'))) throw new Error(`SDK repository not found: ${repository}`);
      const baseCommit = command('git', ['-C', repository, 'rev-parse', '--verify', `${settings.baseRef}^{commit}`], {quiet: true});
      const candidateCommit = command('git', ['-C', repository, 'rev-parse', '--verify', `${settings.candidateRef}^{commit}`], {quiet: true});
      const dirty = command('git', ['-C', repository, 'status', '--porcelain'], {quiet: true});
      if (dirty) process.stderr.write(`Warning: ${settings.repository} has uncommitted changes; they are intentionally excluded.\n`);
      refs[language] = {
        repository: settings.repository,
        baseRef: settings.baseRef,
        baseCommit,
        candidateRef: settings.candidateRef,
        candidateCommit,
      };
    }

    for (const language of Object.keys(config.languages).sort()) {
      const settings = config.languages[language];
      const repository = path.join(sdkRoot, settings.repository);
      const {baseCommit, candidateCommit} = refs[language];
      process.stdout.write(`Extracting ${language}: ${settings.baseRef} → ${settings.candidateRef}\n`);
      const baseSnapshot = path.join(tempRoot, `${language}-base`);
      const candidateSnapshot = path.join(tempRoot, `${language}-candidate`);
      archiveRef(repository, baseCommit, baseSnapshot, tempRoot);
      archiveRef(repository, candidateCommit, candidateSnapshot, tempRoot);
      const baseExtracted = extractLanguage(language, baseSnapshot);
      const candidateExtracted = extractLanguage(language, candidateSnapshot);
      if (baseExtracted.allModuleSymbols && candidateExtracted.allModuleSymbols) {
        const baseRootIds = new Set(baseExtracted.symbols.map((symbol) => symbol.id));
        const baseAllByName = new Map();
        for (const symbol of baseExtracted.allModuleSymbols) {
          const matches = baseAllByName.get(symbol.name) || [];
          matches.push(symbol);
          baseAllByName.set(symbol.name, matches);
        }
        const promotedSymbols = [];
        for (const candidateSymbol of candidateExtracted.symbols) {
          if (baseRootIds.has(candidateSymbol.id)) continue;
          const matches = baseAllByName.get(candidateSymbol.name) || [];
          if (matches.length !== 1) continue;
          baseExtracted.symbols.push({...matches[0], id: candidateSymbol.id, name: candidateSymbol.name});
          baseRootIds.add(candidateSymbol.id);
          promotedSymbols.push(candidateSymbol.id);
        }
        refs[language].promotedSymbols = promotedSymbols.sort();
      }
      baseManifests[language] = normalizeManifest({
        ...baseExtracted,
        language,
        repository: settings.repository,
        candidateRef: settings.baseRef,
        candidateCommit: baseCommit,
      });
      candidateManifests[language] = normalizeManifest({
        ...candidateExtracted,
        language,
        repository: settings.repository,
        candidateRef: settings.candidateRef,
        candidateCommit,
      });
    }

    const diff = buildDiff(baseManifests, candidateManifests, refs);
    fs.mkdirSync(path.dirname(output), {recursive: true});
    const staging = fs.mkdtempSync(path.join(path.dirname(output), `.${path.basename(output)}.staging-`));
    try {
      for (const [language, manifest] of Object.entries(candidateManifests)) {
        fs.writeFileSync(path.join(staging, `${language}-v2.json`), stableJson(manifest));
      }
      fs.writeFileSync(path.join(staging, 'v2-interface-diff.json'), stableJson(diff));
      fs.writeFileSync(path.join(staging, 'v2-interface-diff.md'), renderDiffMarkdown(diff));
      fs.writeFileSync(path.join(staging, 'v2-interface-summary.md'), renderSummaryMarkdown(diff));
      replaceDirectoryAtomically(staging, output);
    } finally {
      fs.rmSync(staging, {recursive: true, force: true});
    }

    for (const [language, result] of Object.entries(diff.languages)) {
      const counts = result.counts.symbols;
      process.stdout.write(`${language}: ${candidateManifests[language].symbols.length} candidate symbols; ${counts.added} added, ${counts.promoted} promoted, ${counts.removed} removed, ${counts.changed} changed\n`);
    }
    process.stdout.write(`Wrote ${path.relative(ROOT, output)} in ${((Date.now() - started) / 1000).toFixed(1)}s\n`);
  } finally {
    if (options.keepTemp) process.stdout.write(`Temporary snapshots retained at ${tempRoot}\n`);
    else fs.rmSync(tempRoot, {recursive: true, force: true});
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`Interface extraction failed: ${error.message}\n`);
  process.exitCode = 1;
}
