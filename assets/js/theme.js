/*!
 * theme.js — Three-way theme switcher for Botbies Log
 * Default: dark. States: 'dark' | 'light' | 'auto' (follows system, falls back to dark)
 * Storage key: 'botbies-theme'
 *
 * FOWT PREVENTION — inline this script verbatim as the FIRST element in <head>:
 * <script>(function(){var t=localStorage.getItem('botbies-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':t==='auto'?(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):'dark');})()</script>
 */
(function () {
  var STORAGE_KEY = 'botbies-theme';
  var STATES = ['dark', 'light', 'auto'];
  var ICONS = { dark: '🌙', light: '☀️', auto: '⚙️' };
  var LABELS = { dark: 'Switch to light theme', light: 'Switch to auto theme', auto: 'Switch to dark theme' };
  var THEME_COLORS = { light: '#faf9f6', dark: '#0f172a' };

  var mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  var currentState = 'dark';
  var mediaListener = null;

  function resolveTheme(state) {
    if (state === 'light') return 'light';
    if (state === 'dark') return 'dark';
    // auto: follow system preference; if no preference set, default to dark
    return mediaQuery.matches ? 'light' : 'dark';
  }

  function applyTheme(resolved) {
    document.documentElement.setAttribute('data-theme', resolved);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[resolved] || THEME_COLORS.dark);
  }

  function updateToggle(state, resolved) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.textContent = ICONS[state] || ICONS.dark;
    btn.setAttribute('aria-label', LABELS[state] || LABELS.dark);
    btn.setAttribute('title', 'Current: ' + state + ' (' + resolved + ')');
  }

  function setState(newState) {
    currentState = newState;
    if (newState === 'auto') {
      localStorage.removeItem(STORAGE_KEY);
      if (!mediaListener) {
        mediaListener = function () {
          var resolved = resolveTheme('auto');
          applyTheme(resolved);
          updateToggle('auto', resolved);
        };
        mediaQuery.addEventListener('change', mediaListener);
      }
    } else {
      localStorage.setItem(STORAGE_KEY, newState);
      if (mediaListener) {
        mediaQuery.removeEventListener('change', mediaListener);
        mediaListener = null;
      }
    }
    var resolved = resolveTheme(newState);
    applyTheme(resolved);
    updateToggle(newState, resolved);
  }

  function getInitialState() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light') return 'light';
    if (stored === 'auto') return 'auto';
    return 'dark'; // default: dark, not auto
  }

  function nextState(current) {
    var idx = STATES.indexOf(current);
    return STATES[(idx + 1) % STATES.length];
  }

  document.addEventListener('DOMContentLoaded', function () {
    setState(getInitialState());

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        setState(nextState(currentState));
      });
    }
  });
})();
