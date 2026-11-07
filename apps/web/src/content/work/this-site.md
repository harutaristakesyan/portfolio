---
title: This site
summary: Static Astro on a private S3 bucket behind CloudFront, one Lambda for the contact form, AWS CDK, GitHub Actions through an OIDC role. The code is public.
role: Everything
period: Nov 2026
duration: one weekend
stack: [Astro, TypeScript, S3, CloudFront, Lambda, API Gateway, AWS CDK, GitHub Actions]
order: 6
diagram:
  caption: harut.dev — request path and deploy path
  nodes:
    - { id: browser, label: Browser, col: 0, row: 0, kind: ext }
    - { id: cf, label: CloudFront, sub: CSP · HSTS · rewrites, col: 1, row: 0, kind: key }
    - { id: s3, label: S3, sub: private · OAC, col: 2, row: 0 }
    - { id: api, label: HTTP API, sub: 5 req/s, col: 2, row: 1 }
    - { id: lambda, label: contact λ, sub: Zod · honeypot, col: 3, row: 1, kind: key }
    - { id: resend, label: Resend, sub: email, col: 4, row: 1, kind: ext }
    - { id: gh, label: GitHub Actions, sub: OIDC role, col: 0, row: 2, kind: ext }
    - { id: cdk, label: CDK deploy, sub: one stack, col: 1, row: 2, kind: key }
  edges:
    - { from: browser, to: cf }
    - { from: cf, to: s3, label: pages, kind: key }
    - { from: cf, to: api, label: form POST }
    - { from: api, to: lambda, kind: key }
    - { from: lambda, to: resend }
    - { from: gh, to: cdk, kind: dashed }
    - { from: cdk, to: s3, kind: dashed }
---

## Why it is here

A portfolio claims things. This page is the one claim you can check: the repository is public at [github.com/harutaristakesyan/portfolio](https://github.com/harutaristakesyan/portfolio), the infrastructure is code, and the tests run on every push.

## What it is

- Astro, static output, no client framework. Plain CSS, two fonts, nothing inlined.
- A private S3 bucket behind CloudFront with origin access control. A CloudFront Function maps clean URLs to objects, redirects `www` and trailing slashes, and returns a real 404 for unknown paths.
- One Lambda behind an HTTP API for the contact form, reached through CloudFront on the same origin, so there is no CORS. Zod validation, a honeypot field, a throttled stage.
- A response headers policy: `script-src 'self'; style-src 'self'`, HSTS with preload, `frame-ancestors 'none'`.
- One CDK stack for all of it, plus a second stack that creates the deploy role GitHub Actions assumes via OIDC. No long-lived AWS keys anywhere.

## Failure modes handled

- **A bad deploy.** The workflow verifies (lint, typecheck, build, 20 tests) before it is allowed to deploy; the stack tests synthesise the template and assert the bucket is private and the API has one route.
- **Form spam.** The honeypot drops bots silently; the API stage is throttled so a flood costs cents, not a mailbox.
- **A leaked key.** There is none to leak: the Resend key lives in a GitHub environment secret and reaches only the Lambda environment.
- **Cache after a release.** Each deploy uploads the exact build it synthesised against and invalidates the distribution.

## Decisions

- **No framework on the client.** The page is text and one form; shipping React for that would be the opposite of the point.
- **Lambda for one form.** Three files and a test. A third-party form service would have been faster and would have put someone else's script on the page.
- **Public repository.** The site's job is to show how I work. The code is the clearest way to do that.
