# Quacktory Catalog

A browsable catalog of every Quacktory demo site under `output/sites/site-*/`,
listing **universal style/design prompts** (no business-specific copy — no
brand names, no product names, no prices, no logos). Each card links to the
existing site and has a copy-to-clipboard button. Plus an **external MCP
server** (stdio) that exposes the same prompts as MCP resources so any MCP
client can read them.

The catalog surface is source-agnostic — nothing in this folder mentions a
parser or data source by name.

## Layout

```
output/quacktory-catalog/
├── index.html, styles.css, main.js     # static catalog page (no framework, CDN-free)
├── data/
│   ├── prompts.json                    # canonical slug-keyed store
│   └── index.json                      # flat list of summaries (sorted)
├── sites/<slug>/                       # copied demo sites (one per entry)
├── llms.txt                            # AI-seo: short catalog description + entry index
├── llms-full.txt                       # AI-seo: full universal_prompt for every entry
├── sitemap.xml                         # XML sitemap (index + every sites/<slug>/ page)
├── robots.txt                          # allows all + AI crawlers; points to sitemap
├── thumbs/<slug>.jpg                   # real site screenshot (Playwright Chromium, 1280x720)
└── README.md                           # this file
```

## Rebuild flow

The catalog is regenerated only on demand — there is no auto-hook when sites
change. The default mode (`--no-llm`) reads design tokens and crit
frontmatter only — no LLM call happens here.

```bash
source .venv/bin/activate
python scripts/build_catalog.py            # merges; new slugs only (--no-llm default)
python scripts/build_catalog.py --force <slug>  # regenerate one entry's universal_prompt via LLM
python scripts/build_catalog.py --force-all --no-llm  # rebuild every entry from tokens/crit (no LLM)
python scripts/build_catalog.py --force-all  # regenerate every entry's universal_prompt via LLM
python scripts/build_catalog.py --prune      # drop entries whose site is gone
python scripts/build_catalog.py --no-llm     # explicit — derive prompts from tokens only
```

Caching is merge-by-slug. LLM calls (`universal_prompt` regeneration)
happen only for new or `--force`'d slugs. Use `--prune` to drop entries
whose slug is no longer in the site set.

### Pinterest-specific frontmatter step

Some entries lack `design-tokens.json`; their colors and fonts live in
CSS custom properties. To populate `palette` / `fonts` / `register` /
`hero_pattern` for those entries, run the vision pass once after the
crits exist:

```bash
python scripts/extract_visual_fields.py            # all such slugs in data/index.json
python scripts/extract_visual_fields.py --slug X   # one slug
python scripts/extract_visual_fields.py --dry-run  # preview targets
```

This writes a YAML frontmatter block (`palette`, `fonts`, `register`,
`hero_pattern`) to the top of each `output/crits/<slug>.md`.
`build_catalog.py` then prefers that frontmatter over the CSS fallback.
Other entries (which do emit `design-tokens.json`) get their fields
straight from the tokens file — no vision step needed.

The first time a brand-new batch flows through, the build order is:

```bash
python scripts/extract_visual_fields.py # vision frontmatter
python scripts/build_catalog.py         # catalog picks up frontmatter
```

The catalog can run before `extract_visual_fields.py` and still produce
a useful entry — `_extract_visual_fields` falls back to scraping
`styles.css` for `--bg` / `--fg` / `--accent` / `--font-display` /
`--font-body` when no frontmatter exists yet. Vision wins on the next
rebuild once frontmatter is written.

## Local preview

```bash
python -m http.server 9100 --directory output/quacktory-catalog
# open http://localhost:9100/
```

### Toolbar

The toolbar above the grid exposes:

- **Search** — substring match across `title`, `excerpt`, `register`,
  and `hero_pattern_label`. Press `/` from anywhere to focus the search box.
- **Hero style chips** — multi-select filter on `hero_pattern`.
- **Sort** — `Recent` (default, by `updated_at` desc) or `A–Z` (by title,
  locale-aware). Note: switching to `Recent` by default is a behavior change
  from earlier builds that used raw `index.json` order — it's intentional and
  documented in `AGENTS.md`.
- **Clear filters** — appears only when search, patterns, or sort differ from
  the initial state; resets all three.
- **Results summary** — live region that announces the active filter
  ("`Search: "xbox"`", "`2 hero patterns selected`", etc.).

