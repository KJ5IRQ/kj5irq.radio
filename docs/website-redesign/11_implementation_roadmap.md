# 11. Implementation Roadmap

The build runs on a feature branch; the current site stays live untouched until Phase 7 cutover. Phases 0 to 2 are substantially complete in these documents; their remaining tasks are Joshua's review actions.

## Phase 0: Discovery and inventory — DONE (this engagement)
- **Objective:** Know what exists.
- **Deliverables:** Docs 00 to 01.
- **Acceptance:** Sources tabled, audit findings evidenced. ✓
- **Remaining task:** Joshua reads docs 00 to 02 and rules on the doc 15 decisions (employer mention, WxBot repo name, grid square, headline choice).
- **Complexity:** Low.

## Phase 1: Strategy and content model — DONE pending approval
- **Objective:** One organizing idea; typed content schema.
- **Deliverables:** Docs 02, 06, 07.
- **Acceptance:** Joshua signs off on "The Station" direction and the positioning sentence, or amends them.
- **Risks:** Skipping this sign-off and discovering disagreement at Phase 6. Don't.
- **Complexity:** Low.

## Phase 2: IA and wireframes — DONE pending approval
- **Deliverables:** Docs 03, 04.
- **Acceptance:** MVP sitemap approved; hero copy pair chosen (recommended vs dry-edge alternative).
- **Complexity:** Low.

## Phase 3: Visual design system
- **Objective:** The doc 05 system made real as code tokens, not mockups. Design in the browser; this site is small enough that Figma would be ceremony.
- **Tasks:** CSS custom properties (color, type, spacing, both themes); font subsetting and self-hosting; base layout + header/footer; one fully styled fake project entry and one prose page as the living style guide (`/dev/styleguide`, excluded from sitemap and robots).
- **Deliverables:** `src/styles/tokens.css`, `global.css`, `BaseLayout.astro`, styleguide page.
- **Acceptance:** Joshua views the styleguide on his phone and laptop, both themes, and says "yes, this" (the doc 05 Joshua test). Contrast checks pass.
- **Risks:** Serif body text not landing with him → fallback plan in doc 05 typography (system sans body, serif display). Decide here, cheaply.
- **Dependencies:** Phase 2 approval. **Complexity:** Medium.
- **Cut line:** Drop the styleguide page polish, not the tokens.

## Phase 4: Technical foundation
- **Tasks:** Astro scaffold on branch `redesign/foundation`; content collections + Zod schemas (doc 06); CI workflow (check, build, link check, deploy); CNAME/robots/favicon/404; OG image generation; sitemap integration.
- **Deliverables:** Green CI building a deployable skeleton.
- **Acceptance:** `npm run build` clean; deploy to Pages verified on a temporary basis or locally verified with production config; schemas reject an invalid fixture file (test the gate by trying to break it).
- **Risks:** Pages + Actions wiring quirks with the apex domain; mitigate by keeping the CNAME file in `public/` and testing before cutover.
- **Dependencies:** None (parallel with Phase 3 after scaffold). **Complexity:** Medium.

## Phase 5: Content migration and creation
- **Objective:** Every MVP page has real, approved words. The bottleneck phase, and it's Joshua-shaped.
- **Tasks:** Adapt doc 04/07 draft copy (hero, operator note, project cards); Joshua drafts/edits About and the radio page facts; write the AllStar case study (drafted from repos, Joshua verifies every technical claim); produce the 3 to 4 screenshots/figure per doc 07 asset table, redacted; verify WxBot card claims against reality.
- **Deliverables:** All `src/content/` files with `privacyReviewed: true` honestly set.
- **Acceptance:** Doc 14 content + privacy checklists pass on every file.
- **Risks:** Drafted-by-Claude copy shipping unverified (forbidden: every factual claim gets Joshua's eyes); scope creep into writing-section content (resist; it's post-MVP).
- **Dependencies:** Phase 1 approvals. **Complexity:** Medium (effort), High (judgment).
- **Cut line:** WxBot and homelab become index-card-only (no detail pages).

## Phase 6: MVP build
- **Tasks:** Build pages in order: home → projects index → AllStar case study → hermes-kb → radio → about → wxbot/homelab → colophon → 404. Wire SEO component and JSON-LD. Image pipeline through real assets.
- **Deliverables:** Complete site on the branch.
- **Acceptance:** Doc 14 design + technical tests pass; both themes eyeballed per page.
- **Risks:** Component sprawl (the doc 13 component list is the allowlist; new components need a reason).
- **Dependencies:** Phases 3, 4, 5. **Complexity:** Medium.
- **Cut line:** colophon, archive strip.

## Phase 7: QA, privacy review, launch
- **Tasks:** Full doc 14 acceptance run; grep `dist/` with the red-flag list; Lighthouse on throttled mobile; screen reader pass; cross-browser pass; then merge to `main`, tag `v1.0.0`, verify live at kj5irq.radio over Cloudflare, submit sitemap to Search Console.
- **Acceptance:** Every doc 14 test green or consciously waived in writing.
- **Risks:** DNS/HTTPS hiccup at cutover (mitigation: cutover is a merge, rollback is a revert; Pages rebuilds in minutes).
- **Complexity:** Low to Medium.

## Phase 8: Post-launch publishing workflow
- **Tasks:** Implement `vault-sync.mjs` + lint (doc 09); dry-run against a test note designed to trip every gate; document the workflow in the repo README; Joshua updates QRZ bio with the URL; decide the first real published note.
- **Acceptance:** The boobytrapped test note is correctly rejected for every gate, then a clean note flows end to end.
- **Risks:** Building this before launch (don't; it's post-MVP by design so launch never waits on it).
- **Complexity:** Medium.
- **Then:** writing index + RSS when 3 real pieces exist; Pagefind at ~30 documents; the hand-finished schematic for the AllStar case study; Now/Uses if desired.

## Sequence summary

Joshua approvals (0-2, an evening) → foundation + design system in parallel (3-4, one to two sessions) → content (5, the long pole, mostly Joshua) → build (6, one to two sessions) → QA + launch (7, one session) → pipeline (8, whenever).
