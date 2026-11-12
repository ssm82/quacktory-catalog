// file: main.js
// Quacktory — single-screen gallery: smooth scroll and restrained motion

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* === Smooth scroll for in-page links === */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

/* === Subtle hero parallax (very small vertical offset) === */
if (!reduceMotion) {
  const frame = document.querySelector('.hero__frame');
  if (frame) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const r = frame.getBoundingClientRect();
        const center = window.innerHeight / 2 - (r.top + r.height / 2);
        const offset = Math.max(-12, Math.min(12, center * 0.02));
        frame.style.setProperty('--parallax', `${offset}px`);
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }
}
