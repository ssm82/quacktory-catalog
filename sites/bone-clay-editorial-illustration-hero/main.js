// file: main.js

const boot = () => {
  const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
  let motionOverride = null;
  const reduced = () => motionOverride === null ? motionMedia.matches : motionOverride === "reduced";

  const profiles = {
    Micro: { title: "Micro", size: "4–8 cm", edition: "Pocket edition", lead: "3 weeks", status: "New species", accent: "#F2BE00", description: "A thumb-sized duck with a pocket-scale silhouette and the same serious attitude. Small enough for a keychain, bold enough for a shelf.", image: "./assets/product-micro.jpg" },
    Classic: { title: "Classic", size: "10–25 cm", edition: "Everyday classic", lead: "3 weeks", status: "Studio regular", accent: "#D93A2B", description: "The cat-sized original: friendly, durable and equally happy in a bathroom, office or very serious collection.", image: "./assets/product-classic.jpg" },
    Designer: { title: "Designer", size: "15–30 cm", edition: "Limited studio run", lead: "6 weeks", status: "Collector's object", accent: "#E997A7", description: "A collectible duck made for illustrator collaborations, limited runs and people who prefer their shelves with a point of view.", image: "./assets/product-designer.jpg" },
    Mega: { title: "Mega", size: "50–120 cm", accent: "#48AEB2", edition: "Statement edition", lead: "6 weeks", status: "Decorative object", description: "A generous sculptural duck built for photo sets, shop windows and statement gifts. Decorative, theatrical and not remotely a bath toy.", image: "./assets/product-mega.jpg" },
    Architect: { title: "Architect", size: "1.5–3 m", edition: "Commission edition", lead: "12 weeks", status: "Made to commission", accent: "#3C8FC2", description: "A room-sized installation for lobbies, events and branded spaces, scaled and mounted with certified crews.", image: "./assets/product-architect.jpg" }
  };

  const collectionProfile = {
    kind: "collection",
    title: "Quacktory",
    size: "4 cm–3 m",
    edition: "Emerging species",
    lead: "Five scales",
    status: "Collection open",
    accent: "#E88422",
    description: "Serious ducks for un-serious people. Explore a species range built from pocket-sized companions to three-metre installations.",
    image: "./assets/product-designer.jpg"
  };

  const settingsProfile = {
    kind: "settings",
    title: "Studio settings",
    size: "System-aware",
    edition: "Accessibility",
    lead: "One calm scene",
    status: "Motion follows your device",
    accent: "#E88422",
    description: "This gallery follows your device's motion preference. Use the species controls to inspect every scale without losing the scene."
  };

  const existingDialog = document.querySelector("#species-dialog");
  let dialog;
  if (existingDialog && existingDialog.tagName === "DIALOG") {
    dialog = existingDialog;
    if (dialog.open) dialog.close();
  } else {
    dialog = document.createElement("dialog");
    dialog.id = "species-dialog";
    existingDialog ? existingDialog.replaceWith(dialog) : document.body.append(dialog);
  }
  dialog.removeAttribute("class");
  dialog.removeAttribute("style");
  dialog.removeAttribute("aria-hidden");
  dialog.setAttribute("data-quacktory-dialog", "");
  dialog.setAttribute("aria-modal", "true");

  const modalStyle = document.createElement("style");
  modalStyle.setAttribute("data-quacktory-style", "");
  modalStyle.textContent = `
    #species-dialog[data-quacktory-dialog]{position:fixed;inset:0;width:100vw;height:100vh;height:100svh;max-width:none;max-height:none;margin:0;padding:0;border:0;overflow:hidden;background:transparent;color:#111}
    #species-dialog[data-quacktory-dialog]::backdrop{background:rgba(17,17,17,.2)}
    [data-quacktory-overlay]{position:absolute;inset:0;background:rgba(17,17,17,.26);cursor:default}
    [data-quacktory-panel]{position:absolute;z-index:1;top:50%;left:50%;transform:translate(-50%,-50%);width:min(900px,calc(100vw - 40px));max-height:calc(100vh - 40px);max-height:calc(100svh - 40px);overflow:auto;overscroll-behavior:contain;display:grid;grid-template-columns:minmax(250px,.85fr) minmax(0,1.15fr);background:#f7f7f4;border:1px solid rgba(17,17,17,.14);border-top:6px solid var(--quacktory-accent);border-radius:30px;box-shadow:0 30px 90px rgba(17,17,17,.22)}
    [data-quacktory-close]{position:absolute;z-index:4;top:14px;right:14px;width:44px;height:44px;border:1px solid rgba(17,17,17,.2);border-radius:50%;background:rgba(255,255,255,.88);color:#111;font:400 25px/1 Arial,sans-serif;cursor:pointer;transition:transform 180ms ease-out,background 180ms ease-out}
    [data-quacktory-close]:hover{transform:rotate(5deg) scale(1.04);background:#fff}
    [data-quacktory-visual]{position:relative;min-height:480px;display:grid;place-items:center;padding:58px 34px 34px;background:var(--quacktory-accent)}
    [data-quacktory-visual] img{width:100%;height:380px;object-fit:contain;filter:drop-shadow(0 24px 25px rgba(17,17,17,.2));border-radius:22px;background:rgba(255,255,255,.28)}
    [data-quacktory-badge]{position:absolute;top:18px;left:18px;padding:8px 11px;border-radius:999px;background:rgba(255,255,255,.86);font:700 9px/1 Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase}
    [data-quacktory-placeholder]{font:700 150px/1 "Space Grotesk",sans-serif;color:rgba(255,255,255,.82);transform:rotate(-8deg)}
    [data-quacktory-copy]{padding:52px 44px 38px}
    [data-quacktory-kicker]{margin:0 0 14px;font:700 10px/1 Inter,sans-serif;letter-spacing:.13em;text-transform:uppercase}
    [data-quacktory-copy] h2{margin:0 0 18px;font:600 clamp(34px,5vw,58px)/.95 "Space Grotesk",sans-serif;letter-spacing:-.055em}
    [data-quacktory-description]{margin:0 0 25px;color:#4d4547;font-size:14px;line-height:1.65}
    [data-quacktory-copy] dl{margin:0 0 28px;display:grid;grid-template-columns:1fr 1fr;gap:1px;border:1px solid rgba(17,17,17,.12);border-radius:18px;overflow:hidden;background:rgba(17,17,17,.12)}
    [data-quacktory-copy] dl div{padding:14px;background:#f1f1ef}
    [data-quacktory-copy] dt{margin:0 0 5px;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#765d64}
    [data-quacktory-copy] dd{margin:0;font:600 12px/1.35 "Space Grotesk",sans-serif}
    [data-quacktory-actions]{display:flex;flex-wrap:wrap;gap:9px}
    [data-quacktory-actions]> *{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 16px;border-radius:999px;border:1px solid rgba(17,17,17,.2);background:transparent;color:#111;font:700 10px/1 Inter,sans-serif;letter-spacing:.06em;text-decoration:none;text-transform:uppercase;cursor:pointer;transition:transform 180ms ease-out,background 180ms ease-out}
    [data-quacktory-actions]> *:hover{transform:translateY(-2px);background:rgba(17,17,17,.06)}
    [data-quacktory-actions] [data-quacktory-share]{background:#111;color:#fff;border-color:#111}
    [data-quacktory-status]{min-height:18px;margin:13px 0 0;color:#765d64;font-size:11px;line-height:1.5}
    html[data-quacktory-motion="reduced"] *{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
    @media(max-width:680px){[data-quacktory-panel]{grid-template-columns:1fr;width:calc(100vw - 24px);max-height:calc(100svh - 24px);border-radius:24px}[data-quacktory-visual]{min-height:210px;height:210px;padding:48px 56px 20px}[data-quacktory-visual] img{height:140px}[data-quacktory-copy]{padding:28px 24px 25px}[data-quacktory-copy] h2{font-size:38px}[data-quacktory-copy] dl{grid-template-columns:1fr}}
  `;
  document.head.append(modalStyle);

  const MAX_SHARES = 99;
  const storageKey = "quacktory-share-count";
  let shareCount = 0;
  try { shareCount = Math.min(MAX_SHARES, Math.max(0, Math.floor(Number(localStorage.getItem(storageKey)) || 0))); } catch {}
  let currentProfile = collectionProfile;
  let lastFocused = null;
  let previousBodyOverflow = "";
  let bodyLocked = false;

  const motionText = () => motionOverride === null
    ? `Motion: system (${motionMedia.matches ? "reduced" : "full"})`
    : `Motion: ${motionOverride}`;

  const updateShareLabels = () => {
    document.querySelectorAll("[data-quacktory-share]").forEach(button => {
      button.textContent = `Share · ${String(shareCount).padStart(2, "0")} / ${MAX_SHARES}${shareCount === MAX_SHARES ? " max" : ""}`;
    });
  };

  const copyUrl = async () => {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(window.location.href); return; } catch {}
    }
    const field = document.createElement("textarea");
    field.value = window.location.href;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) throw new Error("Copy unavailable");
  };

  const shareCurrent = async () => {
    shareCount = Math.min(MAX_SHARES, shareCount + 1);
    try { localStorage.setItem(storageKey, String(shareCount)); } catch {}
    updateShareLabels();
    const status = dialog.querySelector("[data-quacktory-status]");
    if (status) status.textContent = `Counted · ${shareCount} of ${MAX_SHARES} shares used.`;
    const subject = dialog.open && currentProfile.kind !== "settings" ? currentProfile : collectionProfile;
    const payload = { title: `${subject.title} — Quacktory`, text: subject.description, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else await copyUrl();
      if (status) status.textContent = `Shared · ${shareCount} of ${MAX_SHARES}.`;
    } catch (error) {
      if (status) status.textContent = error?.name === "AbortError"
        ? "Share cancelled — the count still updated."
        : "Counted. Copy the page URL to share it.";
    }
  };

  const renderModal = profile => {
    const kind = profile.kind || "species";
    const ctaHref = kind === "settings" ? "#top" : "#custom";
    const ctaLabel = kind === "settings" ? "Back to the scene ↘" : "Request a quote ↘";
    const leadLabel = kind === "settings" ? "Mode" : "Lead time";
    const leadValue = kind === "settings" ? motionText() : profile.lead;
    const image = profile.image
      ? `<img src="${profile.image}" alt="${profile.title} duck" decoding="async">`
      : `<div data-quacktory-placeholder aria-hidden="true">Q</div>`;

    dialog.innerHTML = `
      <div data-quacktory-overlay></div>
      <article data-quacktory-panel style="--quacktory-accent:${profile.accent}">
        <button type="button" data-quacktory-close aria-label="Close dialog" autofocus>×</button>
        <div data-quacktory-visual>
          <span data-quacktory-badge>${profile.edition}</span>
          ${image}
        </div>
        <div data-quacktory-copy>
          <p data-quacktory-kicker>${kind === "settings" ? "Studio controls" : kind === "collection" ? "The collection" : "Species profile"}</p>
          <h2 id="quacktory-dialog-title">${profile.title}</h2>
          <p data-quacktory-description>${profile.description}</p>
          <dl>
            <div><dt>Size</dt><dd>${profile.size}</dd></div>
            <div><dt>Edition</dt><dd>${profile.edition}</dd></div>
            <div><dt>${leadLabel}</dt><dd>${leadValue}</dd></div>
            <div><dt>Status</dt><dd>${profile.status}</dd></div>
          </dl>
          <div data-quacktory-actions>
            <button type="button" data-quacktory-share>Share · ${String(shareCount).padStart(2, "0")} / ${MAX_SHARES}</button>
            ${kind === "settings" ? `<button type="button" data-quacktory-motion>${motionText()}</button>` : ""}
            <a href="${ctaHref}" data-quacktory-cta>${ctaLabel}</a>
          </div>
          <p data-quacktory-status aria-live="polite"></p>
        </div>
      </article>`;

    dialog.setAttribute("aria-labelledby", "quacktory-dialog-title");
    dialog.setAttribute("aria-describedby", "quacktory-dialog-description");
    dialog.querySelector("[data-quacktory-description]")?.setAttribute("id", "quacktory-dialog-description");
    dialog.querySelector("[data-quacktory-close]").addEventListener("click", closeModal);
    dialog.querySelector("[data-quacktory-motion]")?.addEventListener("click", () => {
      motionOverride = motionOverride === null
        ? (motionMedia.matches ? "full" : "reduced")
        : motionOverride === "reduced" ? "full" : null;
      if (motionOverride) document.documentElement.setAttribute("data-quacktory-motion", motionOverride);
      else document.documentElement.removeAttribute("data-quacktory-motion");
      const button = dialog.querySelector("[data-quacktory-motion]");
      if (button) button.textContent = motionText();
      const status = dialog.querySelector("[data-quacktory-status]");
      if (status) status.textContent = "Motion preference updated.";
      paintParallax();
    });
    updateShareLabels();
  };

  const cleanupModal = () => {
    if (bodyLocked) {
      document.body.style.overflow = previousBodyOverflow;
      bodyLocked = false;
    }
    if (lastFocused?.isConnected) {
      try { lastFocused.focus({ preventScroll: true }); } catch {}
    }
    lastFocused = null;
  };

  const closeModal = () => {
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else {
      dialog.removeAttribute("open");
      cleanupModal();
    }
  };

  const openModal = (profile, trigger) => {
    currentProfile = profile;
    if (!dialog.open) lastFocused = trigger || document.activeElement;
    renderModal(profile);
    if (!dialog.open) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      bodyLocked = true;
      try { dialog.showModal(); }
      catch { dialog.setAttribute("open", ""); }
    }
    requestAnimationFrame(() => {
      const panel = dialog.querySelector("[data-quacktory-panel]");
      const overlay = dialog.querySelector("[data-quacktory-overlay]");
      if (!reduced() && panel?.animate) {
        panel.animate([
          { opacity: 0, transform: "translate(-50%, -46%) scale(.97)" },
          { opacity: 1, transform: "translate(-50%, -50%) scale(1)" }
        ], { duration: 440, easing: "cubic-bezier(.22,1,.36,1)" });
        overlay?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
      }
      dialog.querySelector("[data-quacktory-close]")?.focus({ preventScroll: true });
    });
  };

  dialog.addEventListener("click", event => {
    if (event.target === dialog || event.target.closest?.("[data-quacktory-overlay]")) closeModal();
  });
  dialog.addEventListener("cancel", event => { event.preventDefault(); closeModal(); });
  dialog.addEventListener("close", cleanupModal);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && dialog.open) { event.preventDefault(); closeModal(); }
    if (event.key !== "Tab" || !dialog.open) return;
    const focusable = [...dialog.querySelectorAll("button:not([disabled]),a[href],[tabindex]:not([tabindex='-1'])")];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  const railUtilities = document.querySelector(".rail-utilities");
  if (railUtilities) {
    const shareButton = document.createElement("button");
    shareButton.type = "button";
    shareButton.className = "utility-chip";
    shareButton.setAttribute("data-quacktory-share", "");
    shareButton.setAttribute("aria-label", "Share this gallery");
    shareButton.style.minHeight = "44px";
    railUtilities.append(shareButton);

    const settingsButton = document.createElement("button");
    settingsButton.type = "button";
    settingsButton.className = "utility-chip";
    settingsButton.setAttribute("data-quacktory-settings", "");
    settingsButton.setAttribute("aria-label", "Open studio settings");
    settingsButton.setAttribute("aria-haspopup", "dialog");
    settingsButton.setAttribute("aria-controls", "species-dialog");
    settingsButton.title = "Studio settings";
    settingsButton.style.width = "44px";
    settingsButton.style.height = "44px";
    settingsButton.style.minHeight = "44px";
    settingsButton.style.padding = "0";
    settingsButton.style.display = "grid";
    settingsButton.style.placeItems = "center";
    settingsButton.innerHTML = '<span aria-hidden="true">⚙</span>';
    settingsButton.addEventListener("click", () => openModal(settingsProfile, settingsButton));
    railUtilities.append(settingsButton);
  }

  document.addEventListener("click", event => {
    if (event.target.closest?.("[data-quacktory-share]")) {
      event.preventDefault();
      shareCurrent();
    }
  });
  updateShareLabels();

  const speciesNodes = [...document.querySelectorAll("button[data-species]")];
  speciesNodes.forEach(node => {
    node.setAttribute("aria-pressed", "false");
    node.dataset.active = "false";
    node.addEventListener("click", () => {
      const activeName = node.dataset.species;
      speciesNodes.forEach(other => {
        const active = other.dataset.species === activeName;
        other.setAttribute("aria-pressed", String(active));
        other.dataset.active = String(active);
      });
      const profile = profiles[activeName] || {
        title: activeName || "Unknown species",
        size: "Newly emerging",
        edition: "Gallery edition",
        lead: "On request",
        status: "Newly discovered",
        accent: "#48AEB2",
        description: "A newly emerged species, still being catalogued by the studio."
      };
      openModal(profile, node);
    });
  });

  const floatingLabel = document.querySelector(".floating-label");
  if (floatingLabel) {
    floatingLabel.setAttribute("role", "button");
    floatingLabel.setAttribute("tabindex", "0");
    floatingLabel.setAttribute("aria-haspopup", "dialog");
    floatingLabel.setAttribute("aria-controls", "species-dialog");
    floatingLabel.setAttribute("aria-label", "About Quacktory");
    floatingLabel.addEventListener("click", () => openModal(collectionProfile, floatingLabel));
    floatingLabel.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(collectionProfile, floatingLabel);
      }
    });
  }

  document.querySelector(".rail-control")?.addEventListener("click", () => scrollToId("#species"));

  const scrollToId = selector => {
    const target = document.querySelector(selector);
    if (!target) return;
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    const startY = window.scrollY;
    const endY = Math.max(0, startY + target.getBoundingClientRect().top - 18);
    if (reduced()) {
      window.scrollTo(0, endY);
      requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });
    } else {
      const duration = 650;
      let started;
      const step = time => {
        if (!started) started = time;
        const progress = Math.min(1, (time - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        window.scrollTo(0, startY + (endY - startY) * eased);
        if (progress < 1) requestAnimationFrame(step);
        else root.style.scrollBehavior = previousBehavior;
      };
      requestAnimationFrame(step);
    }
    try { history.replaceState(null, "", selector); } catch {}
  };

  document.addEventListener("click", event => {
    const anchor = event.target instanceof Element ? event.target.closest("a[href^='#']") : null;
    if (!anchor) return;
    const selector = anchor.getAttribute("href");
    if (!selector || selector === "#" || !document.querySelector(selector)) return;
    event.preventDefault();
    if (anchor.closest("dialog")) closeModal();
    scrollToId(selector);
  });

  const frames = [...document.querySelectorAll(".scale-frame")];
  if ("IntersectionObserver" in window && frames.length && !reduced()) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const frame = entry.target;
        frame.style.opacity = "";
        frame.style.transform = "";
        frame.animate([
          { opacity: 0, transform: "translateY(20px) scale(.985)" },
          { opacity: 1, transform: "translateY(0) scale(1)" }
        ], { duration: 650, delay: Math.min(frames.indexOf(frame) * 45, 220), easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
        observer.unobserve(frame);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6%" });
    frames.forEach(frame => {
      frame.style.opacity = "0";
      frame.style.transform = "translateY(20px)";
      observer.observe(frame);
    });
  }

  const stage = document.querySelector(".hero-stage");
  const ceiling = document.querySelector(".architectural-ceiling");
  const photo = document.querySelector(".scene-photo");
  let parallaxFrame = 0;
  function paintParallax() {
    if (!stage || !ceiling || !photo) return;
    const maximum = Math.max(1, stage.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maximum));
    const distance = reduced() ? 0 : progress;
    ceiling.style.translate = `0 ${distance * 16}px`;
    photo.style.translate = `0 ${distance * 6}px`;
  }
  window.addEventListener("scroll", () => {
    if (!parallaxFrame) parallaxFrame = requestAnimationFrame(() => { paintParallax(); parallaxFrame = 0; });
  }, { passive: true });

  const animateHero = () => {
    if (reduced()) return;
    const run = (element, delay, keyframes, duration = 680) => {
      if (!element?.animate) return;
      element.animate(keyframes, { duration, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
    };
    run(ceiling, 0, [{ opacity: 0 }, { opacity: 1 }]);
    run(photo, 80, [{ opacity: 0, transform: "scale(1.025)" }, { opacity: 1, transform: "scale(1)" }], 760);
    run(document.querySelector(".hero-copy"), 180, [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }]);
    run(document.querySelector(".site-header"), 100, [{ opacity: 0, transform: "translateY(-8px)" }, { opacity: 1, transform: "translateY(0)" }]);
    [".specimen--mega", ".specimen--architect", ".specimen--designer", ".specimen--classic", ".specimen--micro"].forEach((selector, index) => {
      const specimen = document.querySelector(selector);
      run(specimen, 240 + index * 45, [{ opacity: 0 }, { opacity: 1 }]);
      run(specimen?.querySelector(".specimen-object"), 260 + index * 45, [{ opacity: 0, transform: "translateY(18px) scale(.97)" }, { opacity: 1, transform: "translateY(0) scale(1)" }]);
    });
    document.querySelectorAll(".scene-orb").forEach((orb, index) => run(orb, 330 + index * 35, [{ opacity: 0 }, { opacity: 1 }], 460));
    run(floatingLabel, 590, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }]);
    run(document.querySelector(".interface-rail"), 680, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }]);
  };

  requestAnimationFrame(animateHero);
  paintParallax();
  const motionChanged = () => {
    if (motionOverride === null) {
      const button = dialog.querySelector("[data-quacktory-motion]");
      if (button) button.textContent = motionText();
    }
    paintParallax();
  };
  if (motionMedia.addEventListener) motionMedia.addEventListener("change", motionChanged);
  else motionMedia.addListener(motionChanged);
};

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
else boot();
