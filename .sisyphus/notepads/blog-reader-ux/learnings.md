# Learnings — blog-reader-ux

## Project Context
- **Repo**: botbies-blog/ = fork of botbies/botbies.github.io (hicky-bot/botbies.github.io)
- **Branch**: feat/reader-ux
- **Working dir**: /Users/kha/_projects/bbagent/botbies-blog/
- **Build**: `node build.js` → outputs to `_generated/` (gitignored)
- **Commit identity**: `git -c user.name="Hicky Sisyphus" -c user.email="hicky-bot@users.noreply.github.com" commit`
- **Strip Co-authored-by**: commit-msg hook in .git/hooks/commit-msg handles this automatically

## Key Files
- `build.js` (363 lines) — Node.js SSG, `marked` for markdown. Primary edit target.
- `assets/css/post.css` (241 lines) — CSS custom properties, dark/light/print. No img rules.
- `assets/css/style.css` (195 lines) — DEAD CODE. Not referenced in build.js. Do NOT touch.
- `assets/js/theme.js` (87 lines) — three-way toggle. Do NOT touch.
- `.github/workflows/build.yml` — `npm ci` → `node build.js` → upload `_generated/`

## CSS Notes
- Add markdown image styling in `assets/css/post.css` immediately after `.markdown-body hr` to keep post media responsive without touching build output logic.

## Existing Utilities to USE (not recreate)
- `formatDateShort(ts)` at build.js:72-75 — formats dates for cards
- `getExcerpt(content, maxLen)` at build.js:42-52 — strips markdown, truncates
- `esc(str)` at build.js:54-56 — HTML escaping
- `plainAuthor(str)` at build.js:58-59 — strips emoji from author names
- `byDateDesc(a, b)` at build.js:76-79 — sort comparator

## Critical Architecture Notes
- `postCard()` is used by homepage, tag pages, AND author pages — one change propagates all
- `pageShell()` is the single HTML template wrapper for all pages
- `build.js` wipes `_generated/` at start (line 289 rmSync) — Tailwind compile must run AFTER node build.js
- `<time>` elements are empty in raw HTML, filled by dates.js on hydration
- RSS content must be CDATA-wrapped — posts contain HTML from marked

## Task Dependency Order
T1 → T4, T5, T6, T7, T8
T2 → T8
T3 → T8
ALL → T8 (Tailwind last)

## Favicon task
- `pageShell()` now places the SVG favicon link immediately after the sitemap link and before `meta[name="color-scheme"]`.
- `assets/favicon.svg` is enough on its own; `copyDir('assets', path.join(OUT, 'assets'))` carries it into `_generated/assets/` automatically.
- A simple blue robot mark with a dark background stays readable at favicon sizes.
