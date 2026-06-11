# 05. Visual and Experience Direction

## Design thesis

**What the site should feel like:** a well-kept field manual that belongs to a specific operator. Printed-document confidence (rules, margins, real typographic hierarchy), with the quiet competence of someone who labels his cables. Calm surfaces, one decisive green, monospace reserved for actual data. The interface should feel *operated*, like the rest of his systems: dated, statused, maintained.

**What it must not feel like:** a SaaS landing page, an AI lab, a cyberpunk dashboard, a Dribbble dark-mode shot, a resume template, or a theme anyone could download.

**Visual metaphor:** documentation, not decoration. The aesthetic ancestors are good technical manuals, amateur radio logbooks, and editorial indexes, not sci-fi UIs. The metaphor shows up as structure (rules, captions, meta rows, status tags) rather than imagery.

**What makes it distinct from a normal portfolio:** content is presented as maintained records of running systems (status, last-updated, limitations stated plainly) instead of trophies.

**What makes it distinct from an AI-generated portfolio:** light-first instead of default-dark; green instead of blue/purple gradients; ruled lists instead of glassy card grids; zero scroll choreography; copy with falsifiable specifics; visible human choices (the green has a family story, the footer says 73).

**What a visitor remembers the next day:** "the guy whose AI agent can key up his radio node" plus the green-on-paper look and the honest status labels.

## Three concepts

### Concept 1: "Field Manual" (safe but excellent)

