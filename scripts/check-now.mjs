// Fail the build if src/data/now.json is older than MAX_AGE_DAYS.
import { readFileSync } from 'node:fs';

const MAX_AGE_DAYS = 45;
const path = new URL('../src/data/now.json', import.meta.url);
const now = JSON.parse(readFileSync(path, 'utf8'));
const updated = Date.parse(now.updated);

if (Number.isNaN(updated)) {
  console.error('check-now: now.json.updated is not a date.');
  process.exit(1);
}

const ageDays = (Date.now() - updated) / 86400000;
if (ageDays > MAX_AGE_DAYS) {
  console.error(
    `check-now: now.json is ${Math.floor(ageDays)} days old (limit ${MAX_AGE_DAYS}). Update the line or kill /now.`
  );
  process.exit(1);
}

if (!now.line || typeof now.line !== 'string') {
  console.error('check-now: now.json.line is missing.');
  process.exit(1);
}

console.log(`check-now: fresh (${Math.floor(ageDays)}d).`);
