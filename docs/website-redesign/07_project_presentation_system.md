# 07. Project Presentation System

## Formats

### 1. Small project card (index entry)

The atomic unit of the Station Log. Rendered as a ruled list row, not a floating card.

```
────────────────────────────────────────────────────────
Title →                                      [status tag]
One sentence: what it is.
One sentence: why anyone should care.
MONO: PYTHON · UPDATED 2026-06-04 · REPO ↗
────────────────────────────────────────────────────────
```

Rules: summary ≤140 chars; whyItMatters ≤120 chars; meta row is build-generated from frontmatter; no images at index level (keeps the index fast and scannable).

### 2. Full project case study

Body skeleton (enforced by checklist):
1. **What this is.** Plain description, no setup paragraph.
2. **Why I built it.** The actual itch, one short section.
3. **How it works.** Pattern-level architecture, one figure max.
4. **What it can do.** Concrete, demonstrable examples ("an agent can ask the node who is connected and disconnect a noisy link").
5. **Limitations.** Mandatory. Honest. ("ASL3 only. No auth story beyond the LAN. Don't expose this to the internet.")
6. **Status and next.**
7. **Links.** Repos, upstream projects, docs.

Header meta table: status, started, updated, stack, repo(s), license if relevant.

### 3. Experimental project

Same card, `experimental` tag (amber), summary must start with what it is *trying* to do. No case study page until it stabilizes; the card links straight to the repo.

### 4. Archived project

Grouped in a collapsed strip at the bottom of `/projects/`. Card gains "archived YYYY-MM" in the meta row. Detail pages (if any) carry the archive banner. Archived projects are content, not embarrassment: they prove the maintenance discipline is real.

### 5. Private/internal project placeholder

Used at most once or twice, only when omission would create a confusing hole (e.g. hermes-kb obviously feeds something). Format: a single sentence inside another page, never its own card. "This feeds a private agent setup I run at home; that part isn't published." No name, no architecture, no teasing roadmap. If it can't be described in one safe sentence, it isn't mentioned at all.

### 6. Technical system page (homelab type)

For systems that are operated rather than shipped. Sections: what runs here (pattern level), why it exists, what it taught me, what broke and what that taught me, current limitations. Explicitly no inventory table, no topology diagram, no service list with versions.

## Example public-safe cards (drafted from confirmed sources)

These are drafts in Joshua's register; he edits, he approves.

### AllStar node toolchain (flagship, featured)

> **AllStar node toolchain** `active`
> A REST API, an MCP server, and a Chrome extension for my AllStarLink node. Software, scripts, and AI agents can monitor the node, manage connections, and control it like any other service.
> Radios are the original distributed network. Mine just has an API now.
> `PYTHON / JS · UPDATED 2026-06-04 · 3 REPOS ↗`

Case study notes: the architecture figure shows node → asl3-api → {asl3-mcp → agents, asl-node-panel → browser}. Public-safe: node number, repo links, ASL3 dependency. Private: home network placement, auth specifics, anything about what agents run against it beyond generic examples.

### hermes-kb (featured)

> **hermes-kb** `stable`
> 200 pages of Hermes Agent documentation in a single SQLite FTS5 file. Fully searchable, no internet required at query time, one function call to format results for an LLM.
> Agents shouldn't need the internet to read their own manual.
> `PYTHON · UPDATED 2026-05-28 · REPO ↗`

Private boundary: the H.A.G. sentence per format 5, nothing more.

### WxBot (featured or standard)

> **WxBot** `running`
> A small Python bot that watches National Weather Service data for my area and pushes alerts to the people who need them.
> Weather radios are great. Weather radios that message your family are better.
> `PYTHON · UPDATED 2026-04-21 · REPO ↗`

Privacy note: site copy says "my area"; the repo name currently encodes the ZIP (doc 15, decision D4). The second line should be confirmed against what the bot actually does; if it posts to a net or a Discord instead of family, say that instead. Do not ship unverified claims.

### The homelab (technical system page)

> **The homelab** `active`
> A Proxmox cluster in a Texas closet running the boring, useful stuff: virtualization, backups, home automation, and the agents that tie it together.
> It exists so experiments break here instead of anywhere that matters.
> `PROXMOX / LINUX · UPDATED 2026-06`

Privacy boundary: pattern level only, per format 6.

### openclaw-skill-asl3 (archive strip)

> **openclaw-skill-asl3** `archived 2026-05`
> An agent skill for AllStar node control. Superseded by the MCP server, which does the same job in a more standard way.
> `PYTHON · ARCHIVED`

This card quietly demonstrates good judgment: he migrated a bespoke integration to an open standard.

### Business systems (deferred card, post-MVP, Joshua-drafted)

> **Business systems work** `ongoing`
> I run NetSuite for a living: workflow design, integration plumbing, automation that survives real users. Most of it can't be published, but the patterns can.
> `NETSUITE · PATTERNS ONLY`

Ships only with a real patterns page behind it; otherwise it's a vague chip with extra steps.

## Required assets per project

| Project | Assets needed | Source |
|---|---|---|
| AllStar toolchain | 1 architecture SVG; 1 screenshot of the panel extension; optional node hardware photo | Joshua / repos |
| hermes-kb | 1 terminal-output screenshot (real query, real result), styled per doc 05 screenshot rules | Joshua |
| WxBot | 1 example alert screenshot (redact recipient names/numbers) | Joshua |
| Homelab | none required; optional rack/shelf photo if it doesn't reveal labels | Joshua |

Screenshot redaction rule: crop or blur all hostnames, IPs, phone numbers, names, and tokens before the file ever enters the repo (git history is forever).
