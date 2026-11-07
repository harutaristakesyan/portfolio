---
title: B2B SaaS platform on serverless AWS
summary: An enterprise SaaS built and operated end to end on Lambda, Aurora Serverless and Cognito, in a domain-first TypeScript monorepo deployed with SST.
role: Engineering lead
period: 2025 — 2026
duration: 14 months
stack: [TypeScript, AWS Lambda, Aurora Serverless v2, Cognito, S3, SES, SST, React]
order: 2
diagram:
  caption: Request path and tenancy
  nodes:
    - { id: web, label: React app, sub: S3 + CloudFront, col: 0, row: 0 }
    - { id: cognito, label: Cognito, sub: org-scoped JWT, col: 1, row: 1 }
    - { id: api, label: API Gateway, sub: JWT authoriser, col: 1, row: 0 }
    - { id: handlers, label: Lambda, sub: one per route, col: 2, row: 0, kind: key }
    - { id: core, label: core package, sub: rules, no AWS, col: 2, row: 1, kind: key }
    - { id: aurora, label: Aurora, sub: serverless v2, col: 3, row: 0 }
    - { id: s3, label: S3, sub: tenant files, col: 3, row: 1 }
    - { id: ses, label: SES, sub: transactional, col: 4, row: 0, kind: ext }
  edges:
    - { from: web, to: api }
    - { from: web, to: cognito, label: sign-in, kind: dashed }
    - { from: cognito, to: api, kind: dashed }
    - { from: api, to: handlers, kind: key }
    - { from: handlers, to: core, kind: key }
    - { from: handlers, to: aurora }
    - { from: handlers, to: s3 }
    - { from: handlers, to: ses }
---

## Problem

A B2B product for enterprise customers needed to go from idea to a system real companies could sign up to, with a small distributed team and no dedicated operations people. The cost of running it had to stay near zero while nobody was using it, and the codebase had to stay readable as the team changed.

## What I built

- Serverless architecture on AWS: Lambda behind API Gateway, Aurora Serverless v2 for relational data, Cognito for authentication, S3 for files, SES for transactional mail.
- A domain-first TypeScript monorepo: contracts, core rules and handlers as separate packages, so business logic is tested without AWS in the loop.
- Infrastructure with SST, so every environment is reproducible from the repository and a new developer deploys a personal copy in one command.
- Release workflow, issue tracking and review practice for the team, with me accountable for delivery.

## Failure modes handled

- **Tenant isolation.** Every query is scoped by the organisation claim in the token at the data layer, not in each handler; a missing scope fails closed.
- **Cold starts on a quiet system.** Handlers are small and share one bundle; Aurora's minimum capacity is set so the first request of the day is slow, not failed.
- **Partial writes.** Multi-table operations run in one transaction; file uploads commit their metadata only after S3 confirms.
- **Mail bounces.** SES bounce notifications mark the address and stop further sends instead of retrying into a wall.

## Decisions

- **Serverless over containers.** Usage was spiky and the team had no one to babysit a cluster. The trade was accepting cold starts and designing around them.
- **SST over hand-written CloudFormation.** Faster iteration for a product still finding its shape; the cost was a framework dependency, taken knowingly.
- **No microservices.** One deployable with clear package boundaries. Splitting would have added network hops and deploy coordination for a small team.
