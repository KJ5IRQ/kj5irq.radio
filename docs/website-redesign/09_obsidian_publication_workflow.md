# 09. Obsidian / Pensieve Publication Workflow

## Principles

1. The vault is private by default, forever. Publishing is an explicit, per-note, multi-gate act.
2. The website build never reads the vault. A manual sync script copies approved notes into the site repo; the repo is the only thing the build sees.
3. Fail closed. Missing fields, unknown fields, or ambiguous states mean a note does not publish.
4. Git history is forever. A note enters the repo only after passing review, because un-publishing cannot un-commit.

## Vault structure (recommended, minimal disruption)

No reorganization of the existing vault is required. Add one folder:

```
Vault/
├── (everything as it is today)        # never touched by the pipeline
└── Publish/                           # the ONLY folder the sync script can read
    ├── notes/
    └── writing/
```

The allowlist is structural: the script is pointed at `Publish/` and physically cannot see siblings. Drafting happens anywhere in the vault; a note is *moved* into `Publish/` as a deliberate act, which is gate one.

## Frontmatter schema (vault side)

```yaml
---
title: "Putting an MCP server on a radio node"
slug: "mcp-radio-node"
date: 2026-07-01
summary: "What worked, what didn't."
kind: note            # note | essay | satire | analysis
state: draft          # private | draft | review | approved | published | archived
publish: false        # flips true only at approval, by hand
privacyReviewed: false
topics: [radio, agents]
---
```

## Publication states

| State | Meaning | Script behavior |
|---|---|---|
| `private` | In the vault, not for the site (default everywhere) | Ignored; if found inside `Publish/`, warn (it's probably misfiled) |
| `draft` | Being written with publication intent | Ignored |
| `review` | Content done; awaiting privacy + edit pass | Ignored; listed in script output as "pending review" |
| `approved` | Passed review; `publish: true`, `privacyReviewed: true` set by hand in the same sitting | **Copied** to repo on next sync |
| `published` | Live; state updated by the script after successful sync | Re-copied if file changed (updates flow) |
| `archived` | Was public, now retired | Page gains archive banner; never deleted from repo (link rot is rude) |

## The privacy gates (in order)

1. **Location gate:** note must live in `Publish/`.
2. **State gate:** `state: approved` or `published`.
3. **Flag gate:** `publish: true` AND `privacyReviewed: true`. All three of gates 1 to 3 must agree; any mismatch = skip + loud warning.
4. **Content lint:** the script scans the body and frontmatter for red-flag patterns before copying: IP addresses, `192.168.`/`10.x` ranges, internal hostnames pattern list (Joshua maintains it), employer and vendor names list, phone numbers, email addresses other than the public one, file paths (`C:\`, `/home/`), URLs not on a public-domain allowlist, names of family members (maintained list), API-key-shaped strings. Any hit = the note is skipped and reported. Overriding requires an inline `<!-- lint-ok: reason -->` next to the flagged line, which itself shows up in the PR diff.
5. **Field allowlist:** only schema fields are copied; everything else in frontmatter is stripped. Vault-specific fields (`state`, vault tags, aliases) never reach the repo.
6. **Human diff gate:** sync writes to a git branch; Joshua reads the actual diff before merging. This is the gate that catches what regex cannot: context, tone, "wait, that paragraph mentions work."

## Manual workflow (the only workflow at launch)

1. Write wherever. When something wants to be public, move it to `Publish/`, set `state: draft`.
2. Finish it. Set `state: review`. Reread it once as a stranger, once as his employer, once as his family. Fix.
3. Set `state: approved`, `publish: true`, `privacyReviewed: true` in one sitting.
4. Run `npm run sync` in the site repo. Script reports: copied / skipped / pending / lint failures.
5. Review the git diff. Commit to a branch, open the PR, merge.
6. Script (or Joshua) flips vault `state` to `published`.

## Optional automated workflow (later, opt-in, never default)

At most: a scheduled local job (on the homelab, not in CI) that runs steps 4 to 5 and opens the PR automatically. **The human merge remains.** Full automation to production is explicitly rejected: the entire safety model is the human diff gate, and the vault's value depends on Joshua never having to self-censor his private notes out of fear of a pipeline.

## Build script concept (`scripts/vault-sync.mjs`)

- Config: vault `Publish/` path (machine-local, in `.gitignore`d `sync.config.json`, never committed since it's a private filesystem path).
- Read `Publish/**/*.md`; parse frontmatter (gray-matter).
- Apply gates 1 to 5; collect a report.
- Transform: strip non-allowlisted fields; rewrite Obsidian `[[wikilinks]]` to plain text or site links (unresolvable wikilinks = lint failure, since they leak note titles from the private vault); copy referenced images only from `Publish/assets/` and only after they pass an EXIF-strip step.
- Write to `src/content/notes/` or `src/content/writing/` by `kind`.
- Exit nonzero if anything was skipped for gate reasons, so it's never silent.

## Failure modes and mitigations

| Failure | Mitigation |
|---|---|
| Private note misfiled into `Publish/` | State+flag gates (still won't copy); warning surfaces the misfile |
| Sensitive detail inside an approved note | Content lint + human diff gate |
| Wikilink leaks a private note's title | Lint failure on unresolved wikilinks |
| Image EXIF contains GPS | EXIF strip in the image step |
| Sync script bug copies too much | Script writes only to a branch; nothing reaches `main` without eyes |
| Future Joshua gets lazy and merges without reading | The script's report prints a one-line summary of *every* file copied; smallness of habit is the real defense. Automation never removes the merge step. |
| Vault path leaks into repo | Config file gitignored; lint also greps output for the path |

## What this explicitly does not do

No live vault sync. No vault-wide publishing. No "publish" tag that acts immediately. No CI access to the vault or to Drive. No third-party publish services (Obsidian Publish would bypass every gate above and is rejected for this use).
