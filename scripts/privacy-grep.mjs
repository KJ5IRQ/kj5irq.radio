// Privacy gate: scans the built output for patterns that must never ship.
// Runs after `astro build`; exits nonzero on any hit.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname;

const patterns = [
  { name: 'RFC1918 IP (192.168.x.x)', re: /\b192\.168\.\d{1,3}\.\d{1,3}\b/ },
  { name: 'RFC1918 IP (10.x.x.x)', re: /\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/ },
  { name: 'RFC1918 IP (172.16-31.x.x)', re: /\b172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b/ },
  { name: 'ZIP code 76067', re: /76067(?!\/?")/ },
  { name: 'Employer name', re: /nextlink/i },
  { name: 'Parent company', re: /AMG Technologies/i },
  { name: 'Vault codename', re: /pensieve/i },
  { name: 'Private project name', re: /H\.A\.G\./ },
  { name: 'Key assignment', re: /(api[_-]?key|secret|token)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}/i },
  { name: 'Local filesystem path', re: /(\/home\/[a-z0-9_]+\/|C:\\Users\\)/i },
];

// The WxBot repo URL legitimately contains the ZIP; allow exactly that URL.
const allow = [/github\.com\/KJ5IRQ\/WxBot_76067/];

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
