# kj5irq.radio

Personal site of Joshua Ford (KJ5IRQ). Static, built with [Astro](https://astro.build), hosted on GitHub Pages behind Cloudflare DNS.

## Develop

```sh
nvm use            # Node 22
npm install
npm run dev
```

## Build and checks

```sh
npm run build
```

`build` runs four things in order, and all must pass:

1. `scripts/check-source.mjs`: rejects the build if private patterns or em dashes appear in site source
2. `astro build` (also validates content frontmatter against `src/content.config.ts`)
3. `scripts/privacy-grep.mjs`: rejects the build if private patterns appear in `dist/`
4. `scripts/check-links.mjs`: rejects the build on broken internal links

## Content

Work lives in `src/content/projects/*.md`. Frontmatter is typed and strict; every file must carry `publish: true` and `privacyReviewed: true` or the build fails. Statuses (`active`, `stable`, `experimental`, `archived`) and `updated` dates are shown on the site, so keep them honest.

Talks live in `src/data/talks.ts`. Title, date, and venue are required. Recording URLs are optional.

Old `/projects/` URLs redirect to `/work/`.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` builds and deploys to GitHub Pages. The repo's Pages setting must be **Source: GitHub Actions**. Custom domain comes from `public/CNAME`; DNS is managed at Cloudflare.

Rollback: revert the offending commit on `main`; the action redeploys the previous state in minutes.

## House rules

- No analytics, no cookies, no third-party scripts.
- Black and white. Two typefaces, self-hosted. Color is a later decision, not a default.
- Client JavaScript budget: the theme toggle and nothing else without a written reason.
- No em dashes in site copy.
- No seasonal kits. Dark is the default.
- No employer legal names, city, ZIP, grid, or node IDs.
- Internal planning notes do not live in this repository.
