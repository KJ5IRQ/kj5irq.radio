# 15. Hard Calls and Risks

Blunt section. These are the calls that determine whether the redesign is good or merely new.

## Decisions Joshua must make (logged as D1 to D6)

**D1. Employer mention.** Recommendation: drop "Nextlink Internet" and "AMG Technologies" from the site entirely; say "I run NetSuite for a Texas ISP" on About, nowhere else. The title-and-employer block is LinkedIn's job. Naming your employer on a personal site with political satire ambitions is borrowing trouble at zero interest. If he insists on naming it: once, About page, plain text, no logo.

**D2. Political writing under the callsign.** The plan defers writing, but decide the principle now: serious political analysis and satire published on kj5irq.radio is permanently welded to his real name, employer discoverability, and FCC record. Options: (a) publish it here and own it, (b) separate pen-name venue, (c) keep it private. This is a life decision, not a UX one. The site plan supports (a) structurally but recommends Joshua sleep on it twice.

**D3. Grid square / location precision.** Recommendation: "Texas" only. Hams will find the FCC record if they care; the site shouldn't do the work for everyone else.

**D4. WxBot repo name.** `WxBot_76067` publishes his ZIP on GitHub today. The site won't repeat it, but the card links to the repo. Recommendation: rename the repo to `wxbot` (GitHub redirects old links automatically). Low cost, closes a small hole.

**D5. Hero personality dial.** "Systems that integrate, not just coexist" (safe, proven) vs "I run systems. Some of them talk back." (memorable, riskier). Recommendation: the second one is better and he knows it; but it's his face on the page.

**D6. Serif-forward design.** The doc 05 direction is light, paper, serif: deliberately opposite to his current dark monospace instincts. He must see the Phase 3 styleguide before committing. If he hates it, the dark theme becomes default and the system survives intact; that's why tokens come first.

## What Joshua may want that should wait

- The writing section (no content yet; shelves before books).
- The vault pipeline (post-launch, and only with all gates).
- Anything dashboard-like. He built kj5irq-hub once and it's gone; that experiment already voted.
- A Hermes/H.A.G. page. The interesting version leaks; the safe version is vapor. One sentence inside hermes-kb is the ceiling until the project itself is deliberately published.
- Live node status on the radio page. Cute for a week, then it's either an uptime commitment or a broken widget. Static facts with honest dates.

## What could confuse visitors

- The callsign-as-brand. Mitigated by leading with "Joshua Ford" in the h1 area and title tag, callsign second. The domain stays; the name carries.
- Director title + tinkerer projects can read as two different people. The operator framing and the "From operations to ownership" arc are the bridge; never present the job and the projects in separate visual languages.

## Prominence ranking (projects)

1. AllStar toolchain (flagship; the only one that's genuinely rare)
2. hermes-kb (clean story, current topic, modest and real)
3. WxBot (small, human, finished)
4. Homelab (context page, not a star)
5. openclaw-skill-asl3 (archive; quietly demonstrates judgment)
Stay private: H.A.G., anything employer, the vault.

## What could make the site embarrassing

- Unverified claims in Claude-drafted copy (mitigated: C2 test; nothing ships unverified).
- "Systems Architect"-style self-titling. Show, never claim.
- A stale "active" tag on a dead project a year from now. Mitigation: statuses are content; the quarterly maintenance pass includes a status sweep. An honest `archived` is never embarrassing; a false `active` is.
- The satire question (D2) handled by accident instead of decision.

## What could make it hard to maintain

- Any live data dependency (banned at MVP).
- Component sprawl (the doc 13 allowlist).
- The schematic, if it becomes load-bearing before it exists (it's an enhancement, not a dependency).
- An automated vault pipeline trusted too early (the human merge gate is permanent).

## What could make it look AI-generated

The current site's typewriter+cursor+chips trio is the cautionary tale, and it came from AI-assisted iterations ("REFACTOR V2" comments). Standing rules: no effect without a communicated meaning; light/paper/green/serif palette; copy with falsifiable specifics; and the C5 read-aloud test. The subtler risk is *plausible blandness*: AI-smooth copy that says nothing wrong and nothing specific. The why-care lines on cards are the antidote; if one could appear on anyone's site, rewrite it.

## Cutting-edge ideas: worth it vs decoration

**Worth it:** the log-index treatment (structure that scales); build-generated OG images; honest status taxonomy as a design element; print stylesheet; the hand-finished schematic, later, on the case study where a figure genuinely teaches.

**Decoration (rejected):** view-transitions page morphs, scroll-driven anything, WebGL, theme-aware ASCII art, live APRS/node widgets, AI chat over his notes (a privacy incident with a UI), 3D logo, custom cursors forever and always.

## Top risks summarized

| Risk | Severity | Mitigation |
|---|---|---|
| Phase 5 stalls (content is Joshua-shaped work) | High | Draft copy already exists in docs 04/07; his job is editing, not blank pages |
| Privacy slip in screenshots/history | High | P6 to P9 tests; redact before commit; rewrite branch history if needed pre-merge |
| Design lands wrong for him (D6) | Medium | Tokens-first; styleguide checkpoint; dark-default fallback |
| Astro churn | Low | Pinned versions; annual upgrade evening; site is mostly content |
| Scope creep toward atlas/dashboard | Medium | This document; the MVP exclusion list; the kj5irq-hub precedent |
