# site-the-shift-1

design: the-shift-1

Open `index.html` directly, or serve the folder:

    python3 -m http.server 9300 --directory .

## Asset bundle

Six JPEGs in `assets/`, generated via MiniMax:

- `hero-lifestyle.jpg` (16:9) — opens the page
- `product-micro.jpg` (1:1) — keychain 4–8 cm
- `product-classic.jpg` (1:1) — 15 cm workhorse
- `product-designer.jpg` (1:1) — 20 cm collaboration edition
- `product-mega.jpg` (1:1) — 50 cm photo-object
- `product-architect.jpg` (1:1) — 1.5 m installation

## Files

- `design-tokens.json` — palette / fonts / hero-pattern (extracted from the crit)
- `index.html` — markup phase (html+css in one LLM call)
- `styles.css` — markup phase (html+css in one LLM call)
- `main.js` — one focused LLM call (optional)
- `assets-spec.json` — the prompts used to generate the asset bundle

## Build phases

    python scripts/build-site.py --slug the-shift-1 \
        --phases prompts,images,markup,js,readme,verify
