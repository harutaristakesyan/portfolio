# Harut Aristakesyan · personal identity

The lowercase ha ligature shares the right shoulder of the h with the round bowl of the a. The
connected construction refers to Harut's work on backends and integrations. Open counters,
consistent stroke weight and rounded terminals complement the redesigned site's Manrope prose,
JetBrains Mono metadata and architecture drawings. It represents Harut as an individual engineer.

The palette comes from the engineering-notebook redesign: signal blue `#9fcbe0`, dark graphite
`#0e0f11`, bone `#ecebe6`, muted grey `#9a9b97` and line grey `#24262b`. The production mark is
geometric SVG, with no font, image or script dependencies. The header and footer pair it with
the live-text `harut.dev` name in JetBrains Mono.

## Source and exports

- Canonical vector: `apps/web/public/brand/monogram.svg`.
- White vector for dark surfaces: `apps/web/public/brand/monogram-inverse.svg`.
- Graphite vector for light surfaces: `apps/web/public/brand/monogram-ink.svg`.
- Transparent PNG: `apps/web/public/brand/monogram.png` (960 × 800).
- Domain lockup: `apps/web/public/brand/wordmark.png` (400 × 128, transparent).
- Browser icons: `favicon.svg`, ICO containing 16/32/48px images, and 16/32px PNGs.
- Home-screen icons: opaque 180px Apple and 192/512px Android PNGs. The OS applies its corner mask.
- Social preview: `apps/web/public/og.png` (1200 × 630), rendered with the bundled Manrope and
  JetBrains Mono fonts.

Edit the canonical SVG, then run from the repository root:

```sh
pnpm --filter @portfolio/web brand
```

The generated exports are repository assets; normal builds need no generation service. Keep the
mark's proportions, use the signal or white version on a dark background and the graphite
version on a light background. Leave at least one stem width of clear space around it. Keep the
domain beside the mark where space allows.

## Design exploration

Mode: built-in image generation for the visual exploration, followed by a manually constructed
production vector. The geometric SVG is the authoritative final asset, rather than a bitmap trace.
The selected image exploration is saved as `docs/brand/concept.png`. The previous angular HA
source remains available as `docs/brand/previous-monogram.svg`.

Prompt used:

> Use case: logo-brand. Asset: one original minimalist personal monogram logo for Harut Aristakesyan,
> independent backend engineer. New direction for a spacious warm-white portfolio with Manrope
> typography, dark graphite and quiet blue #245b72. Create a bespoke lowercase 'ha' ligature, highly
> refined geometric monoline lettering: tall upright ascender of lowercase h, a generous rounded h
> arch, lowercase a with a round open counter and a right upright. The arch of the h flows naturally
> into the circular a, connected with deliberate negative space, suggesting connected systems. Make
> it compact, near-square, distinctly legible as ha, approachable and precise. Uniform medium-bold
> strokes, softly rounded ends, balanced curved geometry. One single flat solid blue #245b72
> silhouette on fully transparent background. Show ONE isolated mark centered large. No uppercase
> HA, no sharp triangular A, no full name, no extra letters, no square container, no mockup, no
> shadows, no gradients, no ornament, no circuits, no code brackets, no arrows, no decorative dots.
> This is a personal engineer's signature, understated and durable at favicon size. Pure vector-style
> clean edges, no texture.

Production refinement: reconstruct the ligature with one arch, a circular bowl and two rounded
uprights. After synchronising the dark engineering-notebook redesign, apply its signal blue to
the mark and retain its `harut.dev` wordmark. Use dark-on-signal icons for contrast in both light
and dark browser chrome. The saved image exploration documents the earlier palette; the SVG
and generated exports carry the current production palette.
