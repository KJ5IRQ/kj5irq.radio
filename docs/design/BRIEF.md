# kj5irq.radio — v2 Design Brief

**Status:** governing brief for a from-scratch design pass. Nothing here is built yet.
**Written:** 2026-09-18. **Supersedes:** the aesthetic direction in `docs/website-redesign/` (the June 2026 plan).
**Read this first** before designing, building, reviewing, or delegating any work on this site.

---

## 1. What this site is

Josh's personal site. In his words: *"It's my personal site — why can't it be a portfolio and a blog, and a place to post projects and anything else I want?"*

That is the requirement. It is not a portfolio, not a blog, not a project showcase. It is **all of them, one site**, and the design must not force a choice between them.

**The front page is the front door.** Visitors are possible employers, friends, and strangers who followed a link to something specific. The front page's job is to orient them and route them, not to perform.

## 2. The structural spine: one entry type

Everything on the site is an **entry**:

```
kicker · title · standfirst · dateline · optional image
```

A project write-up is an entry. A blog post is an entry. A radio note is an entry. "I built this on Saturday" is an entry. Categories differ; the shape does not.

This single decision is what lets one site hold heterogeneous content without three layouts, three design languages, and three maintenance burdens. It is also what makes the editorial direction work: a magazine does not restyle itself per article type.

**Non-negotiable consequence:** no separate "blog section" with its own visual identity. One spine, typed by category.

## 3. Visual language

Derived from measurement of the references Josh named, not from prior plans.

| Element | Decision |
|---|---|
| Paper | Warm off-white / cream. **Not** pure white. |
| Ink | Soft near-black with two greys for hierarchy. **Not** pure `#000`. |
| Accent | Ford Field Green, in slivers only: kickers, rules, link hover, status. One accent, easy to abuse. |
| Body type | Serif, 18–19px, line-height 1.6–1.75. Reading-first. |
| Headings | Modest: h1 30–48px. **Not** 80px display type. |
| Labels | Mono or small-caps kickers, datelines, numbering. |
| Structure | Visible hairline grid; rules as the primary separator. |
| Images | First-class and expected. Full-bleed or 1px-ruled with a mono caption. |
| Motion | Effectively none. Underline and arrow transitions only, inside `prefers-reduced-motion`. |

### Editorial devices to borrow (especially on subpages)

- Masthead rather than hero on the front page: name, one line, then entries.
- Kicker + dateline above each entry, set small.
- Standfirst (one-line summary) under the title.
- Numbered sections on long pages (`01`, `02`).
- Figures with captions, rules above/below.
- A contents-page feel for indexes: date in the margin, title in the main column.
- Multiple-column text is permitted on wide screens for article bodies; never below ~900px.
- Category labels as quiet filters, not as navigation furniture.

### Entry cards

Every entry on an index renders as the same card: date and kicker in the margin column, then the picture at the left at **230px** with the headline, summary, note and meta beside it. No entry is special-cased.

A larger lead entry was tried twice and dropped both times. With a big picture and no other pictures it read as a lone object dropped into a list of text; with all five pictured it read as five equal blocks and the lead stopped leading. Josh's call was uniform cards with the picture always at the left.

230px is half the 460px measure, and it is also the widest a card picture can be while leaving the text column enough room to keep the meta row on one line.

### The station mark

The skull-and-tower mark is used **where it can actually be read**, and type carries the small sizes. This was measured, not assumed: at 32px the drawing's strokes antialias to pale grey, and bolding them at four tested weights collapses the tower and the teeth into a blob. The asset cannot read at 16–32px at all.

| Placement | What goes there | Why |
|---|---|---|
| Favicon (32px, 180px) | A capital `K` in Source Serif 4 on cream | Type stays sharp where the drawing does not |
| Footer | The mark at 40px beside the sign-off line | A signature, sitting with the line it signs |
| `/radio/` | The mark at 112px in a station plate | The page is about the station, so the mark is information, not ornament |
| Social preview | A rendered 1200x630 card: mark, name, tagline | The textless mark alone previewed as a nameless skull |

**Never** the badge variant with `KJ5IRQ` and *Mementō Morī* baked into the image. Baked-in text cannot be selected, read aloud, themed, or corrected. That file is a profile image for Google, QRZ and Discord, not a site asset.

