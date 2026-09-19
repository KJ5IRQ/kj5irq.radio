#!/usr/bin/env node
// Vault to repo sync. Implements docs/website-redesign/09_obsidian_publication_workflow.md.
//
// The vault is private by default and stays that way. This script can see exactly
// one folder inside it, <vault>/Publish, copies only what passes every gate into
// src/content/writing/, never writes to the vault, never commits, and never talks
// to the network. Un-publishing cannot un-commit, so the human diff after this runs
// is the gate that catches what a regex cannot.
//
// Two deliberate departures from doc 09, both simplifications:
//   - One collection, not two. Doc 09 writes notes to src/content/notes/ and
//     writing to src/content/writing/; this site has a single `writing`
//     collection with `kind` carrying the difference, so everything lands in
//     one place and the kind tag does the work.
//   - The script does not create a branch or open a PR. It writes into the
//     working tree and reports; review with `git diff`, then commit deliberately.
//
// Usage: npm run sync [-- --dry-run]

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { homedir } from 'node:os';
import matter from 'gray-matter';
import { patterns, allow } from './privacy-patterns.mjs';

const REPO = new URL('..', import.meta.url).pathname;
const OUT_DIR = join(REPO, 'src', 'content', 'writing');
const DRY_RUN = process.argv.includes('--dry-run');

const KINDS = ['essay', 'note', 'analysis', 'satire', 'fiction'];
const PUBLISHED_STATES = ['approved', 'published'];
// Only what the site schema declares. Everything else the vault carries (state,
// aliases, cssclasses, vault tags) is dropped, so vault-side metadata cannot ride
// in. An allowlist, not a blocklist.
const ALLOWED_FIELDS = ['title', 'summary', 'date', 'kind', 'updated', 'series', 'topics'];
const REQUIRED_FIELDS = ['title', 'summary', 'date', 'kind'];

function loadConfig() {
  const file = join(REPO, 'sync.config.json');
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  return {};
}

const vaultPath =
  process.env.VAULT_PATH || loadConfig().vaultPath || join(homedir(), 'Documents', 'Control');
const publishDir = join(vaultPath, 'Publish');

const report = { copied: [], updated: [], unchanged: [], pending: [], ignored: [], refused: [], lint: [], exceptions: [] };

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    // README and _-prefixed files and folders are scaffolding, not content.
    if (name.startsWith('_') || /^README/i.test(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (name.endsWith('.md')) yield path;
  }
}

// Refuse rather than repair: a note that does not fit the schema is a message to
// a human, not something to guess at.
function refuse(list, file, why) {
  list.push({ file: relative(vaultPath, file), why });
}

function checkText(file, label, text) {
  const hits = [];
  for (const line of text.split('\n')) {
    for (const { name, re } of patterns) {
      if (re.test(line) && !allow.some((a) => a.test(line))) {
        const excepted = /<!--\s*lint-ok:\s*\S+.*?-->/.test(line);
        if (excepted) report.exceptions.push(`${relative(vaultPath, file)}: ${name} (${line.trim().slice(0, 60)})`);
        else hits.push(`${label}: ${name}`);
      }
    }
  }
  return hits;
}

