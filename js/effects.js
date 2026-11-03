// UI behaviors: scroll reveal, stat count-up, card spotlight, navbar, mobile menu, policy table of contents.

/** Fade elements with `.reveal` in as they enter the viewport. */
export function initReveal(root) {
  const items = root.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -60px 0px" } // threshold 0 so very tall elements (policy) still trigger
  );
  items.forEach((el) => observer.observe(el));
}

/** Numbers in `[data-count]` count up from zero the first time they scroll into view. */
export function initCountUp(root) {
  const items = root.querySelectorAll("[data-count]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!items.length || reducedMotion || !("IntersectionObserver" in window)) return;

  const run = (el) => {
    const match = el.textContent.match(/^(\D*)([\d.]+)(.*)$/); // e.g. "100K+" -> "", "100", "K+"
    if (!match) return;
    const [, prefix, number, suffix] = match;
    const target = parseFloat(number);
    const decimals = number.includes(".") ? number.split(".")[1].length : 0;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  items.forEach((el) => observer.observe(el));
}

/** Soft light that follows the pointer across `.card` elements. */
export function initSpotlight() {
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest?.(".card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--y", `${e.clientY - rect.top}px`);
  });
}

/** Navbar gets a glass background once the page is scrolled, plus a reading progress line. */
export function initNavbar() {
  const navbar = document.getElementById("navbar");
  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    navbar.classList.toggle("is-scrolled", window.scrollY > 10);
    navbar.style.setProperty("--progress", scrollable > 0 ? (window.scrollY / scrollable).toFixed(4) : 0);
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/** Highlight the nav link that matches the current page. */
export function setActiveNav(hash) {
  const active = hash.startsWith("#/apps") ? "#apps" : "#/";
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === active);
  });
}

export function initMobileMenu() {
  const button = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  const setOpen = (open) => {
    menu.classList.toggle("hidden", !open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    button.querySelector(".menu-open").classList.toggle("hidden", open);
    button.querySelector(".menu-close").classList.toggle("hidden", !open);
  };
  button.addEventListener("click", () => setOpen(menu.classList.contains("hidden")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

/** Privacy policy table of contents: smooth scroll + highlight the section in view. */
export function initToc(root) {
  const links = root.querySelectorAll("[data-toc]");
  if (!links.length) return;

  links.forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault(); // keep the policy URL intact
      document.getElementById(link.dataset.toc)?.scrollIntoView({ behavior: "smooth" });
    })
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.dataset.toc === entry.target.id));
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
  links.forEach((link) => {
    const section = document.getElementById(link.dataset.toc);
    if (section) observer.observe(section);
  });
}
