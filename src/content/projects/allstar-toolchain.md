---
title: "AllStar node toolchain"
summary: "A REST API, an MCP server, and a browser panel for my AllStarLink node."
whyItMatters: "Software and AI agents can monitor and control the radio like any other service."
status: "active"
cluster: "radio"
updated: 2026-06-04
publish: true
privacyReviewed: true
repo: "https://github.com/KJ5IRQ/asl3-api"
links:
  - label: "asl3-mcp"
    url: "https://github.com/KJ5IRQ/asl3-mcp"
  - label: "asl-node-panel"
    url: "https://github.com/KJ5IRQ/asl-node-panel"
stack: ["Python", "FastAPI", "MCP", "JavaScript"]
featured: true
caseStudy: true
order: 1
---

## What this is

Three small projects that together give an AllStarLink node a modern control surface:

- **asl3-api** wraps the Asterisk Manager Interface in a FastAPI REST service. Connect and disconnect nodes, send DTMF, run macros, and watch live node events over HTTP.
- **asl3-mcp** sits on top of that API and speaks Model Context Protocol, so an AI agent can operate the node with typed tools instead of shell access.
- **asl-node-panel** is a Chrome side panel for humans: live status, favorites, weekly connect schedules, and one-tap commands.

## Why I built it

AllStarLink already networks radios over the internet, which is half the magic. But day-to-day control of a node still meant SSH sessions and DTMF sequences. I wanted my node to be as scriptable as everything else I run, and once it had a real API, giving an agent safe access to it was the obvious next step.

## How it works

<figure>
<pre aria-label="Architecture diagram, described in the paragraph below">
 AI agent              browser
    |                     |
 asl3-mcp          asl-node-panel
    |                     |
    +--------+   +--------+
             |   |
           asl3-api  (FastAPI: REST + live events)
             |
      Asterisk / app_rpt  (AMI)
             |
       AllStarLink node
</pre>
<figcaption>One door in. Everything goes through the API.</figcaption>
</figure>

The API is the only piece that talks to Asterisk. The MCP server and the panel are both ordinary API clients, which means the agent layer never holds AMI credentials and can be cut off by revoking one key.

## What it can do

- Live node state with sub-2-second event streaming over Server-Sent Events
- A cached directory of roughly 40,000 AllStarLink nodes for instant lookups
- API-key auth, per-endpoint rate limiting, and an audit log of every command
- Agent tools split by risk tier: read-only checks are free, voice announcements are low risk, connect and disconnect require an explicit confirmation flag, and disconnect-all is treated as the loaded gun it is
- An active-QSO guard that blocks control actions while a conversation is in progress, so no agent ever drops a contact mid-sentence
- Weekly schedules, DTMF macros, and a screen-reader mode in the panel

## Limitations

This targets ASL3 with Asterisk 22 on a Raspberry Pi class machine. It is built for the local network: keys and rate limits are there, but it is not hardened for the public internet and should not be exposed to it. The panel is early, currently in the 0.6.x range.

## Status and next

All three pieces are active and in regular use on my own node. The MCP server replaced an earlier bespoke agent skill, which is now archived; standards beat one-off integrations.

## Links

- [asl3-api](https://github.com/KJ5IRQ/asl3-api): the REST service
- [asl3-mcp](https://github.com/KJ5IRQ/asl3-mcp): the MCP server
- [asl-node-panel](https://github.com/KJ5IRQ/asl-node-panel): the Chrome side panel
