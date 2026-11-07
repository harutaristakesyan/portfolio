---

title: Booking-to-benefits integration with Stripe billing
summary: Bookings from two property-management systems become guest passes and are billed through Stripe, with changes and cancellations flowing through correctly.
role: Integration engineer
period: "2026"
stack: [TypeScript, AWS Lambda, API Gateway, AWS CDK, Stripe, Zod]
order: 1
---

## Problem

A hospitality product issues benefits to guests for every confirmed stay and bills its partners per booking. Bookings come from two different property-management systems, each with its own webhook format, retry behaviour and idea of what a "change" is. A booking can arrive twice, be modified after the pass was issued, or be cancelled after it was billed.

## What I built

- An ingestion layer on Lambda behind API Gateway that normalises both partners into one booking model, validated with Zod at the edge.
- Idempotent processing keyed on the partner's booking identity, so duplicates and replays never create a second pass or a second charge.
- Retries with a dead-letter queue and a replay path for the day an upstream API misbehaves.
- Stripe billing driven by confirmed stays, with cancellations and date changes reconciled against what was already charged.
- Infrastructure as code with AWS CDK, deployed from CI, with the client's AWS account and repositories owning everything.

## Outcome

The client's team runs the integration without me: every booking is traceable from the partner's webhook to the pass and the Stripe line, and failures land in a queue they can inspect and replay instead of in a support inbox.
