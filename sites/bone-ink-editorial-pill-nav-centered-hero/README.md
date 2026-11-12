# Quacktory · Case Study 06 — The Size Ladder

A static editorial demo for **Quacktory**, a fictional rubber-duck collective, derived
from the design crit at `output/crits/pinterest-53198839343857598.md` (a Nike Run+
iOS editorial case study).

## Direction

Editorial case study. Light neutral canvas (`#E5E5E5`), near-black ink, heavy display
sans (Archivo Black) at 900 weight, all-caps body copy. A single horizontal pill
hero card with overlaid "spec" cards. A bottom timeline rail translates the source
crit's year timeline into the brand's size ladder (4 cm → 3 m). One oversized type
moment at a time — the display headline and the CTA are intentionally *not* the
same weight, addressing the source crit's watch-out.

## How to open

```bash
python3 -m http.server 8099 --directory output/sites/site-pinterest-53198839343857598
# then visit http://localhost:8099/
```

Or just open `index.html` in a browser. No build step, no `node_modules`.

## Interactivity

- **Tab control** — switches between EDITION and SIZE GUIDE copy.
- **Modal** — click any duck on the size ladder to open a modal with size / title /
  description / price. Closes via ×, overlay click, or Escape.
- **Hover lifts** — nodes lift and grow a thin black under-bar; the bottom rail
  fills proportionally to the hovered position.
- **Scroll fade-in** — every section fades up as it enters the viewport.

## Assets

Six generated product images (16:9 hero + 5 × 1:1 SKUs) live in `./assets/`. Each
shares identical silhouette and camera angle; finish and colorway vary by SKU
(charcoal, ivory bone, glossy graphite + brass, warm taupe, pale concrete).
