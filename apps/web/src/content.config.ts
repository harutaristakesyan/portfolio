import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/** Case studies without client or product names: what was built and which problem it solved. */
const work = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(220),
    role: z.string(),
    period: z.string(),
    stack: z.array(z.string()).min(1),
    /** Lower comes first on the home page. */
    order: z.number().int(),
  }),
});

export const collections = { work };
