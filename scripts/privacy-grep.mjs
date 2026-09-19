// Privacy gate: scans the built output for patterns that must never ship.
// Runs after `astro build`; exits nonzero on any hit.
//
// The pattern list lives in scripts/privacy-patterns.mjs because the vault sync
// applies the same policy before a note ever reaches the repo. One list, both
// gates, no drift.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { patterns, allow } from './privacy-patterns.mjs';

const DIST = new URL('../dist', import.meta.url).pathname;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (/\.(html|xml|txt|json|js|css)$/.test(name)) yield path;
  }
}

let failures = 0;
for (const file of walk(DIST)) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (const { name, re } of patterns) {
    lines.forEach((line, i) => {
      if (re.test(line) && !allow.some((a) => a.test(line))) {
        failures++;
        console.error(`PRIVACY: ${name} in ${relative(DIST, file)}:${i + 1}`);
      }
    });
  }
}

if (failures > 0) {
  console.error(`\nprivacy-grep: ${failures} hit(s). Build rejected.`);
  process.exit(1);
}
console.log('privacy-grep: clean.');
