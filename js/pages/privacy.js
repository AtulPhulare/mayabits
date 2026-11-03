// Privacy policy page for a single app, with a sticky table of contents.
import { site, apps, sdks } from "../config.js";
import { esc, each, icons } from "../utils.js";
import { appIcon, backLink } from "../components.js";

function policySections(app) {
  const name = esc(app.name);
  const dev = esc(site.developer);
  const email = esc(site.email);
  const has = (key) => app.sdks.includes(key);

  const collected = [
    has("admob") && `<li><strong>AdMob:</strong> may collect the device advertising ID, IP address, and ad interaction data to serve and measure personalized or non-personalized ads. You can reset or opt out of ad personalization in your device settings.</li>`,
    has("firebaseAnalytics") && `<li><strong>Firebase / Google Analytics:</strong> collects anonymous usage data such as app opens, screens viewed, session duration, device model, OS version, and approximate region to help us understand how the app is used.</li>`,
    has("crashlytics") && `<li><strong>Firebase Crashlytics:</strong> collects crash reports and diagnostic information (device state, stack traces, installation UUID) to help us fix bugs and improve stability.</li>`,
    has("playServices") && `<li><strong>Google Play Services:</strong> used for core app functionality and may process device identifiers in accordance with Google's policies.</li>`,
  ].filter(Boolean).join("");

  const sdkLinks = each(app.sdks, (key) => `<li><a href="${sdks[key].url}" target="_blank" rel="noopener">${sdks[key].name}</a></li>`);

  return [
    {
      id: "introduction",
      title: "Introduction",
      body: `
        <p>${dev} built the <strong>${name}</strong> app as a free app${has("admob") ? " supported by advertisements" : ""}. This SERVICE is provided by ${dev} at no cost and is intended for use as is.</p>
        <p>This page informs visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decides to use our Service. If you choose to use our Service, you agree to the collection and use of information in relation to this policy. The Personal Information we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</p>`,
    },
    {
      id: "information-collection",
      title: "Information Collection and Use",
      body: `
        <p>For a better experience while using our Service, we may require you to provide us with certain personally identifiable information. The information that we request will be retained on your device and/or by us and used as described in this privacy policy.</p>
        <p>The app uses third-party services that may collect information used to identify you, including:</p>
        <ul>${collected}</ul>`,
    },
    {
      id: "log-data",
      title: "Log Data",
      body: `<p>Whenever you use our Service, in case of an error in the app we collect data and information (through third-party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol ("IP") address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.</p>`,
    },
    {
      id: "cookies",
      title: "Cookies",
      body: `
        <p>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites you visit and are stored on your device's internal memory.</p>
        <p>This Service does not use these "cookies" explicitly. However, the app may use third-party code and libraries that use "cookies" or similar technologies to collect information and improve their services. You have the option to either accept or refuse these cookies where offered.</p>`,
    },
    {
      id: "service-providers",
      title: "Service Providers",
      body: `
        <p>We may employ third-party companies and individuals for the following reasons:</p>
        <ul>
          <li>To facilitate our Service;</li>
          <li>To provide the Service on our behalf;</li>
          <li>To perform Service-related services; or</li>
          <li>To assist us in analyzing how our Service is used.</li>
        </ul>
        <p>These third parties may have access to your Personal Information solely to perform the tasks assigned to them on our behalf, and are obligated not to disclose or use it for any other purpose.</p>
        <p><strong>Third-party SDKs used by ${name} and their privacy policies:</strong></p>
        <ul>${sdkLinks}</ul>`,
    },
    {
      id: "security",
      title: "Security",
      body: `<p>We value your trust in providing us your Personal Information and strive to use commercially acceptable means of protecting it. However, no method of transmission over the internet or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>`,
    },
    {
      id: "links",
      title: "Links to Other Sites",
      body: `<p>This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. These external sites are not operated by us, so we strongly advise you to review their Privacy Policy. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>`,
    },
    {
      id: "children",
      title: "Children's Privacy",
      body: `<p>These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete it from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take the necessary actions.</p>`,
    },
    {
      id: "changes",
      title: "Changes to This Privacy Policy",
      body: `<p>We may update our Privacy Policy from time to time. You are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. Changes are effective immediately after they are posted.</p>`,
    },
    {
      id: "contact-us",
      title: "Contact Us",
      body: `<p>If you have any questions or suggestions about this Privacy Policy, do not hesitate to contact us at <a href="mailto:${email}">${email}</a>.</p>`,
    },
  ];
}

/** Short plain-language summary shown above the full policy. */
function atAGlance(app) {
  const fact = (emoji, title, text) => `
    <div class="flex gap-3">
      <span class="text-xl">${emoji}</span>
      <div><p class="font-medium text-zinc-200">${title}</p><p class="mt-0.5 text-sm text-zinc-500">${text}</p></div>
    </div>`;
  return `
    <div class="card reveal mt-10 p-6 sm:p-8">
      <p class="text-sm font-semibold text-zinc-300">At a glance</p>
      <div class="mt-5 grid gap-6 sm:grid-cols-3">
        ${fact("📅", "Effective date", esc(site.effectiveDate))}
        ${fact("🧩", "Third-party services", esc(app.sdks.map((key) => sdks[key].name).join(", ")) + ".")}
        ${fact("✉️", "Questions?", `Email <a href="mailto:${esc(site.email)}" class="text-zinc-300 underline underline-offset-4 hover:text-white">${esc(site.email)}</a>`)}
      </div>
    </div>`;
}

export function privacyPage(id) {
  const app = apps.find((a) => a.id === id);
  if (!app) return null;

  const sections = policySections(app);

  return {
    title: `Privacy Policy — ${app.name}`,
    theme: { colors: app.colors, layout: "dim" },
    html: `
      <section class="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
        <div class="reveal">${backLink(`#/apps/${app.id}`, `Back to ${app.name}`)}</div>

        <header class="reveal mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
          ${appIcon(app, "h-20 w-20 rounded-3xl text-4xl")}
          <div>
            <span class="eyebrow">Privacy Policy</span>
            <h1 class="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">${esc(app.name)}</h1>
            <p class="mt-2 text-sm text-zinc-500">Developer: <span class="text-zinc-300">${esc(site.developer)}</span> · Effective date: ${esc(site.effectiveDate)}</p>
          </div>
        </header>

        ${atAGlance(app)}

        <details class="toc-mobile card mt-6 lg:hidden">
          <summary class="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-zinc-300">On this page ${icons.plus}</summary>
          <div class="px-5 pb-4 text-sm">${each(sections, (s) => `<a href="#${s.id}" data-toc="${s.id}" class="toc-link">${s.title}</a>`)}</div>
        </details>

        <div class="mt-6 grid gap-10 lg:mt-12 lg:grid-cols-[220px_1fr]">
          <nav class="hidden lg:block" aria-label="Table of contents">
            <div class="sticky top-28 text-sm">
              <p class="mb-3 font-semibold text-zinc-300">On this page</p>
              ${each(sections, (s) => `<a href="#${s.id}" data-toc="${s.id}" class="toc-link">${s.title}</a>`)}
            </div>
          </nav>

          <article class="policy card reveal p-6 sm:p-10">
            ${each(sections, (s, i) => `
              <section id="${s.id}">
                <h2 ${i === 0 ? 'style="margin-top:0"' : ""}>${s.title}</h2>
                ${s.body}
              </section>`)}
          </article>
        </div>
      </section>`,
  };
}
