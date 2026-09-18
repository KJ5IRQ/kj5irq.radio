# kj5irq.radio design explorations

**Status:** scratch explorations. None of this is on `main` and nothing here is deployed.
**Saved:** 2026-09-18, from throwaway builds in `/tmp` that would otherwise have been lost with the session.
**Base:** commit `13d92da` ("Website redesign: full 8-page rebuild (Astro, Station Log design) + plan docs"), the last commit before the World Cup kit landed on 2026-06-12.

## Why these exist

The 17-document plan in `docs/website-redesign/` in the site repo recommended **doc 05 Concept 2, "Station Log"**. What actually shipped on 2026-06-11 was **Concept 1, "Field Manual"**. Verified evidence:

- `--margin-col: 160px` is defined in `tokens.css` and was **never used anywhere** in the shipped code.
- Doc 05 specifies Concept 2's index grid as `grid-template-columns: 160px 1fr`. The only grids in the shipped site are the operator-note column and its mobile collapse.
- No hanging dates, no oversized index numerals, no baseline-aligned multi-column meta on any page.
- Doc 05 for Concept 2: *"Hero is smaller; the featured-work log IS the page's centerpiece."* Shipped: large `--size-display` hero, modest list underneath.

Josh's reaction to the shipped design was "close, but something's off." These three variants exist to make that concrete and let him react to real pages instead of descriptions.

## The variants

Each directory is a complete Astro source tree (no `node_modules`, no `dist`).

### `station-tweaks/` — v1 as built, plus a switch panel

The shipped Concept 1 design with a **Tweaks** harness: Theme (Light/Dark/Auto) and Body (Serif/Sans). This is the "as built" baseline you can compare against.

### `station-log/` — the plan's Concept 2, implemented

Adds the missing log treatment:

- Index entries become a `160px / 1fr` grid with the **date hanging in the margin column**
- A thin Ford Field Green tick marks running projects (muted for archived, amber for experimental)
- Title arrows nudge 2px on hover, inside `prefers-reduced-motion: no-preference`
- Hero stepped down from `--size-display` to `--size-h1` so the log is the centerpiece

Breakpoint here is 900px per doc 05.

### `station-mono/` — the monochrome direction (Josh's current favourite)

Built after he named black-and-white as the direction, using measured values from the reference sites rather than guesses. See "Measured reference values" below.

- **Pure `#ffffff` paper, pure `#000000` ink** (replacing the warm `#faf9f6` / `#1c1b18`)
- Greys (`#6b6b6b`, `#dcdcdc`) carry hierarchy instead of colour
- **Grotesk body** — IBM Plex Sans, pairing with the IBM Plex Mono already in the project
- Tighter leading (1.6) and tracking (-0.02em) so large type reads as designed
- Display scale pushed: headline 60px → **80px**; `--size-display` now up to 7.5rem
- Keeps the log treatment, with the breakpoint lowered to **760px** (demo concession; doc 05 says 900)
- **Tweaks panel:** Theme (Light/Dark/Auto) · Face (Grotesk/Serif) · Accent (Green/Mono)

## Measured reference values

Josh pointed at Awwwards' "Black and White Websites" collection. Fetched and parsed the actual stylesheets of five of them (script: `analyze_bw.py` logic, run 2026-09-18):

| Site | Achromatic hexes | Palette | Type |
|---|---|---|---|
| Bruno Tomé | 100% (17/17) | `#fff`, `#000` only | Space Mono |
| Studio—BA® | 100% (16/16) | `#fff`, `#000`, `#a6a6a6` | Helvetica Now Text + EB Garamond |
| mē-lo (Angela Milosevic) | 100% (19/19) | `#fff`, `#000`, `#eeede9` | Ogg Slant/Roman + Attila Sans Sharp |
| Black Dog | 100% (27/27) | `#000`, `#fff`, `#333` | Roboto Slab |
| LEQB | 91% (29/32) | `#000`, `#fff`, `#f7f7f7` + one accent `#ff3c21` | Biotif Light/Regular/Medium |

Takeaways that shaped the mono variant: pure black and white rather than warm off-whites; mid-greys for hierarchy; one or two families at most; and **"monochrome plus exactly one accent colour" is a real, award-winning pattern** (LEQB) — which is why the green survives as an option rather than being discarded.

## Rebuilding a variant

```bash
cd station-mono          # or station-log, station-tweaks
npm install
npm run build            # runs astro build + privacy-grep + check-links
npx http-server dist     # or: python3 -m http.server 8904 --directory dist
```

Note: `station-mono` needs `@fontsource/ibm-plex-sans` (included in its `package.json`). The Tweaks panel is test-harness scaffolding and must **not** ship to production.

## Open decisions

1. **Accent: green or strict monochrome?** The only question in the mono variant. Josh's plan says the green is load-bearing identity ("Ford Field Green as a brand color with a family pun embedded in it", doc 02) and LEQB sets the precedent for mono + one accent. Recommendation on the table: keep the green, used rarely.
2. **Hero scale.** Josh is unsure about "a flashy hero." Position taken: a hero is correct on this homepage, but the references show that *type at scale* does the work, not animation.
3. **Which direction wins** — v1 as built, Concept 2 (log), or monochrome-plus-log.
4. Not decided and still true: **the World Cup kit is live on kj5irq.radio**, two months after the 2026-07-19 final.

## Known defects in the site repo (found 2026-09-18, not yet fixed)

- `npm run sync` → `scripts/vault-sync.mjs` does not exist.
- `npm run check` → `astro check` requires `@astrojs/check` + `typescript`, which are not installed. The MVP checklist item "Astro build green with `astro check`" is not currently satisfiable.
- The WxBot repo's own README still titles itself `WxBot_76067`, publishing the ZIP, though the site no longer links to that name.
