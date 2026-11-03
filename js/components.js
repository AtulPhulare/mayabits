// Reusable UI building blocks. Each returns an HTML string.
import { esc, gradient, rgba, each, icons } from "./utils.js";

export function appIcon(app, size = "h-16 w-16 rounded-2xl text-3xl") {
  return `<div class="app-icon ${size}" style="${gradient(app.colors)} --glow: ${rgba(app.colors[0], 0.6)};">${app.icon}</div>`;
}

export function sectionHeader({ eyebrow, title, text = "", center = false }) {
  return `
    <div class="reveal ${center ? "mx-auto text-center" : ""} max-w-2xl">
      ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ""}
      <h2 class="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">${esc(title)}</h2>
      ${text ? `<p class="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">${esc(text)}</p>` : ""}
    </div>`;
}

export function section(content, { id = "", className = "" } = {}) {
  return `
    <section ${id ? `id="${id}"` : ""} class="relative ${className}">
      <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">${content}</div>
    </section>`;
}

export function featureCard({ icon, title, text }, i = 0, colors) {
  const iconStyle = colors ? gradient(colors) : "background: rgb(var(--white) / 0.06);";
  return `
    <div class="card card-lift reveal flex gap-4 p-5 sm:block sm:p-6" style="--delay: ${i * 70}ms">
      <div class="icon-tile" style="${iconStyle}">${icon}</div>
      <div>
        <h3 class="font-display text-lg font-semibold sm:mt-5">${esc(title)}</h3>
        <p class="mt-1 text-sm leading-relaxed text-zinc-400 sm:mt-2">${esc(text)}</p>
      </div>
    </div>`;
}

export function storeButtons(app) {
  const button = (url, small, big, icon) =>
    url
      ? `<a href="${esc(url)}" target="_blank" rel="noopener" class="inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgb(var(--white)/.5)]">
           ${icon}
           <span class="text-left leading-tight">
             <span class="block text-[10px] uppercase tracking-wider text-zinc-500">${small}</span>
             <span class="block font-semibold">${big}</span>
           </span>
         </a>`
      : "";

  const html =
    button(app.playStore, "Get it on", "Google Play", icons.googlePlay) +
    button(app.appStore, "Download on the", "App Store", icons.apple);

  return (
    html ||
    `<span class="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 font-semibold text-zinc-300">
       <span class="h-2 w-2 animate-pulse rounded-full bg-amber-400"></span> Coming soon
     </span>`
  );
}

export function platformChips(app) {
  const chips = [app.playStore && "Android", app.appStore && "iOS"].filter(Boolean);
  if (!chips.length) chips.push("Coming soon");
  return each(chips, (c) => `<span class="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-400">${c}</span>`);
}

/** A screenshot, or a placeholder screen in the app's colors when there is none yet. */
export function phoneScreen(app, index, src, { compact = false } = {}) {
  if (src) return `<img src="${esc(src)}" alt="${esc(app.name)} screenshot ${index + 1}" class="h-full w-full object-cover" loading="lazy" />`;
  return `
    <div class="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden" style="${gradient(app.colors)}">
      <div class="absolute ${compact ? "inset-x-4 top-8" : "inset-x-6 top-14"} space-y-2 opacity-30">
        <div class="h-3 w-2/3 rounded-full bg-snow"></div>
        <div class="h-3 w-1/2 rounded-full bg-snow"></div>
      </div>
      <span class="${compact ? "text-4xl" : "text-6xl"} drop-shadow-lg">${app.icon}</span>
      ${compact ? "" : `<span class="text-xs font-medium text-snow/80">Screenshot ${index + 1}</span>`}
      <div class="absolute ${compact ? "inset-x-4 bottom-5" : "inset-x-6 bottom-8"} grid grid-cols-3 gap-2 opacity-25">
        <div class="${compact ? "h-8" : "h-12"} rounded-xl bg-snow"></div><div class="${compact ? "h-8" : "h-12"} rounded-xl bg-snow"></div><div class="${compact ? "h-8" : "h-12"} rounded-xl bg-snow"></div>
      </div>
    </div>`;
}

export function phoneMockup(app, index, src, { width = "w-60", float = false } = {}) {
  return `<div class="phone ${width} ${float ? "float" : ""} snap-center">${phoneScreen(app, index, src)}</div>`;
}

export function backLink(href, label) {
  return `<a href="${href}" class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur transition hover:bg-white/10 hover:text-white">${icons.arrowLeft} ${esc(label)}</a>`;
}
