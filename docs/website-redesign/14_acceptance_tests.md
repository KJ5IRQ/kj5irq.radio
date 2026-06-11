# 14. Acceptance Tests

Run at Phase 7. Every test gets pass / fail / waived-in-writing. A waive requires a reason and Joshua's initials in the PR description.

## Strategy

- [ ] **S1.** A first-time visitor (recruit one real human who doesn't know Joshua) can say who he is and what he does after 10 seconds on the homepage, unprompted.
- [ ] **S2.** The homepage expresses exactly one organizing idea (the operator/station spine); no section contradicts it.
- [ ] **S3.** Projects, radio, and professional identity read as one person's connected work, not three hobbies in a trench coat. Test: the same tester is asked "how do these relate?"; they should be able to answer.
- [ ] **S4.** Every page answers "where should I go next" with at most two choices.

## Content

- [ ] **C1.** Every project card states what it is and why it matters within its two lines.
- [ ] **C2.** Every factual/technical claim on every page has been verified by Joshua personally (checklist signed in PR).
- [ ] **C3.** Case studies contain a Limitations section with at least one real limitation.
- [ ] **C4.** Zero instances of the banned vocabulary (doc 02 anti-tone list) and zero em dashes: enforced by grep over `src/content` and page sources, in CI.
- [ ] **C5.** Read-aloud test: Joshua reads the hero, About, and one card out loud. Anything he wouldn't say to a person gets rewritten.
- [ ] **C6.** Every `updated` date is real.

## Privacy

- [ ] **P1.** `dist/` grep with the doc 09 red-flag pattern list (IPs, RFC1918 ranges, hostnames list, employer/vendor list, family names list, phone numbers, key-shaped strings, vault path, "Pensieve", "H.A.G."): zero unwaived hits.
- [ ] **P2.** No vault content present (the sync script does not exist at launch; verify nothing was hand-copied either).
- [ ] **P3.** Employer references comply with decision D1, parent company appears nowhere.
- [ ] **P4.** No family details; headshot is the only personal image.
- [ ] **P5.** Location precision: "Texas" only; no ZIP, city, street, or grid square (unless D3 opted in).
- [ ] **P6.** All published images EXIF-stripped (verify with exiftool over `dist/`).
- [ ] **P7.** Screenshots inspected at full zoom for residual hostnames/IDs/names before commit.
- [ ] **P8.** Zero third-party requests in the network panel on every page (fonts self-hosted, no analytics, banner.js gone).
- [ ] **P9.** git history of the redesign branch contains no asset that later needed redaction (if it does, rewrite before merge; after merge it's permanent).

## Design

- [ ] **D1.** Every page usable and readable at 360px; no horizontal scroll.
- [ ] **D2.** Dark theme hand-checked per page; no inverted-image artifacts; logo renders correctly both themes.
- [ ] **D3.** Contrast: axe/Pa11y zero violations; spot-check the green link on dark and status tags.
- [ ] **D4.** Navigation: tester finds the AllStar case study from the homepage in ≤2 clicks without help.
- [ ] **D5.** Anti-AI check: no gradients, glass, particles, terminals, typewriters, cursors, scroll effects, bento grids. (Yes, literally walk this list.)
- [ ] **D6.** The memory test: tester, next day, can name one thing about the site. Record what it was.
- [ ] **D7.** Print stylesheet sanity: a case study prints legibly (cheap with this design; nice signal of document seriousness).

## Technical

- [ ] **T1.** `npm run build` green from clean clone with pinned Node.
- [ ] **T2.** Schema gate proven: the bad-fixture file (missing `privacyReviewed`) fails the build.
- [ ] **T3.** Internal links 100% green; external warn-only reviewed.
- [ ] **T4.** sitemap.xml valid, includes all public pages, excludes /dev/ and 404.
- [ ] **T5.** Every page: unique title, meta description, canonical, OG card renders correctly in a validator.
- [ ] **T6.** JSON-LD validates (Schema.org validator) on home, a project, radio.
- [ ] **T7.** No image in `dist/` over 200KB; all have width/height; below-fold lazy.
- [ ] **T8.** Lighthouse mobile throttled: ≥95 / 100 / 100 / 100 on home, projects index, case study.
- [ ] **T9.** JS payload ≤1KB; site fully functional with JS disabled (theme falls back to system preference).
- [ ] **T10.** No layout shift on font load (CLS ≈ 0).
- [ ] **T11.** Reduced-motion mode: zero animation, smooth-scroll off.
- [ ] **T12.** Screen reader pass (VoiceOver + NVDA) on home, index, case study: landmarks, heading outline, meta rows announced sensibly.
- [ ] **T13.** Live cutover verified: https apex green-lock, www redirects, old fragment URLs (`/#about`) land harmlessly on the homepage.
- [ ] **T14.** Deployment documented in README (build, deploy, rollback = revert).
