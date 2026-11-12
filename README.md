# Quacktory Catalog — Website Templates & Design Prompts

A collection of **154 static website templates** (HTML/CSS/JS demo sites) built with the **MiniMax-M3** model from reusable design prompts. Each entry includes a screenshot, a live demo, and a universal style/design prompt you can adapt for landing pages, portfolios, and product sites.

**Live catalog:** https://ssm82.github.io/quacktory-catalog/

## What’s inside

- `sites/<slug>/` — ready-to-open static **site templates** (plain `index.html`, `styles.css`, `main.js`, assets). No build step, no framework.
- `thumbs/` — screenshot previews for each template.
- `data/prompts.json` — machine-readable **design prompts** and metadata (palette, fonts, hero pattern, register).
- `data/index.json` — catalog index.
- `p/<slug>/` — per-template prompt/detail pages.
- `llms.txt`, `llms-full.txt`, `sitemap.xml`, `robots.txt` — SEO and AI-readable catalog data.

## For developers

Use this repository to find and reuse:

- **Website templates** and **landing page templates** (static HTML, CSS, JavaScript)
- **Hero section** and layout patterns: cinematic dark hero, editorial, duotone giant-serif headline, full-bleed photo with wordmark, browser frame-in-frame, pill-nav centered hero, editorial/photographic illustration hero
- **Design systems & style prompts**: color palettes, typography pairings, visual register, and composition/motion guidance
- **Frontend inspiration** for prototypes, portfolios, marketing pages, and demo sites

Each template is framework-free and can be served as static files:

```bash
python -m http.server 9100
# open http://localhost:9100/ or browse sites/<slug>/
```

## Prompts

`data/prompts.json` contains universal prompts that describe visual style (palette, typography, hero treatment, composition) without business-specific copy, so they can be reused across different products and topics.

## Topics

website templates, site templates, html templates, css templates, javascript templates, static site templates, landing page templates, portfolio templates, hero section templates, web design prompts, design system, frontend templates, ui design, web design inspiration, ai generated websites, minimax-m3
