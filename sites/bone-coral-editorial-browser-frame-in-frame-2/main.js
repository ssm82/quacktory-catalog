// file: main.js

const SKU = {
  micro:    { num: "N° 01", name: "Micro",     size: "4–8 cm",   ref: "thumb-sized",   price: "from €8",     lt: "today · keychain", accent: "#E23B2C", desc: "Injection-moulded, 8 cavities. Food-grade silicone compound. Black pupil, white sclera. EN 71-3, 6+ with choking-hazard sticker." },
  classic:  { num: "N° 02", name: "Classic",   size: "10–25 cm", ref: "palm-sized",    price: "from €22",    lt: "3 weeks",         accent: "#D63A2C", desc: "Compression-moulded, 1–2 cavities. Food-grade silicone. Same base relief as every other line. Age-marked 3+." },
  designer: { num: "N° 03", name: "Designer",  size: "15–30 cm", ref: "cat-sized",     price: "from €68",    lt: "6 weeks · collab", accent: "#E0553F", desc: "Hand-cast in silicone, runs up to 300. Natural rubber with EPDM additives. Design sign-off from the collab author. 6+, collector's object, not a toy." },
  mega:     { num: "N° 04", name: "Mega",      size: "50–120 cm",ref: "stool-sized",   price: "from €640",   lt: "6 weeks",         accent: "#B82E22", desc: "Rotational moulding with internal fibreglass frame. Drop-tested 5× from 1 m. Decorative-only. Indoor only, protect from direct UV." },
  architect:{ num: "N° 05", name: "Architect", size: "1.5–3 m",  ref: "bear-sized",    price: "on request",  lt: "12 weeks · install", accent: "#0E0E0E", desc: "Sculptural casting against a CNC-milled polystyrene master. Internal steel frame with stiffening ribs. Ultrasonic inspection. Certified crew installation." }
};

const style = document.createElement('style');
style.textContent = `
.modal{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;padding:24px}
.modal.is-open{display:flex}
.modal__overlay{position:absolute;inset:0;background:rgba(14,14,14,.72);backdrop-filter:blur(4px);opacity:0;transition:opacity 280ms var(--ease-out);cursor:pointer}
.modal.is-open .modal__overlay{opacity:1}
.modal__panel{position:relative;width:min(560px,92vw);max-height:88vh;overflow:auto;background:var(--paper);border:1px solid var(--line);box-shadow:0 40px 80px -20px rgba(0,0,0,.6),0 0 0 14px rgba(14,14,14,.4);opacity:0;transform:translateY(10px);transition:opacity 360ms var(--ease-out),transform 360ms var(--ease-out)}
.modal.is-open .modal__panel{opacity:1;transform:translateY(0)}
.modal__close{position:absolute;top:14px;right:14px;width:32px;height:32px;display:grid;place-items:center;font-size:20px;line-height:1;color:var(--fg);background:transparent;border:1px solid var(--line);font-family:var(--f-mono);transition:background 200ms var(--ease-out),color 200ms var(--ease-out)}
.modal__close:hover{background:var(--fg);color:var(--paper)}
.modal__head{padding:30px 32px 18px;border-bottom:1px solid var(--line);display:flex;align-items:baseline;gap:14px}
.modal__num{font-family:var(--f-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.modal__name{font-family:var(--f-display);font-size:32px;font-weight:500;letter-spacing:-.02em;color:var(--fg)}
.modal__accent{height:3px;background:var(--accent)}
.modal__body{padding:24px 32px 28px;display:grid;gap:18px}
.modal__specs{display:grid;grid-template-columns:repeat(2,1fr);gap:14px 22px;margin:0;padding:0}
.modal__specs>div{display:flex;flex-direction:column;gap:2px;border-top:1px solid var(--line);padding-top:8px}
.modal__specs dt{font-family:var(--f-mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0}
.modal__specs dd{margin:0;font-family:var(--f-display);font-size:15px;color:var(--fg);font-weight:500}
.modal__desc{margin:0;font-size:13px;line-height:1.6;color:var(--ink-2)}
.modal__foot{padding:14px 32px 22px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;font-family:var(--f-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.modal__share{display:flex;align-items:center;gap:10px}
.modal__share-btn{padding:6px 10px;border:1px solid var(--line);font-family:var(--f-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--fg);background:transparent;transition:background 200ms var(--ease-out),color 200ms var(--ease-out),border-color 200ms var(--ease-out)}
.modal__share-btn:hover:not([disabled]){background:var(--accent);color:var(--paper);border-color:var(--accent)}
.modal__share-btn[disabled]{opacity:.5;cursor:not-allowed}
.rung.is-active{background:rgba(226,59,44,.06);box-shadow:inset 0 0 0 1px var(--accent)}
.reveal{opacity:0;transform:translateY(14px);transition:opacity 700ms var(--ease-out),transform 700ms var(--ease-out)}
.reveal.is-in{opacity:1;transform:translateY(0)}
.hero__pill,.hero__cue,.hero__tag{cursor:pointer}
@media (prefers-reduced-motion:reduce){
  .modal__overlay,.modal__panel,.reveal{transition:opacity 0ms,transform 0ms}
  .reveal{opacity:1;transform:none}
}
`;
document.head.appendChild(style);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

