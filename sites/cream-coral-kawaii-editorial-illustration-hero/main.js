// file: main.js

// ===== Inline styles for dynamic elements =====
const style = document.createElement('style');
style.textContent = `
  .modal{position:fixed;inset:0;z-index:9998;display:grid;place-items:center;opacity:0;pointer-events:none;transition:opacity .25s ease}
  .modal.open{opacity:1;pointer-events:auto}
  .modal-overlay{position:absolute;inset:0;background:rgba(20,58,140,.55);backdrop-filter:blur(6px)}
  .modal-card{position:relative;background:#F7F1E2;border:3px solid #1F4FB8;border-radius:24px;padding:36px 32px 28px;max-width:440px;width:calc(100% - 40px);box-shadow:0 20px 60px rgba(31,79,184,.4);transform:translateY(20px) scale(.96);transition:transform .3s cubic-bezier(.2,.8,.2,1)}
  .modal.open .modal-card{transform:translateY(0) scale(1)}
  .modal-close{position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:50%;background:#1F4FB8;color:#fff;font-size:18px;font-weight:700;display:grid;place-items:center;transition:transform .2s ease,background .2s ease}
  .modal-close:hover{background:#E8652A;transform:rotate(90deg)}
  .modal-dot{width:44px;height:44px;border-radius:50%;border:3px solid #1F4FB8;margin-bottom:14px;box-shadow:0 4px 12px rgba(31,79,184,.25)}
  .modal-title{font-family:'Anton',Impact,sans-serif;font-size:34px;color:#1F4FB8;line-height:1;margin-bottom:10px;text-transform:uppercase;letter-spacing:.02em}
  .modal-desc{font-size:15px;color:#143A8C;line-height:1.55;margin-bottom:18px}
  .modal-meta{display:flex;gap:18px;flex-wrap:wrap;font-size:11px;color:#1F4FB8;text-transform:uppercase;letter-spacing:.08em}
  .modal-meta span b{display:block;font-weight:800;font-size:18px;color:#E8652A;letter-spacing:0;margin-bottom:2px}
  .bookend{transition:transform .3s ease,filter .3s ease;cursor:pointer}
  .bookend:hover{transform:translateY(-8px) scale(1.04);filter:drop-shadow(0 18px 30px rgba(232,101,42,.5))}
`;
document.head.append(style);

// ===== Modal =====
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
  <div class="modal-overlay" data-close></div>
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button class="modal-close" data-close aria-label="Close">✕</button>
    <div class="modal-dot"></div>
    <h3 class="modal-title" id="modal-title"></h3>
    <p class="modal-desc"></p>
    <div class="modal-meta"></div>
  </div>`;
document.body.append(modal);

function openModal(d){
  modal.querySelector('.modal-dot').style.background = d.accent;
  modal.querySelector('.modal-title').textContent = d.title;
  modal.querySelector('.modal-desc').textContent = d.desc;
  modal.querySelector('.modal-meta').innerHTML = `
    <span><b>${d.size||'—'}</b>size</span>
    <span><b>${d.edition||'—'}</b>edition</span>
    <span><b>${d.year||'2026'}</b>year</span>
    <span><b>${d.accent||'—'}</b>accent</span>`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
modal.addEventListener('click', e => { if (e.target.dataset.close !== undefined) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== Wire bookend ducks =====
document.querySelectorAll('.bookend').forEach(el => {
  el.addEventListener('click', () => openModal({
    title: el.classList.contains('b-l') ? 'Sakura Bracket' : 'Koi Bracket',
    size: 'XL', edition: el.classList.contains('b-l') ? '№001' : '№002', year: '2026',
    accent: el.classList.contains('b-l') ? '#F2A5C4' : '#F2A45A',
    desc: el.classList.contains('b-l')
      ? 'Left bracket of the logo. Sakura palette, holds the letter Q from falling into the sky.'
      : 'Right bracket of the logo. Salmon palette, mirrors the left — without it the letter Y would have no shores.'
  }));
});

// ===== START CTA =====
const cta = document.querySelector('.cta-trip');
if (cta) {
  cta.addEventListener('click', e => {
    e.preventDefault();
    openModal({
      title: 'The trip starts here',
      size: '4 cm → 3 m', edition: 'collection 2026', year: '2026', accent: '#E8652A',
      desc: 'Enjoy your virtual duck trip and go out only once it is safe. Solid rubber, no inserts — small ones for a pocket, big ones for a foyer.'
    });
  });
}

// ===== Smooth scroll for in-page anchors =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const t = document.querySelector(id);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  });
});
