# 03. Information Architecture

## A. MVP sitemap

```
kj5irq.radio
├── /                      Home
├── /about/                About (the operator)
├── /projects/             Projects index (the bench)
│   ├── /projects/allstar-toolchain/    Case study: AllStarLink API + MCP + panel
│   ├── /projects/hermes-kb/            Project: local knowledge base
│   ├── /projects/wxbot/                Project: weather bot
│   └── /projects/homelab/              Overview: the homelab (generalized)
├── /radio/                KJ5IRQ (the station)
├── /colophon/             How this site is built (small, optional but cheap)
└── (contact = section on Home + About footer; no separate page)
```

7 to 8 pages total. Plus: `sitemap.xml`, `robots.txt`, `favicon`, `og` images, custom 404.

## B. Expanded sitemap (post-launch)

```
kj5irq.radio
├── (everything above)
├── /writing/              Writing index + RSS
│   └── /writing/[slug]/
├── /notes/                Short, garden-style notes from the vault (gated, doc 09)
│   └── /notes/[slug]/
├── /projects/[more]/      NetSuite/business-systems patterns (employer-generalized),
│                          home automation, future tools
├── /now/                  Now page (only if he will actually update it)
├── /uses/                 Hardware/software list
└── /archive/              Retired projects (openclaw-skill-asl3 lives here)
```

## C. Page specifications (MVP)

### Home
- **URL slug:** `/`
- **Purpose:** Answer who/what/why-care/where-next in one screenful plus one scroll.
- **Audience:** All.
- **Priority:** Critical.
- **Main sections:** Identity hero; featured projects (3 to 4); short operator note; radio line; contact.
- **Required content:** Name, spine sentence, callsign, 3 featured project cards, email.
- **Optional content:** Most recent update line ("Last station log entry").
- **CTA:** Email me / See the projects.
- **Privacy concerns:** No employer name here. Location stays "Texas".
- **MVP:** Yes. Full plan in doc 04.

### About
- **URL slug:** `/about/`
- **Purpose:** The operator's story in his own voice; professional credibility without resume cosplay.
- **Audience:** Hiring managers, curious peers.
- **Priority:** High.
- **Main sections:** Short bio (first person); the arc (warehouse to ERP ownership, 3 to 4 sentences); what I work with (plain list); how to reach me; headshot.
- **Required content:** Bio, the arc, contact links (email, GitHub, LinkedIn, QRZ).
- **Optional content:** One paragraph on how he thinks about systems; the Ford Field Green story in one dry sentence.
- **CTA:** Email; LinkedIn for the resume version.
- **Privacy concerns:** Employer named at most once, past-tense-safe phrasing ("I run NetSuite for a Texas ISP" style, decision in doc 15). No family details.
- **MVP:** Yes.

### Projects index
- **URL slug:** `/projects/`
- **Purpose:** Every public project, one screenful each as a card, honest status labels.
- **Audience:** Technical peers.
- **Priority:** Critical.
- **Main sections:** Intro line (one sentence); cards grouped by cluster (Radio, AI tooling, Homelab, Utilities); archived strip at bottom.
- **Required content:** 4 to 6 cards per doc 07 schema with status, dates, repo links.
- **CTA:** Per card: read more / view repo.
- **Privacy concerns:** Cards must pass the doc 07 privacy fields.
- **MVP:** Yes.

### Project: AllStarLink toolchain (flagship case study)
- **URL slug:** `/projects/allstar-toolchain/`
- **Purpose:** The proof-of-distinctiveness page: node → REST API → MCP server → browser panel, told as one system.
- **Audience:** Hams who code, AI tinkerers, anyone evaluating his ability.
- **Priority:** Critical.
- **Main sections:** What it is; why (the itch); architecture (one simple diagram); what each piece does; what an agent can actually do with it; limitations; status; links to the three repos.
- **Required content:** Per case-study schema (doc 07). One diagram (can be a clean SVG block diagram, hand-finished).
- **Privacy concerns:** Node number is fine (AllStarLink numbers are public). No home network details, no IPs, no hostnames.
- **MVP:** Yes.

