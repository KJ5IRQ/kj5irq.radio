# kj5irq.radio

Personal site of Joshua Ford (KJ5IRQ). Static, built with [Astro](https://astro.build), hosted on GitHub Pages behind Cloudflare DNS.

## Develop

```sh
nvm use            # Node 22
npm install
npm run dev        # localhost:4321
```

## Build and checks

```sh
npm run build
```

`build` runs three things in order, and all must pass:

1. `astro build` (also validates content frontmatter against `src/content.config.ts`)
2. `scripts/privacy-grep.mjs`: rejects the build if private patterns (IPs, employer names, ZIP, project codenames, key-shaped strings) appear in `dist/`
3. `scripts/check-links.mjs`: rejects the build on broken internal links

## Content

Projects live in `src/content/projects/*.md`. Frontmatter is typed and strict; every file must carry `publish: true` and `privacyReviewed: true` or the build fails. Statuses (`active`, `stable`, `experimental`, `archived`) and `updated` dates are shown on the site, so keep them honest.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` builds and deploys to GitHub Pages. The repo's Pages setting must be **Source: GitHub Actions**. Custom domain comes from `public/CNAME`; DNS is managed at Cloudflare.

Rollback: revert the offending commit on `main`; the action redeploys the previous state in minutes.

## House rules

- No analytics, no cookies, no third-party scripts.
- One accent color (Ford Field Green). Two typefaces, self-hosted.
- Client JavaScript budget: the theme toggle and nothing else without a written reason.
- No em dashes in site copy.

Redesign rationale and the full plan: `docs/website-redesign/`.
