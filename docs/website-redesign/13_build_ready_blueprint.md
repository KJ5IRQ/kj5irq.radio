# 13. Build-Ready Implementation Blueprint

Target: Astro ~5.x, Node 22, GitHub Pages via Actions. Branch: per session instructions at build time. Everything below is MVP unless marked.

## File plan

### Configuration and infrastructure

| Path | Purpose | Inputs | Outputs | Dependencies | Privacy risk | MVP |
|---|---|---|---|---|---|---|
| `astro.config.mjs` | site URL `https://kj5irq.radio`, sitemap integration, prefetch | — | build config | astro, @astrojs/sitemap | None | Yes |
| `package.json` | scripts: dev/build/check/sync | — | — | — | None | Yes |
| `.nvmrc` | `22` | — | — | — | None | Yes |
| `.github/workflows/deploy.yml` | check → build → link check → deploy Pages on push to main | repo | live site | withastro/action | Low (pin action versions) | Yes |
| `public/CNAME` | `kj5irq.radio` (carry over, this keeps Pages bound to the domain) | — | — | — | None | Yes |
| `public/robots.txt` | allow all + sitemap pointer; disallow /dev/ | — | — | — | None | Yes |
| `public/favicon.svg` + fallback ico | derived from logo.png mark | logo | — | — | None | Yes |
| `scripts/check-links.mjs` | crawl `dist/` for broken internal links | dist | CI pass/fail | linkinator or hand-rolled | None | Yes |
| `scripts/vault-sync.mjs` | doc 09 pipeline | vault Publish/ | content files on a branch | gray-matter | **High; fail-closed design per doc 09** | No (Phase 8) |
| `scripts/privacy-grep.mjs` | red-flag pattern scan of `dist/` | dist, patterns file | CI warn/fail | — | It IS the mitigation | Yes |

### Styles

| Path | Purpose | Privacy risk | MVP |
|---|---|---|---|
| `src/styles/tokens.css` | doc 05 custom properties: palette both themes, type scale, spacing, rules | None | Yes |
| `src/styles/global.css` | reset, base typography, prose styles, focus/motion rules | None | Yes |

Plain CSS, no Tailwind, no preprocessor. The design system is ~2 files; a utility framework would be more code than the site.

### Layouts

| Path | Purpose | Inputs | MVP |
|---|---|---|---|
| `src/layouts/BaseLayout.astro` | html shell, head (SEO component, inline theme script), header, footer, skip link | title, description, og fields | Yes |
| `src/layouts/DocLayout.astro` | reading-column page (about, case studies, radio, colophon) | frontmatter | Yes |
| `src/layouts/IndexLayout.astro` | log-style index with margin column ≥900px | entries | Yes |

### Components (this list is the allowlist; additions need a reason)

| Path | Purpose | Inputs | Privacy risk | MVP |
|---|---|---|---|---|
| `src/components/SEO.astro` | title/desc/canonical/OG/JSON-LD per doc 06 table | page meta | Low (review JSON-LD output once) | Yes |
| `src/components/Header.astro` | wordmark + 3 links | — | None | Yes |
| `src/components/Footer.astro` | email, GitHub, LinkedIn, QRZ, colophon, 73 | site config | None | Yes |
| `src/components/ThemeToggle.astro` | button + inline head script (no FOUC, aria-pressed) | — | None | Yes |
| `src/components/ProjectEntry.astro` | the log row: title, summary, why-care, mono meta | Project entry | None (data already gated) | Yes |
| `src/components/StatusTag.astro` | active/stable/experimental/archived outline tag | status | None | Yes |
| `src/components/MetaRow.astro` | mono data row with aria labeling | fields | None | Yes |
| `src/components/CaseStudyHeader.astro` | meta table atop case studies | frontmatter | None | Yes |
| `src/components/Figure.astro` | image/SVG + 1px rule + mono caption + text alternative | asset, caption, alt | Medium: every asset pre-redacted | Yes |
| `src/components/ArchiveBanner.astro` | "Archived. Kept for reference." | — | None | Yes |
| `src/components/StationFacts.astro` | radio facts table | radio data | Low (grid square gated by D3) | Yes |

### Content

