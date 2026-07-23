import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/chapters' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    stage: z.number().int().min(0).max(4),
    order: z.number().int().min(0).max(10),
    summary: z.string(),
    updated: z.coerce.date(),
    verified: z.coerce.date(),
    verified_version: z.string(),
    estimated_reading_minutes: z.number().int().positive(),
    lesson_goal: z.string(),
    core_component: z.string(),
    sources: z.array(
      z.object({
        label: z.string(),
        url: z.string().url(),
      }),
    ).min(1),
    takeaways: z.array(z.string()).min(2).max(5),
  }),
});

export const collections = { chapters };
