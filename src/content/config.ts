import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/chapters' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    stage: z.number(),
    order: z.number(),
    summary: z.string(),
    updated: z.coerce.date(),
    estimated_reading_minutes: z.number().optional(),
    components: z.array(z.string()).optional(),
  }),
});

export const collections = { chapters };
