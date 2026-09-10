// Source-copy gate. Scans site source (not this file, not dist) for
// forbidden public terms and em dashes. Runs before astro build.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.astro',
  'scripts',
  'docs',
]);

const TEXT = /\.(astro|md|ts|js|css|json|txt|html|yml|yaml)$/;

const privacy = [
  { name: 'RFC1918 IP (192.168.x.x)', re: /\b192\.168\.\d{1,3}\.\d{1,3}\b/ },
  { name: 'RFC1918 IP (10.x.x.x)', re: /\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/ },
  { name: 'RFC1918 IP (172.16-31.x.x)', re: /\b172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b/ },
  { name: 'ZIP code 76067', re: /76067/ },
  { name: 'Employer name', re: /nextlink/i },
  { name: 'Parent company', re: /AMG Technolog/i },
  { name: 'City', re: /mineral\s*wells/i },
  { name: 'Hudson Oaks', re: /hudson\s*oaks/i },
  { name: 'Phone', re: /940[-.\s]?445[-.\s]?4684/ },
  { name: 'Prior employer', re: /kar kare/i },
  { name: 'Grid square', re: /EM02wt/i },
  { name: 'Node id', re: /637050/ },
  { name: 'Old X handle', re: /BuryMeInTexas/i },
  { name: 'Vault codename', re: /pensieve/i },
  { name: 'Private project name', re: /H\.A\.G\./ },
  { name: 'Key assignment', re: /(api[_-]?key|secret|token)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}/i },
  { name: 'Local filesystem path', re: /(\/home\/[a-z0-9_]+\/|C:\\Users\\)/i },
];

const emdash = { name: 'em dash', re: /[\u2013\u2014]/ };

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === '.' || name === '..') continue;
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) {
      if (SKIP_DIRS.has(name)) continue;
      yield* walk(path);
    } else if (TEXT.test(name)) {
      yield path;
    }
  }
}

let failures = 0;
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file);
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (const { name, re } of [...privacy, emdash]) {
    lines.forEach((line, i) => {
      if (re.test(line)) {
        failures++;
        console.error(`SOURCE: ${name} in ${rel}:${i + 1}`);
      }
    });
  }
}

if (failures > 0) {
  console.error(`\ncheck-source: ${failures} hit(s). Build rejected.`);
  process.exit(1);
}
console.log('check-source: clean.');
