---
title: "WxBot"
summary: "A Discord weather bot for my corner of Texas, fed by the National Weather Service."
whyItMatters: "Texas weather changes its mind a lot. Now it announces itself where people already are."
status: "active"
cluster: "utilities"
updated: 2026-04-21
publish: true
privacyReviewed: true
repo: "https://github.com/KJ5IRQ/WxBot_76067"
stack: ["Python", "Discord", "NWS API"]
featured: true
caseStudy: true
order: 3
---

## What this is

A small Discord bot that answers weather questions with real National Weather Service data. Slash commands return current conditions and the next six forecast periods, and each user can save a home location once and never type it again.

## Why I built it

The people I wanted to keep informed are already on Discord. Instead of everyone checking an app, the weather comes to the channel, from the same NWS data the apps use, without ads or an account.

## How it works

Commands like `/wxnow` and `/wxforecast` hit the NWS public API. Setting a home location geocodes a place name through OpenStreetMap, finds the nearest NWS observation station, and stores the result per user. Responses are cached for a few minutes so the bot stays polite to the free APIs that feed it.

## Limitations

Discord only, United States only (it is NWS data), and it reports rather than alarms: it answers when asked instead of pushing warnings. Watch-and-warning push alerts are the obvious next step.

## Status and next

Running. Next: proactive severe weather alerts for saved locations.

## Links

- [WxBot on GitHub](https://github.com/KJ5IRQ/WxBot_76067)
