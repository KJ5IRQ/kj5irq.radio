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
      stack: z.array(z.string()).max(5).optional(),
      featured: z.boolean().default(false),
      caseStudy: z.boolean().default(false),
      order: z.number().default(99),
    })
    .strict(),
});

export const collections = { projects };
