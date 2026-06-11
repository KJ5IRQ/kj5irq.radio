# 01. Current Website Audit

Audited: live site at kj5irq.radio and `index.html` at commit `b593cc1`, 2026-06-11.

## First impression (10-second test)

A visitor sees: a dark page, a callsign logo, "KJ5IRQ" in monospace, a typewriter animation slowly typing "I build systems that integrate, not just coexist.", a job title, and an employer name. After ten seconds they know Joshua is a NetSuite director at an ISP who likes ham radio. They do not know he builds software, what any of his projects are, or why they should click anything. There is, in fact, nothing to click except email and two social links.

Verdict: the page is a competent one-screen resume. It is not yet a home for the work.

## Findings

### F1. The strongest material is missing entirely

- **Finding:** The site lists "Ham Radio, Homelab, Electronics, Networking, Linux" as hobbies with zero proof, while Joshua's GitHub contains original, working software: a FastAPI interface for AllStarLink nodes, an MCP server for node control, a Chrome extension for node monitoring, a local weather bot, and a local knowledge base for Hermes Agent docs.
- **Evidence:** `index.html` lines 1182-1191 (hobby list); github.com/kj5irq repo list.
- **Impact:** The site undersells the exact thing that makes Joshua distinct. "Hobbies: Ham Radio" is generic; "I gave my repeater node a REST API and an MCP server so an AI agent can key it up" is memorable and verifiable.
- **Recommendation:** Replace the hobby list with a projects system (docs 03, 07).
- **Priority:** Critical. **Effort:** High (it is the redesign).

### F2. Resume framing with employer attached

