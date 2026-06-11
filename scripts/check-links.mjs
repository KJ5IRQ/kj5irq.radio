// Internal link checker: every internal href/src in the built output must
// resolve to a file in dist. External links are not checked here.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (name.endsWith('.html')) yield path;
  }
}

function resolves(url) {
  const clean = url.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return existsSync(join(DIST, 'index.html'));
  const path = join(DIST, clean);
  return (
    existsSync(path) ||
    existsSync(join(path, 'index.html')) ||
    existsSync(`${path.replace(/\/$/, '')}.html`)
  );
}

let broken = 0;
for (const file of walk(DIST)) {
  const html = readFileSync(file, 'utf8');
  const refs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (ref.startsWith('//')) continue;
    if (!resolves(ref)) {
      broken++;
      console.error(`BROKEN: ${ref} referenced in ${relative(DIST, file)}`);
    }
  }
}

if (broken > 0) {
  console.error(`\ncheck-links: ${broken} broken internal link(s).`);
  process.exit(1);
}
console.log('check-links: all internal links resolve.');
