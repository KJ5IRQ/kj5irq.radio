# 10. SEO, Accessibility, and Performance Plan

## SEO

### Homepage title options
1. `Joshua Ford · systems, radio, automation (KJ5IRQ)` ← recommended
2. `Joshua Ford | KJ5IRQ | Systems and automation in Texas`
3. `Joshua Ford: NetSuite, amateur radio, AI tooling`

### Homepage meta description options
1. "Joshua Ford (KJ5IRQ) builds and runs systems in Texas: ERP platforms, an AllStarLink node with its own API and MCP server, a homelab, and practical AI tooling." ← recommended
2. "Personal site of Joshua Ford, KJ5IRQ. Projects connecting business systems, amateur radio, and local AI agents."

### Open Graph image concept
One template, build-generated per page: paper background, page title in the display serif, the green rule, `kj5irq.radio` and the callsign small in mono. Homepage variant adds the logo mark. No headshot on OG (his name + mark is the brand; the face stays on About). 1200x630, generated at build (satori or astro-og-canvas), so every page gets a correct card with zero per-page effort.

### Keywords (write for these, never stuff)
"Joshua Ford" + Texas/NetSuite (his own name is goal one), "KJ5IRQ", "AllStarLink API", "AllStarLink MCP", "ASL3 REST API", "Hermes Agent knowledge base", "NetSuite administrator personal site". Niche, low-competition phrases that exactly match real pages: the AllStar toolchain case study can plausibly own "AllStarLink MCP server" outright.

### Structured data
- Sitewide: `Person` JSON-LD (name, alternateName KJ5IRQ, url, sameAs: GitHub, LinkedIn, QRZ).
- Projects with repos: `SoftwareSourceCode`.
- Writing (later): `Article` with datePublished/dateModified.

### Mechanical rules
- Canonical: `https://kj5irq.radio/...`, trailing slash, https+apex only (www redirects at Cloudflare).
- Sitemap: `@astrojs/sitemap`, all public pages, excludes 404.
- robots.txt: allow all, sitemap pointer. No AI-crawler blocking games at MVP (a public portfolio wants to be read; revisit if he ever cares).
- RSS: only with the writing section; advertise via `<link rel=alternate>` then.
- Per-type title/description/JSON-LD rules: see table in doc 06.
- Redirects: the old site is one page with fragment anchors (`/#about` etc.); fragments need no redirects. No URL debt. Lucky.

### KJ5IRQ discoverability
The radio page is the canonical home for the callsign string; QRZ bio should link back to kj5irq.radio (Joshua action); AllStarLink node listing can carry the URL too. These two backlinks matter more than any on-page trick.

### What not to over-optimize
No keyword-stuffed headings, no FAQ schema theater, no blog-for-SEO content, no meta keywords tag, no obsessing over rankings for generic terms ("systems administrator") he'll never win and doesn't need.

## Accessibility (WCAG 2.2 AA target)

- **Semantics:** one `h1` per page; sequential heading levels; `header/nav/main/footer` landmarks; lists are lists; the project meta rows are definition-style content, not ASCII art to screen readers (use `aria-label` on the row or visually-hidden labels).
- **Keyboard:** everything reachable and operable; logical tab order (source order = visual order); skip link retained from the current site.
- **Focus:** visible 2px accent ring with offset on every interactive element, both themes; never `outline: none` without replacement.
- **Contrast:** body ≥7:1 (effectively AAA, comes free with ink-on-paper); UI text and links ≥4.5:1 in both themes; the dark-theme green link color (`#789C5E` on `#141413` ≈ 5.4:1) verified per component; status tags ≥3:1 for borders plus text contrast.
- **Reduced motion:** all transitions inside `prefers-reduced-motion: no-preference`; no smooth-scroll outside it; the future diagram draw-in disabled under it.
- **Alt text:** every image; headshot "Joshua Ford" not "headshot"; the architecture figure gets a full text alternative (a short paragraph below it, which also helps everyone).
- **Theme toggle:** real `<button>`, `aria-pressed`, inline head script to prevent FOUC, works without JS by falling back to system preference.
- **Screen reader pass:** VoiceOver (Safari) + NVDA (Firefox) walkthrough of home, projects index, and one case study before launch.

## Performance

### Budgets and targets
- Lighthouse (mobile, throttled): Performance ≥95, A11y 100, Best Practices 100, SEO 100.
- Transfer per page: ≤300KB total, ≤150KB before images.
- JS: ≤1KB (inline theme script). Any proposal to add client JS must name the user benefit in one sentence or it doesn't ship.
- Fonts: 2 families; subset; woff2 only; ≤120KB combined; `font-display: swap` with metric-compatible fallbacks tuned (Fontaine or manual `size-adjust`) to kill layout shift.
- Images: AVIF/WebP via astro:assets; explicit width/height; `loading="lazy"` below the fold; hero has no image (free win); no image file over 200KB published.
- CSS: single compiled sheet ≤30KB, inlined critical not needed at this size (just inline it all if under ~20KB).
- CLS ≈ 0, LCP = the h1 text (sub-second on 4G).

### Strategy notes
Static generation everywhere; no hydration; system of plain `<a>` navigation (no client router, no prefetch library; Astro's built-in prefetch on hover is acceptable, it's tiny and optional). Mobile-first CSS; the 160px margin column is a ≥900px enhancement.

## Testing checklist

- **Browsers:** latest Firefox, Chrome, Safari (macOS + iOS), Edge; one pass at 360px, 768px, 1100px, 1440px.
- **Mobile:** real phone test (his), both themes, both orientations.
- **Links:** automated check in CI (internal 100% green; external checked but warn-only, the internet rots).
- **A11y:** axe-core or Pa11y in CI on built pages + the manual screen reader pass above.
- **Build:** `astro check` (types + schemas) green; sync script report clean.
- **Privacy:** doc 14 privacy checklist executed on the full built output (grep the `dist/` for the red-flag pattern list, same list as doc 09's lint; it's cheap and catches template accidents).
- **Visual:** screenshot diff is overkill at this scale; a manual eyeball of every page in both themes pre-merge is the rule.
