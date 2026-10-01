// MonoBlood showcase — theme toggle, mobile menu, scroll-spy, product tour, lightbox, 404 hotkeys.

const STORAGE_KEY = "axiom-theme"; // shared across Security Buffor sites: "axiomDark" | "axiomLight"
const DESKTOP_MIN = 900;
const SLIDE_MS = 7000;
const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Theme ---------- */

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0b0b0b" : "#f3f2ef");
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  });
}

function initTheme() {
  applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next === "dark" ? "axiomDark" : "axiomLight");
      } catch (e) {}
    });
  });
}

/* ---------- Mobile menu ---------- */

function initMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(menu.hidden));
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > DESKTOP_MIN && !menu.hidden) setOpen(false);
  });
}

/* ---------- Scroll: header state, active nav link, back-to-top ---------- */

function initScroll() {
  const header = document.querySelector("[data-header]");
  const toTop = document.querySelector("[data-to-top]");
  const links = [...document.querySelectorAll("[data-nav-link]")];
  const sections = links
    .map((link) => document.getElementById(new URL(link.href).hash.slice(1)))
    .filter(Boolean);

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("is-visible", y > window.innerHeight * 0.8);

    const probe = y + window.innerHeight * 0.35;
    let active = null;
    sections.forEach((s) => {
      if (s.offsetTop <= probe) active = s.id;
    });
    links.forEach((link) => {
      const on = active !== null && link.hash === "#" + active;
      link.classList.toggle("is-active", on);
      if (on) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      const skip = document.querySelector(".wordmark");
      if (skip) skip.focus({ preventScroll: true });
    });
  }
}

/* ---------- Product tour ---------- */

function initTour(tour) {
  const tabs = [...tour.querySelectorAll("[data-tour-tab]")];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  const label = tour.querySelector("[data-tour-label]");
  const toggle = tour.querySelector("[data-tour-toggle]");
  const toggleLabel = tour.querySelector("[data-tour-toggle-label]");
  const progress = tour.querySelector("[data-tour-progress]");
  if (tabs.length < 2) return;

  let index = 0;
  let timer = null;
  let paused = reducedMotion; // user choice
  let held = false; // hover / focus inside
  let visible = false;

  const restartProgress = () => {
    if (!progress) return;
    progress.style.animation = "none";
    void progress.offsetWidth; // restart CSS animation
    progress.style.animation = "";
    progress.style.animationDuration = SLIDE_MS + "ms";
  };

  const running = () => !paused && !held && visible;

  const schedule = () => {
    clearTimeout(timer);
    tour.classList.toggle("is-running", running());
    if (running()) {
      restartProgress();
      // don't flip slides behind an open lightbox
      timer = setTimeout(() => (root.classList.contains("has-lightbox") ? schedule() : show(index + 1)), SLIDE_MS);
    }
  };

  function show(next, focusTab = false) {
    index = (next + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    const tab = tabs[index];
    if (focusTab) tab.focus();
    // keep the active chip visible in the horizontal (mobile) strip without moving the page
    const strip = tab.parentElement;
    if (strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: tab.offsetLeft - strip.clientWidth / 2 + tab.offsetWidth / 2, behavior: reducedMotion ? "auto" : "smooth" });
    }
    label.textContent = panels[index].dataset.label || "";
    schedule();
  }

  const setPaused = (value) => {
    paused = value;
    toggle.setAttribute("aria-pressed", String(value));
    toggle.setAttribute("aria-label", value ? "Play slideshow" : "Pause slideshow");
    toggleLabel.textContent = value ? "Play" : "Pause";
    schedule();
  };

  tabs.forEach((tab, i) => tab.addEventListener("click", () => show(i)));
  tour.querySelector("[data-tour-prev]").addEventListener("click", () => show(index - 1));
  tour.querySelector("[data-tour-next]").addEventListener("click", () => show(index + 1));
  toggle.addEventListener("click", () => setPaused(!paused));

  tabs[0].parentElement.addEventListener("keydown", (e) => {
    const map = { ArrowUp: index - 1, ArrowLeft: index - 1, ArrowDown: index + 1, ArrowRight: index + 1, Home: 0, End: tabs.length - 1 };
    if (e.key in map) {
      e.preventDefault();
      show(map[e.key], true);
    }
  });

  // Swipe on the screenshot (touch devices)
  onSwipe(tour.querySelector(".tour__stage"), (dir) => show(index + dir));

  // Hold while the visitor is reading or interacting
  const hold = (value) => {
    held = value;
    schedule();
  };
  tour.addEventListener("mouseenter", () => hold(true));
  tour.addEventListener("mouseleave", () => hold(false));
  tour.addEventListener("focusin", () => hold(true));
  tour.addEventListener("focusout", (e) => {
    if (!tour.contains(e.relatedTarget)) hold(false);
  });

  // Only advance while on screen
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      schedule();
    }, { threshold: 0.35 }).observe(tour);
  } else {
    visible = true;
  }

  if (reducedMotion) setPaused(true);
  else schedule();
}

