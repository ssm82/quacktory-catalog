# Quacktory · Serenity

Static demo of a Quacktory rubber-duck brand page translated through the
`pinterest-53198839343569031` crit — a dark, warm spa / bathhouse direction.

**Design direction.** Deep warm-brown background, italic serif (Cormorant
Garamond) display paired with humanist sans (Inter) body. A single warm-tan
pill (`#C9A98C`) is the only CTA accent on the page. Hero is full-bleed
lifestyle photography with copy overlaid on the darker right third; circular
SKU tiles mirror the crit's service tiles; the 2×2 values grid and the
two-column journey section are direct translations of the crit structure.

**Crit watch-outs addressed:**
- Luminance bumped — body and value-card copy use full opacity, not 0.85.
- Two equal-weight CTAs in different styles (filled tan pill primary, ghost
  outline secondary) instead of identical buttons.
- Visible focus states on nav, nodes, CTA, and modal close.
- Service tiles don't truncate off-canvas — responsive grid breaks to 3-up
  then 2-up, the off-canvas "Service Five" tile becomes hidden on mobile.

**Files.**
- `index.html` — semantic single page.
- `styles.css` — design tokens in `:root`, Pattern C hero hybrid, tile row,
  values 2×2 grid, journey two-column, timeline rail, modal.
- `main.js` — smooth scroll fallback, IntersectionObserver fade-ins, modal
  open/close (button, overlay, Escape), tile click flashes the matching
  timeline node, ghost-pill share counter.

**Assets.** Six generated MiniMax images in `assets/`. The hero and the 5
SKUs share camera angle (front-facing slightly elevated 30°) and studio
light (soft diffused three-point) — only finish and colorway vary, keeping
the silhouette consistent across the set.

**Open it.**
```
python3 -m http.server 8091 --directory output/sites/site-pinterest-53198839343569031
```
Then visit `http://localhost:8091/`.
