# Quacktory · Destination Pond

A static demo site for the Quacktory rubber-duck house brand, designed in the
language of the Pinterest `53198839343569105` crit — a surreal travel-commerce
mockup with a translucent pill-shaped destination card floating over a dreamy
sunset desert.

## Open it

```bash
python3 -m http.server 8094 --directory output/sites/site-pinterest-53198839343569105
```

Then open <http://localhost:8094>.

No build step, no frameworks. Plain HTML / CSS / vanilla JS.

## Design direction

- **Palette** — dusty lavender-pink (`#C8A8B8`) → warm peach-pink (`#E8B8A8`)
  → warm beige sand (`#D4B89C`), with a glowing pink orb (`#FFB8D8`) and a
  charcoal Apple-Pay-analog CTA (`#2C2C2E`).
- **Hero** — one screen: a full-bleed pastel desert gradient with a glowing pink
  orb in the lower right and a frosted stadium card holding a circular image
  window that bleeds through the card's top edge, a "destination · Pond ·
  4 cm — 3 m" metadata list, a dark `Pay` CTA, and a tongue-in-cheek
  "Quack, wade and ship." The `Pay` CTA opens the per-SKU manifest modal.
- **Chrome** — none, by design: the source capture has no nav, header or
  footer, so the page keeps the zero-navigation single-screen composition.

## Files

- `index.html` — page structure
- `styles.css` — design tokens in `:root`, full hero/modal styling
- `main.js` — modal open/close
- `assets/` — six generated product images (hero-lifestyle + 5 SKUs)
- `assets-spec.json` — generation prompts for the six images