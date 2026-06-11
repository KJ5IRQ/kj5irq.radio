# 06. Content Model

All content is Markdown/MDX with typed frontmatter, validated at build time (Astro content collections + Zod, per doc 08). A build that receives invalid or privacy-flagged frontmatter fails loudly. Schemas below are the source of truth for doc 13.

## Global conventions

- Dates: `YYYY-MM-DD`.
- `publish` is the master gate on every type: builds include an entry only when `publish: true` AND `status` is a publishable state. Default is unpublished. (Doc 09 explains how this interacts with the vault.)
- `updated` is required and surfaces in the UI; stale honesty beats fake freshness.
- No frontmatter field may contain secrets, internal hostnames, IPs, or private URLs. The sync/lint script greps for obvious offenders (doc 09).

## Content types

### 1. Project

- **Purpose:** An entry on `/projects/` and optionally its own page.
- **Required fields:** `title`, `slug`, `summary` (≤140 chars, the index one-liner), `whyItMatters` (one sentence), `status` (`active | stable | experimental | archived`), `cluster` (`radio | ai-tooling | homelab | utilities | business-systems`), `started`, `updated`, `publish`, `privacyReviewed: true`
- **Optional fields:** `repo` (URL), `links[]`, `stack[]` (≤5 plain strings), `featured` (bool, homepage), `caseStudy` (bool: full page vs index-only), `image` + `imageAlt`
- **Public/private:** All listed fields public. There are no private fields in public collections; private context stays in the vault, not in this repo.
- **Example:**

```yaml
---
title: "hermes-kb"
slug: "hermes-kb"
summary: "200 pages of Hermes Agent docs in one SQLite file. Searchable offline."
whyItMatters: "Agents shouldn't need the internet to read their own manual."
status: "stable"
cluster: "ai-tooling"
started: 2026-05-01
updated: 2026-06-04
publish: true
privacyReviewed: true
repo: "https://github.com/KJ5IRQ/hermes-kb"
stack: ["Python", "SQLite FTS5"]
featured: true
caseStudy: true
---
```

- **Display rules:** Index entry always; full page only if `caseStudy`. `archived` projects render in the archive strip, never featured.
- **SEO:** Title `"{title} · Joshua Ford"`; description = `summary`; OG image auto-generated from title + status.
- **Privacy risks:** `repo` links can leak via the repo itself (READMEs, issues); the `privacyReviewed` flag asserts the *repo* was checked too, not just the page.

### 2. Project case study (body structure for `caseStudy: true`)

Not a separate collection; a required body skeleton enforced by editorial checklist (doc 14), not by code:

1. What this is (2 to 4 sentences)
2. Why I built it (the itch)
3. How it works (one figure max, pattern level)
4. What it can actually do (concrete examples)
5. Limitations (mandatory, honest)
6. Status and next
7. Links

### 3. Writing piece (post-MVP)

- **Required:** `title`, `slug`, `date`, `summary`, `kind` (`essay | satire | analysis | fiction`), `publish`, `privacyReviewed`
- **Optional:** `updated`, `series`, `image`
- **Display:** Reverse-chronological index with margin dates; `kind` shown as a tag. Satire is labeled as satire; future readers and quote-miners both benefit.
- **SEO:** Article JSON-LD, OG per piece, RSS inclusion when `publish`.
- **Privacy risks:** Political analysis under his real name and callsign is a deliberate, irreversible association; flagged in doc 15 as a Joshua decision, not a default.

### 4. Note (post-MVP, vault-sourced)

- **Required:** `title`, `slug`, `date`, `publish`, `privacyReviewed`, `source: "vault"`
- **Optional:** `updated`, `topics[]`
- **Display:** Plainer template than writing; explicitly framed as working notes.
- **Privacy:** Only enters the repo via the doc 09 pipeline. Never auto-synced.

### 5. Radio page (singleton)

- **Fields:** `callsign`, `licenseClass`, `gridSquare` (optional, opt-in), `nodes[]` ({type: allstar|echolink, id, status}), `qrzUrl`, `updated`
- **Display:** Station facts table + prose. Node IDs are public in AllStarLink's own directory, so listing them is consistent exposure, not new exposure.
- **Privacy:** No street-level location. `gridSquare` ships empty unless Joshua opts in.

### 6. About block / operator bio (singleton)

- **Fields:** `bio` (body), `headshot`, `links[]` (email, GitHub, LinkedIn, QRZ), `employerMention` (`none | generic | named`), `updated`
- The `employerMention` field exists so the doc 15 decision is enforced in one place.

### 7. Now update (post-MVP, optional)

- **Fields:** `date`, body ≤200 words. Page auto-hides if newest entry >120 days old (better no page than a stale one).

### 8. External link / elsewhere item

- **Fields:** `label`, `url`, `context` (one line). Used for footer and a possible future "elsewhere" list. No tracking parameters ever.

### 9. Archive item

Same schema as Project with `status: archived`; `openclaw-skill-asl3` is the first occupant. Archived pages carry a banner: "Archived. Kept for reference, no longer maintained."

## Obsidian compatibility

The frontmatter above is plain YAML that Obsidian handles natively. A vault note destined for the site carries the same fields plus the pipeline state field (`state: private|draft|review|approved|published|archived`, doc 09). The site build never reads the vault directly; the sync script copies approved notes into `src/content/`, stripping any field not in the public schema (allowlist, not blocklist).

## SEO rules summary per type

| Type | Title pattern | Description | Structured data |
|---|---|---|---|
| Home | "Joshua Ford · systems, radio, automation (KJ5IRQ)" | hand-written | Person |
| Project | "{title} · Joshua Ford" | summary | SoftwareSourceCode (where repo exists) |
| Writing | "{title} · Joshua Ford" | summary | Article |
| Radio | "KJ5IRQ · Joshua Ford, amateur radio" | hand-written | Person + sameAs QRZ |
| About | "About · Joshua Ford" | hand-written | Person |
