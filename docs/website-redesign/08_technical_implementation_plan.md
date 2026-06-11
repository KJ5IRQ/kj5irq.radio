# 08. Technical Implementation Plan

## Current stack

Hand-written single `index.html` on GitHub Pages, Cloudflare DNS pointing the apex at GitHub's Pages IPs, `CNAME` file in repo. Zero build step. It works; it just can't grow.

## Recommendation: Astro on GitHub Pages (built by GitHub Actions), Cloudflare DNS unchanged

### Why Astro fits Joshua

- **Static by default, zero client JS by default.** The doc 05 budget (one inline theme script) is Astro's natural output, not something to fight for.
- **Content collections with Zod schemas** implement doc 06 directly: typed frontmatter, builds that fail on invalid or unreviewed content. The privacy gate becomes a compile error.
- **Markdown-first** matches the Obsidian pipeline (doc 09): notes are files, the site is a renderer.
- **Boring in the right places.** It's HTML and CSS with a templating layer; in six months Joshua can still read every file. Components exist but there's no client framework unless he adds one (he shouldn't).
- **First-class image pipeline** (`astro:assets`): the 1.2MB headshot problem becomes structurally impossible.

### Why not the alternatives

- **Next.js:** a React application server for a site with no application. Heavier mental model, heavier output, churn-prone. Wrong tool.
- **Hugo:** excellent and fast, but Go templates are the part people dread touching later, and the design system in doc 05 wants component-scoped markup. Second place.
- **Eleventy:** close third; great philosophy, but config-assembled. Astro's typed collections and image pipeline win on the privacy-gate and asset requirements specifically.
- **Plain HTML/CSS:** the current site is the proof of its ceiling: no layouts, no collections, no per-page metadata without copy-paste.
- **A CMS (any):** one author, who lives in Git and Obsidian. A CMS adds an admin surface, an attack surface, and a subscription to babysit. No.

### Hosting

**Stay on GitHub Pages.** It is already wired (repo, CNAME, Cloudflare DNS, HTTPS) and free. The only change: deploy via GitHub Actions (`withastro/action`) instead of serving the repo root, so `main` holds source and the action publishes the build.

Cloudflare Pages is the noted alternative (slightly nicer previews); migrating mid-redesign adds risk for marginal gain. Revisit only if Pages limits bite.

### Workflows

- **Content:** edit Markdown in `src/content/**` (directly, or via the doc 09 vault sync) → commit to a branch → PR → merge → Action builds and deploys. Previews: `npm run dev` locally is sufficient at this scale.
- **Deployment:** push to `main` → Actions: install, `astro check`, `astro build`, link check, deploy to Pages. Rollback = revert commit.
- **Images:** originals (reasonable size, pre-redacted) in `src/assets/`; Astro emits AVIF/WebP/srcset at build. Never commit anything over ~2MB; a pre-commit size check enforces it.
- **SEO:** `@astrojs/sitemap`, per-page `<SEO>` component, JSON-LD per doc 06, `robots.txt` static.
- **Analytics:** **none at launch.** A personal site does not need visitor surveillance, and "no analytics, no cookies" belongs in the colophon. If curiosity wins later: Cloudflare Web Analytics (free, cookieless, one line) since Cloudflare already fronts DNS. Never Google Analytics.
- **Search:** none at MVP (8 pages). Pagefind when writing+notes exceed ~30 documents; it's static, indexed at build, zero backend.
- **RSS:** `@astrojs/rss` ships with the writing section, not before. Reserve `/rss.xml` (return 404 until then, never a broken feed).
- **Backups:** the repo is the site; GitHub + every local clone are the backup. The vault is backed up separately by Joshua's existing Drive sync; the site never becomes the vault's only home. Tag releases (`v1.0.0` at launch) for easy archaeology.

### Local development

```
git clone git@github.com:KJ5IRQ/kj5irq.radio.git
cd kj5irq.radio
npm install
npm run dev        # localhost:4321
```

Node 22 LTS via `.nvmrc`. No environment variables at all in MVP (a fact worth preserving; the moment one appears, it goes in `.env`, never committed, documented in README).

### Expected folder structure

```
/
├── .github/workflows/deploy.yml
├── astro.config.mjs
├── package.json / package-lock.json
├── .nvmrc
├── public/            # CNAME, robots.txt, favicon, logo
├── src/
│   ├── assets/        # images (pre-redacted originals)
│   ├── components/    # per doc 13
│   ├── content/
│   │   ├── projects/  # *.md per doc 06
│   │   └── config.ts  # Zod schemas = the privacy gate
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── scripts/
│   ├── vault-sync.mjs # doc 09
│   └── check-links.mjs
└── docs/website-redesign/   # these documents
```

### Security concerns

- No third-party scripts (removes the current banner.js class of risk permanently). CSP via meta tag: `default-src 'self'` plus inline-style/script hashes as needed.
- Actions pinned to major versions; Dependabot on (monthly batch, not noise).
- Dependency surface kept to Astro + 2 or 3 official integrations. Every `npm install` of something new is a small decision, not a reflex.
- Secrets: none exist; keep it that way.

### Maintenance burden (honest estimate)

- Steady state: edit Markdown, bump `updated`, merge. Minutes.
- Quarterly: `npm update`, rebuild, eyeball. ~30 minutes.
- Astro major upgrades: roughly annual, an evening. Acceptable; Hugo would be lower-churn but costs more at design time (tradeoff acknowledged).

### Commands

- Build: `npm run build` (runs `astro check && astro build`)
- Dev: `npm run dev`
- Test/validate: `npm run check` (astro check + link check + schema validation, which is the build itself)
- Sync vault content: `npm run sync` (doc 09; manual, never in CI)

### Branch strategy

- `main`: deployable source of truth; deploys on push.
- Feature branches per change (`redesign/foundation`, `content/allstar-case-study`), PRs even solo (the diff review *is* the privacy review checkpoint).
- The current single-file site remains live on `main` until the redesign branch is complete and approved; cutover is one merge, rollback is one revert.

### Implementation sequence (summary; full roadmap doc 11)

1. Scaffold Astro on a branch; port CNAME/robots/favicon; CI builds and deploys to a preview (or local-verified) state.
2. Design system: tokens, layouts, typography, both themes.
3. Content collections + schemas.
4. Pages: home → projects index → flagship case study → remaining projects → radio → about → colophon → 404.
5. SEO layer, link checking, image pipeline verification.
6. Privacy review pass (doc 14 checklist), Lighthouse pass.
7. Cutover merge, tag `v1.0.0`, verify live, then archive screenshots of the old site for nostalgia.
