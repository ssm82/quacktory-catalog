(function () {
  "use strict";

  const PAGE_SIZE = 12;
  const FONT_KEY_LABELS = {
    display: "Title",
    body: "Body",
    mono: "Mono",
  };
  const state = {
    entries: [],
    summary: null,
    search: "",
    patterns: new Set(),
    sort: "recent",
    page: 1,
    pageSize: PAGE_SIZE,
  };

  function readPageFromHash() {
    const m = /[#&]page=(\d+)/.exec(window.location.hash || "");
    const n = m ? parseInt(m[1], 10) : 1;
    return Number.isFinite(n) && n >= 1 ? n : 1;
  }

  function writePageToHash(page) {
    const hash = window.location.hash || "";
    const next = hash.replace(/([#&])page=\d+/, "").replace(/^#$/, "");
    const tail = next ? next + "&page=" + page : "page=" + page;
    const url = window.location.pathname + window.location.search + "#" + tail;
    if ("replaceState" in window.history) {
      window.history.replaceState(null, "", url);
    } else {
      window.location.hash = tail;
    }
  }

  const $ = (id) => document.getElementById(id);

  function init() {
    state.page = readPageFromHash();
    window.addEventListener("hashchange", () => {
      const next = readPageFromHash();
      if (next !== state.page) {
        state.page = next;
        renderGrid();
      }
    });
    Promise.all([
      fetch("./data/index.json").then((r) => r.json()),
      fetch("./data/prompts.json").then((r) => r.json()),
    ])
      .then(([index, prompts]) => {
        state.entries = index.entries || [];
        state.summary = index.summary || null;
        window.__quacktoryPrompts = prompts;
        state._patternLabels = {};
        for (const slug of Object.keys(prompts)) {
          const e = prompts[slug];
          if (!e || typeof e !== "object") continue;
          const letter = e.hero_pattern || "?";
          const label = e.hero_pattern_label || letter;
          if (!state._patternLabels[letter]) {
            state._patternLabels[letter] = label;
          }
        }
        render();
        attachEvents();
      })
      .catch((err) => {
        document.getElementById("status").hidden = false;
        document.getElementById("status").textContent =
          "Could not load the catalog. Please reload.";
        console.error(err);
      });
  }

  function attachEvents() {
    const search = $("search");
    search.addEventListener("input", (e) => {
      state.search = e.target.value.trim().toLowerCase();
      resetPage();
      renderGrid();
      updateClearFilters();
    });
    document.addEventListener("keydown", (e) => {
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        search.focus();
        search.select && search.select();
      }
    });
    loadFontsForEntries();
    const sortSel = $("sort");
    if (sortSel) {
      sortSel.value = state.sort;
      sortSel.addEventListener("change", (e) => {
        state.sort = e.target.value;
        resetPage();
        renderGrid();
        updateClearFilters();
      });
    }
    const clearBtn = $("clear-filters");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        state.search = "";
        state.patterns.clear();
        state.sort = "recent";
        search.value = "";
        if (sortSel) sortSel.value = "recent";
        renderToolbar();
        resetPage();
        renderGrid();
        updateClearFilters();
      });
    }
    updateClearFilters();
  }

  function updateClearFilters() {
    const clearBtn = $("clear-filters");
    if (clearBtn) {
      const show = state.search !== "" || state.patterns.size > 0 || state.sort !== "recent";
      clearBtn.hidden = !show;
    }
    updateResultsSummary();
  }

  function updateResultsSummary() {
    const summary = $("results-summary");
    if (!summary) return;
    if (state.search !== "") {
      summary.textContent = `Search: "${state.search}"`;
    } else if (state.patterns.size > 0) {
      const n = state.patterns.size;
      summary.textContent = `${n} hero pattern${n === 1 ? "" : "s"} selected`;
    } else if (state.sort !== "recent") {
      summary.textContent = "Sorted A–Z";
    } else {
      summary.textContent = "";
    }
  }

  function render() {
    renderToolbar();
    renderGrid();
  }

  function renderToolbar() {
    const patterns = new Map();
    for (const e of state.entries) {
      const p = e.hero_pattern || "?";
      patterns.set(p, (patterns.get(p) || 0) + 1);
    }

    const patternChips = $("pattern-chips");
    patternChips.innerHTML = "";
    const sortedPatterns = [...patterns.entries()].sort((a, b) => {
      const la = state._patternLabels[a[0]] || a[0];
      const lb = state._patternLabels[b[0]] || b[0];
      return la.localeCompare(lb);
    });
    for (const [pat, count] of sortedPatterns) {
      const label = state._patternLabels[pat] || pat;
      patternChips.appendChild(makeChip(label, count, "pattern", state.patterns, pat));
    }
  }

  function makeChip(label, count, kind, set, key) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    if (typeof count === "number" && count < 5) {
      btn.classList.add("chip--rare");
      btn.title = count + " examples — rare combination";
    }
    const chipKey = key || label;
    btn.setAttribute("aria-pressed", set.has(chipKey) ? "true" : "false");
    btn.textContent = label;
    const span = document.createElement("span");
    span.className = "chip__count";
    span.textContent = String(count);
    btn.appendChild(span);
    btn.addEventListener("click", () => {
      if (set.has(chipKey)) set.delete(chipKey);
      else set.add(chipKey);
      btn.setAttribute("aria-pressed", set.has(chipKey) ? "true" : "false");
      resetPage();
      renderGrid();
      updateClearFilters();
    });
    return btn;
  }

  function renderGrid() {
    const grid = $("grid");
    grid.innerHTML = "";
    const filtered = applySort(state.entries).filter(matches);
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    if (state.page < 1) state.page = 1;

    const start = (state.page - 1) * state.pageSize;
    const end = Math.min(start + state.pageSize, filtered.length);

    const countPill = $("count-pill");
    if (filtered.length === 0) {
      countPill.textContent = "0 of " + state.entries.length + " sites";
    } else {
      countPill.textContent =
        (start + 1) + "–" + end + " of " + filtered.length + " sites";
    }

    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No sites match the current filters.";
      grid.appendChild(empty);
      renderPagination(0);
      renderPaginationCounter(0, filtered.length);
      updateResultsSummary();
      return;
    }

    const pageEntries = filtered.slice(start, end);
    for (const entry of pageEntries) {
      grid.appendChild(makeCard(entry));
    }
    renderPagination(totalPages);
    renderPaginationCounter(totalPages, filtered.length);
    updateResultsSummary();
  }

  function applySort(entries) {
    const sorted = entries.slice();
    if (state.sort === "recent") {
      sorted.sort((a, b) => {
        const da = Date.parse(a.added_at || a.updated_at || "") || 0;
        const db = Date.parse(b.added_at || b.updated_at || "") || 0;
        return db - da;
      });
    } else if (state.sort === "az") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    return sorted;
  }

  function scrollToGridTop() {
    const toolbar = document.querySelector(".toolbar");
    const targetY = toolbar ? toolbar.getBoundingClientRect().top + window.scrollY : 0;
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    } else {
      window.scrollTo(0, targetY);
    }
  }

  function renderPagination(totalPages) {
    const nav = $("pagination");
    if (!nav) return;
    const prev = $("pagination-prev");
    const next = $("pagination-next");
    if (!prev || !next) return;

    if (totalPages <= 1) {
      nav.hidden = true;
      prev.hidden = true;
      next.hidden = true;
      return;
    }
    nav.hidden = false;

    prev.hidden = false;
    prev.disabled = state.page <= 1;
    prev.textContent = "‹ Prev";
    prev.onclick = () => goToPage(state.page - 1);

    next.hidden = false;
    next.disabled = state.page >= totalPages;
    next.textContent = "Next ›";
    next.onclick = () => goToPage(state.page + 1);

    const numbers = nav.querySelectorAll(".page-btn:not(#pagination-prev):not(#pagination-next), .page-dots");
    numbers.forEach((n) => n.remove());

    const pages = pageNumbers(state.page, totalPages);
    let last = 0;
    for (const p of pages) {
      if (p - last > 1) {
        const dots = document.createElement("span");
        dots.className = "page-dots";
        dots.textContent = "…";
        dots.setAttribute("aria-hidden", "true");
        nav.insertBefore(dots, next);
      }
      const isCurrent = p === state.page;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "page-btn";
      if (isCurrent) {
        b.classList.add("page-btn--current");
        b.setAttribute("aria-current", "page");
      }
      b.textContent = String(p);
      b.addEventListener("click", () => goToPage(p));
      nav.insertBefore(b, next);
      last = p;
    }
  }

  function pageNumbers(current, total) {
    const out = [];
    const radius = 2;
    for (let p = 1; p <= total; p++) {
      if (p === 1 || p === total || (p >= current - radius && p <= current + radius)) {
        out.push(p);
      }
    }
    return out;
  }

  function renderPaginationCounter(totalPages, totalEntries) {
    const counter = $("pagination-counter");
    if (!counter) return;
    if (!totalPages || totalPages <= 1 || !totalEntries) {
      counter.hidden = true;
      counter.textContent = "";
      return;
    }
    counter.hidden = false;
    const rangeStart = (state.page - 1) * state.pageSize + 1;
    const rangeEnd = Math.min(state.page * state.pageSize, totalEntries);
    counter.textContent =
      rangeStart + "–" + rangeEnd + " of " + totalEntries;
  }

  function goToPage(page) {
    if (page === state.page) return;
    state.page = page;
    writePageToHash(page);
    renderGrid();
    scrollToGridTop();
  }

  function resetPage() {
    if (state.page !== 1) {
      state.page = 1;
      writePageToHash(1);
    }
  }

  function matches(entry) {
    if (state.patterns.size && !state.patterns.has(entry.hero_pattern)) return false;
    if (state.search) {
      const heroLabel =
        (entry.hero_pattern_label ||
          (state._patternLabels && state._patternLabels[entry.hero_pattern]) ||
          entry.hero_pattern ||
          "");
      const hay = (
        (entry.title || "") + " " +
        (entry.excerpt || "") + " " +
        (entry.source || "") + " " +
        (entry.register || "") + " " +
        heroLabel
      ).toLowerCase();
      if (!hay.includes(state.search)) return false;
    }
    return true;
  }

  function makeCard(entry) {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.dataset.slug = entry.slug;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Preview " + (entry.title || entry.slug));

    const thumb = document.createElement("div");
    thumb.className = "card__thumb";
    if (entry.thumb) {
      const img = document.createElement("img");
      img.alt = entry.title || "Untitled";
      img.loading = "lazy";
      img.src = entry.thumb;
      img.addEventListener("error", () => {
        img.remove();
        const ph = document.createElement("div");
        ph.className = "card__thumb-placeholder";
        ph.textContent = "No thumbnail";
        thumb.appendChild(ph);
      });
      thumb.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "card__thumb-placeholder";
      ph.textContent = "No thumbnail";
      thumb.appendChild(ph);
    }
    card.appendChild(thumb);

    const body = document.createElement("div");
    body.className = "card__body";

    const title = document.createElement("h2");
    title.className = "card__title";
    title.textContent = entry.title || "Untitled";
    body.appendChild(title);

    const chips = document.createElement("div");
    chips.className = "card__chips";
    const heroLetter = entry.hero_pattern || "?";
    const heroLabel =
      entry.hero_pattern_label ||
      (state._patternLabels && state._patternLabels[heroLetter]) ||
      null;
    if (heroLabel && heroLabel !== heroLetter) {
      chips.appendChild(makeMetaChip(heroLabel, "Hero style"));
    }
    body.appendChild(chips);

    if (Array.isArray(entry.palette) && entry.palette.length) {
      const pal = document.createElement("div");
      pal.className = "card__palette";
      pal.setAttribute("aria-label", "Palette");
      for (const hex of entry.palette.slice(0, 3)) {
        if (typeof hex !== "string" || !/^#[0-9a-fA-F]{3,8}$/.test(hex)) {
          continue;
        }
        const cell = document.createElement("span");
        cell.className = "palette-cell";
        const dot = document.createElement("span");
        dot.className = "swatch";
        dot.style.setProperty("background-color", hex);
        dot.title = hex;
        const label = document.createElement("span");
        label.className = "palette-cell__hex";
        label.textContent = hex.toUpperCase();
        cell.appendChild(dot);
        cell.appendChild(label);
        pal.appendChild(cell);
      }
      body.appendChild(pal);
    }

    const fonts = entry.fonts || {};
    const fontKeys = ["display", "body", "mono"].filter((k) => fonts[k]);
    if (fontKeys.length) {
      const fc = document.createElement("div");
      fc.className = "card__fonts";
      for (const k of fontKeys) {
        const chip = document.createElement("span");
        chip.className = "font-chip";
        const role = document.createElement("span");
        role.className = "font-chip__role";
        role.textContent = FONT_KEY_LABELS[k] || k;
        const face = document.createElement("span");
        face.className = "font-chip__face";
        face.textContent = fonts[k];
        face.style.fontFamily = '"' + fonts[k] + '", "Inter", sans-serif';
        chip.appendChild(role);
        chip.appendChild(face);
        fc.appendChild(chip);
      }
      body.appendChild(fc);
    }

    const excerpt = document.createElement("p");
    excerpt.className = "card__excerpt";
    excerpt.textContent = entry.excerpt || "";
    body.appendChild(excerpt);

    const actions = document.createElement("div");
    actions.className = "card__actions";
    const open = document.createElement("button");
    open.type = "button";
    open.className = "btn btn--primary";
    open.textContent = "Open site";
    open.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(entry);
    });
    actions.appendChild(open);

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "btn btn--ghost";
    copy.textContent = "Copy prompt";
    copy.addEventListener("click", (e) => {
      e.stopPropagation();
      copyPrompt(entry.slug, copy);
    });
    actions.appendChild(copy);

    const details = document.createElement("a");
    details.className = "btn btn--details";
    details.href = "./p/" + entry.slug + "/";
    details.textContent = "Details →";
    details.title = "View prompt details";
    details.addEventListener("click", (e) => e.stopPropagation());
    actions.appendChild(details);

    body.appendChild(actions);

    card.addEventListener("click", () => openLightbox(entry));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(entry);
      }
    });

    card.appendChild(body);
    return card;
  }

  function makeMetaChip(label, fullLabel) {
    const c = document.createElement("span");
    c.className = "card__chip";
    c.textContent = label;
    c.title = fullLabel || label;
    return c;
  }

  function copyPrompt(slug, btn) {
    const prompts = window.__quacktoryPrompts || {};
    const entry = prompts[slug];
    if (!entry || !entry.universal_prompt) {
      flashCopy(btn, "Missing", false);
      return;
    }
    const text = entry.universal_prompt;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        () => flashCopy(btn, "Copied", true),
        () => fallbackCopy(text, btn)
      );
    } else {
      fallbackCopy(text, btn);
    }
  }

  function fallbackCopy(text, btn) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      flashCopy(btn, ok ? "Copied" : "Copy failed", ok);
    } catch (e) {
      flashCopy(btn, "Copy failed", false);
    }
  }

  function flashCopy(btn, label, ok) {
    const original = btn.textContent;
    btn.textContent = label;
    if (ok) btn.classList.add("is-copied");
    const live = $("live");
    if (live) {
      live.textContent = ok
        ? "Prompt copied to clipboard"
        : (label === "Missing"
            ? "Prompt not available"
            : "Copy failed");
    }
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("is-copied");
      if (live) live.textContent = "";
    }, 1500);
  }

  /* ---------- LIGHTBOX ---------- */
  const lightboxEls = {};

  function cacheLightboxEls() {
    lightboxEls.root = document.getElementById("lightbox");
    lightboxEls.stage = document.getElementById("lightbox-stage");
    lightboxEls.frame = document.getElementById("lightbox-frame");
    lightboxEls.fallback = document.getElementById("lightbox-fallback");
    lightboxEls.fallbackBody = document.getElementById("lightbox-fallback-body");
    lightboxEls.fallbackNewwin = document.getElementById("lightbox-fallback-newwin");
    lightboxEls.title = document.getElementById("lightbox-title");
    lightboxEls.pattern = document.getElementById("lightbox-pattern");
    lightboxEls.newwin = document.getElementById("lightbox-newwin");
    lightboxEls.close = document.getElementById("lightbox-close");
    lightboxEls.loadGuard = null;
    lightboxEls.lastFocus = null;
  }

  function bindLightboxEvents() {
    if (!lightboxEls.root) return;
    lightboxEls.root.addEventListener("click", (e) => {
      if (e.target && e.target.dataset && e.target.dataset.lightboxClose !== undefined) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightboxEls.root.hidden) {
        closeLightbox();
      }
    });
    lightboxEls.frame.addEventListener("load", onFrameLoad);
    lightboxEls.frame.addEventListener("error", onFrameError);
  }

  function setStage(state) {
    if (!lightboxEls.stage) return;
    lightboxEls.stage.dataset.state = state;
    const loading = lightboxEls.stage.querySelector(".lightbox__loading");
    if (state === "loading") {
      if (loading) loading.hidden = false;
      lightboxEls.frame.hidden = true;
      lightboxEls.fallback.hidden = true;
    } else if (state === "loaded") {
      if (loading) loading.hidden = true;
      lightboxEls.frame.hidden = false;
      lightboxEls.fallback.hidden = true;
    } else if (state === "error") {
      if (loading) loading.hidden = true;
      lightboxEls.frame.hidden = true;
      lightboxEls.fallback.hidden = false;
    }
  }

  function showFallback(message) {
    if (lightboxEls.fallbackBody) {
      lightboxEls.fallbackBody.textContent =
        message || "This site could not be loaded in the preview.";
    }
    setStage("error");
  }

  async function probeUrl(url) {
    try {
      const res = await fetch(url, { method: "HEAD", cache: "no-store" });
      if (res.ok) return { ok: true, status: res.status };
      return { ok: false, status: res.status };
    } catch (e) {
      try {
        const res2 = await fetch(url, { method: "GET", cache: "no-store" });
        if (res2.ok) return { ok: true, status: res2.status };
        return { ok: false, status: res2.status };
      } catch (e2) {
        return { ok: false, status: 0, error: String(e2 && e2.message || e2) };
      }
    }
  }

  function onFrameLoad() {
    if (lightboxEls.loadGuard == null) return;
    clearTimeout(lightboxEls.loadGuard.timer);
    lightboxEls.loadGuard = null;
    try {
      const doc = lightboxEls.frame.contentDocument;
      if (doc && doc.body) {
        const text = (doc.body.textContent || "").toLowerCase();
        const titleText =
          (doc.title || "").toLowerCase();
        if (
          text.includes("not found") ||
          text.includes("404") ||
          titleText.includes("not found") ||
          titleText.includes("404")
        ) {
          showFallback("This site's preview file is missing or returned a 404.");
          return;
        }
      }
    } catch (e) {
      // cross-origin or sandboxed — skip DOM inspection
    }
    setStage("loaded");
  }

  function onFrameError() {
    if (lightboxEls.loadGuard == null) return;
    clearTimeout(lightboxEls.loadGuard.timer);
    lightboxEls.loadGuard = null;
    showFallback("This site's preview file could not be loaded.");
  }

  async function openLightbox(entry) {
    if (!entry || !entry.site_url) return;
    if (!lightboxEls.root) cacheLightboxEls();
    if (!lightboxEls.root) return;

    lightboxEls.lastFocus = document.activeElement;
    lightboxEls.title.textContent = entry.title || entry.slug || "Site";
    const letter = entry.hero_pattern || "";
    const label =
      entry.hero_pattern_label ||
      (state._patternLabels && state._patternLabels[letter]) ||
      letter;
    lightboxEls.pattern.textContent = label ? "Hero " + letter + " · " + label : "Hero " + letter;
    lightboxEls.pattern.hidden = !letter;
    lightboxEls.newwin.href = entry.site_url;
    if (lightboxEls.fallbackNewwin) lightboxEls.fallbackNewwin.href = entry.site_url;

    lightboxEls.root.hidden = false;
    lightboxEls.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-lightbox-open");
    setStage("loading");

    const url = entry.site_url;
    const probe = await probeUrl(url);
    if (lightboxEls.root.hidden) return;
    if (!probe.ok) {
      if (probe.status === 404) {
        showFallback("This site's preview file is missing (404). You can still open it in a new tab if the upstream is reachable.");
      } else if (probe.status === 0) {
        showFallback("The preview could not be reached from here. You can try opening it in a new tab.");
      } else {
        showFallback("The preview returned an unexpected response (status " + probe.status + ").");
      }
      return;
    }

    const guard = { timer: null };
    lightboxEls.loadGuard = guard;
    guard.timer = setTimeout(() => {
      if (lightboxEls.loadGuard !== guard) return;
      lightboxEls.loadGuard = null;
      showFallback("The preview is taking too long to load.");
    }, 15000);

    lightboxEls.frame.src = url;
    setTimeout(() => {
      if (lightboxEls.close && document.activeElement === document.body) {
        lightboxEls.close.focus();
      }
    }, 0);
  }

  function closeLightbox() {
    if (!lightboxEls.root || lightboxEls.root.hidden) return;
    lightboxEls.root.hidden = true;
    lightboxEls.root.setAttribute("aria-hidden", "true");
    if (lightboxEls.loadGuard) {
      clearTimeout(lightboxEls.loadGuard.timer);
      lightboxEls.loadGuard = null;
    }
    try { lightboxEls.frame.src = "about:blank"; } catch (e) { /* noop */ }
    lightboxEls.frame.hidden = true;
    document.body.classList.remove("is-lightbox-open");
    if (lightboxEls.lastFocus && typeof lightboxEls.lastFocus.focus === "function") {
      lightboxEls.lastFocus.focus();
    }
  }

  cacheLightboxEls();
  bindLightboxEvents();

  const loadedFontHrefs = new Set();

  function _googleFontFamilyParam(name) {
    return name.replace(/\s+/g, "+");
  }

  function loadFontsForEntries() {
    if (!Array.isArray(state.entries) || !state.entries.length) return;
    const families = new Set();
    for (const e of state.entries) {
      const fonts = (e && e.fonts) || {};
      for (const k of ["display", "body", "mono"]) {
        const name = fonts[k];
        if (typeof name === "string" && name.trim()) families.add(name.trim());
      }
    }
    if (!families.size) return;
    const href =
      "https://fonts.googleapis.com/css2?" +
      Array.from(families)
        .map((n) => "family=" + _googleFontFamilyParam(n) + ":wght@400;700")
        .join("&") +
      "&display=swap";
    if (loadedFontHrefs.has(href)) return;
    loadedFontHrefs.add(href);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
