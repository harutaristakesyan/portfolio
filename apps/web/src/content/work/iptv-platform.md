---
title: IPTV streaming platform
summary: Streaming platform with web and mobile clients, subscription management and crypto payments, on a Java backend built for sustained load.
role: Lead engineer
period: Feb 2023 — Feb 2024
duration: 12 months
stack: [Micronaut, Java, React, React Native, Node.js, Astro, MongoDB, PostgreSQL]
order: 4
diagram:
  caption: Clients, entitlements and crypto confirmations
  nodes:
    - { id: web, label: React web, col: 0, row: 0 }
    - { id: mobile, label: React Native, col: 0, row: 1 }
    - { id: api, label: Micronaut API, sub: catalogue · sessions, col: 1, row: 0, kind: key }
    - { id: cdn, label: Stream CDN, sub: signed URLs, col: 2, row: 0, kind: ext }
    - { id: pg, label: PostgreSQL, sub: subscriptions, col: 2, row: 1 }
    - { id: mongo, label: MongoDB, sub: catalogue, col: 2, row: 2 }
    - { id: pay, label: Crypto gateway, sub: callbacks, col: 0, row: 2, kind: ext }
    - { id: confirm, label: Confirm worker, sub: exactly-once, col: 1, row: 2, kind: key }
  edges:
    - { from: web, to: api }
    - { from: mobile, to: api }
    - { from: api, to: cdn, label: if entitled }
    - { from: api, to: pg, kind: key }
    - { from: api, to: mongo }
    - { from: pay, to: confirm, label: late or dup }
    - { from: confirm, to: pg, label: extend once, kind: key }
---

## Problem

A streaming service needed a platform that could serve live and on-demand content to web and mobile clients, manage subscriptions, and accept payments in cryptocurrency, where confirmations arrive late and sometimes twice.

## What I built

- Java backend on Micronaut with MongoDB and PostgreSQL: catalogue, playback sessions, subscriptions and entitlement checks.
- Web client in React, a marketing site in Astro, and a mobile client in React Native sharing the same API.
- Subscription lifecycle with crypto payment confirmation handled asynchronously, so a late or duplicate confirmation extends the subscription exactly once.
- Node.js services for the pieces that fit better there, such as media-related tooling.

## Failure modes handled

- **Duplicate confirmation.** The transaction hash is the idempotency key; the second callback finds the extension already applied.
- **Confirmation hours late.** The subscription shows "pending" with the transaction visible to the user, then flips to active without a support ticket.
- **Entitlement race.** Stream URLs are signed per session with a short TTL; a lapsed subscription stops working at the next segment, not at the next login.
- **Catalogue spikes.** Read-heavy catalogue data lives in MongoDB with cached responses; the relational store only sees subscription writes.

## Decisions

- **Two databases.** Subscriptions and payments are relational and need transactions; the catalogue is document-shaped and read-heavy. One store would have been wrong for one of them.
- **One API for three clients.** Web, mobile and the marketing site share endpoints; client-specific shaping happens in the client.
- **Treat every callback as untrusted and repeatable.** This project is where that became a default for everything I build.