for (const file of walk(publishDir)) {
  const raw = readFileSync(file, 'utf8');
  let parsed;
  try {
    parsed = matter(raw);
  } catch (error) {
    refuse(report.lint, file, `frontmatter will not parse: ${error.message}`);
    continue;
  }
  const data = parsed.data ?? {};
  const state = data.state;

  // Not a candidate. The vault default is private, and drafts are not a failure.
  if (!state || ['private', 'draft', 'archived'].includes(state)) {
    report.ignored.push({ file: relative(vaultPath, file), why: state ? `state: ${state}` : 'no state field' });
    continue;
  }
  if (state === 'review') {
    report.pending.push(relative(vaultPath, file));
    continue;
  }
  if (!PUBLISHED_STATES.includes(state)) {
    refuse(report.refused, file, `unknown state: ${state}`);
    continue;
  }

  // All three flags must agree. Any mismatch is a skip with a loud reason.
  if (data.publish !== true) refuse(report.refused, file, 'state is approved but publish is not true');
  if (data.privacyReviewed !== true) refuse(report.refused, file, 'state is approved but privacyReviewed is not true');
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined) refuse(report.refused, file, `missing required field: ${field}`);
  }
  if (data.kind !== undefined && !KINDS.includes(data.kind)) {
    refuse(report.refused, file, `kind must be one of ${KINDS.join(', ')} (got ${data.kind})`);
  }
  if (report.refused.some((r) => r.file === relative(vaultPath, file))) continue;

  // Content lint, on the body and on every string in the frontmatter.
  const frontmatterText = Object.entries(data)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
    .join('\n');
  const hits = [
    ...checkText(file, 'body', parsed.content),
    ...checkText(file, 'frontmatter', frontmatterText),
  ];

  // A wikilink cannot resolve here, and an unresolved one leaks a private note
  // title into a public repo, which is exactly the failure doc 09 names.
  const wiki = raw.match(/\[\[[^\]]+\]\]/g);
  if (wiki) hits.push(`body: unresolved wikilink ${wiki[0]}`);

  // Private hosts in a public page are either a mistake or a leak.
  for (const url of raw.match(/https?:\/\/[^\s)"']+/g) ?? []) {
    if (/^https?:\/\/(localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|[^/]*\.local)/i.test(url)) {
      hits.push(`body: private host in link (${url.slice(0, 48)})`);
    }
  }

  if (hits.length) {
    for (const hit of hits) report.lint.push({ file: relative(vaultPath, file), why: hit });
    continue;
  }

  // Convert to exactly what the site schema wants.
  const slug = (data.slug && String(data.slug)) || basename(file, '.md');
  const out = {};
  for (const field of ALLOWED_FIELDS) {
    if (data[field] === undefined) continue;
    out[field] = data[field];
  }
  for (const dateField of ['date', 'updated']) {
    if (out[dateField] instanceof Date) out[dateField] = out[dateField].toISOString().slice(0, 10);
  }
  out.publish = true;
  out.privacyReviewed = true;
  out.source = 'vault';

  const order = ['title', 'summary', 'date', 'kind', 'updated', 'series', 'topics', 'publish', 'privacyReviewed', 'source'];
  const front = order
    .filter((field) => out[field] !== undefined)
    .map((field) => {
      const value = out[field];
      if (Array.isArray(value)) return `${field}: [${value.map((v) => JSON.stringify(v)).join(', ')}]`;
      if (typeof value === 'string') return `${field}: ${JSON.stringify(value)}`;
      return `${field}: ${value}`;
    })
    .join('\n');
  const document = `---\n${front}\n---\n\n${parsed.content.trim()}\n`;

  const target = join(OUT_DIR, `${slug}.md`);
  const previous = existsSync(target) ? readFileSync(target, 'utf8') : null;
  const rel = `${slug}.md`;

  if (previous === document) {
    report.unchanged.push(rel);
    continue;
  }
  if (!DRY_RUN) {
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(target, document);
  }
  (previous ? report.updated : report.copied).push(rel);
}

// Report. Everything printed, nothing silent: the smallness of this habit is the
// real defence per doc 09.
const line = (label, items) => {
  if (!items.length) return;
  console.log(`\n${label} (${items.length})`);
  for (const item of items) {
    console.log(`  ${typeof item === 'string' ? item : `${item.file} — ${item.why ?? ''}`}`);
  }
};
console.log(`vault:   ${vaultPath}`);
console.log(`source:  ${relative(vaultPath, publishDir) || 'Publish'}/`);
console.log(`target:  src/content/writing/${DRY_RUN ? '   (dry run: nothing written)' : ''}`);
line('copied', report.copied);
line('updated', report.updated);
line('already up to date', report.unchanged);
line('pending review (state: review, not copied)', report.pending);
line('outside the pipeline (no state, or private/draft/archived — not copied)', report.ignored);
line('REFUSED — gate mismatch or bad frontmatter', report.refused);
line('REFUSED — content lint', report.lint);
line('ALLOWED BY INLINE EXCEPTION (visible on purpose)', report.exceptions);

const failures = report.refused.length + report.lint.length;
if (failures) {
  console.error(`\nvault-sync: ${failures} note(s) refused. Nothing was wrong with the rest.`);
  process.exit(1);
}
console.log('\nvault-sync: done. Review `git status` and `git diff`, then commit deliberately.');
