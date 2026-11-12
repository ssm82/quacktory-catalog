// file: main.js
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const catalog = {
    micro: {
      title: 'Micro', meta: '4–8 cm · Thumb-sized',
      description: 'A pocket-scale duck for people who still want their everyday objects to have character.',
      accent: '#f03a45',
      facts: [['Edition', 'Open edition'], ['Material', 'Food-grade silicone'], ['Made for', 'Keychains, merch and gifts up to about $10']]
    },
    classic: {
      title: 'Classic', meta: '10–25 cm · Cat-sized',
      description: 'The familiar duck, reduced to one clean piece and scaled for desks, bathrooms and playful interiors.',
      accent: '#f4a51c',
      facts: [['Edition', 'Core collection'], ['Material', 'Food-grade silicone'], ['Made for', 'Kids, offices and bathrooms']]
    },
    designer: {
      title: 'Designer', meta: '15–30 cm · Cat-sized',
      description: 'A limited object for limited runs, artist collaborations and spaces that treat objects as exhibits.',
      accent: '#ffd83d',
      facts: [['Edition', 'Limited runs'], ['Material', 'Natural rubber with EPDM'], ['Made for', 'Illustrator collaborations and collectible displays']]
    },
    mega: {
      title: 'Mega', meta: '50–120 cm · Bear-sized',
      description: 'A statement duck with enough presence to anchor a room, a campaign or a very good photograph.',
      accent: '#d7193f',
      facts: [['Edition', 'Made to order'], ['Material', 'Natural rubber with EPDM'], ['Made for', 'Photo objects, window displays and statement gifts']]
    },
    architect: {
      title: 'Architect', meta: '1.5–3 m · Bear-sized',
      description: 'A room-sized duck built as an installation, turning branding and hospitality into a physical gesture.',
      accent: '#f03a45',
      facts: [['Edition', 'Commissioned'], ['Material', 'Natural rubber with EPDM'], ['Made for', 'Installations, events, weddings and branded spaces']]
    },
    settings: {
      title: 'A quieter browsing experience', meta: 'Site settings · Accessibility',
      description: 'Motion follows your system preference. When reduced motion is enabled, reveals and parallax are replaced by short, transparent fades.',
      accent: '#f4a51c',
      facts: [['Motion', 'System preference'], ['Layout', 'Responsive and fluid'], ['Interaction', 'Keyboard accessible']]
    }
  };

  const init = () => {
    const header = document.querySelector('[data-header]');
    const create = (tag, className = '', text = '') => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (text) element.textContent = text;
      return element;
    };

    const overlay = create('div');
    overlay.id = 'quacktory-modal-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(8,13,18,.84);opacity:0;transition:opacity 220ms cubic-bezier(.4,0,.2,1);';

    const dialog = create('div');
    dialog.id = 'quacktory-modal-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'quacktory-modal-title');
    dialog.style.cssText = 'position:relative;width:min(720px,100%);max-height:calc(100svh - 32px);overflow:auto;box-sizing:border-box;padding:clamp(28px,6vw,58px);background:#111820;color:#fff;border:1px solid rgba(255,255,255,.16);border-top:3px solid #f03a45;border-radius:0;box-shadow:0 28px 80px rgba(0,0,0,.42);opacity:0;transform:translateY(22px) scale(.985);transition:opacity 240ms cubic-bezier(.22,1,.36,1),transform 240ms cubic-bezier(.22,1,.36,1);';

    const closeButton = create('button', '', '×');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close dialog');
    closeButton.style.cssText = 'position:absolute;top:14px;right:14px;width:44px;height:44px;border:0;background:transparent;color:#fff;font-size:28px;font-weight:300;line-height:1;cursor:pointer;';

    const accent = create('div');
    accent.setAttribute('aria-hidden', 'true');
    accent.style.cssText = 'width:64px;height:3px;margin-bottom:22px;background:#f03a45;';

    const kicker = create('p', 'section-kicker');
    const title = create('h2', 'section-title');
    title.id = 'quacktory-modal-title';
    title.style.cssText = 'margin:0 0 12px;color:#fff;font-size:clamp(2rem,6vw,4.6rem);line-height:.98;font-weight:300;letter-spacing:-.035em;text-transform:uppercase;';
    const meta = create('p', 'scale-size');
    meta.style.cssText = 'margin:0 0 28px;color:#aebbc4;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;';
    const description = create('p', 'making-lead');
    description.style.cssText = 'max-width:570px;margin:0 0 34px;color:#d6dde2;font-size:clamp(1rem,2vw,1.18rem);line-height:1.7;';
    const facts = create('dl', 'fact-list');
    facts.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin:0;padding-top:24px;border-top:1px solid rgba(255,255,255,.16);';

    dialog.append(closeButton, accent, kicker, title, meta, description, facts);
    overlay.append(dialog);
    document.body.append(overlay);

    let lastFocused = null;
    let closeTimer = 0;
    let previousOverflow = '';

    const openModal = (key, source) => {
      clearTimeout(closeTimer);
      const normalized = String(key || '').toLowerCase();
      const data = catalog[normalized] || {
        title: source?.querySelector('.scale-name')?.textContent || source?.getAttribute('aria-label') || 'Quacktory object',
        meta: source?.querySelector('.scale-size')?.textContent || 'Made to order',
        description: 'A one-piece rubber duck built with the same material standards across the Quacktory collection.',
        accent: '#f03a45',
        facts: [['Material', 'Vulcanised rubber'], ['Edition', 'Quacktory collection'], ['Care', 'Warm water and mild soap']]
      };

      kicker.textContent = normalized === 'settings' ? 'Settings' : 'Quacktory / Size ladder';
      title.textContent = data.title;
      meta.textContent = data.meta;
      description.textContent = data.description;
      accent.style.background = data.accent;
      dialog.style.borderTopColor = data.accent;
      facts.replaceChildren(...data.facts.map(([label, value]) => {
        const item = create('div', 'fact-item');
        const term = create('dt', 'fact-label', label);
        const detail = create('dd', 'fact-value', value);
        term.style.cssText = 'margin:0 0 7px;color:#f03a45;font-size:.64rem;letter-spacing:.16em;text-transform:uppercase;';
        detail.style.cssText = 'margin:0;color:#aebbc4;font-size:.82rem;line-height:1.55;';
        item.append(term, detail);
        return item;
      }));

      document.querySelectorAll('[data-modal-trigger]').forEach((trigger) => {
        trigger.setAttribute('aria-pressed', String(trigger === source));
      });

      lastFocused = source || document.activeElement;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      overlay.style.display = 'flex';
      overlay.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        dialog.style.opacity = '1';
        dialog.style.transform = 'translateY(0) scale(1)';
        closeButton.focus({ preventScroll: true });
      });
    };

    const closeModal = () => {
      if (overlay.style.display === 'none') return;
      overlay.style.opacity = '0';
      dialog.style.opacity = '0';
      dialog.style.transform = 'translateY(14px) scale(.99)';
      const finish = () => {
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = previousOverflow;
        lastFocused?.focus?.({ preventScroll: true });
      };
      if (reducedMotion.matches) finish();
      else closeTimer = window.setTimeout(finish, 230);
    };

    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeModal();
    });

    document.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const trigger = event.target.closest('[data-modal-trigger]');
      if (!trigger) return;
      event.preventDefault();
      openModal(trigger.dataset.modalTrigger, trigger);
    });

    document.addEventListener('keydown', (event) => {
      if (overlay.getAttribute('aria-hidden') === 'true') return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    if (header) {
      const headerCta = header.querySelector('.header-cta');
      const controls = create('div');
      controls.style.cssText = 'display:flex;align-items:center;justify-self:end;gap:24px;';
      if (headerCta) {
        headerCta.parentNode.insertBefore(controls, headerCta);
        controls.append(headerCta);
      } else {
        header.append(controls);
      }
      const settingsButton = create('button', 'header-cta', 'Settings');
      settingsButton.type = 'button';
      settingsButton.setAttribute('aria-haspopup', 'dialog');
      settingsButton.setAttribute('aria-controls', dialog.id);
      settingsButton.style.cssText += 'margin:0;padding:0;border:0;background:transparent;cursor:pointer;';
      settingsButton.addEventListener('click', () => openModal('settings', settingsButton));
      controls.append(settingsButton);

      let scrollPending = false;
      const updateHeader = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
        scrollPending = false;
      };
      window.addEventListener('scroll', () => {
        if (!scrollPending) {
          scrollPending = true;
          requestAnimationFrame(updateHeader);
        }
      }, { passive: true });
      updateHeader();
    }

    const footer = document.querySelector('.site-footer');
    const socialColumn = footer?.querySelector('.footer-column');
    const socialLink = socialColumn?.querySelector('.footer-link');
    if (socialLink) {
      let shareCount = 0;
      const shareButton = create('button', 'footer-link', 'Share 0 / 100');
      shareButton.type = 'button';
      shareButton.setAttribute('aria-live', 'polite');
      shareButton.style.cssText += 'display:inline-flex;align-items:center;min-height:44px;margin-top:8px;padding:0;border:0;border-bottom:1px solid currentColor;background:transparent;cursor:pointer;text-transform:inherit;letter-spacing:inherit;';
      shareButton.addEventListener('click', () => {
        shareCount = Math.min(100, shareCount + 1);
        shareButton.textContent = `Share ${shareCount} / 100`;
        shareButton.setAttribute('aria-label', `Share this page, ${shareCount} of 100 shares`);
        if (!reducedMotion.matches && shareButton.animate) {
          shareButton.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-2px)' }, { transform: 'translateY(0)' }], { duration: 280, easing: 'cubic-bezier(.4,0,.2,1)' });
        }
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(window.location.href).catch(() => {});
      });
      socialLink.insertAdjacentElement('afterend', shareButton);
    }

    document.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const offset = header ? header.offsetHeight + 12 : 0;
      const top = id === 'top' ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
      window.scrollTo({ top, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      try { history.pushState(null, '', `#${id}`); } catch (_) {}
    });

    const revealNodes = [...document.querySelectorAll('[data-reveal]')];
    if ('IntersectionObserver' in window && !reducedMotion.matches) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.willChange = 'auto';
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealNodes.forEach((node) => {
        node.style.opacity = '0';
        node.style.transform = 'translateY(32px)';
        node.style.willChange = 'opacity, transform';
        node.style.transition = 'opacity 720ms cubic-bezier(.22,1,.36,1), transform 720ms cubic-bezier(.22,1,.36,1)';
        observer.observe(node);
      });
    } else {
      revealNodes.forEach((node) => {
        node.style.opacity = '1';
        node.style.transform = 'none';
      });
    }

    if (!reducedMotion.matches && document.body.animate) {
      const sequence = [
        [document.querySelector('.hero-kicker'), 80],
        ...[...document.querySelectorAll('.hero-title-line')].map((line, index) => [line, 180 + index * 110]),
        [document.querySelector('.hero-footer'), 520]
      ];
      sequence.forEach(([element, delay]) => {
        if (!element) return;
        element.animate(
          [{ opacity: 0, transform: 'translateY(26px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 850, delay, fill: 'both', easing: 'cubic-bezier(.22,1,.36,1)' }
        );
      });
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
