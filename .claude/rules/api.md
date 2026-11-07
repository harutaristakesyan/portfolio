---

paths:

- "apps/api/**"

---

# API (apps/api)

- One file per HTTP route under `src/functions/<route>/<name>.ts`, exporting `handler` wrapped in
  `handle()` from `src/http.ts`. Register it in `infra/lib/routes.ts`; the bundle script and the
  stack read that list.
- Validate every body with a Zod schema from `src/contracts.ts`; respond with `ok()` only.
  Honeypot hits return `{ ok: true }` without side effects.
- Config comes from the environment (`CONTACT_TO`, `MAIL_FROM`, `RESEND_API_KEY`). Never read
  files, embed secrets or log request bodies.
- `MAIL_TRANSPORT=log` turns mail into a console line for tests and local runs; never set it in Lambda.
- Tests: `pnpm --filter @portfolio/api test` (Vitest, `sendMail` mocked). Add a test for each
  failure boundary: validation, honeypot, mail failure.
