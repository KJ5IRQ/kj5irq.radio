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
  redirects: {
    '/projects/': '/work/',
    '/projects/allstar-toolchain/': '/work/allstar-toolchain/',
    '/projects/hermes-kb/': '/work/hermes-kb/',
    '/projects/homelab/': '/work/homelab/',
    '/projects/wxbot/': '/work/wxbot/',
    '/projects/openclaw-skill-asl3/': '/work/',
  },
});
