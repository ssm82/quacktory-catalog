# Quacktory · Heritage Apothecary

A static demo site for the Quacktory house brand, in the **Heritage
Apothecary** direction — translated from the `EPOCH SAVOUR` perfumery
crit at `output/crits/pinterest-53198839343569038.md`.

## Direction

Ink + cream, oval cartouche, classical serif. A perfumer's cabinet of
five ducks, scaled 4 cm → 3 m. Two values only — forest green and
aged ivory.

## Open

```bash
python3 -m http.server 8081 --directory output/sites/site-pinterest-53198839343569038
# → http://localhost:8081/
```

Or just open `index.html` directly in a browser.

## Files

- `index.html` — six sections: hero, size timeline, cartouche, apothecary,
  collection, atelier.
- `styles.css` — design tokens, vitrine composition, modal.
- `main.js` — cartouche aura pulse, size-timeline modal, scroll fade-in.
- `assets/` — 6 MiniMax-generated images (1 hero + 5 SKUs).
- `assets-spec.json` — the prompt set used to generate the assets.
