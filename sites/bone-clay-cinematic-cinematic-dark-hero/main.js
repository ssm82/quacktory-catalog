// file: main.js
// Quacktory · "Into the Storm" — interactive layer
// Modal-driven product passports, manifesto close, share cap, settings.

const SKU_DATA = {
  micro: {
    title: "QUACKTORY · MICRO",
    size: "4–8 cm",
    edition: "Impulse buy",
    year: "In lineup since 2019",
    pantone: "Pantone 7401 · sun yellow",
    accent: "#F4B81E",
    desc: "Thumb-sized. For the fridge, the vending machine, the Christmas advent calendar. Solid cast, food-grade silicone."
  },
  classic: {
    title: "QUACKTORY · CLASSIC",
    size: "10–25 cm",
    edition: "Core series",
    year: "In lineup since 2017",
    pantone: "Pantone 7401 · sun yellow",
    accent: "#F4B81E",
    desc: "Palm-sized. Kids, bathroom, office desk, gift without a reason. Natural rubber with EPDM, through-body pigment."
  },
  designer: {
    title: "QUACKTORY · DESIGNER",
    size: "15–30 cm",
    edition: "Limited",
    year: "Collabs since 2021",
    pantone: "12 signature Pantone equivalents",
    accent: "#D97757",
    desc: "Cat-sized. Collaborations with independent studios, seasonal limited editions, signed series."
  },
  mega: {
    title: "QUACKTORY · MEGA",
    size: "50–120 cm",
    edition: "Object run",
    year: "In lineup since 2022",
    pantone: "12 signature Pantone equivalents",
    accent: "#A8C4D6",
    desc: "Child-sized. Photo object, window display, gift-as-statement. Reinforced frame, delivered in a wooden crate."
  },
  architect: {
    title: "QUACKTORY · ARCHITECT",
    size: "1.5–3 m",
    edition: "Installation · B2B",
    year: "In lineup since 2023",
    pantone: "To client specification",
    accent: "#F4B81E",
    desc: "Bear-sized. Exhibition installation, corporate event, bespoke for architectural studios."
  }
};

const SHARE_CAP = 9999;
let shareCount = 0;

// ---------- Modal scaffold (created once) ----------
const overlay = document.createElement("div");
overlay.className = "modal-overlay";
overlay.setAttribute("role", "dialog");
overlay.setAttribute("aria-modal", "true");
overlay.innerHTML = `
  <div class="modal" data-state="closed">
    <button class="modal-close" type="button" aria-label="Close">
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <path d="M1 1 L13 13 M13 1 L1 13" stroke="currentColor" stroke-width="1.6" fill="none"/>
      </svg>
    </button>
    <div class="modal-body"></div>
  </div>
`;
document.body.appendChild(overlay);

const modal = overlay.querySelector(".modal");
const modalBody = overlay.querySelector(".modal-body");
const modalClose = overlay.querySelector(".modal-close");

function openModal(key) {
  const isSettings = key === "settings";
  const data = isSettings ? {
    title: "SETTINGS · MANIFESTO",
    size: "v2.0",
    edition: "Sound · typography · language",
    year: "2025",
    pantone: "Accent #F4B81E",
    accent: "#F4B81E",
    desc: "Brief system message: manifesto preferences. Voice playback, font size, interface language toggle. Settings are stored locally."
  } : SKU_DATA[key];
  if (!data) return;

  modalBody.innerHTML = `
    <span class="modal-rule" style="background:${data.accent}"></span>
    <span class="modal-eyebrow">${isSettings ? "QUACKTORY" : "QUACKTORY PRESENTS"}</span>
    <h3 class="modal-title">${data.title}</h3>
    <dl class="modal-meta">
      <div><dt>Size</dt><dd>${data.size}</dd></div>
      <div><dt>Edition</dt><dd>${data.edition}</dd></div>
      <div><dt>Year</dt><dd>${data.year}</dd></div>
      <div><dt>Color</dt><dd>${data.pantone}</dd></div>
    </dl>
    <p class="modal-desc">${data.desc}</p>
    <div class="modal-foot">
      <button class="modal-share" type="button" data-share>
        <span>SHARE</span>
        <span class="modal-share-count" data-share-count>0 / ${SHARE_CAP}</span>
      </button>
      <span class="modal-accent" style="color:${data.accent}">●</span>
    </div>
  `;
  overlay.classList.add("is-open");
  modal.setAttribute("data-state", "open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  overlay.classList.remove("is-open");
  modal.setAttribute("data-state", "closed");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// ---------- SKU cards → open modal ----------
document.querySelectorAll(".sku").forEach((el) => {
  const key = el.dataset.openModal || el.dataset.sku;
  el.addEventListener("click", () => openModal(key));
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(key); }
  });
});

// ---------- Audio toggle → settings modal ----------
const audioBtn = document.querySelector(".audio-toggle");
if (audioBtn) {
  audioBtn.addEventListener("click", () => openModal("settings"));
}

// ---------- Hero CTA → scroll ----------
const cta = document.querySelector("[data-cta]");
if (cta) cta.addEventListener("click", (e) => {
  const id = cta.getAttribute("href");
  if (id && id.startsWith("#")) {
    e.preventDefault();
    const t = document.querySelector(id);
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// ---------- Hero scroll hint ----------
const heroScroll = document.querySelector(".hero-scroll");
if (heroScroll) heroScroll.addEventListener("click", (e) => {
  e.preventDefault();
  const t = document.querySelector(heroScroll.getAttribute("href"));
  if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
});

// ---------- Manifesto close button ----------
const closeBtn = document.querySelector(".close-btn");
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    const card = closeBtn.closest(".quote-card");
    if (card) {
      card.style.transition = "opacity .4s, transform .4s";
      card.style.opacity = "0";
      card.style.transform = "translateY(12px)";
      setTimeout(() => { card.style.display = "none"; }, 420);
    }
  });
}

// ---------- Nav: smooth scroll for in-page links ----------
document.querySelectorAll(".nav-rail a[data-nav]").forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id && id.startsWith("#")) {
      const t = document.querySelector(id);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
    }
  });
});

// ---------- Share counter (delegated, capped) ----------
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-share]");
  if (!btn) return;
  if (shareCount >= SHARE_CAP) return;
  shareCount++;
  const c = modalBody.querySelector("[data-share-count]");
  if (c) c.textContent = `${shareCount} / ${SHARE_CAP}`;
  btn.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }],
    { duration: 240, easing: "ease-out" }
  );
});

// ---------- Timeline scale ticks → scroll to closest SKU ----------
document.querySelectorAll(".scale-tick").forEach((tick) => {
  tick.addEventListener("click", () => {
    const skus = document.querySelectorAll(".sku");
    const idx = Math.min(skus.length - 1, Math.floor((parseFloat(tick.style.getPropertyValue("--p")) / 100) * skus.length));
    skus[idx].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  });
  tick.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tick.click(); }
  });
  tick.setAttribute("tabindex", "0");
  tick.setAttribute("role", "button");
});

// ---------- Scroll-driven reveals (subtle) ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll(".sku, .quote-card, .section-head, .scale-tick").forEach((el) => io.observe(el));
