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
  if (member.description) normalized.description = String(member.description);
  if (member.deprecated) normalized.deprecated = String(member.deprecated);
  return normalized;
}

function normalizeSymbol(symbol) {
  const normalized = {
    id: String(symbol.id),
    name: String(symbol.name),
    kind: String(symbol.kind),
    signature: String(symbol.signature || symbol.name),
    members: (symbol.members || []).map(normalizeMember).sort((a, b) =>
      compareText(a.id, b.id) || compareText(a.signature, b.signature)),
  };
  if (symbol.module !== undefined) normalized.module = String(symbol.module);
  if (symbol.description) normalized.description = String(symbol.description);
  if (symbol.deprecated) normalized.deprecated = String(symbol.deprecated);
  return normalized;
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

function buildSymbolChanges(base, candidate, promotedIds = []) {
  const promoted = new Set(promotedIds);
  const baseSymbols = new Map(base.symbols.map((symbol) => [symbol.id, symbol]));
  const candidateSymbols = new Map(candidate.symbols.map((symbol) => [symbol.id, symbol]));
  const ids = [...new Set([...baseSymbols.keys(), ...candidateSymbols.keys()])].sort(compareText);
  const symbolChanges = [];

  for (const id of ids) {
    const before = baseSymbols.get(id);
    const after = candidateSymbols.get(id);
    if (!before) {
      symbolChanges.push({
        id,
        status: 'added',
        kind: after.kind,
        signature: after.signature,
        memberCount: after.members.length,
      });
      continue;
    }
    if (!after) {
      symbolChanges.push({
        id,
        status: 'removed',
        kind: before.kind,
        signature: before.signature,
        memberCount: before.members.length,
      });
      continue;
    }

    const memberChanges = diffMembers(id, before.members, after.members);
    const declarationChanged = before.signature !== after.signature || before.kind !== after.kind;
    if (promoted.has(id)) {
      const change = {
        id,
        status: 'promoted',
        kind: after.kind,
        previousModule: before.module,
        memberChanges,
      };
      if (declarationChanged) {
        change.declarationChange = {before: before.signature, after: after.signature};
      }
      symbolChanges.push(change);
      continue;
    }
    if (declarationChanged || memberChanges.length > 0) {
      const change = {
        id,
        status: 'changed',
        kind: after.kind,
        memberChanges,
      };
      if (declarationChanged) {
        change.declarationChange = {before: before.signature, after: after.signature};
      }
      symbolChanges.push(change);
    }
  }
  return symbolChanges;
}

function countKinds(values, field) {
  return {
    added: values.filter((value) => value[field] === 'added').length,
    promoted: values.filter((value) => value[field] === 'promoted').length,
    removed: values.filter((value) => value[field] === 'removed').length,
    changed: values.filter((value) => value[field] === 'changed').length,
  };
}

function buildDiff(baseManifests, candidateManifests, refs) {
  const languages = {};
  for (const language of Object.keys(candidateManifests).sort(compareText)) {
    const changes = diffManifests(baseManifests[language], candidateManifests[language]);
    const symbolChanges = buildSymbolChanges(
      baseManifests[language],
      candidateManifests[language],
      refs[language].promotedSymbols,
    );
    const retainedMemberChanges = symbolChanges
      .filter((change) => change.status === 'changed')
      .flatMap((change) => change.memberChanges);
    languages[language] = {
      repository: refs[language].repository,
      baseRef: refs[language].baseRef,
      baseCommit: refs[language].baseCommit,
      candidateRef: refs[language].candidateRef,
      candidateCommit: refs[language].candidateCommit,
      counts: {
        symbols: countKinds(symbolChanges, 'status'),
        retainedSymbolMembers: countKinds(retainedMemberChanges, 'kind'),
        records: countKinds(changes, 'kind'),
      },
      symbolChanges,
      changes,
    };
  }
  return {schemaVersion: 2, languages};
}

function titleCase(value) {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

function inlineCode(value) {
  const text = String(value);
  return text.includes('`') ? `\`\` ${text} \`\`` : `\`${text}\``;
}

function renderSymbolList(lines, heading, changes) {
  lines.push(`### ${heading} (${changes.length})`, '');
  if (changes.length === 0) {
    lines.push('None.', '');
    return;
  }
  for (const change of changes) lines.push(`- ${inlineCode(change.id)} — ${change.kind}`);
  lines.push('');
}

function renderMemberChanges(lines, changes) {
  for (const kind of ['added', 'removed', 'changed']) {
    const matching = changes.filter((change) => change.kind === kind);
    if (matching.length === 0) continue;
    lines.push(`- ${titleCase(kind)} members (${matching.length}):`);
    for (const change of matching) {
      const label = change.before && change.after
        ? `${inlineCode(change.before)} → ${inlineCode(change.after)}`
        : inlineCode(change.after || change.before);
      lines.push(`  - ${label}`);
    }
  }
}

function renderPromotedSymbols(lines, changes) {
  lines.push(`### Existing symbols promoted to the package root (${changes.length})`, '');
  if (changes.length === 0) {
    lines.push('None.', '');
    return;
  }
  for (const change of changes) {
    lines.push(`#### ${inlineCode(change.id)}`, '');
    lines.push(`- Previously exported from module: ${inlineCode(change.previousModule || 'unknown')}`);
    if (change.declarationChange) {
      lines.push(`- Declaration: ${inlineCode(change.declarationChange.before)} → ${inlineCode(change.declarationChange.after)}`);
    }
    renderMemberChanges(lines, change.memberChanges);
    lines.push('');
  }
}

function renderDiffMarkdown(diff) {
  const lines = [
    '# v2 public interface diff',
    '',
    '> Generated by `npm run extract:v2-interfaces`. Do not edit this file manually.',
    '',
    'This report compares the configured committed base and candidate refs. It does not inspect uncommitted SDK changes. Start with [the review summary](./v2-interface-summary.md), then use this file for exact changes to retained symbols.',
    '',
  ];
  for (const [language, result] of Object.entries(diff.languages)) {
    lines.push(`## ${language[0].toUpperCase()}${language.slice(1)}`, '');
    lines.push(`- Repository: \`${result.repository}\``);
    lines.push(`- Base: \`${result.baseRef}\` (\`${result.baseCommit}\`)`);
    lines.push(`- Candidate: \`${result.candidateRef}\` (\`${result.candidateCommit}\`)`);
    const symbolCounts = result.counts.symbols;
    const memberCounts = result.counts.retainedSymbolMembers;
    lines.push(`- Public symbols: ${symbolCounts.added} added, ${symbolCounts.promoted} promoted to the package root, ${symbolCounts.removed} removed, ${symbolCounts.changed} changed`);
    lines.push(`- Members of retained symbols: ${memberCounts.added} added, ${memberCounts.removed} removed, ${memberCounts.changed} changed`, '');
    if (result.symbolChanges.length === 0) {
      lines.push('No public interface changes.', '');
      continue;
    }
    renderSymbolList(lines, 'Added public symbols', result.symbolChanges.filter((change) => change.status === 'added'));
    renderPromotedSymbols(lines, result.symbolChanges.filter((change) => change.status === 'promoted'));
    renderSymbolList(lines, 'Removed public symbols', result.symbolChanges.filter((change) => change.status === 'removed'));
    const changed = result.symbolChanges.filter((change) => change.status === 'changed');
    lines.push(`### Retained public symbols with changes (${changed.length})`, '');
    if (changed.length === 0) lines.push('None.', '');
    for (const change of changed) {
      lines.push(`#### ${inlineCode(change.id)}`, '');
      if (change.declarationChange) {
        lines.push(`- Declaration: ${inlineCode(change.declarationChange.before)} → ${inlineCode(change.declarationChange.after)}`);
      }
      renderMemberChanges(lines, change.memberChanges);
      lines.push('');
    }
  }
  return `${lines.join('\n')}\n`;
}

function renderSummaryMarkdown(diff) {
  const lines = [
    '# v2 public interface review summary',
    '',
    '> Generated by `npm run extract:v2-interfaces`. Do not edit this file manually.',
    '',
    'Use this file to scope documentation work. Added and removed symbols appear once; their complete members are available in the language manifests. Open [the review diff](./v2-interface-diff.md) only when you need exact changes to retained symbols.',
    '',
  ];
  for (const [language, result] of Object.entries(diff.languages)) {
    const symbols = result.counts.symbols;
    const members = result.counts.retainedSymbolMembers;
    lines.push(`## ${titleCase(language)}`, '');
    lines.push(`Comparing ${inlineCode(result.baseRef)} to ${inlineCode(result.candidateRef)}.`, '');
    lines.push('| Review unit | Added | Promoted | Removed | Changed |', '|---|---:|---:|---:|---:|');
    lines.push(`| Public symbols | ${symbols.added} | ${symbols.promoted} | ${symbols.removed} | ${symbols.changed} |`);
    lines.push(`| Members of retained symbols | ${members.added} | ${members.promoted} | ${members.removed} | ${members.changed} |`, '');
    for (const status of ['added', 'promoted', 'removed', 'changed']) {
      const matching = result.symbolChanges.filter((change) => change.status === status);
      lines.push(`### ${titleCase(status)} symbols (${matching.length})`, '');
      if (matching.length === 0) {
        lines.push('None.', '');
        continue;
      }
      const groups = new Map();
      for (const change of matching) {
        const separator = language === 'java' ? change.id.lastIndexOf('.') : -1;
        const group = separator === -1 ? 'Package exports' : change.id.slice(0, separator);
        const name = separator === -1 ? change.id : change.id.slice(separator + 1);
        const names = groups.get(group) || [];
        names.push(name);
        groups.set(group, names);
      }
      for (const [group, names] of groups) {
        if (language === 'java') lines.push(`#### ${inlineCode(group)}`, '');
        for (const name of names) lines.push(`- ${inlineCode(name)}`);
        lines.push('');
      }
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
  buildSymbolChanges,
  compareText,
  diffManifests,
  normalizeManifest,
  renderDiffMarkdown,
  renderSummaryMarkdown,
  replaceDirectoryAtomically,
  stableJson,
};