The grid does **not** auto-scroll on filter or search changes — the page only
scrolls to the toolbar when you click a pagination button. The hero-duck
Three.js scene pauses via `IntersectionObserver` when scrolled out of view,
and respects `prefers-reduced-motion` (single frame, no animation loop).

## SEO and AI-SEO surface

Every `build_catalog.py` run also generates the SEO layer (skip with
`--no-seo`). The default base URL is `https://quacktory.space/`;
override it for production:

```bash
python scripts/build_catalog.py --site-url https://quacktory.space/
```

| File | Purpose |
|------|---------|
| `llms.txt` | Short-form AI-SEO surface ([llmstxt.org](https://llmstxt.org/)). Catalog description and one-line summary per entry. |
| `llms-full.txt` | Long-form AI-SEO surface — every entry's full `universal_prompt` with metadata. Lets ChatGPT / Claude / Perplexity ingest the actual design language without scraping HTML. |
| `sitemap.xml` | XML sitemap of the catalog index, `llms-full.txt`, and every `sites/<slug>/` demo page. |
| `robots.txt` | Allows all crawlers; explicit allow for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`. Points at the sitemap. |
| `index.html` head + body | Injected at build time: meta description, canonical, OG, Twitter, JSON-LD `WebSite` + `CollectionPage` + `ItemList`, plus a `<noscript>` summary that lists the first 200 entries. |

All blocks are idempotent — re-running the build replaces the managed
ranges (`<!-- catalog:seo:head:start -->…<!-- catalog:seo:head:end -->`
and the matching noscript pair) instead of duplicating tags.

Clipboard behaviour:

- `http://localhost:9100/` → `navigator.clipboard.writeText` works.
- `file://` (open `index.html` directly) → secure context is missing, the
  page falls back to `document.execCommand("copy")`.

## External MCP server

The catalog is also exposed as a read-only stdio MCP server. After
`pip install -e .`:

```bash
quacktory-catalog-mcp           # boots stdio server
quacktory-catalog-mcp --check   # verify path + count
quacktory-catalog-mcp --prompts /tmp/custom.json  # custom store
```

### Resources

- `quacktory://prompts/index` — flat list of summaries.
- `quacktory://prompt/<slug>` — full JSON entry for one site.

### Tools

- `search_prompts(query?, hero_pattern?, limit?) -> {count, results}` —
  substring search across title, slug, register, and the universal
  prompt itself, with optional hero-pattern filter.
- `get_prompt(slug) -> entry` — full catalog entry; `is_error: true` for
  unknown slugs.

The server reloads `prompts.json` whenever its mtime changes, so admin edits
to the store are picked up without restarting.

## Entry shape

```json
{
  "slug": "son-daven",
  "title": "Son Daven",
  "hero_pattern": "A",
  "palette": ["#A89474", "#2C2824"],
  "fonts": {"display": "Playfair Display", "body": "Inter"},
  "register": "editorial",
  "universal_prompt": "Dark editorial two-color palette with creamy highlights…",
  "site_url": "../sites/son-daven/index.html",
  "thumb": "thumbs/son-daven.jpg",
  "created_at": "2026-08-09T15:00:00Z",
  "updated_at": "2026-08-09T15:00:00Z"
}
```

## Schema notes

- `hero_pattern` is one of `A`–`F` for the static-awwwards-site skill, or `P`
  for the photographic pattern.
- For entries with `design-tokens.json`, `palette` is read in the order
  `bg, fg, accent`.
- For entries without `design-tokens.json`, `palette` comes from the YAML
  frontmatter at the top of `output/crits/<slug>.md` (written by
  `scripts/extract_visual_fields.py`). When the frontmatter is missing,
  `build_catalog.py` falls back to `--bg` / `--fg` / `--accent` from the
  demo's `styles.css`.
- `fonts` / `register` / `hero_pattern` follow the same precedence: crit
  frontmatter (no tokens) or `design-tokens.json`.

## See also

- `scripts/build_catalog.py` — the build script
- `scripts/extract_visual_fields.py` — vision frontmatter pass
- `src/quacktory_catalog_mcp/` — MCP server package
- `tests/test_quacktory_catalog.py` — in-process tests
- AGENTS.md §"Rebuild the Quacktory catalog"
