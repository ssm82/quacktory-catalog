# Quacktory — site-pinterest-53198839343569311

A static demo site for the house rubber-duck brand Quacktory, with the editorial
design direction derived from the Pinterest crit
`output/crits/pinterest-53198839343569311.md` (warm amber palette, full-bleed
photo + headline bisected by an inset square, sculpted-stone accent, two-tier
typography in display serif + body sans).

## Run it

```bash
python3 -m http.server 8080 --directory output/sites/site-pinterest-53198839343569311
# then open http://localhost:8080/
```

## What's in the box

| File | Purpose |
|---|---|
| `index.html` | Single page, 5 sections (hero, story, ladder, process, acquire) |
| `styles.css` | Hand-written, no preprocessor, design tokens in `:root` |
| `main.js` | Modal open/close (timeline nodes + cards), IntersectionObserver card fade, smooth-scroll fallback |
| `assets/` | 6 generated JPGs — hero-lifestyle + product-{micro,classic,designer,mega,architect} |
| `assets-spec.json` | The 6 prompts that produced the images |

## Design notes

- **Crit → Quacktory translation.** The crit is an editorial fashion-magazine
  hero with a single full-bleed portrait and a headline that is literally
  bisected by an inset square. Translated here: the portrait becomes the
  lifestyle hero (five ducks arranged as a still life); the inset square
  becomes the Classic duck product shot in a paper frame; "NUDE DIGITAL" →
  "QUACKTORY · EST. 2019".
- **Size timeline replaces year timeline.** The crit's "year timeline" structural
  pattern is carried over as a 5-node bottom rail (4 cm → 3 m) with edge labels
  in tracked caps.
- **Watch-out fixes.** The crit notes (1) no nav visible, (2) no CTA, (3) the
  inset had no visible container. All three are addressed: a fixed pill nav at
  the top, a paired CTA in the hero and a large CTA on the acquire section, and
  the inset now has a white paper frame + soft shadow so it cannot dissolve into
  the photo.
- **Palette.** Warm amber `#B5947A` (bg), deep umber `#8C6F58`, ink `#5A4636`,
  paper `#FFFFFF`, single accent `#C97B4A`. Two core tokens per the skill's
  duotone rule, with one accent for CTAs and the modal bar.
- **Typography.** Italiana (display, weight 400, wide tracking, all caps for
  headlines) + Inter (body, 11–14 px).
- **Interactivity.** Timeline nodes and product cards open per-SKU modals with
  accent bar + size + title + copy + spec sheet. Modals close on overlay click,
  the × button, or Escape. Cards fade and lift in on scroll via
  IntersectionObserver.

No frameworks, no build step, no `node_modules`.