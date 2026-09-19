import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

/* The writing shelf is advertised to crawlers only when something is on it.
   Doc 03 section D rules against launching an empty writing index, so while it
   is empty the page is noindex and nothing links to it, and listing it in the
   sitemap as well would be a contradiction. The content directory is read
   directly here because the config runs before Astro's content layer exists:
   it is the same condition the pages compute from getCollection. */
const writingDir = new URL('./src/content/writing/', import.meta.url);
const hasPublishedWriting =
  existsSync(writingDir) &&
  readdirSync(writingDir).some(
    (file) =>
      file.endsWith('.md') &&
      /^publish:\s*true\s*$/m.test(readFileSync(new URL(file, writingDir), 'utf8')),
  );

export default defineConfig({
  site: 'https://kj5irq.radio',
  trailingSlash: 'always',
  // Astro 7 changed the default from `true` (HTML-aware) to `'jsx'`, which strips
  // whitespace between inline elements by JSX rules and jams words together
  // (e.g. "2026 ·" and "Alba gu bràth" losing the space between them). This site's
  // markup relies on the HTML-aware behavior, so pin it rather than rewriting templates.
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/dev/') && (hasPublishedWriting || !page.includes('/writing/')),
    }),
  ],
  prefetch: true,
  // The dev toolbar floats over the bottom of the viewport, which is exactly
  // where the footer mark sits during design review. It is a dev aid, not part
  // of the site, and it only ever appears in dev mode.
  devToolbar: { enabled: false },
});
