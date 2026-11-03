// Entry point: fills shared layout (navbar/footer), starts the 3D scene and the router.
import { site, apps } from "./config.js";
import { esc, each } from "./utils.js";
import { createScene } from "./scene.js";
import { startRouter } from "./router.js";
import { initReveal, initCountUp, initSpotlight, initNavbar, initMobileMenu, initToc, setActiveNav } from "./effects.js";

function bindLayout() {
  const values = {
    company: site.company,
    companyInitial: site.company.replace(/[^A-Za-z0-9]/g, "").charAt(0).toUpperCase() || "M",
    tagline: site.tagline,
    year: new Date().getFullYear(),
  };
  Object.entries(values).forEach(([key, value]) => {
    document.querySelectorAll(`[data-bind="${key}"]`).forEach((el) => (el.textContent = value));
  });

  document.querySelectorAll('[data-bind="emailLink"]').forEach((el) => {
    el.href = `mailto:${site.email}`;
    el.textContent = site.email;
  });

  const link = (href, label) => `<li><a href="${href}" class="transition hover:text-white">${esc(label)}</a></li>`;
  document.getElementById("footerApps").innerHTML = each(apps, (a) => link(`#/apps/${a.id}`, a.name));
  document.getElementById("footerPolicies").innerHTML = each(apps, (a) => link(`#/apps/${a.id}/privacy`, a.name));
}

function setAccent([a, b]) {
  document.documentElement.style.setProperty("--accent-a", a);
  document.documentElement.style.setProperty("--accent-b", b);
}

// ---- Light / dark theme (initial value is set by the inline script in index.html) ----
const currentTheme = () => document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

function applyTheme(theme, save = true) {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#fafafc" : "#07070a");
  if (save) {
    try { localStorage.setItem("theme", theme); } catch {}
  }
  scene?.setMode(theme);
}

function initThemeToggle() {
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) =>
    btn.addEventListener("click", () => applyTheme(currentTheme() === "light" ? "dark" : "light"))
  );
  // Follow the system setting until the visitor picks a theme themselves
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch {}
    if (!saved) applyTheme(e.matches ? "light" : "dark", false);
  });
}

let scene = null;
bindLayout();
initThemeToggle();
initNavbar();
initMobileMenu();
initSpotlight();

const background = new URLSearchParams(location.search).get("bg") || site.background;
scene = createScene(document.getElementById("scene"), background);
scene.setMode(currentTheme());
const view = document.getElementById("view");

startRouter({
  view,
  onNavigate(page, hash) {
    document.title = page.title;
    scene.setTheme(page.theme);
    setAccent(page.theme.colors);
    setActiveNav(hash);
    initReveal(view);
    initCountUp(view);
    initToc(view);
  },
});
