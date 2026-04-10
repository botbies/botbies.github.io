# Blog Theme Switcher — Light / Dark / Auto

## TL;DR

> **Quick Summary**: Add a three-way theme switcher (Light / Dark / Auto) to the Botbies blog. Refactor all hardcoded dark-theme colors in `post.css` to CSS custom properties, create a warm-light theme palette, and add a fixed toggle button in the top-right corner of every page. Auto mode follows the browser's `prefers-color-scheme` setting.
>
> **Deliverables**:
> - Refactored `post.css` with CSS custom properties for all colors
> - Light theme variable set (warm light palette)
> - `theme.js` — toggle logic, localStorage persistence, system preference detection
> - FOWT-prevention inline script in every page's `<head>`
> - Toggle UI (fixed top-right) injected via `build.js` `pageShell()`
> - Updated Tailwind color classes in `build.js` templates
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: T1 → T4 → T6 → T7 → Final Verification

---

## Context

### Original Request
Add light theme support to the blog with a switch between Light, Dark, and Auto (which follows browser settings).

### Interview Summary
**Key Discussions**:
- **Toggle placement**: Fixed top-right corner, always visible on every page
- **Light palette**: Warm light — off-white/cream backgrounds, warm grays for text, blue accents
- **Auto mode**: Follows `prefers-color-scheme` media query
- **Three modes**: Light, Dark, Auto (cycle on click)

**Research Findings**:
- Blog is a static site built by `build.js` (Node.js + `marked`). All HTML via string templates.
- Two CSS files: `style.css` (UNUSED — dead code) and `post.css` (loaded on every page via `pageShell()`)
- Tailwind CSS via unpinned CDN (`cdn.tailwindcss.com`)
- Only JS is `dates.js` (5 lines, date formatting)
- ~25 hardcoded color values in `post.css`, 11 Tailwind color classes in `build.js`
- No CSS variables, no theme system, no media queries for color-scheme
- All pages generated through `pageShell()` function in `build.js`

### Metis Review
**Identified Gaps** (addressed):
- **Blue accent contrast on light backgrounds**: `#60a5fa` fails WCAG AA on white (~3.4:1). → Use darker blues (e.g., `#2563eb`) for light theme text links.
- **Semi-transparent cards on light bg**: `.card` and `.comment-card` use `rgba()` + `backdrop-filter: blur()`. → Adjust opacity/colors for light mode.
- **Blog title glow**: Blue `text-shadow` invisible on light bg. → Use darker shadow or disable in light mode.
- **Tailwind CDN unpinned**: Version unknown, affects dark mode config. → Pin version during implementation.
- **First-time visitor default**: → Auto mode (falls back to dark if no system pref — preserves current experience).
- **No-JS fallback**: → Add `@media (prefers-color-scheme)` in CSS as baseline.
- **Print stylesheet**: → Force light theme via `@media print`.
- **`<meta name="theme-color">`**: → Update dynamically via JS.
- **Multi-tab sync**: → Out of scope for v1.

---

## Work Objectives

### Core Objective
Add a three-way theme switcher so the blog supports light, dark, and auto (system-preference) modes, with persistence across sessions and zero flash of wrong theme.

### Concrete Deliverables
- `assets/css/post.css` — refactored with CSS custom properties, dark + light variable sets, print override, no-JS fallback
- `assets/js/theme.js` — toggle logic, localStorage, matchMedia listener, FOWT prevention
- `build.js` — FOWT inline script in `<head>`, toggle HTML in body, meta tags, Tailwind class updates, pinned CDN version
- Baseline screenshots in `.sisyphus/evidence/` confirming dark theme regression

### Definition of Done
- [ ] Toggle visible on every page (home, post, tag, author) in fixed top-right position
- [ ] Click cycles through Auto → Light → Dark → Auto
- [ ] Theme persists across page navigation and browser sessions via localStorage
- [ ] Auto mode follows browser `prefers-color-scheme` and updates live on system change
- [ ] Dark theme is visually identical to current production (zero regression)
- [ ] Light theme text passes WCAG AA contrast ratios (≥4.5:1 body text, ≥3:1 large text)
- [ ] No flash of wrong theme (FOWT) on any page load
- [ ] Toggle is keyboard accessible with visible focus ring

### Must Have
- Three-way toggle: Light / Dark / Auto
- CSS custom properties for all theme colors
- localStorage persistence
- FOWT prevention via inline `<head>` script
- `color-scheme` CSS property per theme
- Dark mode visual regression = zero

### Must NOT Have (Guardrails)
- DO NOT touch `style.css` — it's dead code, separate cleanup if desired
- DO NOT refactor `build.js` HTML structure — only color-related classes + toggle injection
- DO NOT add npm dependencies — keep everything CDN/vanilla
- DO NOT change typography, spacing, or layout — theme switching is COLORS ONLY
- DO NOT add syntax highlighting libraries (code block colors → CSS variables only)
- DO NOT add custom scrollbar styling — let `color-scheme` property handle it
- DO NOT add transitions longer than 200ms on theme switch
- DO NOT store computed theme in localStorage — store user's CHOICE (`'light'`, `'dark'`, or absent for auto)
- DO NOT add per-component theming, image brightness adjustments, or settings panels
- DO NOT add multi-tab sync (out of scope v1)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (no test framework in this project)
- **Automated tests**: None — this is a static blog with no test runner
- **Framework**: None
- **Primary verification**: Agent-Executed QA via Playwright (browser) and Bash (build checks)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Build verification**: Use Bash — `node build.js`, grep for patterns, validate output
- **Visual/UI verification**: Use Playwright — open generated HTML, screenshot, inspect DOM
- **Accessibility verification**: Use Playwright — Tab navigation, aria attributes, contrast checks

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — setup + foundation):
├── Task 1: Baseline dark theme screenshots (all 4 page types)      [quick]
├── Task 2: Pin Tailwind CDN version in build.js                     [quick]
└── Task 3: Audit: verify all pages use pageShell(), no inline styles [quick]

