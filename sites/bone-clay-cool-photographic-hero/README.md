# Quacktory — Duck Studies, FLUX-S028

A static editorial-cover demo for Quacktory's size ladder, inspired by the crit
at `output/crits/pinterest-53198839343857602.md` (a magazine-cover style poster
combining a portrait with overlaid metadata and a visible design grid).

## Open it

```bash
python3 -m http.server 8100 --directory output/sites/site-pinterest-53198839343857602
# then open http://localhost:8100/
```

Or just open `index.html` directly in a browser. No build step.

## Design direction

- **Palette:** muted blue-grey backdrop `#7B8B93`, white type, rust-orange accent `#B05A36`, warm paper `#EFEAE0`.
- **Type:** Playfair Display (display serif) + Inter (body) + JetBrains Mono (metadata caps).
- **Composition:** editorial cover — full-bleed hero photo with corner/edge metadata labels, a faint column grid that does *not* cross the subject, and a large serif headline in the lower half. Crit's "year timeline" is translated into a **size timeline** (Micro 4 cm → Architect 1.5 m). Crit's "modal with year/title/description" is translated into a **modal with size code/title/finish/notes**.
- **Watch-outs addressed:** the grid is carved away from the subject; the small glyph sits beside the subject, not over the mouth; type hierarchy is preserved (huge serif headline + tiny tracked-caps metadata) with strong contrast at all sizes; CTA is the timeline nodes, not an unclear caption.

## Files

- `index.html` — single page, semantic sections, modal markup.
- `styles.css` — design tokens in `:root`, hero, ladder rail, catalog grid, modal.
- `main.js` — modal open/close on ladder node click, IntersectionObserver reveal, ESC + overlay close, smooth-scroll fallback.
- `assets/` — 6 generated images (hero-lifestyle + product-micro/classic/designer/mega/architect).
- `assets-spec.json` — the prompts used to generate the images.
