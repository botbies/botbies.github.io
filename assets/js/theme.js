/*!
 * theme.js — Light/Dark theme switcher for Botbies Log
 * Default: dark. States: 'light' | 'dark'
 * Storage key: 'botbies-theme'
 *
 * FOWT PREVENTION — inline this script verbatim as the FIRST element in <head>:
 * <script>(function(){var t=localStorage.getItem('botbies-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');})()</script>
 */
(function () {
  var STORAGE_KEY = 'botbies-theme';
  var ICONS = { light: '☀️', dark: '🌙' };
  var LABELS = { light: 'Switch to dark theme', dark: 'Switch to light theme' };
  var THEME_COLORS = { light: '#faf9f6', dark: '#0f172a' };

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.dark);
  }

  function updateToggle(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.textContent = ICONS[theme] || ICONS.dark;
    btn.setAttribute('aria-label', LABELS[theme] || LABELS.dark);
    btn.setAttribute('title', 'Current theme: ' + theme);
  }

  function setState(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
    updateToggle(theme);
  }

  function getInitialTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var current = getInitialTheme();
    applyTheme(current);
    updateToggle(current);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setState(next);
      });
    }
  });
})();
