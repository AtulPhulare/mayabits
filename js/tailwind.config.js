// Tailwind CDN configuration — design tokens shared by every page.
// `ink`, `white` and the `zinc` scale read CSS variables (see :root in css/styles.css), so every
// existing class (bg-ink, text-zinc-400, border-white/10, hover:text-white…) flips with the theme.
// In light mode "white" means "strongest foreground" (near-black) and the zinc scale is inverted.
// Use `snow` for anything that must stay pure white in both themes (e.g. text on an app gradient).
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`;

tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: themed("ink"),
        white: themed("white"),
        snow: "#ffffff",
        zinc: Object.fromEntries(
          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => [n, themed(`zinc-${n}`)])
        ),
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "ui-sans-serif", "sans-serif"],
      },
    },
  },
};
