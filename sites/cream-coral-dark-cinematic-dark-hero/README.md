# Quacktory — A Rubber Duck Cover

A static demo site that translates the Triple J *Like a Version* cover programme
into a Quacktory size-ladder release. The cover card carries three stacked
uppercase type lines (programme / title / artist); the five SKUs read as sides
A1–A5 of the same sleeve.

## Open

```bash
python3 -m http.server 8097 --directory output/sites/site-pinterest-53198839343569151
# then open http://localhost:8097/
```

## Files

- `index.html` — single-page structure: cover card, liner notes, size-ladder
  tracklist, CTA, modal sleeve notes, legal mark.
- `styles.css` — design tokens, grain field, cream-card chrome, ladder rows,
  modal, scroll-driven entrance.
- `main.js` — modal open/close, keyboard, IntersectionObserver entrance,
  smooth-scroll for in-page links.
- `assets/` — 6 generated images (1 hero + 5 product shots).
- `assets-spec.json` — generation spec for the 6 images.

## Direction

- Palette: dark variegated backdrop (moss/ink mass, burnt orange/rust, teal
  smudge) with a cream `#F2E8D6` card and near-black ink. Single-family
  uppercase type (Archivo).
- Type rhythm: three line sizes on the cover (largest title, mid programme,
  smallest artist). Rest of the page uses 11–14px tracked caps for chrome.
- Hero composition: full-bleed grain field with a centered cream card —
  Pattern A's centred-display move, but with the card itself as the focus.
- Interactivity: click any ladder row to open the sleeve-note modal. Escape,
  backdrop click, or the × button all close it.
- Watch-outs addressed: the cream card sits on a variegated backdrop whose
  warm orange is close in hue to the card, so every card carries a 1px warm
  border + soft drop shadow to keep the edge legible.
