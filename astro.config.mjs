import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
      filter: (page) => !page.includes('/dev/'),
    }),
  ],
  prefetch: true,
});