Wave 2 (After Wave 1 — core work, parallel):
├── Task 4: Refactor post.css → CSS custom properties (dark + light + print + no-JS fallback) [unspecified-high]
└── Task 5: Create theme.js (toggle logic, localStorage, system pref, FOWT helper)            [unspecified-high]

Wave 3 (After Wave 2 — integration):
└── Task 6: Wire into build.js pageShell() — FOWT script, toggle HTML, meta tags, Tailwind classes [unspecified-high]

Wave 4 (After Wave 3 — polish + verification):
├── Task 7: Light theme visual polish (contrast fixes, card adjustments, glow effect)  [visual-engineering]
└── Task 8: Cache-busting + dark mode regression verification                          [quick]

Wave FINAL (After ALL tasks — 4 parallel reviews, then user okay):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high + playwright)
└── Task F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay

Critical Path: T1 → T4 → T6 → T7 → Final
Parallel Speedup: ~40% faster than sequential
Max Concurrent: 3 (Wave 1)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| T1 | — | T4, T7, T8 |
| T2 | — | T6 |
| T3 | — | T6 |
| T4 | T1 | T6 |
| T5 | — | T6 |
| T6 | T2, T3, T4, T5 | T7, T8 |
| T7 | T6 | F1–F4 |
| T8 | T1, T6 | F1–F4 |
| F1–F4 | T7, T8 | — |

### Agent Dispatch Summary

