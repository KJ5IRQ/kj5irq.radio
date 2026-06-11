# 16. Final Recommendation

## Self-critique applied (what changed between draft and final)

The plan was reviewed from five seats before finalizing. Material revisions that resulted:

1. **Skeptical UX lead:** The original "systems atlas" concept was downgraded from organizing metaphor to a single future figure. An atlas invites diagram theater and a homepage that explains instead of shows. "The Station" replaced it because it maps to real nouns (operator, bench, log, frequency) and demands no illustration to work. The homepage schematic (Concept 3) was moved post-launch and scoped to the one page where a figure teaches.
2. **Privacy reviewer:** Early drafts had a "Hermes/H.A.G." page in the expanded sitemap; it was cut to a one-sentence ceiling (doc 07 format 5). The WxBot ZIP, the grid square, employer naming, and political writing were promoted from footnotes to logged decisions D1 to D4 plus D2. The vault sync gained the unresolved-wikilink lint and EXIF strip after walking failure modes. The styleguide page gained robots exclusion.
3. **Technical maintainer:** Dropped an early idea of Cloudflare Pages migration (risk without need), dropped Tailwind (more machinery than the site), dropped analytics at launch entirely, and made the component list an allowlist. The schema's `publish: z.literal(true)` design means unpublished content simply never enters the repo, which is simpler and safer than filtered rendering.
4. **Blunt editor:** Several headline options that sounded clever and meant nothing were deleted before they reached doc 04 (survivors all pass the "say it to a person" test). The featured-card "why care" lines were rewritten until each was falsifiable. Banned-word grep moved into CI so the standard outlives this engagement.
5. **Future Joshua:** Every recurring obligation was either removed (live data, Now page by default, analytics review) or converted into content he already touches (status tags, updated dates). The single biggest maintenance decision in the plan is what it *doesn't* build.

Remaining honest weaknesses: the serif-forward design is a taste bet that needs the Phase 3 checkpoint (D6); Phase 5 content verification depends on Joshua's time and cannot be automated away; and the writing strategy is deliberately unresolved pending D2, which means the site launches without the part of him that writes. That is the correct order, but it should be said plainly.

## Executive decision memo

**1. Recommended site concept:** The Station. A personal site organized like the thing Joshua actually has: an operator (About), a bench of running projects (Projects), a station identity (Radio/KJ5IRQ), and a log discipline (statuses and dates as first-class design). Metaphor in structure and vocabulary only; zero radio cosplay.

**2. Recommended positioning:** "Joshua Ford is a systems operator in Texas who builds the missing interfaces between business platforms, radios, and AI agents, and runs all of it himself." Hero: "Systems that integrate, not just coexist." (alternative on the table: "I run systems. Some of them talk back.", decision D5).

**3. Recommended visual direction:** "Station Log" (doc 05 Concept 2): light-first warm paper with a hand-tuned dark theme, Ford Field Green as the only accent, Source Serif 4 + IBM Plex Mono, ruled log-style indexes with real build-generated metadata, hairline rules instead of cards, motion budget near zero. Deliberately the opposite of the default-dark gradient AI portfolio.

**4. Recommended stack:** Astro (static, zero client JS except a 1KB theme script), content collections with Zod schemas as a build-time privacy gate, plain CSS tokens, GitHub Actions deploying to the existing GitHub Pages + Cloudflare DNS setup. No CMS, no analytics, no third-party scripts of any kind.

**5. Recommended MVP sitemap:** Home · About · Projects index · AllStar toolchain case study · hermes-kb · WxBot · Homelab (privacy-permitting) · Radio · Colophon (cuttable) · 404. Writing, notes, RSS, search, Now, Uses: all deferred with explicit ship conditions (doc 12).

**6. First 10 implementation tasks:**
1. Joshua rules on D1 to D6 (doc 15).
2. Scaffold Astro on a redesign branch; port CNAME, robots, favicon; CI building.
3. Implement `tokens.css` + `global.css` + BaseLayout (both themes, no-FOUC toggle).
4. Build `/dev/styleguide` with one fake log entry and prose page; **Joshua taste checkpoint (D6)**.
5. Content collections + Zod schemas; prove the gate with a failing fixture.
6. Homepage with final hero copy and hard-coded featured entries (first safe milestone).
7. Project frontmatter files + index page rendering from collections.
8. AllStar toolchain case study (draft from repos, Joshua verifies every claim) + architecture figure + redacted screenshot.
9. hermes-kb, radio, about pages; remaining cards; SEO layer + OG generation.
10. Full doc 14 acceptance run, privacy grep of dist, Lighthouse, then cutover merge and tag v1.0.0.

**7. Major privacy warnings:** Remove the `keepandroidopen.org` third-party script (executes uncontrolled code on every visit today). De-emphasize or drop the employer name (D1). Never publish the vault or sync it automatically; the doc 09 pipeline keeps a human diff gate forever. WxBot's repo name leaks a ZIP code (D4). Screenshots must be redacted *before* entering git history. Decide the political-writing question (D2) deliberately, not by drift.

**8. What should not be built yet:** writing index, vault sync script, RSS, search, Now/Uses, any Hermes/H.A.G. page, the homepage schematic, anything live-data. Each has a written ship condition in doc 12.

**9. What Joshua must provide before build:** D1 to D6 decisions; verification of WxBot's actual behavior; the three screenshots (panel, hermes-kb query, WxBot alert, redacted); About-page facts check (the warehouse-to-ERP arc as drafted); node number(s) and license class for the radio page; QRZ bio link-back when live.

**10. Confidence level:** High on strategy, stack, IA, and privacy plan (grounded in verified sources). Medium-high on the visual direction pending the D6 taste checkpoint. Medium on timeline, because Phase 5 verification is Joshua-gated.

**11. Unresolved assumptions:** A1 (Hermes = Nous Research Hermes Agent tooling; H.A.G. private), A2 (no public writing exists), A4 (green is intentional family-pun branding), WxBot delivery mechanism, license class (not publicly confirmed), and whether the QRZ bio contains material worth mirroring.

**12. Exact build command for later:**

> Read docs/website-redesign/ in the kj5irq.radio repo, starting with 16_final_recommendation.md and 13_build_ready_blueprint.md. I have made the D1 to D6 decisions as follows: [D1 employer: ___] [D2 writing: ___] [D3 location: Texas only] [D4 wxbot repo: ___] [D5 hero: ___] [D6: proceed to styleguide checkpoint]. Execute the implementation plan starting at roadmap Phase 3/4: scaffold Astro on a redesign branch, build the design tokens and styleguide page first, and stop for my review at the styleguide checkpoint before building pages. Do not publish anything from my vault. Do not add analytics or third-party scripts. Follow the doc 14 acceptance tests before any cutover to main.