- **Finding:** The sidebar identity block and hero lead with "Director of NetSuite Administration, Nextlink Internet" and the context grid names AMG Technologies. The page reads as a resume hosted on a hobby domain.
- **Evidence:** Lines 1088, 1131, 1158-1162.
- **Impact:** Three problems. (1) Anything on the site can be read as speaking for the employer. (2) Resume framing makes every other section feel like padding. (3) It dates instantly when the job changes.
- **Recommendation:** Keep professional credibility but generalize: "Director-level NetSuite administrator" with employer named at most once on the About page, or not at all (Joshua's call, doc 15). LinkedIn carries the resume.
- **Priority:** Critical. **Effort:** Low.

### F3. JS-injected hero headline

- **Finding:** The hero `<h1>` is empty in the HTML; the headline lives in a `data-text` attribute and is typed in by JavaScript.
- **Evidence:** Line 1112 (`data-text="I build systems..."`, empty element), lines 1254-1282 (typewriter).
- **Impact:** With JS off or failed, the page has a blank headline. Crawlers and screen readers meet an empty h1 first. The typewriter also fires regardless of `prefers-reduced-motion` (only the cursor blink is guarded) and re-runs on every visit.
- **Recommendation:** Real text in the markup, always. If a typing effect survives the redesign at all (it should not; see F7), it must be progressive enhancement over real text.
- **Priority:** Critical. **Effort:** Low.

### F4. Third-party script injection

- **Finding:** `<script src="https://keepandroidopen.org/banner.js"></script>` is the first element inside `<body>`.
- **Evidence:** Line 1051.
- **Impact:** A render-positioned, uncontrolled third-party script on a personal site: it can change at any time, injects unknown content, leaks visitor IPs to a third party, and is a single point of slowness. Whatever the cause's merits, this is a supply-chain hole in a 1-page site.
- **Recommendation:** Remove. If Joshua supports the cause, a static link or banner he controls achieves it without executing someone else's code.
- **Priority:** Critical (security/privacy). **Effort:** Low.

### F5. Image weight

- **Finding:** The page serves `headshot.png` (1.2MB lossless) although `headshot.webp` (115KB) and `headshot.jpg` (128KB) sit unused in the repo, and the commit history shows deliberate movement *toward* the PNG ("Use lossless PNG headshot for sharper profile image"). `logo.png` is 1024px/117KB displayed at 140px.
- **Evidence:** Line 1103; file sizes; commits `b593cc1`, `f431a63`.
- **Impact:** ~1.3MB of avoidable transfer on a page whose entire HTML is 42KB. Mobile and slow connections pay for it.
- **Recommendation:** `<picture>`/`srcset` with correctly sized WebP/AVIF; the redesign's build step should do this automatically (doc 08).
- **Priority:** High. **Effort:** Low.

### F6. Metadata and SEO surface is missing

- **Finding:** No Open Graph or Twitter tags, no canonical URL, no favicon, no sitemap.xml, no robots.txt, no structured data. Title is "KJ5IRQ | kj5irq.radio" (the domain repeated, no name). Meta description exists and is decent.
- **Evidence:** `<head>` lines 4-14; repo file listing.
- **Impact:** Shared links render bare. Search engines have no person/identity signal. "Joshua Ford" does not appear in the title at all, so the site competes poorly for his own name.
- **Recommendation:** Full metadata layer in the redesign (doc 10): per-page titles, OG image, JSON-LD Person, sitemap, favicon from the existing logo.
- **Priority:** High. **Effort:** Low.

### F7. AI-portfolio tells: custom cursor, typewriter, vague chips

- **Finding:** A JS custom cursor that follows the mouse, a typewriter hero, uppercase "proof chips" ("Enterprise AI Integration", "Systems Architect"), a hero subhead of bullet-separated buzz domains, and CTAs like "Let's Talk Systems" / "Let's Build Something Together".
- **Evidence:** Lines 188-217 and 1219-1247 (cursor), 1254-1282 (typewriter), 1116-1120 (chips), 1110-1111 (subhead), 1122-1124 and 1193 (CTAs).
- **Impact:** These are precisely the patterns the brief says to avoid. "Systems Architect" as a chip with nothing behind it reads as aspiration, not proof. The cursor adds 30 lines of JS to demonstrate nothing.
- **Recommendation:** Delete the cursor and typewriter. Replace chips with links to actual things. Replace consultant CTAs with plain ones ("Email me", "See the projects").
- **Priority:** High. **Effort:** Low.

### F8. Typography is loaded but not used

- **Finding:** Cormorant Garamond and Inter load from Google Fonts, yet the two most prominent text elements (sidebar h1 and hero headline) use Courier New. Three families compete; the serif is relegated to h2s and the footer.
- **Evidence:** Lines 10-14, 314-323, 674-681.
- **Impact:** Render-blocking third-party font requests (also a GDPR-adjacent IP leak to Google) for fonts that barely appear. The hierarchy feels accidental.
- **Recommendation:** Self-host two families max with a deliberate role for each (doc 05). Monospace earns its place only for radio/log/metadata content.
- **Priority:** Medium. **Effort:** Low.

### F9. Heading and landmark structure

- **Finding:** Two `<h1>`s (sidebar callsign, hero headline). Sections jump straight to h2. The hero h1 contains injected `<span>` markup during animation. The theme is applied by script at the end of `<body>`, so manual-theme users get a flash of wrong theme.
- **Evidence:** Lines 1084, 1112; 1289-1328 (theme init).
- **Impact:** Screen reader outline is confusing; FOUC is visible on every load for toggle users.
- **Recommendation:** One h1 per page; inline theme script in `<head>`; this comes free with a rebuilt layout.
- **Priority:** Medium. **Effort:** Low.

### F10. Single-file maintainability ceiling

- **Finding:** 1,333 lines of HTML+CSS+JS in one file, with CSS comments documenting "REFACTOR V2", legacy alias variables, and three competing theme blocks (system, `.light-theme`, `.dark-theme` with diverging values).
- **Evidence:** Lines 16-32, 65-72, 104-171.
- **Impact:** Every content edit risks the styles; there is no way to add a second page without copy-pasting the world. This structurally prevents the site from growing into projects/writing.
- **Recommendation:** Static site generator with layouts and content collections (doc 08).
- **Priority:** High. **Effort:** Medium (covered by rebuild).

### F11. Small copy issues

- **Finding:** Broken spacing from a formatting pass: "it' s an ERP configuration", stray spaces before `</p>`. The About copy itself is actually good and human ("Based in Texas. Usually tinkering with something."). The hobby list uses em-dash bullets, which Joshua specifically dislikes. The footer "73 de KJ5IRQ" is the single best personality moment on the page.
- **Evidence:** Lines 1163-1167, 522-528, 1208.
- **Impact:** Minor, but typos on a one-page site read loudly.
- **Recommendation:** Carry "Based in Texas. Usually tinkering with something." and "73 de KJ5IRQ" into the redesign. Fix the rest by replacement.
- **Priority:** Low. **Effort:** Low.

### F12. Accessibility: good bones, uneven follow-through

- **Finding:** Genuine strengths exist: skip link, `:focus-visible` styles, reduced-motion guards on keyframes, touch-device cursor removal, aria-labels and `aria-pressed` on the toggle. Gaps: typewriter ignores reduced motion (F3), `scroll-behavior: smooth` is unguarded, contact button text on `#5A7A48` is roughly 3.3:1 against `#E8E8E8` (borderline), hover-only affordances on the work list.
- **Evidence:** Lines 173-175, 244-273, 300-312, 897-921.
- **Impact:** Close to good; the redesign should keep the bones and close the gaps.
- **Priority:** Medium. **Effort:** Low.

### F13. Privacy posture

- **Finding:** Exposed today: full name, employer and parent company, callsign, email, headshot, Texas. The callsign itself links to a public FCC ULS record (licensed address), which is inherent to being a ham, not a site flaw, but worth stating consciously. The third-party script (F4) leaks visitor data.
- **Impact:** Acceptable for a public professional, except F4 and the employer prominence (F2).
- **Recommendation:** Keep location at "Texas" granularity. Decisions logged in doc 15.
- **Priority:** High (F4 component). **Effort:** Low.

## What the current site gets right (keep these)

1. The instinct of the hero line: "systems that integrate, not just coexist."
2. Ford Field Green as a personal accent color. It is distinctive precisely because every AI-generated portfolio is blue or purple.
3. Dark and light themes with system-preference respect.
4. The accessibility bones (skip link, focus styles, motion guards).
5. "73 de KJ5IRQ" and the dry About voice.
6. The discipline of a small, dependency-free site. The redesign should keep that spirit even with a build step.