### Project: hermes-kb
- **URL slug:** `/projects/hermes-kb/`
- **Purpose:** Shows the local-first AI pattern: 200 pages of docs in a SQLite FTS5 file, no internet at query time.
- **Priority:** High.
- **Main sections:** What/why/how; the `format_for_llm()` integration idea; limitations; repo link.
- **Privacy concerns:** Describe hermes-kb only. H.A.G. gets, at most, one sentence: "It feeds a private agent I run at home." Nothing more.
- **MVP:** Yes.

### Project: WxBot
- **URL slug:** `/projects/wxbot/`
- **Purpose:** Small, complete, charming utility; shows finishing energy.
- **Priority:** Medium.
- **Privacy concerns:** Site copy says "my county" or "my area", not the ZIP. The repo name already leaks the ZIP; optionally rename the repo later (doc 15), but the site should not repeat it.
- **MVP:** Yes (short page or index-card-only is acceptable at cut line).

### Project: Homelab overview
- **URL slug:** `/projects/homelab/`
- **Purpose:** Generalized tour of what runs at home and why, written as patterns ("virtualization host, a few services, backups that have been tested") rather than inventory.
- **Priority:** Medium.
- **Privacy concerns:** Highest of the project pages. No hostnames, IP ranges, service versions, or topology. Pattern-level only. Proxmox can be named; the layout cannot.
- **MVP:** Yes if it passes privacy review; first to cut otherwise.

### Radio / KJ5IRQ
- **URL slug:** `/radio/`
- **Purpose:** The station page. For hams: who, where (grid square level at most, and only if Joshua opts in), node info, links. For non-hams: a 3-sentence explanation of why a grown adult has a callsign in 2026, in his voice.
- **Audience:** Hams; curious non-hams.
- **Priority:** High.
- **Main sections:** Callsign and license class; the node (AllStarLink/EchoLink, links to the toolchain case study); how to reach him on air; QRZ link; the logo story if he wants.
- **Required content:** Callsign, node number, QRZ link.
- **Optional content:** Equipment list, station photo.
- **Privacy concerns:** FCC address is already public, but the page should stay at "Texas" / grid-square granularity by choice.
- **MVP:** Yes.

### Colophon
- **URL slug:** `/colophon/`
- **Purpose:** One short page: stack, fonts, hosting, no-tracking statement. Cheap to build, signals craft, useful for the kind of visitor he wants.
- **Priority:** Low.
- **MVP:** Yes if time allows; zero shame in cutting.

## D. Pages considered and cut from MVP

| Page | Why cut |
|---|---|
| Writing index | No public-ready content found. Launching it empty undermines the whole site. Build the shelf when there are at least 3 pieces. |
| Notes / garden | Depends on the doc 09 pipeline working and trusted. Post-MVP. |
| Now | Only valuable if updated; stale Now pages are worse than none. Joshua opts in later. |
| Uses | Fun but pure dessert. Later. |
| NetSuite/business systems page | Needs careful employer-safe writing that only Joshua can do. Deferred until he drafts it. |
| Hermes / H.A.G. page | Private project. A public page would be either vague (bad) or leaky (worse). |
| Contact page | A page for one mailto is bureaucracy. Section on Home and About instead. |

## E. Navigation

Global nav, four items, same order everywhere: **Projects · Radio · About** plus the wordmark home link. Footer: email, GitHub, LinkedIn, QRZ, colophon, "73 de KJ5IRQ". No dropdowns, no hamburger on desktop; on mobile a simple wrap, no JS menu needed at this scale.

URL rules: lowercase, hyphenated, trailing slash, no dates in project URLs (projects are living), dates in writing URLs later (`/writing/slug/` with date in frontmatter, not URL).
