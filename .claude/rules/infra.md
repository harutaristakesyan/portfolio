---

paths:

- "infra/**"
- ".github/**"

---

# Infrastructure and delivery (infra, .github)

- One stack `portfolio` (`lib/site-stack.ts`) in us-east-1: private S3 bucket with origin access
  control, CloudFront with a viewer-request Function for clean URLs and 404s, a response headers
  policy with CSP and HSTS, an HTTP API with throttling, one Node 22 ARM64 Lambda per route from
  `lib/routes.ts`, optional ACM certificate and Route 53 records when `DOMAIN` is set.
- `portfolio-github-oidc` (`lib/github-oidc-stack.ts`) is deployed once by hand and trusts only
  this repository's `prod` environment. It assumes the CDK bootstrap roles; no long-lived keys.
- Construct ids derived from handler paths are frozen; renaming one recreates the route and fails.
- `pnpm --filter @portfolio/infra test` bundles the handlers and synthesises the stack against
  `test/fixtures/dist`; keep the tests green and extend them when adding behaviours, origins or
  headers. Synth proves the template, not AWS permissions or DNS.
- The workflow deploys on push to `master` only after verify passes. Secrets and variables live in
  the GitHub environment `prod` (`AWS_ACCOUNT_ID`, `DOMAIN` or `SITE_URL`, `CONTACT_TO`,
  `MAIL_FROM`, secret `RESEND_API_KEY`). Never add secrets to source, outputs or logs.
- Do not run `cdk deploy`, `cdk destroy` or `aws` commands without an explicit instruction.
