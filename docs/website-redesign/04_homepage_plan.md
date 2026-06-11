# 04. Homepage Plan

## Objective

A first-time visitor, in ten seconds, learns: Joshua Ford, Texas, builds and runs systems (ERP by day, radio/AI/homelab at home), here are three real projects, here is his email. In thirty seconds they have clicked into a project or copied the address.

## Section order and wireframe

```
┌──────────────────────────────────────────────────────────┐
│ [wordmark: Joshua Ford / KJ5IRQ]        Projects Radio About │  ← header, one line
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. HERO (text only, no animation theater)               │
│     h1: name-anchored headline                           │
│     2-sentence dek in his voice                          │
│     [Email me]  [See the projects]                       │
│     meta line (mono, small): TX · KJ5IRQ · last updated  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  2. FEATURED WORK ("On the bench")                       │
│     3 project entries, list-style not card-grid:         │
│     each = title, one-line what, one-line why-care,      │
│     status tag, mono meta row (lang · repo · updated)    │
│     → "All projects" link                                │
├──────────────────────────────────────────────────────────┤
│  3. OPERATOR NOTE (short About teaser)                   │
│     3 sentences + headshot (small, not a hero portrait)  │
│     → "More about me"                                    │
├──────────────────────────────────────────────────────────┤
│  4. THE STATION (radio strip)                            │
│     One ruled row: callsign, node, "what this means" link│
│     → /radio/                                            │
├──────────────────────────────────────────────────────────┤
│  5. FOOTER / CONTACT                                     │
│     email (plain, large), GitHub · LinkedIn · QRZ        │
│     "73 de KJ5IRQ" · colophon link · no copyright drama  │
└──────────────────────────────────────────────────────────┘
```

Five sections. Nothing sticky, nothing animated on load, no hero image. The page should be readable with CSS off.

### Visual treatment per section (summary; full system in doc 05)

1. **Hero:** Largest type on the site, set in the display face, left-aligned, max-width measure. The green accent appears once: a single rule or the callsign. The meta line beneath is the first monospace moment and it contains *real data* (date from the build).
2. **Featured work:** Ruled horizontal entries (like a well-set table of contents), not floating cards. Hover affordance is an underline and arrow, not lift/glow.
3. **Operator note:** Two-column on desktop (text + small square headshot), stacked on mobile.
4. **Station strip:** Full-width rule above and below; the one place a subtle texture or the logo mark may appear.
5. **Footer:** Generous padding, email set large enough to be a destination, then the small print.

### What to remove (vs. current site)

The typewriter, the custom cursor, the proof chips, the sticky sidebar, the employer block, the hobbies list, the third-party banner script, the "Let's Talk Systems" button.

### What to avoid

A spinning globe, a map, a fake terminal, a live dashboard, scroll-triggered reveals, testimonial anything, skill bars, a "tech stack" icon zoo.

## Copy options

All options follow the voice rules: plain, specific, no em dashes, no hype.

### Headlines (10)

1. I build the missing interfaces.
2. Systems that integrate, not just coexist. *(carryover, proven)*
3. I run systems. Some of them talk back.
4. Business platforms by day. Radios and agents by night.
5. I give machines a way to talk to each other.
6. Operator of systems, builder of the glue between them.
7. ERP, radio, agents. One operator.
8. I make stubborn systems cooperate.
9. The interesting part is the connection.
10. I wire things together until they work.

### Subheadlines / deks (10)

1. I'm Joshua Ford, a systems administrator in Texas. I run an ERP platform for work, and at home I build tools that let software, radios, and AI agents actually reach each other.
2. NetSuite director by trade. At home: an AllStar node with its own API, a homelab, and agents that can use both.
3. I'm Joshua Ford, KJ5IRQ. I build practical automation: REST interfaces for radio nodes, local knowledge bases, workflows that survive contact with real users.
4. Director-level NetSuite admin. Amateur radio operator. I build the connections those two facts imply.
5. I administer business systems for a living and automate everything else for fun. Most of it is on GitHub.
6. Texas. ERP by day. After hours I teach radios, servers, and agents to cooperate.
7. I'm Joshua Ford. I operate systems end to end, and when two of them can't talk, I build the part that's missing.
8. Systems administrator, radio operator, persistent tinkerer. Everything here is something I actually run.
9. I run an ERP environment, a radio node, and a homelab. The projects below are what happens when those overlap.
10. Joshua Ford, KJ5IRQ. Practical automation, radio infrastructure, and local AI tooling, built and operated in Texas.

### Short bios (5)

1. I'm Joshua Ford, a NetSuite administrator and amateur radio operator (KJ5IRQ) in Texas. I like systems that are understandable, and I build the missing pieces when they aren't. Usually tinkering with something.
2. I run business systems for a living and a small pile of personal infrastructure for fun: a radio node, a homelab, some AI agents. The overlap is where the good projects come from.
3. Director of NetSuite administration by day. After hours I build tools like a REST API and MCP server for my AllStar node, so software and agents can operate the radio. Based in Texas.
4. I started on a warehouse floor and ended up owning the ERP. The habit stuck: find the system, learn it end to end, automate the boring parts. Now I do that to radios and AI agents too.
5. Systems operator in Texas. ERP platforms, amateur radio (KJ5IRQ), homelab, local AI tooling. I publish the parts that might be useful to someone else.

### CTA button pairs (5)

1. [Email me] [See the projects]
2. [Get in touch] [Browse the bench]
3. [Email kj5irq@gmail.com] [Projects]
4. [Say hello] [What I'm building]
5. [Contact] [Start with the radio node]

### Recommended final hero copy

> **h1:** Systems that integrate, not just coexist.
>
> **dek:** I'm Joshua Ford, a systems administrator in Texas. I run an ERP platform for work, and at home I build tools that let software, radios, and AI agents actually reach each other.
>
> **buttons:** [Email me] [See the projects]
>
> **meta line (mono):** `TX · KJ5IRQ · UPDATED 2026-06-11`

Rationale: the h1 is already his line and it survived the audit as the best thing on the current page. The dek does the introduction work the h1 doesn't, names him in sentence one, and earns the radio/AI words with the word "actually". Headline 3 ("I run systems. Some of them talk back.") is the dry-edge alternative if Joshua wants more personality; it is also the only one a visitor might quote to a friend. Offer him the pair.

### Featured work entries (initial 3)

1. **AllStar node toolchain** · A REST API, an MCP server, and a browser panel for my AllStarLink node. Software and AI agents can now monitor, connect, and control the radio. `Python/JS · active`
2. **hermes-kb** · 200 pages of agent documentation in one SQLite file. Full-text search, no internet needed at query time. `Python · stable`
3. **WxBot** · A small bot that watches the weather where I live and tells the people who need to know. `Python · running`

### Operator note (homepage teaser)

> I started in warehouse operations and ended up running the ERP. The habit stuck: learn the system end to end, then automate the boring parts. These days that habit gets applied to radios, servers, and AI agents too. Based in Texas. Usually tinkering with something.