- **Wave 1**: **3 tasks** — T1 → `quick`, T2 → `quick`, T3 → `quick`
- **Wave 2**: **2 tasks** — T4 → `unspecified-high`, T5 → `unspecified-high`
- **Wave 3**: **1 task** — T6 → `unspecified-high`
- **Wave 4**: **2 tasks** — T7 → `visual-engineering`, T8 → `quick`
- **FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high` + `playwright`, F4 → `deep`

---

## TODOs

- [x] 1. Baseline Dark Theme Screenshots

  **What to do**:
  - Run `node build.js` to generate the current site
  - Serve `_generated/` locally (e.g., `npx serve _generated`)
  - Use Playwright to open and screenshot all 4 page types:
    - Home page (`/`)
    - A post page (`/posts/{any-existing-post}/`)
    - A tag page (`/tags/{any-existing-tag}/`)
    - An author page (`/authors/hicky-bot/`)
  - Save full-page screenshots as the dark theme regression baseline
  - These screenshots are the GOLDEN REFERENCE — dark theme after refactor MUST match them

  **Must NOT do**:
  - Do not modify any source files
  - Do not change any CSS or JS

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]
    - `playwright`: Browser automation for screenshots

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 4, 7, 8
  - **Blocked By**: None

  **References**:
  - `build.js:283-356` — Build process: generates `_generated/` directory with all page types
  - `build.js:299-306` — Posts are read from `posts/` directory, use any existing post ID
  - `build.js:323-338` — Tags generated from post frontmatter
  - `build.js:340-353` — Author pages generated from `authors/` directory

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Capture baseline screenshots of all page types
    Tool: Playwright
    Preconditions: `node build.js` succeeds, `_generated/` directory exists
    Steps:
      1. Start a local static server serving `_generated/` on port 3000
      2. Navigate to `http://localhost:3000/` — wait for network idle
      3. Screenshot full page → `.sisyphus/evidence/task-1-home-dark-baseline.png`
      4. Find first post link, navigate to it — wait for network idle
      5. Screenshot full page → `.sisyphus/evidence/task-1-post-dark-baseline.png`
      6. Navigate to any tag page (find a tag link on the post) — wait for network idle
      7. Screenshot full page → `.sisyphus/evidence/task-1-tag-dark-baseline.png`
      8. Navigate to `/authors/hicky-bot/` — wait for network idle
      9. Screenshot full page → `.sisyphus/evidence/task-1-author-dark-baseline.png`
    Expected Result: 4 PNG files exist in `.sisyphus/evidence/`, each showing the dark theme
    Failure Indicators: Any screenshot shows blank/white page, missing content, or build errors
    Evidence: .sisyphus/evidence/task-1-{page}-dark-baseline.png (4 files)
  ```

  **Commit**: YES (groups with T2, T3)
  - Message: `chore: baseline screenshots + pin tailwind + audit`
  - Files: `.sisyphus/evidence/task-1-*.png`
  - Pre-commit: Screenshots exist

- [x] 2. Pin Tailwind CDN Version

  **What to do**:
  - Check which Tailwind version the CDN currently serves (load the URL, check version)
  - In `build.js`, replace `https://cdn.tailwindcss.com` with a pinned version URL (e.g., `https://cdn.tailwindcss.com?v=3.4.17` or the specific version URL pattern)
  - If v4 is detected, note this — it changes how `dark:` classes work (but we're primarily using CSS custom properties, so impact is minimal)
  - Run `node build.js` — must succeed
  - Verify generated HTML contains the pinned URL

  **Must NOT do**:
  - Do not install Tailwind locally
  - Do not add a tailwind.config.js
  - Do not change any other part of build.js

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `build.js:122` — Current CDN reference: `<script src="https://cdn.tailwindcss.com"></script>`
  - Tailwind CDN docs: `https://tailwindcss.com/docs/installation/play-cdn` — version pinning syntax

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Tailwind CDN is pinned to specific version
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run `grep "cdn.tailwindcss" build.js`
      2. Verify output contains a version identifier (not bare `cdn.tailwindcss.com`)
      3. Run `node build.js`
      4. Grep a generated HTML file for the Tailwind CDN URL
      5. Verify it contains the pinned version
    Expected Result: Tailwind CDN URL includes version, build succeeds, generated HTML has pinned URL
    Failure Indicators: Bare `cdn.tailwindcss.com` without version, build failure
    Evidence: .sisyphus/evidence/task-2-tailwind-pin.txt (grep output)

  Scenario: Build still produces valid output after pinning
    Tool: Bash
    Preconditions: Version pinned in build.js
    Steps:
      1. Run `node build.js`
      2. Verify `_generated/index.html` exists
      3. Verify it contains Tailwind classes (e.g., `text-blue-400`)
    Expected Result: Build succeeds, HTML contains expected Tailwind utility classes
    Failure Indicators: Build error, missing classes in output
    Evidence: .sisyphus/evidence/task-2-build-output.txt
  ```

  **Commit**: YES (groups with T1, T3)
  - Message: `chore: baseline screenshots + pin tailwind + audit`
  - Files: `build.js`
  - Pre-commit: `node build.js` succeeds

- [x] 3. Audit: Verify All Pages Use pageShell() and No Inline Styles

  **What to do**:
  - In `build.js`, verify that EVERY `fs.writeFileSync` call for HTML uses `pageShell()` or a function that calls `pageShell()`
  - Confirm: `generateHome()`, `generatePost()`, `generateTag()`, `generateAuthor()` all call `pageShell()`
  - Search `build.js` for any `style=` attributes with color values
  - Search for any `<style>` inline blocks
  - Search for any color-related attributes not going through CSS (e.g., `bgcolor`, `color` HTML attributes)
  - Document findings — if all clean, this confirms that modifying `pageShell()` + `post.css` covers 100% of pages

  **Must NOT do**:
  - Do not modify any files
  - This is a READ-ONLY audit task

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `build.js:102-135` — `pageShell()` function
  - `build.js:155-169` — `generateHome()` calls `pageShell()`
  - `build.js:171-214` — `generatePost()` calls `pageShell()`
  - `build.js:216-231` — `generateTag()` calls `pageShell()`
  - `build.js:233-262` — `generateAuthor()` calls `pageShell()`
  - `build.js:313-351` — All `writeFileSync` calls for HTML

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All HTML generation goes through pageShell()
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run `grep -n "pageShell" build.js` — count calls
      2. Run `grep -n "writeFileSync.*\.html" build.js` — count HTML writes
      3. Verify every HTML write corresponds to a pageShell() call
      4. Run `grep -n 'style=' build.js` — check for inline color styles
      5. Run `grep -n '<style' build.js` — check for inline style blocks
    Expected Result: All HTML writes use pageShell(). Zero inline color styles.
    Failure Indicators: Any HTML write not going through pageShell(), any inline color values
    Evidence: .sisyphus/evidence/task-3-audit-report.txt (grep outputs + conclusion)

  Scenario: No color-related HTML attributes in templates
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run `grep -niE 'bgcolor|color=|style=.*color' build.js`
      2. Verify zero matches (or only false positives in comments/strings)
    Expected Result: No color-related HTML attributes found
    Failure Indicators: Any hardcoded color in HTML attributes
    Evidence: .sisyphus/evidence/task-3-color-attrs.txt
  ```

  **Commit**: YES (groups with T1, T2)
  - Message: `chore: baseline screenshots + pin tailwind + audit`
  - Files: `.sisyphus/evidence/task-3-*.txt`
  - Pre-commit: Audit report shows all clear

- [x] 4. Refactor post.css — CSS Custom Properties with Dark + Light + Print + No-JS Fallback

  **What to do**:
  - **Phase A — Extract dark theme variables**: Replace ALL hardcoded color values in `post.css` with CSS custom properties. Define current dark values as defaults in `:root` (so dark theme works immediately with zero visual change).
    - Naming convention: `--bg-primary`, `--bg-secondary`, `--bg-card`, `--bg-code`, `--text-primary`, `--text-secondary`, `--text-muted`, `--text-heading-1`, `--text-heading-2`, `--text-heading-3`, `--text-accent`, `--text-strong`, `--text-em`, `--text-code`, `--border-primary`, `--border-accent`, `--glow-color`, `--shadow-color`, etc.
    - Map every selector's color/background/border-color to a variable
    - Include `color-scheme: dark;` on `:root`
  - **Phase B — Add light theme variables**: Add `html[data-theme="light"]` block with warm light palette:
    - Backgrounds: off-white/cream (`#faf9f6`, `#f5f3ef`), warm grays for cards (`rgba(245,243,239,0.9)`)
    - Text: warm dark grays (`#1a1a2e`, `#374151`, `#6b7280`)
    - Accents: darker blues for WCAG AA compliance (`#2563eb` for links, `#1e40af` for headings) — verify ≥4.5:1 contrast on light backgrounds
    - Borders: warm gray (`#e5e2dc`, `#d1cdc4`)
    - Code blocks: light warm gray (`#f0ede8`)
    - Blockquote border: `#3b82f6` (same)
    - Include `color-scheme: light;` in this block
  - **Phase C — No-JS fallback**: Add `@media (prefers-color-scheme: light)` block that applies light theme variables when JS is disabled (before any JS runs, the CSS alone handles it)
  - **Phase D — Print override**: Add `@media print` block that forces light theme variables (dark backgrounds waste ink)
  - **Verify**: After changes, run `node build.js` and open in browser. Dark theme MUST look identical to baseline screenshots from Task 1.
  - **Verify**: `grep -cE '#[0-9a-fA-F]{3,8}|rgba?\(' assets/css/post.css` — all hex/rgba values should ONLY be inside `:root`, `html[data-theme="light"]`, `@media (prefers-color-scheme: light)`, or `@media print` blocks. Zero hardcoded colors in selectors.

  **Must NOT do**:
  - Do not change selector names, spacing, or layout properties
  - Do not add new selectors (only modify existing ones + add variable definition blocks)
  - Do not touch `style.css`
  - Do not reorganize the file structure

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]
    - `playwright`: For visual regression comparison against baseline screenshots

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1 (needs baseline screenshots for regression comparison)

  **References**:

  **Pattern References**:
  - `assets/css/post.css:1-149` — ENTIRE FILE needs refactoring. Every line with a color value.

  **Key color values to extract (complete inventory from post.css)**:
  - `#0f172a` — body bg, pre bg → `--bg-primary`
  - `#e2e8f0` — body text → `--text-primary`
  - `rgba(30,41,59,0.7)` — .card bg → `--bg-card`
  - `rgba(255,255,255,0.1)` — .card border → `--border-card`
  - `rgba(147,197,253,0.5)` — .glow text-shadow → `--glow-color`
  - `rgba(147,197,253,0.4)` — .card:hover border → `--border-card-hover`
  - `rgba(20,30,48,0.6)` — .comment-card bg → `--bg-comment`
  - `rgba(255,255,255,0.05)` — .comment-card border → `--border-comment`
  - `#1e293b` — .tag bg → `--bg-tag`
  - `#94a3b8` — .tag color, .em color, .blockquote color → `--text-muted`
  - `#334155` — .tag border, .pre border, .hr border → `--border-primary`
  - `#3b82f6` — .tag:hover border, .blockquote border-left → `--border-accent`
  - `#93c5fd` — .tag:hover color → `--text-accent-light`
  - `#60a5fa` — h1 color, code color, a color → `--text-accent`
  - `#93c5fd` — h2 color → `--text-heading-2`
  - `#bfdbfe` — h3/h4 color → `--text-heading-3`
  - `#cbd5e1` — p color, ul/ol color, pre code color → `--text-secondary`
  - `#1e293b` — inline code bg → `--bg-code-inline`
  - `#0f172a` — pre bg → `--bg-code-block`
  - `#ffffff` — strong color → `--text-strong`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Dark theme visually identical after CSS variable extraction
    Tool: Playwright
    Preconditions: `node build.js` succeeds, baseline screenshots from Task 1 exist
    Steps:
      1. Serve `_generated/` on port 3000
      2. Navigate to home page — screenshot
      3. Navigate to a post page — screenshot
      4. Compare screenshots against `.sisyphus/evidence/task-1-home-dark-baseline.png` and task-1-post-dark-baseline.png
      5. Visual diff should show zero meaningful differences (pixel-level comparison or side-by-side)
    Expected Result: Dark theme unchanged — screenshots match baseline
    Failure Indicators: Any visible color difference between baseline and current
    Evidence: .sisyphus/evidence/task-4-dark-regression-home.png, task-4-dark-regression-post.png

  Scenario: No hardcoded colors remain in selectors
    Tool: Bash
    Preconditions: post.css has been refactored
    Steps:
      1. Extract all lines NOT inside :root, html[data-theme], @media blocks
      2. Grep those lines for hex colors (#xxx) or rgba()
      3. Result should be zero matches
    Expected Result: All color values are inside variable definition blocks only
    Failure Indicators: Any hex/rgba color found in a regular selector
    Evidence: .sisyphus/evidence/task-4-color-audit.txt

  Scenario: Light theme variables produce readable output
    Tool: Playwright
    Preconditions: post.css has light theme variables, a way to trigger them (add data-theme="light" manually via DevTools or temp script)
    Steps:
      1. Serve `_generated/` on port 3000
      2. Navigate to home page
      3. Execute JS: `document.documentElement.setAttribute('data-theme', 'light')`
      4. Screenshot — verify text is readable, no invisible elements
      5. Navigate to a post page, repeat
    Expected Result: Light theme shows warm cream bg, dark text, readable in all sections
    Failure Indicators: White-on-white text, invisible elements, unreadable code blocks
    Evidence: .sisyphus/evidence/task-4-light-preview-home.png, task-4-light-preview-post.png
  ```

  **Commit**: YES
  - Message: `refactor: extract CSS custom properties from post.css with light theme`
  - Files: `assets/css/post.css`
  - Pre-commit: `node build.js` succeeds, dark theme unchanged

- [x] 5. Create theme.js — Three-Way Toggle Logic

  **What to do**:
  - Create `assets/js/theme.js` — vanilla JavaScript, no dependencies, no frameworks
  - **State machine**: Three states — `'auto'` (default), `'light'`, `'dark'`
    - `auto`: Remove localStorage key. Apply theme based on `matchMedia('(prefers-color-scheme: dark)')`. Listen for changes.
    - `light`: Set `localStorage.setItem('botbies-theme', 'light')`. Set `data-theme="light"` on `<html>`.
    - `dark`: Set `localStorage.setItem('botbies-theme', 'dark')`. Set `data-theme="dark"` on `<html>`.
  - **Toggle cycle**: Auto → Light → Dark → Auto (each click advances)
  - **System preference listener**: `matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ...)` — only active in auto mode
  - **DOM updates on theme change**:
    - Set `document.documentElement.setAttribute('data-theme', resolvedTheme)`
    - Update `<meta name="theme-color">` content (dark: `#0f172a`, light: `#faf9f6`)
    - Update toggle button icon/aria-label
  - **Toggle button behavior**:
    - Find button by `id="theme-toggle"`
    - On click: advance to next state in cycle
    - Update icon: ☀️ (light active), 🌙 (dark active), ⚙️ (auto active)
    - Update `aria-label`: "Switch to light theme" / "Switch to dark theme" / "Switch to auto theme"
  - **Initialization** (runs on DOMContentLoaded):
    - Read localStorage for stored preference
    - If none → auto mode
    - Apply correct theme
    - Bind click handler to toggle button
  - **FOWT helper** (separate from main logic — will be inlined in `<head>` by Task 6):
    - Create a minimal function that can be copy-pasted into an inline `<script>` in `<head>`
    - This function reads localStorage, checks matchMedia, sets `data-theme` attribute BEFORE CSS loads
    - Keep it under 300 bytes minified
    - Document this clearly in a comment at the top of theme.js: "The FOWT prevention script below should be inlined in <head>"

  **Must NOT do**:
  - Do not use `document.write()`
  - Do not modify any other files
  - Do not add global variables (use IIFE or module pattern)
  - Do not add transitions to theme switching (that's CSS's job in post.css, handled elsewhere)
  - Do not store computed/resolved theme — store only user's CHOICE

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: Task 6
  - **Blocked By**: None (JS logic is independent of CSS variables)

  **References**:

  **Pattern References**:
  - `assets/js/dates.js:1-5` — Follow this pattern: vanilla JS, minimal DOM manipulation, no globals
  - `build.js:132` — Where scripts are loaded: `<script src="/assets/js/dates.js"></script>` (theme.js will be loaded similarly)

  **External References**:
  - MDN `matchMedia`: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
  - MDN `prefers-color-scheme`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Theme.js has no syntax errors and exports expected functions
    Tool: Bash
    Preconditions: theme.js exists at assets/js/theme.js
    Steps:
      1. Run `node -c assets/js/theme.js` (syntax check)
      2. Verify no errors
      3. Grep for key patterns: 'localStorage', 'matchMedia', 'data-theme', 'theme-toggle', 'aria-label'
    Expected Result: Zero syntax errors, all key patterns present
    Failure Indicators: Syntax error, missing core functionality patterns
    Evidence: .sisyphus/evidence/task-5-syntax-check.txt

  Scenario: FOWT prevention script is documented and under 300 bytes
    Tool: Bash
    Preconditions: theme.js exists
    Steps:
      1. Find the FOWT prevention script section in theme.js (look for comment marker)
      2. Extract it
      3. Verify it reads localStorage, checks matchMedia, sets data-theme
      4. Verify minified size is under 300 bytes
    Expected Result: FOWT script is clearly documented, self-contained, and compact
    Failure Indicators: Missing FOWT script, over 300 bytes, missing core logic
    Evidence: .sisyphus/evidence/task-5-fowt-script.txt

  Scenario: No global variable pollution
    Tool: Bash
    Preconditions: theme.js exists
    Steps:
      1. Grep for top-level `var `, `let `, `const `, `function ` declarations outside IIFE/module
      2. Verify the file uses IIFE `(function() { ... })()` or equivalent encapsulation
    Expected Result: All code is encapsulated, no global leaks
    Failure Indicators: Top-level declarations that would pollute window
    Evidence: .sisyphus/evidence/task-5-globals-check.txt
  ```

  **Commit**: YES
  - Message: `feat: add theme.js with three-way toggle logic`
  - Files: `assets/js/theme.js`
  - Pre-commit: `node -c assets/js/theme.js` passes

- [x] 6. Integrate Theme Switcher into build.js pageShell()

  **What to do**:
  - **FOWT inline script**: Add a `<script>` tag as the VERY FIRST child of `<head>` (before `<meta>`, `<link>`, or any external `<script>`). Paste the minified FOWT prevention script from theme.js (documented in Task 5). This must:
    - Read `localStorage.getItem('botbies-theme')`
    - If `'light'` or `'dark'` → set `document.documentElement.setAttribute('data-theme', value)`
    - If absent (auto) → check `matchMedia('(prefers-color-scheme: dark)')` → set accordingly, default to `'dark'` if no preference
    - This runs synchronously before any CSS loads, preventing FOWT
  - **Meta tags**: Add to `<head>`:
    - `<meta name="color-scheme" content="light dark">`
    - `<meta name="theme-color" content="#0f172a">` (JS will update this dynamically)
  - **Toggle HTML**: Add a fixed-position toggle button to the body (inside `<body>`, before the main content `<div>`):
    ```html
    <button id="theme-toggle" type="button" aria-label="Switch theme" style="position:fixed;top:1rem;right:1rem;z-index:50;background:none;border:1px solid var(--border-primary);border-radius:8px;padding:0.5rem;cursor:pointer;font-size:1.25rem;line-height:1;color:var(--text-muted);min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;" title="Toggle theme">⚙️</button>
    ```
    - 44×44px minimum touch target (accessibility)
    - Uses CSS variables for border/color (theme-aware)
    - Default icon ⚙️ (auto mode) — JS updates on load
  - **Load theme.js**: Add `<script src="/assets/js/theme.js"></script>` AFTER `dates.js` in the body
  - **Update Tailwind color classes**: Replace hardcoded Tailwind color classes in HTML templates with theme-aware equivalents:
    - `text-white` → `text-[var(--text-strong)]` or keep + add CSS override
    - `text-blue-400` → `text-[var(--text-accent)]` or keep + add CSS override  
    - `text-slate-400/500/600` → `text-[var(--text-muted)]` or similar
    - `bg-slate-800` → `bg-[var(--bg-tag)]` or similar
    - `border-slate-700` → `border-[var(--border-primary)]` or similar
    - `border-blue-500` → `border-[var(--border-accent)]` or similar
    - `shadow-2xl` → keep (shadow color auto-adapts)
    - **Strategy**: Where Tailwind `[var(--x)]` arbitrary value syntax works cleanly, use it. Where it gets ugly, add CSS overrides in post.css instead. Prefer fewer arbitrary values — a CSS override is cleaner than `text-[var(--text-accent)]` everywhere.
  - **Verify**: Run `node build.js`. Open generated pages. Toggle should be visible, all 3 modes should work.

  **Must NOT do**:
  - Do not change HTML structure/layout — only add toggle button and scripts
  - Do not change non-color Tailwind classes (spacing, flex, grid, etc.)
  - Do not remove the `cdn.tailwindcss.com` script tag
  - Do not change the `pageShell()` function signature

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]
    - `playwright`: For verifying toggle works in browser

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (solo)
  - **Blocks**: Tasks 7, 8
  - **Blocked By**: Tasks 2, 3, 4, 5

  **References**:

  **Pattern References**:
  - `build.js:102-135` — `pageShell()` function — the ONLY function to modify
  - `build.js:122` — Tailwind CDN script tag location (FOWT script goes BEFORE this)
  - `build.js:132` — dates.js script load (theme.js loads AFTER this)
  - `build.js:125` — `<body>` tag (toggle button goes right after this)

  **Template color classes to update** (complete inventory from build.js):
  - `build.js:140` — `text-slate-400`, `bg-slate-800`, `border-slate-700`, `border-blue-500`, `text-blue-300` (tag in postCard)
  - `build.js:145` — `text-blue-500` (date in postCard)
  - `build.js:148` — `text-white`, `text-blue-300` (title in postCard)
  - `build.js:151` — `text-blue-400` (author link in postCard)
  - `build.js:162` — `text-blue-400` (site title on home)
  - `build.js:163` — `text-slate-400` (tagline)
  - `build.js:197,222,240` — `text-blue-400`, `text-blue-300` (nav back-links)
  - `build.js:199` — `text-blue-400` (post title)
  - `build.js:200` — `text-slate-400`, `text-slate-600` (post meta)
  - `build.js:201` — `text-blue-400` (author link)
  - `build.js:203` — `text-blue-500`, `text-slate-600` (timestamp)
  - `build.js:207` — `text-slate-500`, `border-slate-700` (tags section)
  - `build.js:224` — `text-blue-400` (tag page title)
  - `build.js:225` — `text-slate-500` (tag post count)
  - `build.js:244` — `text-white` (author name)
  - `build.js:246` — `text-blue-400` (author role)
  - `build.js:249` — `text-slate-300` (bio)
  - `build.js:251` — `border-slate-700` (dividers)
  - `build.js:253` — `text-blue-400` (GitHub link)
  - `build.js:256` — `text-slate-300` (posts section heading)
  - `build.js:128-129` — `text-slate-600` (footer), `text-slate-400` (footer hover)

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Toggle visible and functional on home page
    Tool: Playwright
    Preconditions: `node build.js` succeeds
    Steps:
      1. Serve `_generated/` on port 3000
      2. Navigate to `http://localhost:3000/`
      3. Verify element `#theme-toggle` exists and is visible in top-right area
      4. Click `#theme-toggle` — verify `data-theme` attribute on `<html>` changes
      5. Click again — verify it cycles to next state
      6. Click again — verify full cycle (auto → light → dark → auto)
      7. Screenshot each state
    Expected Result: Toggle visible, cycles through 3 states, page colors change accordingly
    Failure Indicators: Toggle missing, click does nothing, theme doesn't change
    Evidence: .sisyphus/evidence/task-6-toggle-auto.png, task-6-toggle-light.png, task-6-toggle-dark.png

  Scenario: Theme persists across page navigation
    Tool: Playwright
    Preconditions: Site served on port 3000
    Steps:
      1. Navigate to home page
      2. Click toggle to set theme to "light"
      3. Click on a post link to navigate to post page
      4. Verify `data-theme="light"` is still set on `<html>`
      5. Verify toggle icon shows ☀️ (light mode indicator)
    Expected Result: Theme persists when navigating between pages
    Failure Indicators: Theme resets on navigation, wrong icon shown
    Evidence: .sisyphus/evidence/task-6-persistence.png

  Scenario: FOWT prevention — no flash on page load
    Tool: Playwright
    Preconditions: Site served on port 3000
    Steps:
      1. Set localStorage `botbies-theme` to `light` via JS
      2. Navigate to home page with CPU throttling (6x slowdown)
      3. Observe: page should render in light theme from first paint
      4. No dark-to-light flash visible
      5. View page source: verify inline script is FIRST element in `<head>`
    Expected Result: Light theme from first paint, no flash
    Failure Indicators: Brief dark flash before light theme applies
    Evidence: .sisyphus/evidence/task-6-no-fowt.png

  Scenario: Toggle is keyboard accessible
    Tool: Playwright
    Preconditions: Site served on port 3000
    Steps:
      1. Navigate to home page
      2. Press Tab repeatedly until `#theme-toggle` receives focus
      3. Verify focus ring is visible (outline or box-shadow)
      4. Press Enter — verify theme changes
      5. Check `aria-label` attribute updates to reflect new state
    Expected Result: Toggle reachable by keyboard, focus visible, Enter activates, aria-label updates
    Failure Indicators: Can't reach via Tab, no focus indicator, Enter doesn't work
    Evidence: .sisyphus/evidence/task-6-keyboard-a11y.png
  ```

  **Commit**: YES
  - Message: `feat: integrate theme switcher into all pages`
  - Files: `build.js`
  - Pre-commit: `node build.js` succeeds, toggle visible in browser

- [ ] 7. Light Theme Visual Polish

  **What to do**:
  - Open the blog in light mode and systematically review every page type for visual issues
  - **Contrast fixes** (WCAG AA minimum):
    - Body text on background: verify ≥4.5:1 ratio
    - Headings on background: verify ≥3:1 ratio (large text)
    - Link text on background: verify ≥4.5:1 ratio
    - Inline code text on code bg: verify ≥4.5:1 ratio
    - Muted text (meta, tags): verify ≥4.5:1 ratio
    - Use DevTools color picker or `axe-core` for automated checks
    - Adjust CSS variable values in `html[data-theme="light"]` block as needed
  - **Card adjustments**: `.card` and `.comment-card` with `backdrop-filter: blur()`:
    - On light bg, semi-transparent cards may look washed out
    - Increase opacity or use solid light backgrounds
    - Ensure card borders are visible but subtle
  - **Glow effect**: `.glow` class (`text-shadow`) on blog title:
    - Blue glow on light bg = invisible or ugly
    - Either use a darker/different shadow color for light mode, or disable glow entirely in light
    - CSS variable: `--glow-color` should have a meaningful light-mode value
  - **Code blocks**: `pre` and `code` elements:
    - Light mode should have a slightly tinted background (warm gray, not pure white)
    - Code text should be readable (darker blue or different accent)
  - **Blockquotes**: Blue left border should remain visible on light bg (blue on cream = fine)
  - **Tags**: Background and border should be visible/distinct on light bg
  - **Toggle button**: Verify it's visible on both light and dark themes (border + icon contrast)

  **Must NOT do**:
  - Do not change dark theme values (only modify `html[data-theme="light"]` variables)
  - Do not change layout, typography, or spacing
  - Do not add new CSS selectors or classes
  - Do not add transitions >200ms (wrap any transition in `@media (prefers-reduced-motion: no-preference)`)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`playwright`]
    - `playwright`: Browser-based visual inspection and screenshot comparison

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 8)
  - **Blocks**: F1–F4
  - **Blocked By**: Task 6

  **References**:

  **Pattern References**:
  - `assets/css/post.css` — `html[data-theme="light"]` block (created in Task 4)
  - `.sisyphus/evidence/task-4-light-preview-*.png` — Initial light theme screenshots from Task 4

  **External References**:
  - WCAG AA contrast requirements: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum
  - WebAIM contrast checker: https://webaim.org/resources/contrastchecker/

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All light theme text passes WCAG AA contrast
    Tool: Playwright
    Preconditions: Site served, light theme active
    Steps:
      1. Navigate to a post page in light mode
      2. For each text element type (body, h1, h2, h3, link, code, muted):
         - Get computed foreground color
         - Get computed background color
         - Calculate contrast ratio
      3. Verify all ratios meet WCAG AA:
         - Normal text: ≥4.5:1
         - Large text (h1, h2): ≥3:1
    Expected Result: All text meets WCAG AA minimum contrast ratios
    Failure Indicators: Any text below minimum ratio
    Evidence: .sisyphus/evidence/task-7-contrast-report.txt

  Scenario: Light theme looks polished on all page types
    Tool: Playwright
    Preconditions: Site served, light theme active
    Steps:
      1. Navigate to home page in light mode — screenshot
      2. Navigate to post page — screenshot
      3. Navigate to tag page — screenshot
      4. Navigate to author page — screenshot
      5. Verify: no invisible elements, no washed-out cards, readable code blocks
    Expected Result: Clean warm-light appearance on all pages
    Failure Indicators: Invisible text, washed-out cards, broken glow, unreadable code
    Evidence: .sisyphus/evidence/task-7-light-home.png, task-7-light-post.png, task-7-light-tag.png, task-7-light-author.png

  Scenario: Cards are readable on light background
    Tool: Playwright
    Preconditions: Site served, light theme active
    Steps:
      1. Navigate to home page
      2. Inspect `.card` elements — verify background is visible/distinct from page bg
      3. Verify card text is readable against card background
      4. Verify card borders are visible but subtle
    Expected Result: Cards have clear visual distinction from page background
    Failure Indicators: Cards blend into background, invisible borders
    Evidence: .sisyphus/evidence/task-7-light-cards.png
  ```

  **Commit**: YES
  - Message: `style: polish light theme contrast and visual details`
  - Files: `assets/css/post.css`
  - Pre-commit: Contrast checks pass

