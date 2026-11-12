# Quacktory — Tactile Earth Edition

A static demo site for the Quacktory rubber-duck brand, built from a
Pinterest mood-board crit. The crit was a Russian/English brand case
study for "SHE" — a tactile, earthy mood board in olive / rust / cream
with a twig as connective tissue and a fingerprint-arch logo mark.
This site keeps that structure: a three-band case study with a real
RU / EN parallel layout, no navigation, and a single typographic
gesture per band.

## Design direction

- **Palette** — Deep forest olive `#2C331B`, rust/terracotta `#8A3710`,
  warm cream `#E8DDC8`, deep walnut `#3E331C`, dry bark `#624638`.
- **Typography** — Cormorant Garamond only: light display caps for the
  wordmark and section titles, the same serif for body copy, tracked
  small caps for eyebrows, hex labels and keyword lines.
- **Pattern** — Pattern A (duotone giant wordmark) over a fingerprint-arch
  logo composition, with a diagonal twig SVG bridging the olive band into
  the rust band.
- **Structure** — 55 / 30 / 15 band composition: olive bilingual case
  study, rust logo band, palette + texture strip.

## Run it

Open `index.html` directly, or:

```bash
python3 -m http.server 8093 --directory output/sites/site-pinterest-53198839343569054
# then visit http://localhost:8093
```

## Files

- `index.html` — three bands, bilingual RU/EN content, no nav.
- `styles.css` — design tokens in `:root`, no preprocessor.
- `main.js` — smooth-scroll polyfill for older browsers.
- `assets/` — six product/hero images, generated via the project's
  MiniMax image-generation helper.
- `assets-spec.json` — the prompt set used to generate the assets.

## Watch-outs addressed

- All hex codes in the palette band match their swatches.
- Body copy on the rust band uses the higher-contrast cream
  `--ink-soft` at a larger display size to clear the legibility
  threshold.
- Section subheads (`ДЛЯ КОГО? / FOR WHOM?`, `ЗАДАЧА / TASK`) use
  a rule line + bolder weight + tighter tracking to read as headings,
  not body copy.
- The wordmark is sized with `min(220px, 12.5vw)` so the final letter is
  never sliced at 1440px.
