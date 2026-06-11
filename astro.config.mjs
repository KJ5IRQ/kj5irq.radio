import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kj5irq.radio',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/dev/'),
    }),
  ],
  prefetch: true,
});
