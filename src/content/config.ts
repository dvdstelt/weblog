import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    author: z.string(),
    id: z.number(),
    redirect_from: z.array(z.string()).optional(),
  }),
});

export const collections = { posts };
