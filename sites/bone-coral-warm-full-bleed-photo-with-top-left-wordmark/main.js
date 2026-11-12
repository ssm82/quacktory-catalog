// file: main.js

document.documentElement.classList.add('qt-js');

// ─── Smooth-scroll fallback for anchor links ───────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const t = document.getElementById(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ─── Hero parallax: drift the knockout window ───────
const heroMask = document.querySelector('.hero-mask-text');
const hero = document.querySelector('.hero');
if (hero && heroMask) {
  window.addEventListener('scroll', () => {
    const r = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const p = Math.max(-1, Math.min(1, -r.top / r.height));
    heroMask.style.backgroundPosition = `center calc(-70% + ${p * 8}%)`;
  }, { passive: true });
}
