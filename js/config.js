/* =========================================================================
   SITE CONTENT — edit this file only. Every page is generated from it.

   Pages:
     Home ............ index.html#/
     App page ........ index.html#/apps/<id>           e.g. #/apps/app1
     Privacy policy .. index.html#/apps/<id>/privacy   (use in Play Console / App Store)

   Per app:
     published    false hides the app from the site
     colors       two hex colors: app icon gradient + 3D scene tint
     playStore /
     appStore     store URLs; leave "" to show "Coming soon"
     screenshots  image paths, e.g. "assets/screenshots/app1-1.png"; [] shows placeholders
     sdks         any of: "playServices", "admob", "firebaseAnalytics", "crashlytics"
   ========================================================================= */

export const site = {
  company: "Mayabits",
  developer: "Mayabits",
  email: "[your-email@example.com]",
  tagline: "Crafting digital realities — we turn invisible bits of code into beautiful, user-friendly apps that solve real-world problems.",
  effectiveDate: "2026-10-22",
  colors: ["#6366f1", "#a855f7"],

  // 3D background: "orb" | "waves" | "blob" | "icons" | "aurora"
  // Preview any of them without editing this file: index.html?bg=waves
  background: "icons",

  hero: {
    eyebrow: "Where Data Meets Imagination",
    title: "Crafting",
    highlight: "Digital Realities.",
    text: "is where ancient magic meets modern code. We weave invisible bits into beautiful, powerful apps — each one built to solve a genuine real-world problem, with an experience that feels effortless.",
  },

  mission: {
    heading: "Transforming bits into brilliance.",
    text: "We don't just write code — we craft it. Like a digital illusionist, we take the problems people face every day, at home, at work and on the go, and weave raw bits into polished products that make them disappear. Every app we ship is ours end to end, so we obsess over clean, intuitive design and the best possible experience for the people using it.",
    stats: [
      { value: "{apps}", label: "Apps & counting" },   // {apps} = number of published apps
      { value: "100%", label: "In-house products" },
      { value: "1st", label: "User experience" },
    ],
    values: [
      { icon: "🧩", title: "Problem first", text: "Every app starts with a real-world problem worth solving — not a feature list." },
      { icon: "🪄", title: "Digital craftsmanship", text: "We weave data and code into systems that feel simple, even when what's underneath isn't." },
      { icon: "👆", title: "Effortless by design", text: "Clean, intuitive interfaces anyone can pick up in seconds — the magic is that it just works." },
      { icon: "🔒", title: "Built on trust", text: "No illusions about your data: we collect only what's needed to run and improve our apps, and we're open about it." },
    ],
    process: [
      { step: "01", title: "Discover", text: "We find real problems people face every day and understand them deeply." },
      { step: "02", title: "Weave the bits", text: "We design and build a simple, user-friendly solution, polishing every detail until it feels effortless." },
      { step: "03", title: "Manifest & improve", text: "We launch it into the world, listen to our users and keep making the experience better." },
    ],
  },
};

