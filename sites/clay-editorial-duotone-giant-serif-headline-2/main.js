// Quacktory × Spotify Astrology Club
const DATA = {
  micro: {
    title: "MICRO", size: "4–8 cm · thumb-sized",
    body: "Keychain, merch, impulse gift. Injection moulding under pressure, steel tool, 8 cavities, ~45 sec/cycle. EN 71-3.",
    spec: { "AGE": "6+", "RANGE": "impulse", "LEAD TIME": "3 weeks", "PRICE": "from $7 per unit" },
    cap: 132
  },
  classic: {
    title: "CLASSIC", size: "10–25 cm · cat-sized",
    body: "For kids, bathtub, desk. Compression moulding, aluminium tool, ~3 min/cycle. No plastic, no metal, no glued seams.",
    spec: { "AGE": "3+", "RANGE": "mid", "LEAD TIME": "3 weeks", "QC": "5 checks" },
    cap: 132
  },
  designer: {
    title: "DESIGNER", size: "15–30 cm · limited",
    body: "Illustrator collaborations. Hand-poured into silicone flask (≤300 pcs) or compression moulding for larger runs. Design approval with the collaborating author.",
    spec: { "AGE": "6+", "RANGE": "mid+", "LEAD TIME": "6 weeks", "RUN": "limited" },
    cap: 64
  },
  mega: {
    title: "MEGA", size: "50–120 cm · child-sized",
    body: "Photo objects, window props, gift-with-impact. Rotational moulding with an internal fibreglass reinforcing frame. Decorative object — not a toy.",
    spec: { "AGE": "art object", "RANGE": "premium", "LEAD TIME": "6 weeks", "SHIPPING": "specialist courier required" },
    cap: 24
  },
  architect: {
    title: "ARCHITECT", size: "1.5–3 m · bear-sized",
    body: "Installations, events, weddings, branded spaces. Sculptural casting around a CNC-milled polystyrene master. Steel skeleton with stiffening ribs.",
    spec: { "AGE": "installation", "RANGE": "contract", "LEAD TIME": "12 weeks", "INSTALL": "certified crew" },
    cap: 12
  }
};

const modal = document.getElementById("modal");
const mTitle = document.getElementById("modal-title");
const mSize = document.getElementById("modal-size");
const mBody = document.getElementById("modal-body");
const mSpec = document.getElementById("modal-spec");

function openModal(sku) {
  const d = DATA[sku];
  if (!d) return;
  mTitle.textContent = d.title;
  mSize.textContent = d.size;
  mBody.textContent = d.body;
  mSpec.innerHTML = "";
  Object.entries(d.spec).forEach(([k, v]) => {
    const dt = document.createElement("dt"); dt.textContent = k;
    const dd = document.createElement("dd"); dd.textContent = v;
    mSpec.appendChild(dt);
    mSpec.appendChild(dd);
  });
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal__close").focus();
}
function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}
document.querySelectorAll("[data-sku]").forEach(el => {
  el.addEventListener("click", () => openModal(el.dataset.sku));
});
document.querySelectorAll("[data-close]").forEach(el => {
  el.addEventListener("click", closeModal);
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

// Playback affordance — the crit's circular pause control
const orb = document.getElementById("playpause");
if (orb) {
  orb.addEventListener("click", () => {
    const paused = orb.classList.toggle("is-paused");
    orb.setAttribute("aria-pressed", String(paused));
    orb.setAttribute("aria-label", paused ? "Play" : "Pause");
    orb.querySelector(".orb__sub").textContent = paused ? "PLAY" : "PAUSE";
  });
}