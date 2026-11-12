# Quackery Kitchen — `site-pinterest-53198839343569101`

A static demo of the **Quackery Kitchen** mobile app, built from the
crit at `output/crits/pinterest-53198839343569101.md` (the original mobile
food-app dish-detail screen). Translated into Quacktory's house brand: a
five-step size ladder of chef-coated rubber ducks, plated like a dish.

## Open it

```bash
python3 -m http.server 8083 --directory output/sites/site-pinterest-53198839343569101
# then open http://localhost:8083
```

Or just open `index.html` in a browser — no build step.

## What's inside

- **Hero** — A 420 × 800 phone-frame mockup of the Quacktory dish-detail
  screen on the warm peach-to-beige gradient. Cart badge, chef-hat chrome,
  full-bleed hero, "Classic · 15cm" title, meta row with clock glyph,
  description, price + heart, and a black "Add to Cart" CTA over a black
  bottom dock.
- **Side phone** — A phantom Micro SKU card offset to the left behind the
  main phone. Click it (or any ladder node) to swap the main hero.
- **Size ladder** — A five-node horizontal timeline at the bottom
  (Micro 4cm → Architect 1.5m), each with its own generated product
  photograph, edge labels (`amuse-bouche` / `centrepiece`).
- **Design notes** — A 6-card grid summarising Direction, Color,
  Typography, Hero, Interaction and Watch-Outs.
- **Atelier footer** — Editorial figure with the lifestyle hero shot.

## Interactivity

- Click the **cart icon** → badge increments.
- Click the **heart** → toggles filled/outline.
- Click the **side phone** or any **ladder node** → swaps the main hero
  image, title, meta, description and price.
- Click the **Add to Cart** → bumps the badge + a tiny press animation.
- Top nav anchors scroll to the ladder, notes and atelier sections.

## Generated assets

Six images live in `assets/`:

| File | Slot |
|---|---|
| `hero-lifestyle.jpg` | Lifestyle / scene (16:9) |
| `product-micro.jpg` | Micro · 4cm |
| `product-classic.jpg` | Classic · 15cm |
| `product-designer.jpg` | Designer · 20cm |
| `product-mega.jpg` | Mega · 50cm |
| `product-architect.jpg` | Architect · 1.5m |

They were generated via `python .kilo/skills/static-awwwards-site/scripts/generate-images.py`
from the spec at `assets-spec.json`.

## Tokens

```
--bg-top:    #E8B5A8   peach
--bg-bottom: #C8B59A   warm beige
--card:      #E8D5C0   card surface
--ink:       #0E0E0E   primary action / nav
--ink-soft:  #1A1A1A   body text
--tomato:    #C84030   accent (heart, current node)
--yolk:      #E89B3C   accent
--basil:     #5A8A3A   accent
--navy:      #2C3E50   accent (Architect SKU)
```

Fonts: **Inter** (UI) + **Fraunces** (display serif, italic for captions).
