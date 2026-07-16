'use strict';

const fs = require('node:fs');
const path = require('node:path');

function compareText(left, right) {
  return left.localeCompare(right, 'en', {sensitivity: 'variant'});
}

function normalizeMember(member) {
  const normalized = {
    id: String(member.id),
    name: String(member.name),
    kind: String(member.kind),
    signature: String(member.signature),
  };
  if (member.arity !== undefined) normalized.arity = Number(member.arity);
  if (member.static !== undefined) normalized.static = Boolean(member.static);
  return normalized;
}

function normalizeSymbol(symbol) {
  return {
    id: String(symbol.id),
    name: String(symbol.name),
    kind: String(symbol.kind),
    signature: String(symbol.signature || symbol.name),
    members: (symbol.members || []).map(normalizeMember).sort((a, b) =>
      compareText(a.id, b.id) || compareText(a.signature, b.signature)),
  };
}

function normalizeManifest(manifest) {
  return {
    schemaVersion: 1,
    language: String(manifest.language),
    repository: String(manifest.repository),
    candidateRef: String(manifest.candidateRef),
    candidateCommit: String(manifest.candidateCommit),
    symbols: (manifest.symbols || []).map(normalizeSymbol).sort((a, b) => compareText(a.id, b.id)),
  };
}

function memberGroupKey(member) {
  return `${member.kind}:${member.name}:${member.arity ?? ''}:${member.static ? 'static' : 'instance'}`;
}

function record(kind, symbolId, before, after) {
  const value = {kind, symbol: symbolId};
  if (before) value.before = before.signature;
  if (after) value.after = after.signature;
  return value;
}

function diffMembers(symbolId, beforeMembers, afterMembers) {
  const changes = [];
  const beforeBySignature = new Map(beforeMembers.map((member) => [member.signature, member]));
  const afterBySignature = new Map(afterMembers.map((member) => [member.signature, member]));
  const unmatchedBefore = beforeMembers.filter((member) => !afterBySignature.has(member.signature));
  const unmatchedAfter = afterMembers.filter((member) => !beforeBySignature.has(member.signature));
  const groups = new Map();

  for (const member of unmatchedBefore) {
    const key = memberGroupKey(member);
    const group = groups.get(key) || {before: [], after: []};
    group.before.push(member);
    groups.set(key, group);
  }
  for (const member of unmatchedAfter) {
    const key = memberGroupKey(member);
    const group = groups.get(key) || {before: [], after: []};
    group.after.push(member);
    groups.set(key, group);
  }

  for (const key of [...groups.keys()].sort(compareText)) {
    const group = groups.get(key);
    group.before.sort((a, b) => compareText(a.signature, b.signature));
    group.after.sort((a, b) => compareText(a.signature, b.signature));
    const paired = Math.min(group.before.length, group.after.length);
    for (let index = 0; index < paired; index += 1) {
      changes.push(record('changed', symbolId, group.before[index], group.after[index]));
    }
    for (const member of group.before.slice(paired)) changes.push(record('removed', symbolId, member, null));
    for (const member of group.after.slice(paired)) changes.push(record('added', symbolId, null, member));
  }
  return changes;
}

function diffManifests(base, candidate) {
  const changes = [];
  const baseSymbols = new Map(base.symbols.map((symbol) => [symbol.id, symbol]));
  const candidateSymbols = new Map(candidate.symbols.map((symbol) => [symbol.id, symbol]));
  const ids = [...new Set([...baseSymbols.keys(), ...candidateSymbols.keys()])].sort(compareText);

  for (const id of ids) {
    const before = baseSymbols.get(id);
    const after = candidateSymbols.get(id);
    if (!before) {
      changes.push({kind: 'added', symbol: id, after: after.signature});
      for (const member of after.members) changes.push(record('added', id, null, member));
      continue;
    }
    if (!after) {
      changes.push({kind: 'removed', symbol: id, before: before.signature});
      for (const member of before.members) changes.push(record('removed', id, member, null));
      continue;
    }
    if (before.signature !== after.signature || before.kind !== after.kind) {
      changes.push({kind: 'changed', symbol: id, before: before.signature, after: after.signature});
    }
    changes.push(...diffMembers(id, before.members, after.members));
  }
  return changes.sort((a, b) =>
    compareText(a.symbol, b.symbol) || compareText(a.kind, b.kind) ||
    compareText(a.before || '', b.before || '') || compareText(a.after || '', b.after || ''));
}

