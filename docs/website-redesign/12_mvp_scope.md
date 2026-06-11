# 12. MVP Scope

## Included

- Home, About, Projects index, Radio (KJ5IRQ), 404
- Project pages: AllStar toolchain case study (flagship), hermes-kb; WxBot and Homelab at least as index cards, as pages if Phase 5 allows
- Archive strip with openclaw-skill-asl3 card (index-level only)
- Colophon (cheap; first to cut)
- Both themes, full a11y baseline, SEO layer (titles, descriptions, OG images, JSON-LD Person, sitemap, robots, favicon, canonical)
- CI build + deploy via Actions to GitHub Pages

## Excluded (not at launch)

- Writing index and any writing content
- Notes / vault publishing and the sync script itself
- RSS, search, analytics
- Now, Uses, NetSuite/business-systems page, any Hermes/H.A.G. page
- The homepage schematic (Concept 3 material)
- Contact form (mailto only), comments (never), newsletters

## Deferred with conditions

| Item | Ships when |
|---|---|
| Writing index + RSS | 3 finished public-ready pieces exist |
| Vault sync pipeline | Phase 8, after launch, after the boobytrap test passes |
| Pagefind search | ~30+ documents |
| Schematic figure | Hand-finished SVG exists and survives the "diagram theater" test |
| Now page | Joshua commits to a 90-day update habit |
| Business systems page | Joshua drafts employer-safe patterns himself |

## Reasoning

The MVP is exactly the set of pages for which verified public material already exists. Everything excluded fails one of three tests: no content yet (writing), needs infrastructure that shouldn't gate launch (sync, search), or needs a Joshua decision/drafting that shouldn't happen under deadline pressure (employer content, H.A.G.). A 8-page site that is entirely true beats a 20-page site that is one-third aspiration.

## MVP sitemap

```
/  /about/  /projects/  /projects/allstar-toolchain/  /projects/hermes-kb/
[/projects/wxbot/  /projects/homelab/]  /radio/  [/colophon/]  /404
```

## MVP content checklist

- [ ] Hero h1 + dek chosen by Joshua (doc 04 recommended pair vs dry alternative)
- [ ] Operator note approved
- [ ] About page: bio, arc, links; employerMention decision applied (doc 15 D1)
- [ ] 4 to 6 project cards, each ≤140-char summary + why-care line, all claims verified by Joshua
- [ ] AllStar case study: all 7 sections, technical claims verified, 1 figure + 1 screenshot redacted
- [ ] hermes-kb page: 7 sections, one screenshot
- [ ] Radio page: callsign, class, node IDs, QRZ link; grid square per D3
- [ ] Footer: email, GitHub, LinkedIn, QRZ, "73 de KJ5IRQ"
- [ ] 404 page with one dry line and a link home
- [ ] All copy: no em dashes, no banned vocabulary (grep for the doc 02 anti-tone list)

## MVP design checklist

- [ ] Tokens implement doc 05 palette/type/spacing exactly; both themes hand-checked
- [ ] Index entries use the log row pattern; no card grids, no shadows
- [ ] One accent color present; status tags outline-style
- [ ] Headshot small on About + operator note only
- [ ] No motion beyond underline/arrow transitions; reduced-motion clean
- [ ] Styleguide page excluded from sitemap/robots

## MVP technical checklist

- [ ] Astro build green with `astro check`; schemas reject invalid fixture
- [ ] Zero client JS except inline theme script; no FOUC in either theme
- [ ] Fonts self-hosted, subset, ≤120KB, no layout shift
- [ ] All images via pipeline; none over 200KB; explicit dimensions
- [ ] CNAME preserved; site live at apex over Cloudflare; www redirects
- [ ] sitemap.xml, robots.txt, favicon, OG images all resolve
- [ ] Internal links 100% green in CI
- [ ] Lighthouse mobile ≥95/100/100/100

## MVP privacy checklist

- [ ] keepandroidopen.org script gone; zero third-party requests except none (fonts are self-hosted)
- [ ] Employer named per D1 decision only; parent company nowhere
- [ ] No ZIP code, street, grid square (unless D3 opts in) anywhere including alt text and OG
- [ ] No hostnames, IPs, internal paths, service inventories in any page, screenshot, or figure
- [ ] Screenshots redacted before entering git history
- [ ] H.A.G. appears at most as the one approved sentence; "Pensieve" appears nowhere
- [ ] `dist/` grepped with the doc 09 red-flag pattern list, clean
- [ ] EXIF stripped from all published images
