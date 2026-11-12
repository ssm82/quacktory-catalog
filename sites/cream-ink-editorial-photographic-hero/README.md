# Quacktory · Botanical Atelier

A static demo site that translates the design language from
`output/crits/pinterest-53198839343569061.md` (botanical / forest-green landing
page) into a Quacktory product page: a hand-glazed rubber-duck collection,
Micro 4cm → Architect 1.5m, in olive / walnut / rust / tan / forest / cream.

## Run

```bash
python3 -m http.server 8082 --directory output/sites/site-pinterest-53198839343569061
# then open http://localhost:8082
```

## Files

- `index.html` — semantic sections: hero, feature strip, catalog grid, size
  timeline, footer, plus a size-detail modal.
- `styles.css` — design tokens (forest green + cream + terracotta + tan) and
  every section's layout / interaction styles.
- `main.js` — smooth-scroll fallback, IntersectionObserver fade-in for the
  feature strip, size-timeline node → modal, and catalog-card → matching node
  animation.
- `assets/` — six images generated via the MiniMax image-generation API:
  - `hero-lifestyle.jpg` (16:9) — mood shot
  - `product-micro.jpg`, `product-classic.jpg`, `product-designer.jpg`,
    `product-mega.jpg`, `product-architect.jpg` (1:1) — per-SKU product shots

## Brand notes

- Same duck silhouette across the six products, varying only in finish, color,
  and prop — per the skill's brand-consistency rules.
- The hero is an asymmetric 45/55 split with a tilted terracotta panel and
  inline-SVG leaves extending past the rectangle (echoes the leaf-collage
  standout in the source crit).
- Cards are color-coded the same way the crit's grid is — olive, walnut, rust,
  tan, forest, cream — without label overload.
