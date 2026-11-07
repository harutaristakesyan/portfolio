---
title: Trucking operations platform
summary: Full-stack platform for a trucking company to manage loads, clients and operations in one place, with payments and SMS built in.
role: Full-stack engineer
period: Sep 2024 — May 2025
duration: 9 months
stack: [Next.js, Micronaut 4, MongoDB, Firebase Auth, Stripe, Twilio, GCP]
order: 3
diagram:
  caption: Loads, payments and notifications
  nodes:
    - { id: web, label: Next.js, sub: dispatch · driver UI, col: 0, row: 0 }
    - { id: auth, label: Firebase Auth, sub: roles in claims, col: 0, row: 1, kind: ext }
    - { id: api, label: Micronaut 4, sub: on GCP, col: 1, row: 0, kind: key }
    - { id: mongo, label: MongoDB, sub: loads · clients, col: 2, row: 0 }
    - { id: stripe, label: Stripe, sub: payments, col: 2, row: 1, kind: ext }
    - { id: twilio, label: Twilio, sub: SMS, col: 2, row: 2, kind: ext }
    - { id: hooks, label: Webhook λ, sub: idempotent, col: 3, row: 1, kind: key }
  edges:
    - { from: web, to: api }
    - { from: auth, to: api, label: id token, kind: dashed }
    - { from: api, to: mongo, kind: key }
    - { from: api, to: stripe, label: checkout }
    - { from: api, to: twilio, label: status SMS }
    - { from: stripe, to: hooks, label: events }
    - { from: hooks, to: mongo }
---

## Problem

A trucking business ran its operations across spreadsheets and messaging apps. They needed one platform for loads, clients and dispatch, with payments and notifications, built on a backend that had fallen behind on its framework version and was slow on its main queries.

## What I built

- Responsive web app in Next.js with Firebase authentication and role-based screens for dispatchers, drivers and admins.
- Backend on Micronaut with MongoDB; upgraded the service from Micronaut 2 to 4 and rewrote the hot queries, which is where most of the perceived slowness lived.
- Stripe for the payment flow and Twilio for SMS notifications to drivers and clients.
- Deployment on GCP, working with the client's DevOps to tighten the cloud setup.

## Failure modes handled

- **Stripe retries.** Every webhook event id is recorded before processing; a redelivery is acknowledged and skipped, so a retried payment never books twice.
- **SMS to a dead number.** Twilio delivery status is stored on the notification; dispatch sees "undelivered" instead of assuming the driver knows.
- **Slow list screens.** The load list query was rewritten with the right compound indexes and projection; the UI stopped timing out at the end of the month.
- **Framework upgrade.** Micronaut 2 → 4 done behind the existing integration tests, module by module, with the old version deployable until the last step.

## Decisions

- **Keep MongoDB.** The data was already there and the pain was query shape, not the database; a migration would have cost months for no user-visible gain.
- **Firebase Auth instead of rolling sessions.** The client's team already used it on mobile; one identity source for web and app.
- **Webhooks on a separate function.** Payment events must be accepted even when the main API is redeploying.
