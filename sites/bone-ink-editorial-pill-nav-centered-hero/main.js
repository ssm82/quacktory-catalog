// QUACKTORY · Case Study 06
// Interactivity derived from crit: modal (size/title/description),
// tab control (Edition / Size Guide), scroll fade-in, hover lifts,
// per-node rail fill tracking.

const SKU_DATA = {
  micro: {
    size: "4 CM",
    title: "MICRO",
    copy: "KEYCHAIN-SIZED. THE TINIEST OF THE FIVE. CHARCOAL MATTE RUBBER. LIVES ON A HOOK, A LANYARD, A POCKET.",
    price: "€18",
    image: "./assets/product-micro.jpg",
  },
  classic: {
    size: "15 CM",
    title: "CLASSIC",
    copy: "THE WORKHORSE. 15 CM, IVORY BONE, FAINT SATIN SHEEN. THE ONE YOU SEE ON EDITORIAL SHELVES.",
    price: "€34",
    image: "./assets/product-classic.jpg",
  },
  designer: {
    size: "20 CM",
    title: "DESIGNER",
    copy: "20 CM, GLOSSY GRAPHITE BLACK, A TINY BRUSHED BRASS ACCENT RING AT THE NECK. PREMIUM FASHION-OBJECT.",
    price: "€62",
    image: "./assets/product-designer.jpg",
  },
  mega: {
    size: "50 CM",
    title: "MEGA",
    copy: "50 CM, WARM TAUPE SAND, SMOOTH SATIN MATTE. FOR SHELVES, STOREFRONTS, AND THE LIVING-ROOM CORNER.",
    price: "€180",
    image: "./assets/product-mega.jpg",
  },
  architect: {
    size: "3 M",
    title: "ARCHITECT",
    copy: "3 METRES, PALE CONCRETE GREY, PLASTER-LIKE MATTE. A STATEMENT PIECE FOR LOBBIES, HOTELS, FOYERS, PHOTO SHOOTS. COMMISSIONED.",
    price: "€4,800",
    image: "./assets/product-architect.jpg",
  },
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ── tabs ────────────────────────────────────────────────────────
function initTabs() {
  const tabs = $$(".tab");
  const panels = $$(".tab-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panels.forEach((p) => {
        p.classList.toggle("is-visible", p.dataset.panel === target);
      });
    });
  });
}

// ── scroll fade-in ──────────────────────────────────────────────
function initFade() {
  const targets = $$(".section, .hero__headline, .hero__frame, .ladder__track");
  targets.forEach((el) => el.setAttribute("data-fade", ""));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
  );
  targets.forEach((el) => io.observe(el));
}

// ── modal ───────────────────────────────────────────────────────
function openModal(sku) {
  const data = SKU_DATA[sku];
  if (!data) return;
  $("#modal-image").src = data.image;
  $("#modal-image").alt = `${data.title} rubber duck, ${data.size}.`;
  $("#modal-size").textContent = data.size;
  $("#modal-title").textContent = data.title;
  $("#modal-copy").textContent = data.copy;
  $("#modal-price").textContent = data.price;
  $("#modal").classList.add("is-open");
  $("#modal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("#modal").classList.remove("is-open");
  $("#modal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function initModal() {
  $$(".node").forEach((node) => {
    node.addEventListener("click", () => {
      const sku = node.dataset.sku;
      if (sku) openModal(sku);
    });
  });
  $$("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// ── rail fill (track hovered/indexed node on the ladder) ────────
function initRail() {
  const rail = $(".ladder__rail-fill");
  const nodes = $$(".node");
  const total = nodes.length;
  nodes.forEach((node, i) => {
    const update = (idx) => {
      const pct = ((idx + 1) / total) * 100;
      rail.style.setProperty("--fill", `${pct}%`);
    };
    node.addEventListener("mouseenter", () => update(i));
    node.addEventListener("focus", () => update(i));
  });
  nodes[total - 1].addEventListener("mouseleave", () => {
    rail.style.setProperty("--fill", "0%");
  });
}

// ── smooth-scroll polyfill for older browsers ───────────────────
function initSmoothScroll() {
  if ("scrollBehavior" in document.documentElement.style) return;
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const t = document.getElementById(id);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

initTabs();
initFade();
initModal();
initRail();
initSmoothScroll();