/* ---------- Lightbox ---------- */

function onSwipe(el, handler) {
  let x = null;
  let y = null;
  el.addEventListener("touchstart", (e) => {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener("touchend", (e) => {
    if (x === null) return;
    const dx = e.changedTouches[0].clientX - x;
    const dy = e.changedTouches[0].clientY - y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) handler(dx < 0 ? 1 : -1);
    x = null;
  }, { passive: true });
}

function initLightbox() {
  const dialog = document.querySelector("[data-lightbox-dialog]");
  const links = [...document.querySelectorAll("a[data-lightbox]")];
  if (!dialog || !links.length || typeof dialog.showModal !== "function") return;

  const img = dialog.querySelector("[data-lightbox-img]");
  const caption = dialog.querySelector("[data-lightbox-caption]");
  const controls = dialog.querySelector("[data-lightbox-controls]");
  let group = [];
  let index = 0;
  let opener = null;

  const render = () => {
    const link = group[index];
    const thumb = link.querySelector("img");
    dialog.classList.add("is-loading");
    img.onload = () => dialog.classList.remove("is-loading");
    img.src = link.href;
    img.alt = thumb ? thumb.alt : "";
    caption.textContent = link.dataset.caption || img.alt;
    controls.hidden = group.length < 2;
    // warm up the neighbours so arrowing through feels instant
    [index - 1, index + 1].forEach((i) => {
      const n = group[(i + group.length) % group.length];
      if (n && n !== link) new Image().src = n.href;
    });
  };

  const step = (dir) => {
    if (group.length < 2) return;
    index = (index + dir + group.length) % group.length;
    render();
  };

  const open = (link) => {
    opener = link;
    group = links.filter((l) => l.dataset.lightbox === link.dataset.lightbox);
    index = group.indexOf(link);
    render();
    root.classList.add("has-lightbox");
    dialog.showModal();
  };

  links.forEach((link) =>
    link.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return; // let "open in new tab" work
      e.preventDefault();
      open(link);
    })
  );

  dialog.addEventListener("close", () => {
    root.classList.remove("has-lightbox");
    img.removeAttribute("src");
    if (opener) opener.focus({ preventScroll: true });
  });
  dialog.querySelector("[data-lightbox-close]").addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-lightbox-prev]").addEventListener("click", () => step(-1));
  dialog.querySelector("[data-lightbox-next]").addEventListener("click", () => step(1));
  // click outside the frame (on the backdrop area) closes
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog || e.target.hasAttribute("data-lightbox-stage")) dialog.close();
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
  onSwipe(dialog.querySelector("[data-lightbox-stage]"), step);
}

/* ---------- 404 hotkeys ---------- */

function initHotkeys() {
  const scope = document.querySelector(".error");
  if (!scope) return;
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const el = scope.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
    if (el) {
      e.preventDefault();
      el.click();
    }
  });
}

initTheme();
initMenu();
initScroll();
document.querySelectorAll("[data-tour]").forEach(initTour);
initLightbox();
initHotkeys();
