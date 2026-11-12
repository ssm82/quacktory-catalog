# QUACKTORY — site-pinterest-53198839343569149

A static demo site for Quacktory, the rubber-duck size ladder.
This direction is **cinematic dark editorial fashion-campaign** — derived from a Pinterest capture of a SAINT LAURENT 2025 key visual.

## Direction

- Near-black backdrop (`#0A0A0A`), cream wordmark (`#EFE9DC`), warm amber accents (`#C28A3A` / `#D9A24B`), deep teal mid-tones (`#2E4A40` / `#1E3A33`).
- Display serif **Playfair Display** for the wordmark and titles, **Inter** for body and chrome.
- The duck is staged as a luxury editorial subject — small precious object under amber rim light.
- The size ladder runs 4 cm → 300 cm; the season is **MMXXVI**.

## Structure

1. **Hero** — full-bleed hero photograph + giant "QUACK / TORY" wordmark + scroll cue.
2. **Manifesto** — italic display copy in the season's voice, with size chips.
3. **Vitrine** — five ducks (Micro / Classic / Designer / Mega / Architect) on a near-black stage with per-object amber under-glow on hover. Each card opens a modal.
4. **Rail** — bottom timeline with five circular nodes, edge labels `04 CM` / `3 M`, clickable.
5. **Footer** — colophon.

## Watch-outs addressed

- Wordmark always lands over the darkest patch of the hero (no overlay panel — the original crit says "no scrim"), with a faint text-shadow rather than a solid scrim.
- "MMXXVI" is set in tracked caps and is sized 13px so it survives at thumbnail scale.
- Product ducks stay clean and recognizable in the vitrine (not motion-blurred), since they're product showcase, not mood.
- Modal closes via × button, backdrop click, or Escape.

## Open it

```bash
python3 -m http.server 8096 --directory output/sites/site-pinterest-53198839343569149
# open http://localhost:8096/
```

Or just double-click `index.html` — there is no build step.