Assets are generated from the ink bounding box of `public/logo.png`. That canvas is 67% empty width, so a naive resize draws a 21px skull inside a 32px box. `logo.png` remains the master and is referenced by no page. Icon set is 8 KB total.

### Measured evidence behind these choices

| Reference | What was measured |
|---|---|
| manuelmoreale.com | 75% achromatic; `#f9f9f9` / `#474747` / `#999`; Iowan Old Style; body 18.7px at 1.75; **h1 only 30px**; 0 images; 0 shadows |
| oscarryz.com | Serif (Manuale) 19px/1.6; h1 38px; 14px nav; 4 links total; single column |
| G!TheImagineers | `#000`/`#fff`; visible 1px grid dividing columns; sections numbered `01`–`05`; rotated margin labels; 0 shadows, 0 radii, 0 gradients |
| Canva blog templates | Cream paper, large serif caps, tiny italic kickers and datelines, two/three-column text, photo grids, numbered entries, hairline rules |
| LEQB | Monochrome **plus exactly one accent colour** — the precedent for keeping the green |

## 4. What "from scratch" means here

**Scrapped:** every aesthetic assumption from June — the Station Log concept, the paper/serif/log metaphor, the hero copy decisions, the `--size-display` scale, the 900px log grid as specified.

**Kept, because it is machine rather than design:** the Astro build, the content collections with the Zod schema, the `privacy-grep` and `check-links` gates, the GitHub Pages deploy workflow, the `trailingSlash` setting.

Rebuilding those would cost days and produce nothing visible. They are already correct.

**Kept as governance, not aesthetics** — these are Josh's own rules and are not open to design preference:

- No analytics, no cookies, no third-party scripts. The theme toggle is the entire JavaScript budget.
- `privacy-grep` must stay clean and its `allow` list must stay empty.
- Nothing publishes the ZIP, the employer or parent-company names, private codenames, internal hostnames, IPs, or local filesystem paths.
- Screenshots are redacted **before** entering git.
- No secrets in any layer, ever.

## 5. Anti-goals

Explicitly rejected. If a design includes these, the design is wrong:

- A big animated splash / hero animation.
- 80px display-typography-as-personality (that was the Awwwards move, not Josh's taste).
- Pure black on pure white.
- Cards, shadows, gradients, glass, rounded rectangles as hierarchy.
- Live data, dashboards, uptime widgets on any page.
- Fake terminals, skill bars, testimonial carousels, icon zoos.
- A separate visual identity for writing versus projects.
- Em dashes in site copy.

## 6. Content reality (do not ignore this)

The failure mode of an editorial design is **empty shelves**: a beautiful magazine with nothing in it. Mitigations:

- **The projects are the writing.** The AllStar toolchain, hermes-kb, WxBot and the homelab are already essays; they need datelines, standfirsts and figures rather than card metadata.
- **Images already exist for the flagship.** `asl-node-panel` has `assets/panel-screenshot.png`, `assets/overview-screenshot.png`, and `assets/panel-demo.gif` committed publicly. Nothing to capture, nothing to redact. hermes-kb, WxBot and asl3-api have no imagery and need a capture pass later.
- Writing slots into the same entry spine when it exists. Nothing needs rebuilding to accommodate it.

## 7. Decisions still open

1. ~~**Does the green stay** as the single accent, or go strict monochrome?~~ **Resolved 2026-09-18: the green stays.** Josh confirmed it. The references are otherwise achromatic; LEQB is the precedent for exactly one accent.
2. **Capture pass** for the projects without imagery.
3. **D2 from the June plan is still unresolved:** whether writing publishes under his real name. The design does not depend on the answer, which is exactly why the entry spine is the right call.

## 8. How to work with Josh on this

- **Show, don't describe.** He cannot answer abstract design questions, and concept documents do not land. Build switchable real pages and let him click.
- **One question at a time, with clickable answers.** Empty replies may be network artifacts, not disinterest.
- **Measure references instead of admiring them.** He responds to evidence and poorly to adjectives.
- **Do not manufacture forks.** "Portfolio versus blog" was a false binary that wasted a round trip. Ask what he wants; do not present a choice that the design can dissolve.
- **The preview pane is about 800px wide.** Anything behind a `min-width: 900px` query will not render there — either lower the demo breakpoint or tell him to open the URL full-width.
- Nothing ships to `main` without his explicit yes.
