// Hash router. Works on GitHub Pages with no server configuration.
//   #/                     home
//   #/apps/<id>            app landing page
//   #/apps/<id>/privacy    app privacy policy
//   #<section>             a section of the current page, or of the home page
import { homePage } from "./pages/home.js";
import { appPage } from "./pages/app.js";
import { privacyPage } from "./pages/privacy.js";

const ROUTES = [
  { pattern: /^#\/apps\/([^/]+)\/privacy\/?$/, render: (match) => privacyPage(match[1]) },
  { pattern: /^#\/apps\/([^/]+)\/?$/, render: (match) => appPage(match[1]) },
];

function resolve(hash) {
  for (const route of ROUTES) {
    const match = hash.match(route.pattern);
    const page = match && route.render(match);
    if (page) return { key: match[0], page };
  }
  return { key: "home", page: homePage() };
}

export function startRouter({ view, onNavigate }) {
  let currentKey = null;

  function handle() {
    const hash = location.hash;

    // Old single-page links such as #privacy-app1
    const legacy = hash.match(/^#privacy-(.+)$/);
    if (legacy) {
      location.replace(`#/apps/${legacy[1]}/privacy`);
      return;
    }

    const sectionId = hash.length > 1 && !hash.startsWith("#/") ? hash.slice(1) : null;

    // Section that already exists on the current page: just scroll to it
    if (sectionId && currentKey && document.getElementById(sectionId)) {
      document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
      return;
    }

    const { key, page } = resolve(sectionId ? "#/" : hash);
    if (key !== currentKey) {
      currentKey = key;
      view.innerHTML = `<div class="page-enter">${page.html}</div>`;
      onNavigate(page, hash);
    }

    const section = sectionId && document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }

  // Clicking a link to the hash we're already on doesn't fire "hashchange"
  document.addEventListener("click", (e) => {
    const link = e.target.closest?.('a[href^="#"]');
    if (link && !link.dataset.toc && link.getAttribute("href") === location.hash) {
      e.preventDefault();
      handle();
    }
  });

  window.addEventListener("hashchange", handle);
  handle();
}
