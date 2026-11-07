# Portfolio — instructions for agents and AI tools

Read README.md first. Current user instructions take precedence.

## What this is

Harut Aristakesyan's personal site. It supports his individual Upwork profile and job
applications, so it speaks as one engineer, not as a studio: no team, no "we", no Readymade
branding on the pages. The contact form and CV download are the only calls to action.

## Content rules

- Cases are named by what was built and which problem it solved. No client, product or employer
  names in case studies, no logos, links or identifying details. The built-output test enforces a
  banned-word list; extend it when a new case is added.
- Employer names are fine in Experience (they are on the CV). Keep the CV and the site saying the
  same dates and titles.
- Claim only what the CV and the actual projects support. No invented metrics, clients or results.
- Contact details on the site are allowed; proposals on Upwork must not carry them.

## Technical rules

- Static output only. No SSR adapter, no client framework, no analytics scripts without a decision.
- The edge CSP is `script-src 'self'; style-src 'self'`: keep `inlineStylesheets: "never"` and
  `assetsInlineLimit: 0` in `astro.config.ts`; never add inline `<script>` or `style=""`.
- URLs have no trailing slash and map to `.html` files (`build.format: "file"`). The CloudFront
  Function rejects paths that are not in the built output, so new pages need no infra change but
  removed pages should get a redirect added to the function if they were linked anywhere.
- One Lambda per route in `infra/lib/routes.ts`; construct ids are derived from the handler path
  and must not change. The handler reads config from the environment only.
- Secrets never go into source, CloudFormation outputs or logs. Mail goes through SES with the
  Lambda's IAM role, so the app has no API keys; keep it that way.
- Node 24 ARM64, us-east-1, pnpm. Run `pnpm check`, `pnpm typecheck`, `pnpm build`, `pnpm test`
  before pushing. Deploy only when asked; `master` deploys automatically.
