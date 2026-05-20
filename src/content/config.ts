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
  }),
});

export const collections = { posts };
