// file: main.js

function initSolarin() {
  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const modalStates = new WeakMap();
  let activeModal = null;
  let activeOpener = null;
  let activeOpenerExpanded = null;
  let scrollFrame = 0;

  const catalog = {
    "modal-micro": ["Micro", "4–8 cm", "Thumb-sized keychains, merch and gifts.", "#D79A42"],
    "modal-classic": ["Classic", "10–25 cm", "A bathroom and office classic for kids and teams.", "#00D9B5"],
    "modal-designer": ["Designer", "15–30 cm", "Illustrator collaborations and limited collector runs.", "#D79A42"],
    "modal-mega": ["Mega", "50–120 cm", "Decorative photo objects and shop-window statement pieces.", "#EAF4F3"],
    "modal-architect": ["Architect", "1.5–3 m", "Installations for events, weddings and branded spaces.", "#00D9B5"]
  };

  const closest = (target, selector) => {
    const element = target instanceof Element ? target : target?.parentElement;
    return element?.closest(selector) || null;
  };

  const findModal = (id) => {
    const byId = document.getElementById(id);
    if (byId) return { modal: byId, sharedFallback: false };
    const dialogs = document.querySelectorAll('[role="dialog"]');
    return dialogs.length === 1
      ? { modal: dialogs[0], sharedFallback: true }
      : { modal: null, sharedFallback: false };
  };

  const getModalState = (modal) => {
    if (!modalStates.has(modal)) {
      modalStates.set(modal, {
        hiddenInitially: modal.hidden,
        timer: null,
        focusTimer: null,
        inline: {
          opacity: modal.style.opacity,
          visibility: modal.style.visibility,
          pointerEvents: modal.style.pointerEvents
        }
      });
    }
    return modalStates.get(modal);
  };

  const getFocusable = (modal) => Array.from(modal.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter((element) => element.getClientRects().length > 0);

  const modalInformation = (opener, id) => {
    const base = catalog[id] || ["Product details", "", "A considered piece from the Solarin system.", "#00D9B5"];
    const sourceText = (selector) => opener.querySelector(selector)?.textContent.trim() || "";
    return {
      title: opener.dataset.title || sourceText(".range-card__name") || base[0],
      size: opener.dataset.size || sourceText(".range-card__size") || base[1],
      description: opener.dataset.description || sourceText(".range-card__audience") || base[2],
      price: opener.dataset.price || sourceText(".range-card__price-value") || "",
      accent: opener.dataset.accent || base[3]
    };
  };

  const updateModalContent = (modal, information, sharedFallback) => {
    modal.setAttribute("aria-label", `${information.title} details`);
    modal.dataset.title = information.title;
    modal.dataset.size = information.size;
    modal.dataset.description = information.description;
    modal.dataset.accent = information.accent;
    modal.style.setProperty("--modal-accent", information.accent);

    ["title", "size", "description", "price"].forEach((key) => {
      const target = modal.querySelector(`[data-modal-${key}]`);
      if (target) target.textContent = information[key];
    });

    const accentTarget = modal.querySelector("[data-modal-accent]");
    if (accentTarget) accentTarget.style.color = information.accent;

    if (sharedFallback) {
      const heading = modal.querySelector("h1, h2, h3");
      const paragraph = modal.querySelector("p");
      if (heading) heading.textContent = information.title;
      if (paragraph) paragraph.textContent = information.description;
    }
  };

  const lockPage = (state) => {
    state.pageOverflow = { root: root.style.overflow, body: body.style.overflow };
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
  };

  const unlockPage = (state) => {
    if (!state.pageOverflow) return;
    root.style.overflow = state.pageOverflow.root;
    body.style.overflow = state.pageOverflow.body;
  };

  const openModal = (opener) => {
    const id = opener.getAttribute("data-modal-open");
    const { modal, sharedFallback } = findModal(id);
    if (!modal) return;

    if (activeModal === modal) {
      closeModal(true);
      return;
    }

    if (activeModal) closeModal(false);

    const state = getModalState(modal);
    clearTimeout(state.timer);
    clearTimeout(state.focusTimer);

    updateModalContent(modal, modalInformation(opener, id), sharedFallback);

    modal.hidden = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    modal.style.opacity = "1";
    modal.style.visibility = "visible";
    modal.style.pointerEvents = "auto";

    if (modal.tagName === "DIALOG" && typeof modal.showModal === "function" && !modal.open) {
      try {
        modal.showModal();
      } catch {
        modal.setAttribute("open", "");
      }
    }

    activeModal = modal;
    activeOpener = opener;
    activeOpenerExpanded = opener.getAttribute("aria-expanded");
    opener.classList.add("is-active");
    opener.setAttribute("aria-expanded", "true");
    lockPage(state);

    state.focusTimer = window.setTimeout(() => {
      if (activeModal !== modal) return;
      const focusable = getFocusable(modal);
      const target = focusable[0] || modal;
      if (target === modal && !modal.hasAttribute("tabindex")) modal.tabIndex = -1;
      target.focus({ preventScroll: true });
    }, 60);
  };

  const closeModal = (restoreFocus = true) => {
    if (!activeModal) return;
    const modal = activeModal;
    const opener = activeOpener;
    const state = getModalState(modal);

    activeModal = null;
    activeOpener = null;
    clearTimeout(state.timer);
    clearTimeout(state.focusTimer);

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.style.opacity = state.inline.opacity;
    modal.style.visibility = state.inline.visibility;
    modal.style.pointerEvents = state.inline.pointerEvents;

    if (modal.tagName === "DIALOG" && typeof modal.close === "function" && modal.open) {
      modal.close();
    }

    unlockPage(state);

    if (state.hiddenInitially) {
      state.timer = window.setTimeout(() => {
        if (activeModal !== modal) modal.hidden = true;
      }, 320);
    }

    if (opener) {
      opener.classList.remove("is-active");
      if (activeOpenerExpanded === null) opener.removeAttribute("aria-expanded");
      else opener.setAttribute("aria-expanded", activeOpenerExpanded);
    }

    if (restoreFocus && opener) {
      window.setTimeout(() => opener.focus({ preventScroll: true }), 40);
    }
  };

  const closeControl = (target) => {
    const explicit = closest(target, "[data-modal-close]");
    if (explicit) return explicit;

    const button = closest(target, "button");
    if (!button) return null;

    const label = [
      button.getAttribute("aria-label") || "",
      button.getAttribute("title") || "",
      button.textContent || ""
    ].join(" ").trim();

    const closeClass = Array.from(button.classList).some((name) => /close|dismiss/i.test(name));
    return closeClass || /close|dismiss|×|✕/i.test(label) ? button : null;
  };

  const isBackdrop = (target, modal) => {
    if (target === modal) return true;
    if (!(target instanceof Element)) return false;
    const style = window.getComputedStyle(target);
    const rect = target.getBoundingClientRect();
    const coversViewport = rect.width >= window.innerWidth * 0.9 && rect.height >= window.innerHeight * 0.9;
    return coversViewport && (style.position === "fixed" || style.position === "absolute");
  };

  document.addEventListener("click", (event) => {
    const opener = closest(event.target, "[data-modal-open]");
    if (opener && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      openModal(opener);
      return;
    }

    if (!activeModal) return;

    if (closeControl(event.target)) {
      event.preventDefault();
      closeModal(true);
      return;
    }

    if (isBackdrop(event.target, activeModal)) closeModal(true);
  });

  document.addEventListener("keydown", (event) => {
    if (!activeModal) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal(true);
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = getFocusable(activeModal);
    if (!focusable.length) {
      event.preventDefault();
      activeModal.focus();
      return;
    }

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

  const supportsSmoothScroll = window.CSS && CSS.supports("scroll-behavior", "smooth");
  if (!supportsSmoothScroll) {
    document.addEventListener("click", (event) => {
      const link = closest(event.target, 'a[href^="#"]');
      if (!link || link.closest("[data-modal-open]")) return;
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      cancelAnimationFrame(scrollFrame);
      history.pushState(null, "", `#${id}`);

      const destination = target.getBoundingClientRect().top + window.scrollY - 88;
      if (reducedMotion.matches) {
        window.scrollTo(0, destination);
        return;
      }

      const start = window.scrollY;
      const distance = destination - start;
      const started = performance.now();
      const duration = 520;

      const step = (time) => {
        const progress = Math.min((time - started) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, start + distance * eased);
        if (progress < 1) scrollFrame = requestAnimationFrame(step);
      };
      scrollFrame = requestAnimationFrame(step);
    });
  }

  const canAnimate = typeof Element !== "undefined" && "animate" in Element.prototype;
  if (canAnimate && !reducedMotion.matches) {
    document.querySelectorAll(".hero__line").forEach((line, index) => {
      line.animate(
        [
          { opacity: 0, transform: "translateY(22px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        {
          duration: 500,
          delay: 80 + index * 75,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards"
        }
      );
    });

    const heroMedia = document.querySelector(".hero__media");
    heroMedia?.animate(
      [
        { opacity: 0, transform: "scale(0.96) rotate(-2deg)" },
        { opacity: 1, transform: "scale(1) rotate(0deg)" }
      ],
      {
        duration: 760,
        delay: 220,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards"
      }
    );
  }

  if (canAnimate && "IntersectionObserver" in window && !reducedMotion.matches) {
    const revealTargets = document.querySelectorAll(".range-card, .section-heading, .production-heading, .production-panel");
    const revealOrder = new WeakMap();
    revealTargets.forEach((target, index) => revealOrder.set(target, index % 5));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.animate(
          [
            { opacity: 0, transform: "translateY(18px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          {
            duration: 480,
            delay: revealOrder.get(entry.target) * 55,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "backwards"
          }
        );
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealTargets.forEach((target) => observer.observe(target));
  }

  const media = document.querySelector(".hero__media[data-tilt]");
  if (media && !reducedMotion.matches) {
    const motionStyle = document.createElement("style");
    motionStyle.textContent = `
      .hero__media[data-tilt] {
        transform: perspective(1100px) translate3d(0, var(--solarin-shift, 0px), 0) rotateX(var(--solarin-tilt-x, 0deg)) rotateY(var(--solarin-tilt-y, 0deg));
        transition: transform 240ms var(--ease);
        will-change: transform;
      }
      @media (prefers-reduced-motion: reduce) {
        .hero__media[data-tilt] { transform: none !important; transition: none !important; }
      }
    `;
    document.head.appendChild(motionStyle);

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (finePointer.matches) {
      media.addEventListener("pointermove", (event) => {
        const rect = media.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        media.style.setProperty("--solarin-tilt-x", `${(-y * 2.4).toFixed(2)}deg`);
        media.style.setProperty("--solarin-tilt-y", `${(x * 2.4).toFixed(2)}deg`);
      });

      media.addEventListener("pointerleave", () => {
        media.style.setProperty("--solarin-tilt-x", "0deg");
        media.style.setProperty("--solarin-tilt-y", "0deg");
      });
    }

    let parallaxFrame = 0;
    const updateParallax = () => {
      parallaxFrame = 0;
      if (reducedMotion.matches) return;
      const rect = media.getBoundingClientRect();
      const distance = window.innerHeight / 2 - (rect.top + rect.height / 2);
      const shift = Math.max(-38, Math.min(38, distance * 0.035));
      media.style.setProperty("--solarin-shift", `${shift.toFixed(2)}px`);
    };

    window.addEventListener("scroll", () => {
      if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax);
    }, { passive: true });
    updateParallax();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSolarin, { once: true });
} else {
  initSolarin();
}
