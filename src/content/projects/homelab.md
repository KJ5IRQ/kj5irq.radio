---
title: "The homelab"
summary: "A Proxmox box in a Texas closet running the boring, useful stuff."
whyItMatters: "Experiments break here instead of anywhere that matters."
status: "active"
cluster: "homelab"
updated: 2026-06-01
publish: true
privacyReviewed: true
stack: ["Proxmox", "Linux"]
featured: false
caseStudy: true
order: 4
---

## What this is

A small virtualization setup at home, built on Proxmox and Linux. It hosts the services behind the other projects on this site: the radio node tooling, the weather bot, home automation, and the local AI agents that tie things together.

## Why I built it

Two reasons. First, practice: running real infrastructure, even small infrastructure, teaches things that tutorials cannot, mostly through failure. Second, containment: I like to experiment, and the homelab is the blast radius. When something breaks at two in the morning, it breaks here.

## What it taught me

- Backups you have never restored are a mood, not a backup. Test the restore.
- Every service you add is a service you now operate. The fun is in the first week; the discipline is in month six.
- The same patterns that keep an ERP environment healthy at work apply at home: change one thing at a time, write down what you did, and monitor before you need to.

## Limitations

Deliberately undocumented in public. What runs here, how it is laid out, and how it is reached are not on the internet, on purpose. This page describes patterns, not inventory.

## Status and next

Active and quietly doing its job. The interesting work it hosts shows up as its own projects on this site when it is ready.
