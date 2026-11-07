---

paths:

- "apps/web/**"

---

# Website (apps/web)

- Static Astro, `build.format: "file"`, no trailing slashes. Pages are `.astro`, content is Markdown
  under `src/content/work` validated by `src/content.config.ts`; everything else the site says lives
  in `src/data/site.ts`. Change text there, not in components.
- No client framework, no inline `<script>` or `style=""`, no third-party scripts: the edge CSP is
  `script-src 'self'; style-src 'self'`. Interactive behaviour goes into a component `<script>`
  block, which Astro emits as an external module.
- Styling is plain CSS in `src/styles/global.css` with the existing tokens; no Tailwind.
- The contact form posts JSON to `/api/contact`; field names are a contract with
  `apps/api/src/functions/contact/schema.ts`. In `astro dev` the request is answered by `dev/contact-mock.ts`.
- After changes: `pnpm --filter @portfolio/web typecheck`, `pnpm build`, `pnpm --filter @portfolio/web test`
  (the test runs against `dist` and fails on leaked client names; extend its list for new cases).
- Replace `public/resume.pdf` only when Harut hands over a new CV; `node scripts/og.mjs` regenerates
  `public/og.png` after changing the headline.