export const apps = [
  {
    id: "app1",
    published: true,
    name: "[App 1 Name]",
    category: "Productivity",
    tagline: "Get more done with less effort.",
    description: "A longer description of App 1. Explain what it does, who it's for, and what makes it different from everything else on the store.",
    icon: "🚀",
    colors: ["#6366f1", "#3b82f6"],
    playStore: "https://play.google.com/store/apps/details?id=com.example.app1",
    appStore: "",
    screenshots: [],
    features: [
      { icon: "⚡", title: "Lightning fast", text: "Opens instantly and stays responsive, even on older devices." },
      { icon: "🌙", title: "Dark mode", text: "Easy on the eyes, day or night." },
      { icon: "📴", title: "Works offline", text: "Use every core feature without an internet connection." },
      { icon: "🔔", title: "Smart reminders", text: "Gentle nudges at exactly the right time." },
      { icon: "📊", title: "Insights", text: "Clear stats that show your progress over time." },
      { icon: "🎨", title: "Beautiful design", text: "A clean interface that gets out of your way." },
    ],
    faqs: [
      { q: "Is [App 1 Name] free?", a: "Yes. The app is free to download and use, supported by non-intrusive ads." },
      { q: "Do I need an account?", a: "No. You can start using the app immediately without signing up." },
      { q: "How do I report a bug?", a: "Email us using the Support card on this page and we'll get back to you quickly." },
    ],
    sdks: ["playServices", "admob", "firebaseAnalytics", "crashlytics"],
  },
  {
    id: "app2",
    published: true,
    name: "[App 2 Name]",
    category: "Lifestyle",
    tagline: "Your everyday companion, beautifully simple.",
    description: "A longer description of App 2. Explain what it does, who it's for, and what makes it different from everything else on the store.",
    icon: "🎨",
    colors: ["#d946ef", "#ec4899"],
    playStore: "https://play.google.com/store/apps/details?id=com.example.app2",
    appStore: "https://apps.apple.com/app/id0000000000",
    screenshots: [],
    features: [
      { icon: "🖌️", title: "Creative tools", text: "Everything you need, right at your fingertips." },
      { icon: "☁️", title: "Auto save", text: "Never lose your work again." },
      { icon: "📤", title: "Easy sharing", text: "Share to any app in a single tap." },
      { icon: "🌈", title: "Themes", text: "Personalize the look and feel to match your style." },
    ],
    faqs: [
      { q: "Is [App 2 Name] free?", a: "Yes, it's free to download with optional ads." },
      { q: "Which devices are supported?", a: "Android 6.0+ and iOS 14+." },
    ],
    sdks: ["playServices", "admob", "firebaseAnalytics"],
  },
  {
    id: "app3",
    published: true,
    name: "[App 3 Name]",
    category: "Utilities",
    tagline: "The smart little tool you'll use every day.",
    description: "A longer description of App 3. Explain what it does, who it's for, and what makes it different from everything else on the store.",
    icon: "⚡",
    colors: ["#10b981", "#14b8a6"],
    playStore: "",
    appStore: "",
    screenshots: [],
    features: [
      { icon: "🧠", title: "Smart automation", text: "Let the app handle the repetitive work for you." },
      { icon: "🔋", title: "Battery friendly", text: "Optimized to use minimal resources." },
      { icon: "🛡️", title: "Private by design", text: "Your data stays on your device." },
    ],
    faqs: [
      { q: "When will [App 3 Name] launch?", a: "Very soon! Contact us to get notified on launch day." },
    ],
    sdks: ["playServices", "firebaseAnalytics", "crashlytics"],
  },
  {
    id: "app4",
    published: true,
    name: "[App 4 Name]",
    category: "Education",
    tagline: "Learn something new, a few minutes a day.",
    description: "A longer description of App 4. Explain what it does, who it's for, and what makes it different from everything else on the store.",
    icon: "📚",
    colors: ["#f59e0b", "#f97316"],
    playStore: "",
    appStore: "",
    screenshots: [],
    features: [
      { icon: "⏱️", title: "Bite-sized lessons", text: "Short sessions that fit into any part of your day." },
      { icon: "📈", title: "Track progress", text: "See how far you've come with simple stats." },
      { icon: "🌙", title: "Dark mode", text: "Easy on the eyes, day or night." },
    ],
    faqs: [
      { q: "When will [App 4 Name] launch?", a: "Very soon! Contact us to get notified on launch day." },
    ],
    sdks: ["playServices", "firebaseAnalytics"],
  },
].filter((app) => app.published !== false);

export const sdks = {
  playServices:      { name: "Google Play Services",          url: "https://www.google.com/policies/privacy/" },
  admob:             { name: "AdMob",                         url: "https://support.google.com/admob/answer/6128543" },
  firebaseAnalytics: { name: "Google Analytics for Firebase", url: "https://firebase.google.com/policies/analytics" },
  crashlytics:       { name: "Firebase Crashlytics",          url: "https://firebase.google.com/support/privacy/" },
};