const modal = document.createElement('div');
modal.className = 'modal';
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');
modal.innerHTML = `
  <div class="modal__overlay" data-close></div>
  <div class="modal__panel">
    <button class="modal__close" data-close aria-label="Close spec sheet">×</button>
    <div class="modal__head">
      <span class="modal__num"></span>
      <span class="modal__name"></span>
    </div>
    <div class="modal__accent"></div>
    <div class="modal__body">
      <dl class="modal__specs">
        <div><dt>Size</dt><dd class="m-size"></dd></div>
        <div><dt>Reference</dt><dd class="m-ref"></dd></div>
        <div><dt>Price</dt><dd class="m-price"></dd></div>
        <div><dt>Lead time</dt><dd class="m-lt"></dd></div>
      </dl>
      <p class="modal__desc"></p>
    </div>
    <div class="modal__foot">
      <span>Quacktory · Object</span>
      <div class="modal__share">
        <span>Share</span>
        <button class="modal__share-btn" type="button"><span class="share-count">0</span> / 99</button>
      </div>
    </div>
  </div>
`;
document.body.appendChild(modal);

const SHARE_CAP = 99;
let shareCount = 0;
let lastFocus = null;

function fill(d) {
  $('.modal__num', modal).textContent = d.num;
  $('.modal__name', modal).textContent = d.name;
  $('.modal__accent', modal).style.background = d.accent;
  $('.m-size', modal).textContent = d.size;
  $('.m-ref', modal).textContent = d.ref;
  $('.m-price', modal).textContent = d.price;
  $('.m-lt', modal).textContent = d.lt;
  $('.modal__desc', modal).textContent = d.desc;
  shareCount = 0;
  $('.share-count', modal).textContent = '0';
  $('.modal__share-btn', modal).disabled = false;
}

function openModal(sku) {
  const d = SKU[sku];
  if (!d) return;
  fill(d);
  lastFocus = document.activeElement;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  $('.modal__close', modal).focus();
}

function openSettings() {
  fill({
    num: "00 · Display", name: "Settings",
    size: "editorial paper", ref: "warm red · #E23B2C",
    price: "motion: opacity + 8 px", lt: "ease-out · 360 ms",
    accent: "var(--accent)",
    desc: "Hover any subject to read its spec sheet. Press Esc to close. Respects prefers-reduced-motion. Single accent only — no shadows, no gradients on the screen."
  });
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  $('.modal__close', modal).focus();
}

function closeModal() {
  if (!modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

modal.addEventListener('click', e => { if (e.target.dataset.close !== undefined) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

$$('.duck').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.sku)));

$$('.rung').forEach(rung => {
  const fire = () => {
    $$('.rung').forEach(r => r.classList.remove('is-active'));
    rung.classList.add('is-active');
    openModal(rung.dataset.sku);
  };
  rung.addEventListener('click', fire);
  rung.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); }
  });
});

$$('.hero__pill').forEach(p => p.addEventListener('click', () => openModal('designer')));

const gear = $('.logo__mark');
if (gear) gear.addEventListener('click', e => { e.preventDefault(); openSettings(); });

$('.modal__share-btn', modal).addEventListener('click', e => {
  if (shareCount >= SHARE_CAP) return;
  shareCount++;
  $('.share-count', modal).textContent = shareCount;
  if (shareCount >= SHARE_CAP) e.currentTarget.disabled = true;
});

$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

$$('.hero__cue, .hero__tag').forEach(c => {
  c.addEventListener('click', () => $('#ladder')?.scrollIntoView({ behavior: 'smooth' }));
});

const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

$$('.hero__copy, .hero__visual, .ladder, .how, .vitrine, .b2b').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});
