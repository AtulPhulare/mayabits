// App landing page: hero, features, screenshots, FAQ, support/privacy, more apps.
import { site, apps } from "../config.js";
import { esc, each, icons, rgba } from "../utils.js";
import { appIcon, sectionHeader, section, featureCard, storeButtons, phoneMockup, backLink } from "../components.js";

function platformLine(app) {
  const platforms = [app.playStore && "Android", app.appStore && "iOS"].filter(Boolean);
  return platforms.length ? `Available on ${platforms.join(" & ")}` : "Launching soon";
}

function hero(app, firstShot) {
  return `
    <section class="relative">
      <div class="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
        <div class="reveal">${backLink("#apps", "All apps")}</div>
        <div class="mt-12 grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div class="reveal flex items-center gap-5">
              ${appIcon(app, "h-20 w-20 rounded-3xl text-4xl sm:h-24 sm:w-24 sm:text-5xl")}
              <div>
                <p class="text-sm font-medium" style="color: ${app.colors[0]}">${esc(app.category)}</p>
                <h1 class="font-display text-4xl font-bold tracking-tight sm:text-6xl">${esc(app.name)}</h1>
                <p class="mt-1 text-sm text-zinc-500">by ${esc(site.developer)}</p>
              </div>
            </div>
            <p class="reveal mt-10 font-display text-2xl font-medium leading-snug text-zinc-100 sm:text-3xl" style="--delay: 80ms">${esc(app.tagline)}</p>
            <p class="reveal mt-5 text-lg leading-relaxed text-zinc-400" style="--delay: 140ms">${esc(app.description)}</p>
            <div class="reveal mt-10 flex flex-wrap gap-3" style="--delay: 200ms">${storeButtons(app)}</div>
            <div class="reveal mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500" style="--delay: 260ms">
              <span>${platformLine(app)}</span>
              <span class="h-1 w-1 rounded-full bg-zinc-700"></span>
              <a href="#/apps/${app.id}/privacy" class="text-zinc-400 underline-offset-4 transition hover:text-white hover:underline">Privacy policy</a>
            </div>
          </div>
          <div class="reveal relative flex justify-center" style="--delay: 150ms">
            <div class="absolute top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl" style="background: ${rgba(app.colors[0], 0.35)}"></div>
            ${phoneMockup(app, 0, firstShot, { width: "w-64 sm:w-72", float: true })}
          </div>
        </div>
      </div>
    </section>`;
}

function features(app) {
  return section(
    `
    ${sectionHeader({ eyebrow: "Features", title: `Why you'll love ${app.name}` })}
    <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      ${each(app.features, (f, i) => featureCard(f, i, app.colors))}
    </div>`,
    { className: "border-t border-white/5" }
  );
}

function screenshots(app, shots) {
  return section(
    `
    ${sectionHeader({ eyebrow: "Screenshots", title: "Take a look inside" })}
    <div class="reveal no-scrollbar fade-x -mx-4 mt-14 snap-x snap-mandatory overflow-x-auto px-4 pb-6 sm:mx-0 sm:px-0">
      <div class="mx-auto flex w-max gap-6">${each(shots, (src, i) => phoneMockup(app, i, src, { width: "w-56" }))}</div>
    </div>`,
    { className: "border-t border-white/5" }
  );
}

function faq(app) {
  if (!app.faqs.length) return "";
  return section(
    `
    ${sectionHeader({ eyebrow: "FAQ", title: "Questions & answers", center: true })}
    <div class="mx-auto mt-14 max-w-3xl space-y-3">
      ${each(app.faqs, (f, i) => `
        <details class="card reveal px-6 py-5" style="--delay: ${i * 60}ms">
          <summary class="flex items-center justify-between gap-4 font-medium">${esc(f.q)} ${icons.plus}</summary>
          <p class="mt-3 text-sm leading-relaxed text-zinc-400">${esc(f.a)}</p>
        </details>`)}
    </div>`,
    { className: "border-t border-white/5" }
  );
}

function supportAndPrivacy(app) {
  const subject = encodeURIComponent(`${app.name} — Support`);
  const tile = (href, emoji, title, text, cta, delay) => `
    <a href="${href}" class="card card-lift reveal group p-8" style="--delay: ${delay}ms">
      <div class="icon-tile" style="background: ${rgba(app.colors[0], 0.15)}; border: 1px solid ${rgba(app.colors[0], 0.3)}">${emoji}</div>
      <h3 class="mt-5 font-display text-2xl font-semibold">${title}</h3>
      <p class="mt-2 text-sm leading-relaxed text-zinc-400">${text}</p>
      <span class="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3" style="color: ${app.colors[0]}">${cta} ${icons.arrowRight}</span>
    </a>`;

  return section(
    `
    <div class="grid gap-5 md:grid-cols-2">
      ${tile(`mailto:${esc(site.email)}?subject=${subject}`, "💬", "Support", `Need help or found a bug? Email us at ${esc(site.email)}.`, "Contact support", 0)}
      ${tile(`#/apps/${app.id}/privacy`, "🔒", "Privacy Policy", `Learn what data ${esc(app.name)} collects and how it's used.`, "Read privacy policy", 90)}
    </div>`,
    { className: "border-t border-white/5" }
  );
}

function moreApps(app) {
  const others = apps.filter((a) => a.id !== app.id);
  if (!others.length) return "";
  return section(
    `
    <h2 class="reveal font-display text-2xl font-bold">More from ${esc(site.company)}</h2>
    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      ${each(others, (o, i) => `
        <a href="#/apps/${o.id}" class="card card-lift reveal flex items-center gap-4 p-4" style="--delay: ${i * 70}ms">
          ${appIcon(o, "h-14 w-14 rounded-2xl text-2xl")}
          <div class="min-w-0">
            <p class="font-semibold">${esc(o.name)}</p>
            <p class="truncate text-sm text-zinc-500">${esc(o.tagline)}</p>
          </div>
        </a>`)}
    </div>`,
    { className: "border-t border-white/5" }
  );
}

export function appPage(id) {
  const app = apps.find((a) => a.id === id);
  if (!app) return null;

  const shots = app.screenshots.length ? app.screenshots : [null, null, null, null];

  return {
    title: `${app.name} — ${site.company}`,
    theme: { colors: app.colors, layout: "side" },
    html: hero(app, shots[0]) + features(app) + screenshots(app, shots) + faq(app) + supportAndPrivacy(app) + moreApps(app),
  };
}
