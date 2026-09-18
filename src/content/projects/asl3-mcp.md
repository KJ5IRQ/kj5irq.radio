---
title: "ASL3-MCP"
summary: "Typed tools that let an AI agent run my AllStarLink node without shelling into it."
whyItMatters: "An agent should not need SSH to key a radio."
status: "active"
cluster: "radio"
updated: 2026-06-04
publish: true
privacyReviewed: true
repo: "https://github.com/KJ5IRQ/asl3-mcp"
stack: ["Python", "MCP", "FastAPI"]
image:
  src: "/images/asl-panel-screenshot.png"
  alt: "The ASL Node Panel: live node status, connected nodes, and one-tap controls."
  width: 460
  height: 948
order: 1
---

## What this is

A Model Context Protocol server that wraps my asl3-api and exposes an AllStarLink node as typed
tools. An agent can read node state, look up a callsign, send a voice announcement, or connect and
disconnect nodes, and it never holds Asterisk credentials or shell access to do any of it.

The tools are split by risk tier. Read-only checks are free. Voice announcements are low risk.
Connect and disconnect require an explicit confirmation flag, and disconnect-all is treated as the
loaded gun it is. An active-QSO guard blocks control actions while a conversation is in progress,
so no agent drops a contact mid-sentence.

## Why MCP instead of a skill

I wrote a bespoke agent skill first. It worked, and it only ever worked for me. Model Context
Protocol is a standard, so any client that speaks it can drive the node: the agents I run now, and
whatever I move to later. Standards beat one-off integrations.

## Links

- [asl3-mcp on GitHub](https://github.com/KJ5IRQ/asl3-mcp)
- [The full toolchain write-up](/projects/allstar-toolchain/)
