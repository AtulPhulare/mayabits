// Home page: company hero, mission, process, published apps, contact.
import { site, apps } from "../config.js";
import { esc, each, icons } from "../utils.js";
import { appIcon, sectionHeader, section, featureCard, platformChips, phoneScreen } from "../components.js";

function hero() {
  const { hero } = site;
  return `
    <section class="relative flex min-h-[100svh] items-center">
      <div class="relative mx-auto max-w-6xl px-4 pb-24 pt-32 text-center sm:px-6">
        <div class="hero-scrim" aria-hidden="true"></div>
        <span class="eyebrow reveal"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"></span>${esc(hero.eyebrow)}</span>
        <h1 class="reveal mx-auto mt-8 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl" style="--delay: 80ms">
          ${esc(hero.title)} <span class="text-gradient">${esc(hero.highlight)}</span>
        </h1>
        <p class="reveal mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-zinc-400" style="--delay: 160ms">
          <strong class="font-semibold text-zinc-200">${esc(site.company)}</strong> ${esc(hero.text)}
        </p>
        <div class="reveal mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" style="--delay: 240ms">
          <a href="#apps" class="btn-primary w-full sm:w-auto">Explore our apps ${icons.arrowRight}</a>
          <a href="#mission" class="btn-ghost w-full sm:w-auto">Our mission</a>
        </div>
        <div class="reveal mt-16 flex flex-col items-center gap-3" style="--delay: 320ms">
          <div class="flex items-center justify-center -space-x-3">
            ${each(apps, (app) => `<a href="#/apps/${app.id}" title="${esc(app.name)}" class="relative rounded-2xl ring-4 ring-ink transition hover:z-10 hover:-translate-y-1">${appIcon(app, "h-14 w-14 rounded-2xl text-2xl")}</a>`)}
          </div>
          <p class="text-xs font-medium text-zinc-400">${apps.length} ${apps.length === 1 ? "app" : "apps"} and counting</p>
        </div>
      </div>
      <a href="#mission" class="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500" aria-label="Scroll down">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
      </a>
    </section>`;
}

function mission() {
  const m = site.mission;
  return section(
    `
    <div class="grid gap-14 lg:grid-cols-2 lg:items-center">
      <div>
        ${sectionHeader({ eyebrow: "Our mission", title: m.heading, text: m.text })}
        <dl class="reveal mt-10 grid grid-cols-3 gap-3" style="--delay: 120ms">
          ${each(m.stats, (s) => `
            <div class="card p-5 text-center">
              <dt class="font-display text-2xl font-bold sm:text-3xl" data-count>${esc(s.value.replace("{apps}", apps.length))}</dt>
              <dd class="mt-1 text-xs text-zinc-500">${esc(s.label)}</dd>
            </div>`)}
        </dl>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        ${each(m.values, (v, i) => featureCard(v, i))}
      </div>
    </div>`,
    { id: "mission", className: "border-t border-white/5" }
  );
}

function process() {
  return section(
    `
    ${sectionHeader({ eyebrow: "How we work", title: "From a real problem to a little bit of magic", center: true })}
    <div class="relative mt-14 grid gap-4 md:grid-cols-3">
      <div class="process-line hidden md:block" aria-hidden="true"></div>
      ${each(site.mission.process, (p, i) => `
        <div class="card reveal p-8" style="--delay: ${i * 90}ms">
          <span class="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-ink font-display text-lg font-bold"><span class="text-gradient-static">${esc(p.step)}</span></span>
          <h3 class="mt-6 font-display text-xl font-semibold">${esc(p.title)}</h3>
          <p class="mt-2 text-sm leading-relaxed text-zinc-400">${esc(p.text)}</p>
        </div>`)}
    </div>`,
    { className: "border-t border-white/5" }
  );
}

// Even counts (2, 4) get a 2-column grid of wide cards with a phone preview; multiples of 3 stay compact.
const wideCards = apps.length % 3 !== 0;

function appCard(app, i) {
  if (wideCards) return wideAppCard(app, i);
  return `
    <a href="#/apps/${app.id}" class="card card-lift reveal group flex flex-col p-7" style="--delay: ${i * 90}ms">
      <div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl transition group-hover:opacity-40" style="background: ${app.colors[0]}"></div>
      <div class="flex items-start justify-between">
        ${appIcon(app)}
        <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">${esc(app.category)}</span>
      </div>
      <h3 class="mt-6 font-display text-2xl font-semibold">${esc(app.name)}</h3>
      <p class="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">${esc(app.tagline)}</p>
      <div class="mt-6 flex items-center justify-between">
        <div class="flex gap-1.5">${platformChips(app)}</div>
        <span class="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition group-hover:border-white group-hover:bg-white group-hover:text-zinc-900">${icons.arrowRight}</span>
      </div>
    </a>`;
}

function wideAppCard(app, i) {
  return `
    <a href="#/apps/${app.id}" class="card card-lift reveal group flex min-h-[19rem] flex-col p-7 sm:pr-48" style="--delay: ${i * 90}ms">
      <div class="pointer-events-none absolute -right-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full opacity-25 blur-3xl transition group-hover:opacity-50" style="background: ${app.colors[0]}"></div>
      <div class="mini-phone hidden sm:block" aria-hidden="true">${phoneScreen(app, 0, app.screenshots[0], { compact: true })}</div>
      <div class="flex items-center gap-4">
        ${appIcon(app)}
        <span class="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">${esc(app.category)}</span>
      </div>
      <h3 class="mt-6 font-display text-2xl font-semibold">${esc(app.name)}</h3>
      <p class="mt-2 text-sm font-medium text-zinc-300">${esc(app.tagline)}</p>
      <p class="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-500">${esc(app.description)}</p>
      <div class="relative mt-6 flex items-center gap-3">
        <div class="flex gap-1.5">${platformChips(app)}</div>
        <span class="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition group-hover:border-white group-hover:bg-white group-hover:text-zinc-900 sm:ml-0">${icons.arrowRight}</span>
      </div>
    </a>`;
}

function appsGrid() {
  return section(
    `
    ${sectionHeader({ eyebrow: "Portfolio", title: "Digital realities we've crafted", text: "Tap any app to explore its features, screenshots, downloads and privacy policy." })}
    <div class="mt-14 grid gap-5 ${wideCards ? "lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}">${each(apps, appCard)}</div>`,
    { id: "apps", className: "border-t border-white/5" }
  );
}

function contact() {
  return section(
    `
    <div class="card reveal overflow-hidden p-10 text-center sm:p-16">
      <div class="pointer-events-none absolute inset-0 opacity-40" style="background: radial-gradient(600px circle at 50% 0%, ${site.colors[0]}55, transparent 60%)"></div>
      <div class="relative">
        <h2 class="font-display text-3xl font-bold tracking-tight sm:text-5xl">Let's create some <span class="text-gradient">magic</span></h2>
        <p class="mx-auto mt-4 max-w-xl text-zinc-400">Questions, feedback, partnerships or privacy concerns? Drop us a line — we usually reply within 48 hours.</p>
        <a href="mailto:${esc(site.email)}" class="btn-primary mt-9">${icons.mail} ${esc(site.email)}</a>
      </div>
    </div>`,
    { id: "contact", className: "border-t border-white/5" }
  );
}

export function homePage() {
  return {
    title: `${site.company} — Crafting Digital Realities`,
    theme: { colors: site.colors, layout: "center" },
    html: hero() + mission() + process() + appsGrid() + contact(),
  };
}