| Path | Purpose | Privacy risk | MVP |
|---|---|---|---|
| `src/content/config.ts` | Zod schemas per doc 06; `publish` + `privacyReviewed` required; unknown fields rejected (`.strict()`) | **This is the gate; test it with a bad fixture** | Yes |
| `src/content/projects/allstar-toolchain.md` | flagship case study | Medium: claims verified, no network details | Yes |
| `src/content/projects/hermes-kb.md` | case study | Medium: one H.A.G. sentence max | Yes |
| `src/content/projects/wxbot.md` | card or short page | Medium: no ZIP | Yes |
| `src/content/projects/homelab.md` | pattern-level overview | **High: doc 07 format 6 rules** | Yes* |
| `src/content/projects/openclaw-skill-asl3.md` | archived card, index-only | Low | Yes |
| `src/data/site.ts` | name, email, social URLs, radio facts, employerMention | Low | Yes |

\* homelab ships only if it passes privacy review; cut line otherwise.

### Pages

| Path | Purpose | MVP |
|---|---|---|
| `src/pages/index.astro` | doc 04 homepage: hero, featured (filter `featured`), operator note, station strip, footer-contact | Yes |
| `src/pages/about.astro` | bio, arc, headshot, links | Yes |
| `src/pages/projects/index.astro` | clustered log index + archive strip | Yes |
| `src/pages/projects/[slug].astro` | case-study renderer for `caseStudy: true` entries | Yes |
| `src/pages/radio.astro` | station page | Yes |
| `src/pages/colophon.astro` | stack, fonts, no-tracking statement | Cuttable |
| `src/pages/404.astro` | dry line + home link ("Nothing heard. → home") | Yes |
| `src/pages/dev/styleguide.astro` | living style guide, noindex, disallow in robots | Yes (Phase 3) |
| `src/pages/og/[...route].ts` | build-time OG image generation | Yes (or static fallback image if it fights back; cut line) |
| `src/pages/writing/…`, `src/pages/notes/…`, `rss.xml.ts` | post-MVP | No |

### Assets required before Phase 6

| Asset | Source | Privacy action |
|---|---|---|
| `src/assets/headshot.{jpg}` | existing repo file (jpg, not the 1.2MB png) | none |
| `public/logo.svg` or optimized png | existing logo.png | none |
| AllStar architecture figure (SVG) | drawn during build, Joshua approves | no hostnames/IPs in labels |
| Panel extension screenshot | Joshua | redact node/network identifiers as needed |
| hermes-kb query screenshot | Joshua | check paths in terminal prompt |
| WxBot alert screenshot | Joshua | redact recipients |

## Schemas (sketch for `config.ts`)

```ts
const projects = defineCollection({
  schema: z.object({
    title: z.string(), summary: z.string().max(140),
    whyItMatters: z.string().max(120),
    status: z.enum(["active","stable","experimental","archived"]),
    cluster: z.enum(["radio","ai-tooling","homelab","utilities","business-systems"]),
    started: z.date(), updated: z.date(),
    publish: z.literal(true),          // unpublished files simply don't enter this repo
    privacyReviewed: z.literal(true),  // build fails if not explicitly true
    repo: z.string().url().optional(),
    stack: z.array(z.string()).max(5).optional(),
    featured: z.boolean().default(false),
    caseStudy: z.boolean().default(false),
    image: z.string().optional(), imageAlt: z.string().optional(),
  }).strict(),
});
```

## Validation and commands

- `npm run dev` → localhost:4321
- `npm run build` → `astro check && astro build && node scripts/privacy-grep.mjs && node scripts/check-links.mjs`
- `npm run check` → same minus emit
- CI runs `npm run build` exactly; deploy step only on `main`.

## Milestones

1. **First safe milestone:** scaffold + tokens + BaseLayout + homepage with real hero copy and hard-coded featured entries, deployed nowhere, verified locally. Proves the design in the browser. (Phases 3-4 core.)
2. **Second milestone:** content collections live, projects index + flagship case study rendering from Markdown, CI green end to end.
3. **Launch milestone:** all MVP pages, doc 14 green, merge to `main`, tag `v1.0.0`, live at kj5irq.radio.

## Known unknowns

1. Serif body sign-off (doc 05 fallback ready).
2. Whether `asl3-api`/`asl3-mcp` READMEs contain enough verified detail for the case study, or Joshua needs to supply specifics (likely some of both).
3. OG generation friction in CI (static fallback ready).
4. WxBot's actual delivery mechanism (verify before copy ships).
5. Whether GitHub Pages + Actions keeps the apex HTTPS cert seamless at cutover (it should; CNAME file is preserved; verify within minutes of merge).