- [ ] 8. Cache-Busting + Dark Mode Regression Verification

  **What to do**:
  - **Cache-busting**: In `build.js`, add version query strings to all asset URLs in `pageShell()`:
    - `post.css` → `post.css?v={timestamp or hash}`
    - `dates.js` → `dates.js?v={timestamp or hash}`
    - `theme.js` → `theme.js?v={timestamp or hash}`
    - Use build timestamp: `const ASSET_VERSION = Date.now();`
    - This ensures GitHub Pages' 10-minute cache doesn't serve stale assets
  - **Dark mode regression**: Compare current dark theme against Task 1 baseline screenshots:
    - Open all 4 page types in dark mode
    - Screenshot each
    - Side-by-side comparison with baseline
    - There should be ZERO meaningful visual differences (sub-pixel rendering may differ, but colors/layout must be identical)

  **Must NOT do**:
  - Do not change CSS variables or theme logic
  - Do not change Tailwind CDN URL (already pinned in Task 2)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]
    - `playwright`: Screenshot comparison for regression testing

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 7)
  - **Blocks**: F1–F4
  - **Blocked By**: Tasks 1 (baseline), 6 (full integration)

  **References**:
  - `build.js:123-124` — CSS link tag in pageShell()
  - `build.js:132` — JS script tags in pageShell()
  - `.sisyphus/evidence/task-1-*-dark-baseline.png` — Baseline screenshots for comparison

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Asset URLs have cache-busting query strings
    Tool: Bash
    Preconditions: build.js has cache-busting changes
    Steps:
      1. Run `node build.js`
      2. Grep `_generated/index.html` for `post.css`, `dates.js`, `theme.js`
      3. Verify each URL has a `?v=` query parameter
    Expected Result: All asset URLs include version query strings
    Failure Indicators: Bare URLs without query parameters
    Evidence: .sisyphus/evidence/task-8-cache-bust.txt

  Scenario: Dark theme regression — zero visual differences
    Tool: Playwright
    Preconditions: Site served, dark theme active, baseline screenshots exist
    Steps:
      1. Navigate to home page in dark mode — screenshot
      2. Navigate to post page in dark mode — screenshot
      3. Navigate to tag page in dark mode — screenshot
      4. Navigate to author page in dark mode — screenshot
      5. Compare each against corresponding baseline from Task 1
    Expected Result: Dark theme visually identical to baseline (zero regression)
    Failure Indicators: Any visible color, spacing, or layout difference
    Evidence: .sisyphus/evidence/task-8-dark-regression-home.png, task-8-dark-regression-post.png, task-8-dark-regression-tag.png, task-8-dark-regression-author.png
  ```

  **Commit**: YES
  - Message: `chore: add cache-busting to asset URLs`
  - Files: `build.js`
  - Pre-commit: `node build.js` succeeds, version strings in output

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, open in Playwright, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `node build.js` — must succeed. Review post.css for any remaining hardcoded hex colors outside `:root`. Review theme.js for: no global pollution, proper event cleanup, no memory leaks. Review build.js changes for: only color-related + toggle additions, no structural changes. Check for AI slop: excessive comments, over-abstraction, generic names.
  Output: `Build [PASS/FAIL] | CSS [CLEAN/N issues] | JS [CLEAN/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state (`node build.js`). Open every page type in Playwright. For each page: test all 3 themes, verify toggle cycles correctly, verify persistence across navigation, verify no FOWT (reload with throttled CPU). Test keyboard accessibility (Tab → Enter). Compare dark theme screenshots to baseline in `.sisyphus/evidence/`. Test light theme contrast with DevTools. Save evidence to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Regression [PASS/FAIL] | Accessibility [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual file changes. Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance: no style.css changes, no npm deps, no layout/typography changes, no transitions >200ms. Flag any unaccounted changes.
  Output: `Tasks [N/N compliant] | Guardrails [N/N clean] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| # | Message | Files | Pre-commit Check |
|---|---------|-------|-----------------|
| 1 | `chore: baseline screenshots + pin tailwind + audit` | `build.js`, `.sisyphus/evidence/` | `node build.js` succeeds |
| 2 | `refactor: extract CSS custom properties from post.css` | `assets/css/post.css` | `node build.js` succeeds, dark theme unchanged |
| 3 | `feat: add theme.js with three-way toggle logic` | `assets/js/theme.js` | File exists, no syntax errors |
| 4 | `feat: integrate theme switcher into all pages` | `build.js` | `node build.js` succeeds, toggle visible |
| 5 | `style: polish light theme contrast and visual details` | `assets/css/post.css` | WCAG AA contrast verified |
| 6 | `chore: add cache-busting to asset URLs` | `build.js` | `node build.js` succeeds |

---

## Success Criteria

### Verification Commands
```bash
node build.js                    # Expected: builds without errors
grep -cE '#[0-9a-fA-F]{3,8}' assets/css/post.css  # Expected: only inside :root blocks
ls assets/js/theme.js            # Expected: file exists
grep 'data-theme' build.js       # Expected: FOWT script + toggle references
```

### Final Checklist
- [ ] All "Must Have" present (toggle, 3 modes, CSS vars, localStorage, FOWT prevention, color-scheme, zero dark regression)
- [ ] All "Must NOT Have" absent (no style.css changes, no npm deps, no layout changes, no >200ms transitions)
- [ ] `node build.js` succeeds
- [ ] Dark theme matches baseline screenshots
- [ ] Light theme passes WCAG AA contrast checks
