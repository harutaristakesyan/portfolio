import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const node = z.object({
  id: z.string(),
  label: z.string().max(18),
  sub: z.string().max(22).optional(),
  col: z.number().int().min(0),
  row: z.number().int().min(0),
  kind: z.enum(["ext", "key"]).optional(),
});
const edge = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().max(12).optional(),
  kind: z.enum(["key", "dashed"]).optional(),
});

/** Case studies without client or product names: what was built and which problem it solved. */
const work = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(220),
    role: z.string(),
    period: z.string(),
    duration: z.string(),
    stack: z.array(z.string()).min(1),
    /** Lower comes first on the home page. */
    order: z.number().int(),
    diagram: z.object({ caption: z.string(), nodes: z.array(node).min(2), edges: z.array(edge) }),
  }),
});

export const collections = { work };
