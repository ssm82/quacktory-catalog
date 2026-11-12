// file: main.js
(function(){
  'use strict';

  const DATA = {
    micro:    {name:'Micro',     size:'4 cm',     cmp:'thumb-sized',  price:'from $8',     lead:'Today',    desc:'Keychain, gift, impulse. The pocket duck. Injection-moulded, food-grade silicone compound, eight cavities per cycle.'},
    classic:  {name:'Classic',   size:'18 cm',    cmp:'palm-sized',   price:'from $24',    lead:'3 weeks',  desc:'Bathroom, office, kids. The duck you remember, vulcanised food-grade silicone with hand-painted eyes.'},
    designer: {name:'Designer',  size:'24 cm',    cmp:'cat-sized',    price:'from $68',    lead:'6 weeks',  desc:'Limited illustrator collabs, hand-cast in silicone moulds. Signed and numbered, ≤300 per run.'},
    mega:     {name:'Mega',      size:'85 cm',    cmp:'child-sized',  price:'from $440',   lead:'6 weeks',  desc:'Shop window, photo object, statement gift. Rotational-moulded with internal fibreglass frame.'},
    architect:{name:'Architect', size:'1.5 — 3 m',cmp:'bear-sized',   price:'on request', lead:'12 weeks', desc:'Lobbies, weddings, branded spaces. CNC-milled master, welded steel frame, certified crew install.'}
  };

  const css = document.createElement('style');
  css.textContent = `
    .qmodal{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;padding:24px}
    .qmodal.is-open{display:flex}
    .qmodal__ov{position:absolute;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:qfi .24s var(--ease-out)}
    .qmodal__pn{position:relative;width:min(540px,100%);background:#0E0E10;border:1px solid var(--line);border-radius:24px;padding:36px 32px;animation:qpi .42s var(--ease-out);box-shadow:0 30px 80px rgba(0,0,0,.6)}
    .qmodal__x{position:absolute;top:14px;right:16px;width:30px;height:30px;border-radius:50%;font-size:20px;color:var(--muted);transition:color var(--t-fast)}
    .qmodal__x:hover{color:var(--fg)}
    .qmodal__st{font-family:var(--display);font-size:10px;letter-spacing:.3em;color:var(--accent);text-transform:uppercase}
    .qmodal__nm{font-family:var(--display);font-size:38px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;margin:6px 0 4px;line-height:1}
    .qmodal__sz{font-family:var(--display);font-size:11px;letter-spacing:.26em;color:var(--muted);text-transform:uppercase}
    .qmodal__ds{font-size:14px;line-height:1.65;color:var(--muted);margin:18px 0 22px}
    .qmodal__gr{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:18px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
    .qmodal__gr b{display:block;font-family:var(--display);font-size:9px;letter-spacing:.3em;color:var(--muted);text-transform:uppercase;margin-bottom:6px;font-weight:500}
    .qmodal__gr span{font-size:13px;color:var(--fg)}
    .qmodal__sb{display:flex;align-items:center;gap:10px;width:100%;justify-content:center;padding:14px;margin-top:22px;background:var(--accent);color:var(--ink);border-radius:999px;font-family:var(--display);font-size:11px;letter-spacing:.26em;text-transform:uppercase;font-weight:500;transition:transform var(--t-fast) var(--ease-out),filter var(--t-fast)}
    .qmodal__sb:hover{transform:scale(1.02);filter:brightness(1.06)}
    .qmodal__sb[disabled]{opacity:.55;cursor:default;transform:none;filter:none}
    .qmodal__ct{margin-left:auto;font-variant-numeric:tabular-nums;letter-spacing:.1em}
    .qgear{position:fixed;bottom:24px;right:24px;width:44px;height:44px;border-radius:50%;background:#15151A;border:1px solid var(--line);color:var(--muted);font-size:18px;z-index:80;transition:transform var(--t-mid) var(--ease-out),color var(--t-fast),border-color var(--t-fast)}
    .qgear:hover{color:var(--accent);border-color:var(--accent);transform:rotate(45deg)}
    @keyframes qfi{from{opacity:0}to{opacity:1}}
    @keyframes qpi{from{opacity:0;transform:translateY(18px) scale(.98)}to{opacity:1;transform:none}}
  `;
  document.head.appendChild(css);

  const m = document.createElement('div');
  m.className = 'qmodal';
  m.innerHTML = `
    <div class="qmodal__ov" data-c></div>
    <div class="qmodal__pn" role="dialog" aria-modal="true" aria-label="Spec sheet">
      <button class="qmodal__x" data-c aria-label="Close">×</button>
      <div class="qmodal__st" id="qm-st"></div>
      <h3 class="qmodal__nm" id="qm-nm"></h3>
      <div class="qmodal__sz" id="qm-sz"></div>
      <p class="qmodal__ds" id="qm-ds"></p>
      <div class="qmodal__gr">
        <div><b>Lead time</b><span id="qm-ld"></span></div>
        <div><b>Price</b><span id="qm-pr"></span></div>
        <div><b>Scale</b><span id="qm-cm"></span></div>
      </div>
      <button class="qmodal__sb" id="qm-sb"><span>↗</span><span>Share</span><span class="qmodal__ct" id="qm-ct">0 / 500</span></button>
    </div>`;
  document.body.appendChild(m);

  const gear = document.createElement('button');
  gear.className = 'qgear';
  gear.setAttribute('aria-label','Open settings');
  gear.innerHTML = '⚙';
  document.body.appendChild(gear);

  const CAP = 500, $ = id => m.querySelector('#'+String(id).replace(/^#/, ''));
  let n = 0;

  function open(payload){
    $.st.textContent = payload.st || 'Spec sheet';
    $.nm.textContent = payload.nm;
    $.sz.textContent = payload.sz || '';
    $.ds.textContent = payload.ds;
    $.ld.textContent = payload.ld || '—';
    $.pr.textContent = payload.pr || '—';
    $.cm.textContent = payload.cm || '—';
    n = 0; $.ct.textContent = '0 / '+CAP;
    $('#qm-sb').disabled = false;
    m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function close(){ m.classList.remove('is-open'); document.body.style.overflow = ''; }

  m.addEventListener('click', e => { if(e.target.hasAttribute('data-c')) close(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && m.classList.contains('is-open')) close(); });

  $('#qm-sb').addEventListener('click', e => {
    e.stopPropagation();
    if(n >= CAP) return;
    n++;
    $.ct.textContent = n+' / '+CAP;
    if(n >= CAP){ e.currentTarget.disabled = true; $.ct.textContent = 'capped at '+CAP; }
  });

  document.querySelectorAll('.ladder__node').forEach(node => {
    node.addEventListener('click', () => {
      const d = DATA[node.dataset.sku]; if(!d) return;
      document.querySelectorAll('.ladder__node').forEach(x => x.setAttribute('aria-selected','false'));
      node.setAttribute('aria-selected','true');
      open({st:'Ladder · '+node.dataset.sku, nm:d.name, sz:d.size+' · '+d.cmp, ds:d.desc, ld:d.lead, pr:d.price, cm:d.cmp});
    });
  });

  document.querySelectorAll('.card[data-sku]').forEach(card => {
    const fire = () => {
      const d = DATA[card.dataset.sku]; if(!d) return;
      open({st:'Lineup · '+card.dataset.sku, nm:d.name, sz:d.size+' · '+d.cmp, ds:d.desc, ld:d.lead, pr:d.price, cm:d.cmp});
    };
    card.addEventListener('click', fire);
    card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); fire(); }});
  });

  gear.addEventListener('click', () => open({
    st:'Settings',
    nm:'Preferences',
    sz:'No toggles to flip — just information',
    ds:'This panel is the only modal on the site. It opens from the gear, from any card in the lineup, and from any node on the size ladder — same panel, different payload. We use it to keep the catalogue legible without burying specs in footnotes.',
    ld:'n/a', pr:'free', cm:'everyone'
  }));

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if(id.length > 1){
        const t = document.querySelector(id);
        if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
    });
  });

  const next = document.querySelector('.hero__next');
  if(next) next.addEventListener('click', () => {
    const t = document.getElementById('lineup');
    if(t) t.scrollIntoView({behavior:'smooth', block:'start'});
  });

  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if(en.isIntersecting){
          en.target.style.opacity = '1';
          en.target.style.transform = 'none';
          io.unobserve(en.target);
        }
      });
    }, {threshold:.1, rootMargin:'0px 0px -60px 0px'});

    document.querySelectorAll('.section-head, .ladder, .ladder__node, .card, .fact, .b2b, .lineup, .production').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 600ms var(--ease-out), transform 600ms var(--ease-out)';
      io.observe(el);
    });
  }

  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('*').forEach(el => { el.style.animation = 'none'; el.style.transition = 'none'; });
  }
})();
