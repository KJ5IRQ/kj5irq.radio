import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The schema is the privacy gate. publish and privacyReviewed must be
// literally true or the build fails. Unknown fields are rejected so
// vault-side metadata can never leak through by accident.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string().max(140),
      whyItMatters: z.string().max(120),
      status: z.enum(['active', 'stable', 'experimental', 'archived']),
      cluster: z.enum(['radio', 'ai-tooling', 'homelab', 'utilities', 'business-systems']),
      started: z.coerce.date().optional(),
      updated: z.coerce.date(),
      publish: z.literal(true),
      privacyReviewed: z.literal(true),
      repo: z.string().url().optional(),
      links: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
      // A screenshot or photograph that runs alongside the entry on index pages.
      // Width and height are required so the browser can reserve the space and
      // the entry does not jump when the image lands.
      image: z
        .object({
          src: z.string(),
          alt: z.string(),
          width: z.number(),
          height: z.number(),
        })
        .optional(),
      stack: z.array(z.string()).max(5).optional(),
      featured: z.boolean().default(false),
      caseStudy: z.boolean().default(false),
      order: z.number().default(99),
    })
    .strict(),
});

// Writing and notes, per docs/website-redesign/06_content_model.md sections 3
// and 4, and gated by the doc 09 publication rules.
//
// Same fail-closed shape as projects: publish and privacyReviewed must be
// literally true or the build fails, and unknown fields are rejected. That
// matters more here than for projects, because the doc 09 sync script is
// meant to copy notes out of the private vault: an allowlist that rejects
// everything it does not recognise is what stops vault-side metadata (state,
// private tags, aliases) reaching the repo by accident.
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z
    .object({
      title: z.string(),
      // The index one-liner and the meta description. Longer than a project
      // summary because a piece of writing needs a real sentence, not a label.
      summary: z.string().max(200),
      date: z.coerce.date(),
      // Satire is labeled as satire on the page, so a future reader and a
      // quote-miner both know what they are holding.
      kind: z.enum(['essay', 'note', 'analysis', 'satire', 'fiction']),
      publish: z.literal(true),
      privacyReviewed: z.literal(true),
      updated: z.coerce.date().optional(),
      series: z.string().optional(),
      topics: z.array(z.string()).optional(),
      // Set only by the vault sync path, so a vault note is never mistaken for
      // something written directly for the site.
      source: z.literal('vault').optional(),
      image: z
        .object({
          src: z.string(),
          alt: z.string(),
          width: z.number(),
          height: z.number(),
        })
        .optional(),
    })
    .strict(),
});

export const collections = { projects, writing };
