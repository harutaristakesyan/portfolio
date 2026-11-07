---

title: B2B SaaS platform on serverless AWS
summary: An enterprise SaaS built and operated end to end on Lambda, Aurora Serverless and Cognito, in a domain-first TypeScript monorepo deployed with SST.
role: Engineering lead
period: 2025 — 2026
stack: [TypeScript, AWS Lambda, Aurora Serverless v2, Cognito, S3, SES, SST, React]
order: 2
---

## Problem

A B2B product for enterprise customers needed to go from idea to a system real companies could sign up to, with a small distributed team and no dedicated operations people. The cost of running it had to stay close to zero while nobody was using it, and the codebase had to stay readable as the team changed.

## What I built

- Serverless architecture on AWS: Lambda behind API Gateway, Aurora Serverless v2 for relational data, Cognito for authentication, S3 for files, SES for transactional mail.
- A domain-first TypeScript monorepo: contracts, core logic and handlers as separate packages, so business rules are tested without AWS in the loop.
- Infrastructure with SST, so every environment is reproducible from the repository and a new developer deploys their own copy in one command.
- Release workflow, issue tracking and review practices for the team, with me as the single point of accountability for delivery.

## Outcome

The platform ran in production with usage-based cost and no servers to patch. Architecture, delivery process and team practices were mine to own, which is the setup I prefer: one person answers for the whole thing.
