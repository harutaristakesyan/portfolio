---
title: Booking-to-benefits integration with Stripe billing
summary: Bookings from two property-management systems become guest passes and are billed through Stripe, with changes and cancellations flowing through correctly.
role: Integration engineer
period: "2026"
duration: ongoing, from Oct 2026
stack: [TypeScript, AWS Lambda, API Gateway, SQS, AWS CDK, Stripe, Zod]
order: 1
diagram:
  caption: Booking events → passes → billing
  nodes:
    - { id: pms1, label: PMS A, sub: webhooks, col: 0, row: 0, kind: ext }
    - { id: pms2, label: PMS B, sub: webhooks, col: 0, row: 1, kind: ext }
    - { id: api, label: API Gateway, sub: signature check, col: 1, row: 0 }
    - { id: ingest, label: Ingest λ, sub: normalise + Zod, col: 2, row: 0, kind: key }
    - { id: queue, label: SQS, sub: booking events, col: 3, row: 0 }
    - { id: dlq, label: DLQ, sub: replay path, col: 3, row: 1 }
    - { id: worker, label: Worker λ, sub: idempotent apply, col: 4, row: 0, kind: key }
    - { id: db, label: Postgres, sub: bookings · passes, col: 5, row: 0 }
    - { id: stripe, label: Stripe, sub: invoices, col: 5, row: 1, kind: ext }
  edges:
    - { from: pms1, to: api }
    - { from: pms2, to: api }
    - { from: api, to: ingest }
    - { from: ingest, to: queue, kind: key }
    - { from: queue, to: dlq, label: 3 failures, kind: dashed }
    - { from: queue, to: worker, kind: key }
    - { from: worker, to: db }
    - { from: worker, to: stripe, label: per stay }
---

## Problem

A hospitality product issues benefits to guests for every confirmed stay and bills its partners per booking. Bookings come from two different property-management systems, each with its own webhook format, retry behaviour and idea of what a "change" is. A booking can arrive twice, be modified after the pass was issued, or be cancelled after it was billed.

## What I built

- An ingestion layer on Lambda behind API Gateway that verifies each partner's signature and normalises both formats into one booking event, validated with Zod at the edge.
- A queue between intake and processing, so a partner's retry storm never reaches the database or Stripe directly.
- Idempotent processing keyed on the partner's booking identity and event version: duplicates and replays never create a second pass or a second charge.
- Stripe invoicing driven by confirmed stays, with cancellations and date changes reconciled against what was already charged.
- Infrastructure as code with AWS CDK, deployed from CI into the client's AWS account.

## Failure modes handled

- **Duplicate webhook.** Same booking, same version: acknowledged, no write, no charge.
- **Out-of-order events.** A modification that arrives before the creation it modifies waits in the queue and is applied once its predecessor lands.
- **Cancellation after invoicing.** The invoice line is credited, the pass is revoked, and the partner statement shows both entries rather than a silent delete.
- **Partner API down.** Intake keeps accepting; processing retries with backoff; after three failures the event parks in the dead-letter queue with a one-command replay.
- **Schema drift.** A partner adds a field or changes a date format: Zod rejects it at the edge with a logged sample, nothing half-written reaches the database.

## Decisions

- **Queue, not direct processing.** Costs one extra hop; buys isolation from partner retries and a replay path that the client's team can run without me.
- **No scheduled reconciliation job in phase one.** The event log is the source of truth and every write is idempotent, so a replay of the log reconciles. A nightly job would have been a second implementation of the same rules.
- **Stripe invoices per stay, not metered billing.** Partners wanted a line they could read per booking; metered usage would have hidden that.
