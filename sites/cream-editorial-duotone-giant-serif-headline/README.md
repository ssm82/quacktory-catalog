# QUACKTORY. — editorial mood-board demo

Static HTML/CSS/JS demo built from the crit at `output/crits/pinterest-53198839343569034.md`. No frameworks, no build step.

## Open

```bash
python3 -m http.server 8092 --directory output/sites/site-pinterest-53198839343569034
# then open http://localhost:8092/
```

Or just double-click `index.html` — everything is plain HTML/CSS/JS with Google Fonts loaded from CDN.

## What's here

- **Hero** — Pattern A duotone hybrid: centered uppercase giant serif headline on dark canvas, crit's `VISUAL CONCEPT DEVELOPMENT` translated to `QUACKTORY. / size matters.`
- **Mood-board 3×3 grid** — crit's centerpiece. 5 product SKUs + a `( CASE )` case card + a manifesto text card + an inverted statement card + the hero scene shot. Each cell uses crit's in-image headline overlay technique.
- **Size-ladder timeline** — crit's bottom timeline rail translated: 5 rail-nodes from `MICRO` (`4 cm`) → `ARCHITECT` (`3 m`), vertical edge labels, gradient track. Click any node to scroll to the matching card.
- **Modal** — accent-bar + SKU eyebrow + size + title + description + actions (translates crit's modal pattern).
- **Caption strip** — crit's full-width bottom strip, with brand · series · city on the left, "QUACK" repeat in the middle, contact email on the right.
- **Recurring motifs** — sparkle glyph `✦` pulses on text + statement cards; downward-arrow graphic on every product card mirrors the crit's card #2 device.

## Watch-outs addressed (from the crit)

- **No nav / CTA gap** — fixed pill nav top with 4 items including a primary CTA, plus an explicit "Order the collection" CTA in the story band and the modal.
- **Headline-over-photo contrast** — product overlays use a top-transparent → bottom-dark gradient so the headline always reads on white-backed product shots.
- **Tertiary legibility** — body copy in `--ink` (`#8C8A82`) is used only for genuinely secondary text; primary copy is always `--fg` (`#F2EFE8`).
- **Duplicated "sep 2025" issue** — the size-ladder's edge labels `4 CM` / `3 M` are visually distinct (corner placement vs. inline labels) so they don't read as a duplication.

## Files

```
output/sites/site-pinterest-53198839343569034/
├── index.html
├── styles.css
├── main.js
├── README.md
├── assets-spec.json         # MiniMax image-generation spec
└── assets/
    ├── hero-lifestyle.jpg    # 16:9 lifestyle
    ├── product-micro.jpg     # 4 cm keychain
    ├── product-classic.jpg   # 15 cm workhorse
    ├── product-designer.jpg  # 20 cm speckled collab
    ├── product-mega.jpg      # 50 cm glossy
    └── product-architect.jpg # 1.5–3 m monumental
```
