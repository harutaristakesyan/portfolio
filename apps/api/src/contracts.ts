import { z } from "zod";

/** Contact form payload. Field names are a contract with apps/web/src/components/ContactForm.astro. */
export const ContactSubmit = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(5000),
  /** Honeypot: a filled value is acknowledged without sending anything. */
  website: z.string().optional(),
});
export type ContactSubmit = z.infer<typeof ContactSubmit>;
