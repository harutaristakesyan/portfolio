---
title: E-commerce for tiles and porcelain stoneware
summary: A full online store built from scratch — catalogue, orders, admin, storefront and deployment — for a building-materials retailer.
role: Full-stack engineer
period: May 2023 — Oct 2023
duration: 6 months
stack: [Spring Boot, Java, React, Astro, MongoDB, Docker, NGINX, Portainer]
order: 5
diagram:
  caption: Storefront, admin and a single-server deployment
  nodes:
    - { id: store, label: Astro storefront, sub: static catalogue, col: 0, row: 0 }
    - { id: admin, label: React admin, sub: products · orders, col: 0, row: 1 }
    - { id: nginx, label: NGINX, sub: TLS · routing, col: 1, row: 0, kind: key }
    - { id: api, label: Spring Boot, sub: Docker, col: 2, row: 0, kind: key }
    - { id: mongo, label: MongoDB, sub: Docker volume, col: 3, row: 0 }
    - { id: images, label: Image service, sub: resize · cache, col: 3, row: 1 }
    - { id: portainer, label: Portainer, sub: client-run ops, col: 2, row: 1, kind: ext }
  edges:
    - { from: store, to: nginx }
    - { from: admin, to: nginx }
    - { from: nginx, to: api, kind: key }
    - { from: api, to: mongo, kind: key }
    - { from: api, to: images }
    - { from: portainer, to: api, label: ops, kind: dashed }
---

## Problem

A tile and porcelain-stoneware retailer sold from a catalogue and phone calls. They wanted an online store with a large product catalogue, variants by size and finish, orders, and an admin panel their staff could run, on a budget that ruled out a managed e-commerce platform.

## What I built

- Spring Boot backend with MongoDB for the catalogue, carts and orders, and an admin area for products, stock and order handling.
- Storefront in Astro for fast, indexable catalogue pages, with React where the UI is interactive.
- Image handling for a catalogue with many large product photos: resized variants generated once and cached.
- Deployment with Docker behind NGINX on a dedicated server, managed through Portainer, so the client's staff could restart and update services without a developer.

## Failure modes handled

- **Stock sold twice.** Order placement decrements stock in one atomic update with a precondition; the second buyer gets "out of stock", not a broken order.
- **Huge product photos.** Uploads are accepted at full size, served only as resized variants; a 12 MB photo never reaches a phone.
- **Server reboot.** Containers restart in order with health checks; the client learned to do it from Portainer during handover.
- **Search engines and a large catalogue.** The storefront is static per product, so thousands of pages index without a running app in the request path.

## Decisions

- **Single server, not cloud.** The budget and traffic fit one machine; Docker and Portainer gave the client operability without a platform bill.
- **Static storefront, dynamic admin.** Customers get speed and SEO; staff get a normal app. Two front-ends were cheaper than one that tried to be both.
- **MongoDB for variants.** Tile products vary by size, finish and batch in ways that fit documents better than a rigid schema at this scale.
