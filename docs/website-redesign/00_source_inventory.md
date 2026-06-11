# 00. Source Inventory

Date: 2026-06-11
Reviewer: Claude (Fable), discovery phase. No production files were modified.

## Sources

| Source | Access status | What it contains | Usefulness | Privacy risk | How it will be used | Limitations |
|---|---|---|---|---|---|---|
| Repo `KJ5IRQ/kj5irq.radio` (local clone) | Confirmed | `index.html` (42KB, inline CSS/JS), `CNAME` (kj5irq.radio), `logo.png` (1024px), `headshot.png/.jpg/.webp` (852x1009), git history (8 commits) | High. The entire current site. | Low. Already public. | Full audit basis. | None. |
| Live site https://kj5irq.radio | Confirmed | Rendered version of the repo. Matches `index.html` exactly. | High. Confirms deploy pipeline works (GitHub Pages + Cloudflare DNS). | Low. | Audit, performance and SEO review. | Could not run Lighthouse in this environment; performance findings are from code inspection. |
| GitHub profile `github.com/kj5irq` | Confirmed | Bio: "Amateur radio enthusiast (KJ5IRQ), NetSuite Administrator, home automation, AI/LLM tools, AllStarLink & Echolink". 11 public repos. Activity set to private. | High. The strongest public proof of work. | Low. Already public. | Project inventory, identity synthesis, example project cards. | Contribution graph hidden; cannot judge cadence. |
| Public repos: `asl3-api`, `asl3-mcp`, `asl-node-panel`, `WxBot_76067`, `hermes-kb`, `openclaw-skill-asl3` (archived), forks (`ASL3`, `hamdashboard`, `openhamclock`, `Awesome-Hacking`) | Confirmed | Original radio-automation tooling: FastAPI REST interface for AllStarLink nodes, MCP server for node control, Chrome extension for node monitoring, local weather bot, local FTS5 knowledge base for Hermes Agent docs. | Very high. This is the distinct, verifiable work the current site never mentions. | Medium. `WxBot_76067` encodes a ZIP code (see privacy notes). | Flagship project case studies. | Read READMEs only; did not clone or audit code quality. |
| QRZ page qrz.com/db/KJ5IRQ | Partial | Active profile, 1,946 lookups, logo image. Bio, equipment, and logbook are login-gated. | Medium. Confirms active radio identity. | Low to medium. FCC ULS makes the license address public regardless of this site (see privacy notes). | Radio page strategy; cross-linking. | Could not read the bio text. |
| `KJ5IRQ/kj5irq-hub` repo | Not available (404) | Search results describe it as a past "dashboard website with public view and private admin area" for kj5irq.radio. Now private or deleted. | Low, but instructive: evidence of a prior dashboard-style direction that was abandoned or withdrawn. | None (inaccessible). | Background only. Not cited as fact beyond its prior existence. | Cannot verify contents. |
| LinkedIn linkedin.com/in/kj5irq | Not available | Auth-walled. | Unknown. | n/a | Linked from the site only. | Could not fetch. |
| Obsidian Vault / Pensieve | Partial (existence confirmed, contents not read) | A folder named `Obsidian` exists in Joshua's Google Drive (created 2025-08-31). A child listing returned empty via the Drive API. | Potentially high for identity, but treated as private by default per the engagement rules. | High. Assume private. | Not used for content. The publication workflow (doc 09) is designed so selected notes can be published later with explicit gates. | Deliberately not mined. No note content was read. |
| Prior chats | Not available | No chat archive is accessible from this session. | n/a | n/a | Not used. | The known-context block in the brief stands in for this. |
| Proxmox MCP server (connected to this session) | Confirmed available, deliberately not used | Live access to Joshua's homelab cluster. | Confirms the homelab is real and Proxmox-based. That single fact is used; nothing else. | Very high. Live infrastructure. | One fact only: "homelab runs on Proxmox." No nodes, names, IPs, or inventory were queried. | Intentionally untouched. A website review has no business inside production infra. |
| Brief / known context from Joshua | Confirmed | Director-level NetSuite admin, Hermes / H.A.G. operator, KJ5IRQ, homelab, writer (satire, political analysis, worldbuilding), dislikes filler and em dashes. | High. | Mixed. Employer and H.A.G. details handled as private context. | Identity synthesis. | Second-hand; where it conflicts with public sources, public sources win. |
| Images in repo (`logo.png`, headshots) | Confirmed | A 1024px logo (appears to be the KJ5IRQ mark), a professional headshot in three formats. | Medium. Reusable brand assets. | Low. Already public. | Asset inventory for redesign. | Did not visually inspect at pixel level. |

## Assumptions (labeled)

1. **A1.** "Hermes" in Joshua's projects refers to tooling around the Nous Research Hermes Agent (the `hermes-kb` README links to its docs). H.A.G. is assumed to be a private agent project built on or around it. Publicly, this work is presented as "local AI agent tooling" unless Joshua approves more.
2. **A2.** No public writing archive exists today. None was found on the site, GitHub, or via search. The writing section is therefore deferred, not designed around imaginary content.
3. **A3.** GitHub Pages remains acceptable hosting. Nothing found suggests a need to move.
4. **A4.** The green brand color (`#4F6A3A`, "Ford Field Green" per the CSS comments) is intentional personal branding (Ford, field green). It is kept.

## What Joshua would need to provide later

- QRZ bio text, if he wants the radio page to mirror or link it.
- Any writing he actually wants public (even 2 to 3 pieces).
- A decision on how much employer context appears (see doc 15).
- Station photos or node hardware photos, if desired for the radio page.
