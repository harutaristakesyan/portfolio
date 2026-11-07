---

title: Trucking operations platform
summary: Full-stack platform for a trucking company to manage loads, clients and operations in one place, with payments and SMS built in.
role: Full-stack engineer
period: Sep 2024 — May 2025
stack: [Next.js, Micronaut 4, MongoDB, Firebase Auth, Stripe, Twilio, GCP]
order: 3
---

## Problem

A trucking business ran its operations across spreadsheets and messaging apps. They needed one platform for loads, clients and dispatch, with payments and notifications, built on a backend that had fallen behind on its framework version and was slow on its main queries.

## What I built

- Responsive web app in Next.js with Firebase authentication and role-based screens for dispatchers, drivers and admins.
- Backend on Micronaut with MongoDB; upgraded the service from Micronaut 2 to 4 and rewrote the hot queries, which is where most of the perceived slowness lived.
- Stripe for the payment flow and Twilio for SMS notifications to drivers and clients.
- Deployment on GCP, working with the client's DevOps to tighten the cloud setup.

## Outcome

Operations moved from spreadsheets into the platform, and the backend upgrade removed a version that was about to lose support. The payment and messaging integrations were built with the same idempotency rules I use everywhere: a retried webhook never charges twice.