- **Core idea:** The site as a maintained technical document about one operator.
- **Mood:** Calm, exact, warm paper.
- **Visual language:** Hairline rules, generous margins, section numbering (01, 02), captions under everything, status tags as small bordered labels.
- **Layout style:** Single readable column (~68ch) with a wider grid for index pages; no sidebars.
- **Typography:** A characterful text serif for body and display (e.g. Source Serif 4 or Newsreader), one mono for meta/data (IBM Plex Mono or JetBrains Mono). Two families total, self-hosted.
- **Color:** Warm paper light theme (#faf9f6 range), ink text (#1a1a18), Ford Field Green `#4F6A3A` as the only accent. True dark theme derived, not inverted: deep warm gray, lightened green `#789c5e` for links.
- **Motion:** Essentially none. Underline transitions and that's it.
- **Interactions:** Hover = underline + arrow; focus rings always; details/summary for long sections.
- **Homepage:** As specified in doc 04.
- **Project pages:** Document-style: numbered sections, a single architecture figure, meta table at top (status, repos, updated).
- **Writing pages (later):** Pure editorial column, drop folio, dateline.
- **Radio page:** Same document language; the callsign set huge in the serif as the page's one display moment.
- **Hermes/agent mention:** One paragraph inside hermes-kb page; no dedicated page.
- **Strengths:** Shippable, durable, ages well, easy to maintain, hard to mistake for a template because the *content structure* carries it.
- **Risks:** Could read as plain if typography is timid. Prevention: a genuinely large display scale (h1 at 3.5 to 4.5rem), real small caps/figures, disciplined rules.
- **AI-generated tells to avoid:** None inherent; the danger is blandness, not trendiness.
- **Complexity:** Low. **MVP fit:** Yes. **Future potential:** High (writing slots in perfectly).

### Concept 2: "Station Log" (ambitious and modern)

- **Core idea:** Field Manual's body with an editorial index layer: the homepage and section indexes behave like a typeset log/ledger. Dense, beautiful list typography; every entry carries a mono data row (date, status, band/lang, link). Think a cross between a fine print journal's table of contents and a station logbook.
- **Mood:** Editorial, precise, slightly obsessive.
- **Visual language:** Oversized index numerals, baseline-aligned multi-column meta, hanging dates in the margin on wide screens, the green used as a thin "active" tick on running projects.
- **Layout:** Asymmetric grid on index pages (margin column for dates/labels, main column for entries); document column on detail pages (inherits Concept 1).
- **Typography:** Same two families, pushed harder: tabular figures everywhere in meta, true display sizes, tight leading on the index.
- **Color/motion:** As Concept 1. Motion adds only one thing: entries' arrows nudge 2px on hover.
- **Homepage treatment:** Hero is smaller; the featured-work log *is* the page's centerpiece.
- **Project/writing/radio treatments:** Detail pages identical to Concept 1; the log treatment applies to every index. Radio page gains a small static "station facts" table (callsign, class, node, grid) set like a log header.
- **Strengths:** Memorable structure; the "log" framing makes maintenance a feature (updating dates is content); scales beautifully when writing arrives.
- **Risks:** Margin-column layouts take real CSS care on mid-size screens; dense type can hurt mobile. Prevention: the margin column collapses inline below 900px; minimum 16px meta type.
- **AI tells to avoid:** Don't let the log become a fake terminal. No green-on-black, no blinking cursors, no `>` prompts.
- **Complexity:** Medium. **MVP fit:** Yes (it is Concept 1 plus index treatment). **Future potential:** Highest.

### Concept 3: "Block Diagram" (strange but controlled)

- **Core idea:** The homepage is a single hand-finished SVG schematic of Joshua's world: ERP, node, homelab, agents as labeled blocks with drawn connectors; each block is a link. Inside pages are Concept 1 documents, each opening with its own small schematic fragment.
- **Mood:** Workshop wall, annotated whiteboard, slightly strange in the right way.
- **Visual language:** 1.5px ink lines, slightly imperfect connector routing (deliberate, drawn, not generated), handwritten-style annotations sparsely (a real annotation face like Caveat is risky; better: small italic serif captions).
- **Layout/typography/color:** As Concept 1 underneath.
- **Motion:** Connectors draw in once on first load, fully disabled under reduced motion; nothing loops.
- **Homepage:** The diagram plus a one-line hero above it and contact below. Radical: almost no prose on the homepage.
- **Project pages:** Each begins with its fragment of the master diagram, highlighted.
- **Radio page:** The node's subgraph becomes the page header.
- **Strengths:** Genuinely memorable; literally an atlas; deeply on-brand for a systems person.
- **Risks:** High. A bad schematic looks like clip art; mobile needs a vertical redraw of the diagram; every new project means redrawing; screen-reader experience needs a full parallel text structure; it flirts with "diagram theater" the strategy doc warned about.
- **What would make it look AI-generated:** auto-generated graph layouts, glowing nodes, dotted animated lines. Prevention: a human (Joshua) sketches the layout; the SVG is hand-tuned; no glow, ever.
- **Complexity:** High. **MVP fit:** Partial (could ship pages without the master diagram). **Future potential:** High but maintenance-coupled.

## Recommended direction

**Ship Concept 2, "Station Log": Concept 1's document system plus the log-style indexes.** Hold Concept 3's diagram as a single post-launch enhancement: one hand-finished schematic added to the AllStar toolchain case study first (where a diagram is genuinely needed), promoted to the homepage only if it earns it.

This gets a distinctive, current-feeling site (editorial indexes with real data are having a deserved moment and predate the trend by decades) without betting the launch on illustration work.

## The system

### Design principles
1. Documentation, not decoration.
2. Real data or no data. Every mono string on the site must be true and build-generated (dates, statuses, languages). Nothing cosmetic.
3. One accent. If green stops being special, the system is broken.
4. Light first, dark equal. Both themes hand-tuned, system-respecting, with a no-FOUC toggle.
5. Honest states. "Experimental", "archived", "stable" are design elements.
6. Nothing moves unless it communicates.

### Layout and grid
- Page max-width 1100px. Reading column 68ch.
- Index grid: `grid-template-columns: 160px 1fr` ≥900px (margin column for dates/labels); single column below.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px.
- Hairline rules (`1px`, stroke color) are the primary separator. No drop shadows anywhere. No rounded cards; 2px radius max on tags and buttons.

### Typography
- **Display/body serif:** Source Serif 4 (variable, self-hosted via Fontsource). Fallback: Georgia, serif.
- **Mono:** IBM Plex Mono, weights 400/500. Fallback: ui-monospace stack.
- No sans. Two families is the budget. (If Joshua dislikes serif body at 17px, fallback plan: body in system-ui sans, serif retained for display. Decide in design review with real pages.)
- Scale: meta 0.8125rem mono · body 1.0625rem/1.7 · h3 1.375rem · h2 1.75rem · h1 clamp(2.5rem, 6vw, 4.25rem).
- Tabular figures and slashed zero in all meta. Small caps for section labels if the font supports them honestly.

### Color
Light: bg `#FAF9F6` · surface `#F2F1EC` · ink `#1C1B18` · muted `#5C5A53` · rule `#DDDBD2` · accent `#4F6A3A` · accent-ink (links) `#3D5230`.
Dark: bg `#141413` · surface `#1C1C1A` · ink `#E9E7E0` · muted `#A3A199` · rule `#2C2B28` · accent `#789C5E` · accent on dark always ≥4.5:1 for text uses.
Status tints: active = green; experimental = amber `#8A6D1F`/`#C9A23A`; archived = muted gray. Tags are outline + text, never filled chips.

### Texture and material
Paper warmth comes from the off-white/off-black palette alone. No noise overlays, no gradients, no glass. The single permitted texture: the existing KJ5IRQ logo mark, used small (footer, radio page) and monochrome.

### Icons and illustration
Almost none. Arrows (→) and external-link marks set as text/inline SVG. No icon set. Illustration budget = the future schematic, hand-finished.

### Images and screenshots
Screenshots get a 1px rule border and a mono caption, full stop. Headshot: small, square-ish, 1px rule, used on About and the homepage operator note. Build pipeline emits AVIF/WebP with width sets; no image ships over 200KB.

### Component treatments
- **Project entry (index):** rule above; title (serif, link) · one-line summary · mono meta row `STATUS · LANG · UPDATED YYYY-MM-DD · REPO ↗`.
- **Case study:** meta header table, numbered h2 sections, figure with caption, "Limitations" and "Next" as first-class sections.
- **Writing entry (later):** date in margin column, title, dek. No reading-time gimmick.
- **Radio identity:** callsign as display type; station facts table; everything else document-standard.

### Motion rules
Allowed: color/underline transitions ≤200ms; arrow nudges ≤2px; the future diagram's one-time draw-in. Forbidden: parallax, scroll-triggered reveals, marquees, typewriters, cursor effects, looping anything. All motion inside `@media (prefers-reduced-motion: no-preference)`.

### Interaction rules
Every interactive element: visible focus ring (2px accent offset ring), hover state, active state. Links underlined in body copy always (not hover-only). External links marked. Touch targets ≥44px in nav and footer.

### Accessibility rules
WCAG 2.2 AA contrast minimum across both themes; one h1 per page; landmarks (header/nav/main/footer); skip link retained; theme toggle is a button with `aria-pressed`; diagrams get full text alternatives.

### Performance rules
Zero JS by default (the theme toggle is the only script, inline, <1KB). Two font files subsetted. CSS budget ≤30KB. Lighthouse 95+ across the board on a throttled phone profile.

### Anti-patterns (hard bans)
Neon gradients, glassmorphism, particles, bento grids without content logic, fake terminals, skill bars, logo walls, testimonial carousels, AI-generated hero art, dark-by-default with glow, animated counters, em dashes in copy.

## Tests against the brief

- **Human test:** No buzzwords exist to remove; the design is type, rules, and real data. Pass.
- **Specificity test:** Callsign domain, green with a family story, log entries naming an MCP-controlled radio node. Could not be anyone else's. Pass.
- **Clarity test:** Name + spine sentence above the fold, three real projects on screen one scroll later. Pass.
- **Memory test:** The log indexes and the radio/agent flagship. Pass, with Concept 3's diagram as the future memory-multiplier.
- **Maintenance test:** Updating the site = editing Markdown and dates. The design rewards maintenance instead of punishing it. Pass.
- **Privacy test:** No live data, no dashboards, no vault surface. Status fields are hand-set. Pass.
- **Performance test:** Static HTML, two fonts, one optional inline script. Pass.
- **Accessibility test:** Motion optional, contrast specified, structure semantic. Pass.
- **Anti-AI test:** Light paper + green + serif + ruled lists is the opposite of the default-dark gradient template. The remaining risk is *blandness*, addressed by display-scale type and the log structure. Pass with vigilance.
- **Joshua test:** Six months in, the site asks him only to bump dates and statuses he already tracks. The dry voice and the green are his. Likely pass; validate with him at design review using one fully built page, not mockups.
