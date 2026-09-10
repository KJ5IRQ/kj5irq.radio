---
title: "NetSuite OneWorld"
summary: "A multi-subsidiary ERP I helped select, stood up, and still run."
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

I run NetSuite OneWorld for a multi-company organization. I helped choose the platform, stood the modules up from nothing, and I still operate it: configuration, scripts, integrations, and the people who have to live in it.

## Scope

Multi-subsidiary OneWorld covering warehouse, supply chain, fixed assets, intercompany, and consolidated reporting. I write SuiteScript 1.0 and 2.x, query with SuiteQL, design SuiteFlow, own roles and permissions, and treat sandbox-before-production as a hard rule.

I also run the integrations around it: AP automation, FP&A, transportation. When a vendor's work is wrong, I prove it from the records.

Training and governance are part of the same job. Least privilege, documented integrations, change communication that finance and warehouse can actually follow.

## The AI layer

Same habit as the radio node. I built an MCP server in front of NetSuite so a language model can call typed tools instead of holding a login. Queries go through the service. Credentials stay behind it. The model does not get unsupervised write access and it does not get the keys.

## What I will not publish

This is a production ERP. There is no public repo. The public proof of the same pattern is [the AllStar toolchain](/work/allstar-toolchain/).
