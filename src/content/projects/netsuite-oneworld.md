---
title: "NetSuite OneWorld"
summary: "Sole admin of a multi-subsidiary ERP I helped select, stood up, and still run."
whyItMatters: "The job is not clicking through Setup. It is making the system survive real users."
status: "active"
cluster: "business-systems"
started: 2022-10-01
updated: 2026-09-10
publish: true
privacyReviewed: true
stack: ["SuiteScript", "SuiteQL", "WMS", "MCP"]
featured: true
caseStudy: true
order: 1
---

## What this is

I run NetSuite OneWorld as the sole administrator for a multi-company rural ISP. I was in the room when the platform was chosen, I stood the modules up from nothing, and I still operate it.

## Scope

Multi-subsidiary OneWorld: warehouse, supply chain, fixed assets, intercompany, and consolidated reporting. I write SuiteScript 1.0 and 2.x, query with SuiteQL, design SuiteFlow, own roles and permissions, and treat sandbox-before-production as a hard rule.

I also run the integrations around it. AP automation, FP&A, transportation. When a vendor's work is wrong, I prove it from the records and take it to finance leadership.

The floor work is part of the job. I trained people who had never used an ERP and I still write the governance: least privilege, documented integrations, change communication that finance and warehouse can actually follow.

## The AI layer

Same habit as the radio node. I built an MCP server on NetSuite so a language model can run SuiteQL against live data and drive finance workflows. The model gets an interface. It does not get the keys.

## What I will not publish

This is a production ERP. There is no public repo. The public proof of the same pattern is [the AllStar toolchain](/work/allstar-toolchain/).
