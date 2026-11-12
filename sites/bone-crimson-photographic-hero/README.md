# Quacktory — All In Or Floating

A static demo inspired by the `lama-lama-2` crit: bold editorial
e-commerce for a fictional rubber-duck house brand, sized as a
5-step ladder from 4 cm to 1.5 m.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8080 --directory output/sites/site-awwwards_parser-lama-lama-2
# → http://localhost:8080
```

## Stack

Plain HTML + CSS + JS. No build step. No `package.json`.
Fonts: Archivo (display), Inter (body), JetBrains Mono (microtype)
loaded from Google Fonts CDN.

## Files

- `index.html` — semantic sections: hero, size ladder, designer spotlight,
  collection grid, manifesto.
- `styles.css` — all design tokens in `:root`; CSS-grid layout;
  reveal-on-scroll via `.reveal` class.
- `main.js` — live timer, modal, menu overlay, IntersectionObserver fade-in.
- `assets/` — 6 generated product / lifestyle images (MiniMax `image-01`).
- `assets-spec.json` — the prompt list used to generate the assets.

## Design direction

Translated from `output/crits/lama-lama-2.md`:

- **Palette** — deep crimson (`#B5001F`) on white type, deep navy
  pill chrome, lavender-white microcopy. Watch-out fix from the
  crit: a radial scrim under the headline so legibility no longer
  depends on the image.
- **Hero** — full-bleed Pattern C (image + scrim + centered title),
  hybridized with the floating pill nav.
- **Size ladder** — the crit's year-timeline pattern translated to a
  size timeline: 5 nodes (Micro → Architect) on a horizontal rail,
  edge labels `04 CM` / `3 M`, click to open the SKU modal.
- **Bracket motif** — `[ ... ]` carried across the tagline, footer
  microcopy, modal labels, and eyebrow headers.
- **Live timer** — actually live (reads real clock), so it isn't a
  liar element as the crit flagged.
- **Watch-outs addressed** — scrim added behind the headline; the
  hamburger menu opens an actual link overlay (visible wayfinding
  depth); the timer is real, not mocked.
