import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.coerce.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    author: z.string(),
    id: z.number(),
    topic: z.string().optional(),
    redirect_from: z.array(z.string()).optional(),
    // Commit pins for external repositories this post embeds code from,
    // keyed by the repo key used in a code fence's repo="..." attribute.
    // Must be full 40-character SHAs; see remarkCodeRegion in astro.config.mjs.
    sources: z.record(z.string()).optional(),
  }),
});

const series = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
  }),
});

export const collections = { posts, series };
