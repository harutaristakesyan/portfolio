---

title: IPTV streaming platform
summary: Streaming platform with web and mobile clients, subscription management and crypto payments, on a Java backend built for sustained load.
role: Lead engineer
period: Feb 2023 — Feb 2024
stack: [Micronaut, Java, React, React Native, Node.js, Astro, MongoDB, PostgreSQL]
order: 4
---

## Problem

A streaming service needed a platform that could serve live and on-demand content to web and mobile clients, manage subscriptions, and accept payments in cryptocurrency, where confirmations arrive late and sometimes twice.

## What I built

- Java backend on Micronaut with MongoDB and PostgreSQL: catalogue, playback sessions, subscriptions and entitlement checks.
- Web client in React, a marketing site in Astro, and a mobile client in React Native sharing the same API.
- Subscription lifecycle with crypto payment confirmation handled asynchronously, so a late or duplicate confirmation extends the subscription exactly once.
- Node.js services for the pieces that fit better there, such as media-related tooling.

## Outcome

Web and mobile clients shipped on one backend, and the payment path held up under the messy reality of crypto confirmations. This is the project where I settled on treating every external callback as untrusted and repeatable by default.
