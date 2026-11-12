# Ducks. — Quacktory Quarterly, Issue 04

A static demo site for the Quacktory size ladder, translated from the
editorial magazine-cover direction in
`output/crits/pinterest-53198839343569143.md`.

## Direction

Editorial / print-cover aesthetic. Warm cream paper + deep teal color
field + ink dark accent. Heavy display sans wordmark set huge across
the width, with tiny mono-caps metadata inset as captions inside the
type. Vertical barcode and corner ornaments evoke a vintage print
masthead. The size ladder becomes a bottom timeline rail with
rotated edge labels (`4 cm` / `3 m`).

## Open it

```bash
python3 -m http.server 8095 --directory output/sites/site-pinterest-53198839343569143
```

Then visit `http://localhost:8095/`.

## Files

- `index.html` — semantic structure: cover, size ladder, collection,
  colophon, footer
- `styles.css` — design tokens in `:root`, magazine-cover composition,
  per-product finish treatments, modal specimen card
- `main.js` — scroll reveal, modal open/close (click + Escape),
  collection counter, subtle scroll-driven parallax on the cover photo
- `assets/` — six generated JPGs (hero + five product shots)
- `assets-spec.json` — the prompts used to generate the assets
- `design-tokens.json` — palette, type, rhythm, hero pattern, watch-outs

## Design tokens (from the crit)

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#E7E2D2` | Cream paper field |
| `--fg` | `#2C7F86` | Deep teal color block |
| `--ink` | `#1F1812` | Ink dark accent (metadata, footer) |
| `--blush` | `#F0DDD0` | Classic duck finish |
| `--ivory` | `#F4ECD8` | Micro + Designer base |
| Display | Archivo Black · 900 | "ducks." wordmark, headlines |
| Body | Inter · 400 / 700 | paragraph copy |
| Mono | JetBrains Mono | tracked-caps metadata |

## Watch-outs addressed

- Crit had type-and-block close in value — type is set in cream-white
  on teal (high contrast), inset metadata uses ink for separation.
- Cropping at frame edge is preserved as a *design choice* on the
  hero (Mega-style duck bleeds off the bottom), but the size-ladder
  rail ducks are fully contained.
- The vertical barcode carries a real catalog string (`QQ·04·26`).
- Corner ornaments are minimal editorial lines, not kitsch glyphs.

## Credits

Generated via the `static-awwwards-site` skill. Product photography
synthesized via the MiniMax image-generation API.
