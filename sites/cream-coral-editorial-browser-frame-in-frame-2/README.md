# Quacktory — Pinterest 53198839343857608 edition

An editorial presentation of the Quacktory size ladder. Built from the
critique of Pinterest pin `53198839343857608`: a near-black canvas,
centered cream catalog card, oversized wordmark cutting through the
hero, a single hot-orange kinetic accent, and a four-card asymmetric
grid.

## Files

- `index.html` — semantic sections: hero canvas, size ladder, footer
- `styles.css` — single file, all tokens in `:root`
- `main.js` — smooth-scroll fallback, IntersectionObserver reveal,
  SKU modal, timeline-rail active state
- `assets/` — six images: `hero-lifestyle.jpg` (16:9) plus five
  `product-*.jpg` (1:1) for the size ladder

## Design tokens (from the crit)

| Token | Value | Crit source |
|-------|-------|-------------|
| `--bg` | `#0a0a0a` | "near-black canvas" |
| `--card` | `#efeee8` | "warm off-white/cream mockup" |
| `--accent` | `#ff4d1f` | "single hot-orange kinetic accent" |
| `--font-display` | Italiana | serif headline ("Redefine / size stories") |
| `--font-wordmark` | Archivo Black | oversized "quacktory" wordmark |

## Hero pattern

Hybrid of Pattern A (oversized display wordmark) + Pattern E
(cinematic dark, museum/object-focused) + the original mockup-on-
canvas concept from the crit: a centered cream card on a dark canvas,
with a four-line nav, asymmetric hero (copy + photo + side card), an
oversized wordmark cutting through the photo, an "About studio" block,
and a four-card asymmetric grid.

## Interactivity

- Click any SKU card → opens a modal with eyebrow, title, dimension,
  body, finish, price, lead time.
- Click any timeline node → opens the same modal for that size.
- Close the modal with the X, the overlay, or `Escape`.
- Scroll-reveal fades sections in as they enter the viewport.

## Open it

```bash
python3 -m http.server 8101 --directory output/sites/site-pinterest-53198839343857608
# → http://localhost:8101/
```

Or open `index.html` directly in a browser.
