---
title: "hermes-kb"
summary: "200 pages of Hermes Agent docs in one SQLite file. Searchable offline."
whyItMatters: "Agents shouldn't need the internet to read their own manual."
status: "stable"
cluster: "ai-tooling"
updated: 2026-05-28
publish: true
privacyReviewed: true
repo: "https://github.com/KJ5IRQ/hermes-kb"
stack: ["Python", "SQLite FTS5"]
featured: true
caseStudy: true
order: 2
---

## What this is

A local, offline knowledge base for the Hermes Agent documentation: about 200 pages crawled once, stored in a single SQLite database with FTS5 full-text search. Querying it needs no dependencies and no network. One file, instant answers.

## Why I built it

Agent documentation lives on the web, which is exactly where you don't want a local agent reaching every time it forgets a setup detail. Crawl once, search forever. The database travels with the bot.

## How it works

A build script crawls the docs and writes them into SQLite with an FTS5 index. A small query interface searches it from the command line or from code, and a `format_for_llm()` helper returns results shaped for dropping straight into a model's context. Rebuilding after a docs update is one script; only the rebuild step needs network access.

## What it can do

- Full-text search across the entire documentation set, offline
- Zero dependencies at query time; the `.db` file is the whole distribution
- One function call to feed clean, formatted results to any bot or script

## Limitations

It knows exactly what was crawled and nothing newer; freshness is a manual rebuild away. Search is lexical FTS5, not embeddings, which turns out to be plenty for documentation lookups and keeps the whole thing dependency-free.

## Status and next

Stable and in regular use. It feeds a private agent setup I run at home; that part is not published.

## Links

- [hermes-kb on GitHub](https://github.com/KJ5IRQ/hermes-kb)
