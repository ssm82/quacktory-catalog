// file: main.js
(() => {
  // ============ INJECT MODAL STYLES ============
  const style = document.createElement('style');
  style.textContent = `
    .duck-modal{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .4s var(--ease)}
    .duck-modal.is-open{opacity:1;pointer-events:auto}
    .duck-modal__overlay{position:absolute;inset:0;background:rgba(36,53,36,.78);backdrop-filter:blur(6px);cursor:pointer}
    .duck-modal__box{position:relative;max-width:560px;width:calc(100% - 48px);background:linear-gradient(180deg,#F2E8D5 0%,#E8C9A8 100%);color:#243524;padding:38px 36px 26px;border:2px solid #2C3A2A;box-shadow:0 40px 80px -20px rgba(0,0,0,.55);transform:translateY(20px) scale(.96);transition:transform .5s var(--ease)}
    .duck-modal.is-open .duck-modal__box{transform:translateY(0) scale(1)}
    .duck-modal__close{position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;border:1.5px solid #2C3A2A;background:transparent;color:#2C3A2A;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;transition:background .3s,color .3s,transform .4s}
    .duck-modal__close:hover{background:#2C3A2A;color:#F2E8D5;transform:rotate(90deg)}
    .duck-modal__eyebrow{display:inline-block;font-family:var(--font-body);font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#B8965A;margin-bottom:8px}
    .duck-modal__title{font-family:var(--font-display);font-size:32px;line-height:1.05;color:#243524;margin-bottom:6px;letter-spacing:.02em}
    .duck-modal__edition{display:block;font-family:var(--font-body);font-style:italic;font-size:14px;color:#8B5A3C;margin-bottom:14px}
    .duck-modal__desc{font-family:var(--font-body);font-size:14px;line-height:1.6;color:#3A3A38;margin-bottom:18px}
    .duck-modal__facts{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:8px 18px;margin-bottom:18px;padding:14px 16px;background:rgba(44,58,42,.08);border-left:3px solid var(--modal-accent,#B8965A)}
    .duck-modal__facts li{font-family:var(--font-body);font-size:11px;letter-spacing:.05em;color:#243524}
    .duck-modal__facts li b{display:block;font-family:var(--font-display);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#8B5A3C;margin-bottom:2px}
    .duck-modal__foot{display:flex;justify-content:space-between;align-items:center;gap:14px;padding-top:16px;border-top:1px dashed #8B5A3C}
    .duck-modal__share{display:flex;align-items:center;gap:10px}
    .duck-modal__share-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#2C3A2A;color:#F2E8D5;font-family:var(--font-display);font-size:11px;letter-spacing:.15em;text-transform:uppercase;border:none;transition:transform .3s,background .3s}
    .duck-modal__share-btn:hover{background:#B8965A;color:#243524;transform:translateY(-2px)}
    .duck-modal__share-btn[disabled]{opacity:.5;cursor:default}
    .duck-modal__share-count{font-family:var(--font-body);font-size:11px;color:#8B5A3C;letter-spacing:.05em}
    .duck-modal__code{font-family:var(--font-body);font-size:10px;letter-spacing:.2em;color:#8B5A3C}
    .scale-item,.workshop-card,.scale-tick,.meta-row,.corner-ornament{cursor:pointer}
    .scale-item.is-flash .scale-figure{transform:translateY(-8px) scale(1.02)}
    .workshop-card.is-flash{box-shadow:0 0 0 2px var(--brass),var(--shadow-deep)}
    body.no-scroll{overflow:hidden}
    .reveal{opacity:0;transform:translateY(28px);transition:opacity .8s var(--ease),transform .8s var(--ease)}
    .reveal.is-in{opacity:1;transform:translateY(0)}
  `;
  document.head.appendChild(style);

  // ============ MODAL DOM ============
  const modal = document.createElement('div');
  modal.className = 'duck-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="duck-modal__overlay" data-close></div>
    <div class="duck-modal__box">
      <button class="duck-modal__close" data-close aria-label="Close">✕</button>
      <span class="duck-modal__eyebrow"></span>
      <h2 class="duck-modal__title"></h2>
      <span class="duck-modal__edition"></span>
      <p class="duck-modal__desc"></p>
      <ul class="duck-modal__facts"></ul>
      <div class="duck-modal__foot">
        <div class="duck-modal__share">
          <button class="duck-modal__share-btn" type="button"><span>⇪</span><span>Share this</span></button>
          <span class="duck-modal__share-count">0 / 404</span>
        </div>
        <span class="duck-modal__code"></span>
      </div>
    </div>`;
  document.body.appendChild(modal);
  const $ = (s) => modal.querySelector(s);
  const $box = $('.duck-modal__box'), $eye = $('.duck-modal__eyebrow'),
        $title = $('.duck-modal__title'), $ed = $('.duck-modal__edition'),
        $desc = $('.duck-modal__desc'), $facts = $('.duck-modal__facts'),
        $count = $('.duck-modal__share-count'), $code = $('.duck-modal__code'),
        $share = $('.duck-modal__share-btn');

  // ============ DATA ============
  const LINE = {
    micro:     {eyebrow:'Line 01 · Pocket',      title:'Quacktory Micro',     edition:'4–8 cm · pocket',          desc:'A tiny rubber duck that does not get lost — it gets kept. Keychain, merch, a "just because" gift.', accent:'#B8965A', facts:[['Edition','stock'],['Size','4–8 cm'],['Price','up to ~$7'],['Lead','in stock'],['Material','silicone'],['For','keychains · merch']],         code:'QCT-MICRO-01'},
    classic:   {eyebrow:'Line 02 · Bath',        title:'Quacktory Classic',   edition:'10–25 cm · palm',        desc:'The duck everyone remembers. Solid cast, soft mouth, stable in water. Age 3+ — straight from the bath.', accent:'#A06B45', facts:[['Edition','stock'],['Size','10–25 cm'],['Price','~$16'],['Lead','in stock'],['Material','silicone'],['For','bath · desk']],       code:'QCT-CLASSIC-02'},
    designer:  {eyebrow:'Line 03 · Atelier',     title:'Quacktory Designer',  edition:'15–30 cm · collabs',       desc:'Limited runs and collabs. Hand-laid silicone-mold forming — one cycle a day. A collectible object, not a toy.', accent:'#C8756A', facts:[['Edition','limited'],['Size','15–30 cm'],['Price','from $38'],['Lead','6 wks'],['Material','natural rubber'],['For','window display · collection']], code:'QCT-DESIGNER-03'},
    mega:      {eyebrow:'Line 04 · Object',      title:'Quacktory Mega',      edition:'50–120 cm · photo object',   desc:'A duck the size of a child. Rotational molding, ~2 h in the oven plus cool-down. Ideal as a statement gift.', accent:'#2C3A2A', facts:[['Edition','on request'],['Size','50–120 cm'],['Price','from $240'],['Lead','6 wks'],['Material','rubber + EPDM'],['For','photo · window · events']], code:'QCT-MEGA-04'},
    architect: {eyebrow:'Line 05 · Installation',title:'Quacktory Architect', edition:'1.5–3 m · installation',    desc:'A sculptural pour with a steel frame. Installed by our crew. Product passport included. No longer a duck — a bear.', accent:'#243524', facts:[['Edition','unique'],['Size','1.5–3 m'],['Price','on request'],['Lead','12 wks'],['Material','rubber + steel'],['For','installations · brand']],  code:'QCT-ARCHITECT-05'}
  };
  const CH = {
    hero:     {eyebrow:'Chapter 01', title:'The Collection',    edition:'Main hall',  desc:'Introduction to the Quacktory collection: five lines, one silhouette, range from 4 cm to 3 m. Serious ducks for un-serious people.', accent:'#B8965A', facts:[['Range','4 cm → 3 m'],['Lines','5'],['Creed','serious ducks'],['Year','since the first splash']], code:'QCT-CH-01'},
    scale:    {eyebrow:'Chapter 02', title:'From Thumb to Bear',edition:'Scale',     desc:'The silhouette does not scale linearly. The 3 m Architect remains "the same duck" as the 4 cm Micro. One silhouette — five characters.', accent:'#A06B45', facts:[['Lines','5'],['Min','4 cm'],['Max','3 m'],['Span','×75']], code:'QCT-CH-02'},
    workshop: {eyebrow:'Chapter 03', title:'How We Make Them',  edition:'Workshop',         desc:'Solid cast. No plastic inserts. No glued seams. Eyes — painted, not stickered. Resistant to UV and water.', accent:'#2C3A2A', facts:[['Process','casting'],['Material','silicone · rubber'],['Seams','none'],['Eyes','pigment']], code:'QCT-CH-03'},
    brands:   {eyebrow:'Chapter 04', title:'For Brands',        edition:'Collaborations',desc:'White-label and limited runs for brands. The Designer line as a platform: 6 weeks from master model to a 200-piece batch.', accent:'#C8756A', facts:[['MOQ','200 pcs.'],['Lead','6 wks.'],['Edition','limited'],['Service','white-label']], code:'QCT-CH-04'}
  };
  const SETTINGS = {eyebrow:'Atelier · Settings', title:'Atelier controls', edition:'What can be configured', desc:'This page is already tuned to the max. Fonts, palette, rhythm and grid density are set for a "road album" feel. If you want changes — write to Quacktory directly.', accent:'#B8965A', facts:[['Font','Alfa Slab + Playfair'],['Palette','terracotta · cream · forest'],['Layout','editorial · 4 chapters'],['Mode','display only'],['Cookie','none'],['GDPR','view only']], code:'QCT-SET-00'};

  // ============ MODAL CORE ============
  const CAP = 404;
  let count = 0;
  function open(payload, src) {
    const d = (typeof payload === 'string') ? (LINE[payload] || CH[payload]) : payload;
    if (!d) return;
    $eye.textContent = d.eyebrow;
    $title.textContent = d.title;
    $ed.textContent = d.edition;
    $desc.textContent = d.desc;
    $box.style.setProperty('--modal-accent', d.accent);
    $code.textContent = '№ ' + d.code;
    $facts.innerHTML = d.facts.map(([k,v]) => `<li><b>${k}</b>${v}</li>`).join('');
    count = 0; $count.textContent = '0 / ' + CAP;
    $share.disabled = false; $share.lastElementChild.textContent = 'Share this';
    modal.classList.add('is-open');
    document.body.classList.add('no-scroll');
    if (src) {
      src.classList.add('is-flash');
      setTimeout(() => src.classList.remove('is-flash'), 600);
    }
  }
  function close() { modal.classList.remove('is-open'); document.body.classList.remove('no-scroll'); }
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
  $share.addEventListener('click', () => {
    if (count >= CAP) return;
    count++;
    $count.textContent = count + ' / ' + CAP;
    $share.style.transform = 'translateY(-2px) scale(1.05)';
    setTimeout(() => $share.style.transform = '', 200);
    if (count >= CAP) { $share.disabled = true; $share.lastElementChild.textContent = 'Cap reached'; }
  });

  // ============ WIRING ============
  document.querySelector('.menu-medallion')?.addEventListener('click', () => open(SETTINGS));

  document.querySelectorAll('.chapter-rail a').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = (a.getAttribute('href') || '').replace('#', '');
      if (!CH[id]) return;
      e.preventDefault();
      document.querySelectorAll('.chapter-rail a').forEach((x) => x.classList.toggle('is-active', x === a));
      open(id, a);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 650);
    });
  });

  document.querySelectorAll('.scale-item').forEach((it) => {
    it.addEventListener('click', (e) => { if (e.target.closest('a')) return; open(it.getAttribute('data-line'), it); });
  });

  document.querySelectorAll('.workshop-card').forEach((card) => {
    card.addEventListener('click', () => {
      const num = card.querySelector('.ws-num')?.textContent.trim() || '3.0';
      const title = card.querySelector('h3')?.textContent.trim() || 'Workshop step';
      const raw = card.querySelector('p')?.textContent.trim() || card.textContent.trim();
      open({
        eyebrow: 'Chapter 03 · Step ' + num,
        title, edition: 'Workshop · ' + num,
        desc: raw.slice(0, 240) + (raw.length > 240 ? '…' : ''),
        accent: '#2C3A2A',
        facts: [['Step', num], ['Process', 'manual + automatic'], ['Material', 'silicone · rubber'], ['QC', '100% visual']],
        code: 'QCT-WS-' + num.replace('.', '')
      }, card);
    });
  });

  document.querySelectorAll('.scale-tick, .meta-row, .corner-ornament').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const tick = el.textContent.trim().split('\n')[0].slice(0, 28);
      const block = el.closest('.scale-item')?.querySelector('.scale-line')?.textContent
                 || el.closest('article')?.id
                 || 'Atelier';
      const key = el.closest('.scale-item')?.getAttribute('data-line') || 'atelier';
      const accent = (LINE[key] || SETTINGS).accent;
      open({
        eyebrow: 'Mark · ' + tick,
        title: 'Catalog mark — ' + tick,
        edition: 'Mark · ' + block,
        desc: 'A pointer mark "' + tick + '" inside the "' + block + '" block. Click the subject itself for full specs.',
        accent,
        facts: [['Mark', tick], ['Block', block], ['Type', 'tooltip pill'], ['Action', 'open card']],
        code: 'QCT-MARK-' + (tick.replace(/\D/g, '') || '00')
      });
    });
  });

  document.querySelector('.brand-lockup')?.addEventListener('click', (e) => {
    const href = document.querySelector('.brand-lockup').getAttribute('href') || '#hero';
    const t = document.querySelector(href);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  // ============ SCROLL REVEAL ============
  const reveals = document.querySelectorAll('.chapter-head, .scale-item, .workshop-card, .hero-content');
  reveals.forEach((el) => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add('is-in'));

  // ============ ACTIVE CHAPTER ON SCROLL ============
  const sections = document.querySelectorAll('article[id]');
  const railLinks = document.querySelectorAll('.chapter-rail a');
  const setActive = () => {
    let cur = 'hero';
    sections.forEach((s) => { if (s.getBoundingClientRect().top < window.innerHeight * 0.45) cur = s.id; });
    railLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + cur));
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();
