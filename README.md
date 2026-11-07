# Harut Aristakesyan — personal site

Static Astro site on S3 + CloudFront, one Lambda behind API Gateway for the contact form,
everything in one AWS CDK stack and deployed from GitHub Actions through an OIDC role. Same
shape as readymade.works, cut down to what a one-page portfolio needs.

```
apps/web    Astro 5, static output, plain CSS, no client framework. Content in src/content/work.
apps/api    Lambda handlers, one file per route. POST /api/contact → Resend email.
infra       CDK: SiteStack (S3, CloudFront, HTTP API, Lambda, ACM, Route 53) + GithubOidcStack.
```

## Local

```sh
pnpm install
pnpm dev              # astro dev on :4321, /api/contact is mocked and logged to the console
pnpm build            # apps/web/dist + api typecheck
pnpm test             # web build checks, api unit tests, CDK stack tests
pnpm check            # biome
pnpm typecheck
```

Editing content: cases live in `apps/web/src/content/work/*.md` (frontmatter is validated by
`src/content.config.ts`), everything else the pages say is in `apps/web/src/data/site.ts`.
`node apps/web/scripts/og.mjs` regenerates the social image. Replace `apps/web/public/resume.pdf`
to update the CV download.

## Deploy

Every push to `master` runs verify (biome, typecheck, build, tests) and then `cdk deploy portfolio`
in the GitHub environment `prod`. Pull requests only run verify.

One-time setup, from a machine with AWS credentials for the account:

1. `cdk bootstrap aws://<account>/us-east-1` if this account has not been bootstrapped (readymade did).
2. `pnpm --filter @portfolio/infra deploy:oidc` — creates `portfolio-github-deploy-role`, trusted by
   this repository's `prod` environment in both `sub` forms GitHub can send (plain and with ids).
3. In GitHub → Settings → Environments → `prod`, set variables `AWS_ACCOUNT_ID`, `CONTACT_TO`,
   `MAIL_FROM`, optionally `GOOGLE_DKIM_PUBLIC_KEY` (harut.dev mail), and either `DOMAIN` (apex with a Route 53 hosted zone in the account) or `SITE_URL`
   (the CloudFront URL, once known); secret `RESEND_API_KEY`.
4. Push to `master`. The first deploy without `DOMAIN` prints `SiteUrl` (the CloudFront domain); set
   `SITE_URL` to it so canonical URLs and the sitemap are right, or set `DOMAIN` and redeploy.

Manual deploy, same inputs as environment variables: `pnpm build && pnpm deploy`.

## How requests flow

- CloudFront serves the bucket through origin access control; the bucket is private.
- A CloudFront Function maps `/work/x` → `/work/x.html`, redirects `/x/` → `/x` and `www.` → apex,
  sends unknown pages to `/404.html` with a 404, and lets only the declared API paths through.
- `/api/contact` is a separate CloudFront behaviour to the HTTP API (no caching, HTTPS only). The
  form posts same-origin, so the API needs no CORS. The stage is throttled to 5 req/s.
- Response headers policy: CSP (`script-src 'self'; style-src 'self'`, so Astro is configured not
  to inline anything), HSTS with preload, nosniff, `frame-ancestors 'none'`.
