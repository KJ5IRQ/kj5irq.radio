---
title: "NetSuite OneWorld"
summary: "A multi-subsidiary ERP I inherited, learned, and operate at scale."
whyItMatters: "The job is not clicking through Setup. It is making the system survive real users."
status: "active"
cluster: "business-systems"
updated: 2026-09-19
publish: true
privacyReviewed: true
stack: ["NetSuite", "WMS", "Fixed Asset Management", "AP automation"]
featured: true
caseStudy: true
order: 2
---

## What this is

I run NetSuite OneWorld for a multi-company organization. I did not choose the platform. I inherited it, learned it, and turned it into something the business could actually run at scale: configuration, scripts, integrations, and the people who have to live in it.

## Scope

Multi-subsidiary OneWorld covering warehouse, supply chain, fixed assets, intercompany, and consolidated reporting. Access governance is part of the job, and sandbox-before-production is a hard rule.

I run the integrations around it, including AP automation. When a vendor's work is wrong, I prove it from the records.

Training and governance are part of the same job. Least privilege, documented integrations, change communication that finance and warehouse can actually follow.

## The AI layer

I have been experimenting with governed, read-only AI access to NetSuite: tool-based interfaces that let a model query ERP data without ever being given write authority. Read-only against production and sandbox alike, and the model does not get the keys.

## What I will not publish

This is a production ERP. There is no public repo. The public proof of the same pattern is [the AllStar toolchain](/projects/allstar-toolchain/).