function buildDiff(baseManifests, candidateManifests, refs) {
  const languages = {};
  for (const language of Object.keys(candidateManifests).sort(compareText)) {
    const changes = diffManifests(baseManifests[language], candidateManifests[language]);
    languages[language] = {
      repository: refs[language].repository,
      baseRef: refs[language].baseRef,
      baseCommit: refs[language].baseCommit,
      candidateRef: refs[language].candidateRef,
      candidateCommit: refs[language].candidateCommit,
      counts: {
        added: changes.filter((change) => change.kind === 'added').length,
        removed: changes.filter((change) => change.kind === 'removed').length,
        changed: changes.filter((change) => change.kind === 'changed').length,
      },
      changes,
    };
  }
  return {schemaVersion: 1, languages};
}

function renderDiffMarkdown(diff) {
  const lines = [
    '# v2 public interface diff',
    '',
    '> Generated by `npm run extract:v2-interfaces`. Do not edit this file manually.',
    '',
    'This report compares the configured committed base and candidate refs. It does not inspect uncommitted SDK changes.',
    '',
  ];
  for (const [language, result] of Object.entries(diff.languages)) {
    lines.push(`## ${language[0].toUpperCase()}${language.slice(1)}`, '');
    lines.push(`- Repository: \`${result.repository}\``);
    lines.push(`- Base: \`${result.baseRef}\` (\`${result.baseCommit}\`)`);
    lines.push(`- Candidate: \`${result.candidateRef}\` (\`${result.candidateCommit}\`)`);
    lines.push(`- Changes: ${result.counts.added} added, ${result.counts.removed} removed, ${result.counts.changed} changed`, '');
    if (result.changes.length === 0) {
      lines.push('No public interface changes.', '');
      continue;
    }
    for (const kind of ['added', 'removed', 'changed']) {
      const changes = result.changes.filter((change) => change.kind === kind);
      if (changes.length === 0) continue;
      lines.push(`### ${kind[0].toUpperCase()}${kind.slice(1)}`, '');
      for (const change of changes) {
        const label = change.before && change.after
          ? `\`${change.before}\` → \`${change.after}\``
          : `\`${change.after || change.before}\``;
        lines.push(`- **${change.symbol}**: ${label}`);
      }
      lines.push('');
    }
  }
  return `${lines.join('\n')}\n`;
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function replaceDirectoryAtomically(stagingDirectory, outputDirectory) {
  const parent = path.dirname(outputDirectory);
  const backup = path.join(parent, `.${path.basename(outputDirectory)}.backup-${process.pid}`);
  fs.rmSync(backup, {recursive: true, force: true});
  let movedOld = false;
  try {
    if (fs.existsSync(outputDirectory)) {
      fs.renameSync(outputDirectory, backup);
      movedOld = true;
    }
    fs.renameSync(stagingDirectory, outputDirectory);
    if (movedOld) fs.rmSync(backup, {recursive: true, force: true});
  } catch (error) {
    if (!fs.existsSync(outputDirectory) && movedOld && fs.existsSync(backup)) {
      fs.renameSync(backup, outputDirectory);
    }
    throw error;
  }
}

module.exports = {
  buildDiff,
  compareText,
  diffManifests,
  normalizeManifest,
  renderDiffMarkdown,
  replaceDirectoryAtomically,
  stableJson,
};
