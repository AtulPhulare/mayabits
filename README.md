# Mayabits — App Studio Website

Static site for GitHub Pages: company home page, a landing page per app, and a privacy policy per app.
Built with Tailwind CSS (CDN), Three.js (CDN) and plain ES modules — no build step.

## Edit content

All text, apps, colors, store links and SDKs live in **`js/config.js`**. You shouldn't need to touch anything else.

The 3D background is chosen with `background` in `js/config.js` (`orb`, `waves`, `blob`, `icons`, `aurora`). To preview one without editing, open `index.html?bg=waves`.

Screenshots go in `assets/screenshots/` and are listed per app, e.g. `screenshots: ["assets/screenshots/app1-1.png"]`.

## Page URLs

| Page | URL |
| --- | --- |
| Home | `https://<user>.github.io/<repo>/` |
| App page | `…/#/apps/app1` |
| Privacy policy (for Play Console / App Store) | `…/#/apps/app1/privacy` |

## Structure

```
index.html            Layout shell: navbar, <main id="view">, footer
css/styles.css        Custom styles (cards, buttons, phone mockup, policy typography, animations)
js/tailwind.config.js Tailwind theme tokens (fonts, colors)
js/config.js          ← All site content
js/main.js            Entry point: binds layout, starts scene + router
js/router.js          Hash router (#/, #/apps/<id>, #/apps/<id>/privacy)
js/scene.js           Three.js background host, tinted per page
js/backgrounds/       Background variants: orb, waves, blob, icons, aurora
js/effects.js         Scroll reveal, card spotlight, navbar, mobile menu, policy TOC
js/utils.js           Helpers and SVG icons
js/components.js      Reusable UI pieces (app icon, store buttons, phone mockup, cards)
js/pages/home.js      Home page
js/pages/app.js       App landing page
js/pages/privacy.js   Privacy policy page
```

## Run locally

ES modules don't load from `file://`, so serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Push to a GitHub repo → Settings → Pages → deploy from the `main` branch, root folder.
