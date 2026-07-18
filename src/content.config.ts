import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(['diary', 'paper-review', 'project']),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content/about' }),
  schema: z.object({
    name: z.string().default(''),
    role: z.string(),
    affiliation: z.string(),
    email: z.string(),
    github: z.string(),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: 'home.md', base: './src/content/home' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
  }),
});

export const collections = { posts, about, home };
