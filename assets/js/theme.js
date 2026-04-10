/*!
 * theme.js — Three-way theme switcher for Botbies Log
 * States: 'auto' (default) | 'light' | 'dark'
 * Storage key: 'botbies-theme'
 *
 * FOWT PREVENTION — inline this script verbatim as the FIRST element in <head>:
 * <script>(function(){var t=localStorage.getItem('botbies-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':t==='dark'?'dark':window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');})()</script>
 */
(function () {
  var STORAGE_KEY = 'botbies-theme';
  var STATES = ['auto', 'light', 'dark'];
  var ICONS = { auto: '⚙️', light: '☀️', dark: '🌙' };
  var LABELS = { auto: 'Switch to light theme', light: 'Switch to dark theme', dark: 'Switch to auto theme' };
  var THEME_COLORS = { light: '#faf9f6', dark: '#0f172a' };

  var mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  var currentState = 'auto';
  var mediaListener = null;

  function resolveTheme(state) {
    if (state === 'light') return 'light';
    if (state === 'dark') return 'dark';
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
    btn.textContent = ICONS[state] || ICONS.auto;
    btn.setAttribute('aria-label', LABELS[state] || LABELS.auto);
    btn.setAttribute('title', 'Current: ' + state + ' (' + resolved + ')');
  }

  function setState(newState) {
    currentState = newState;
    if (newState === 'auto') {
      localStorage.removeItem(STORAGE_KEY);
      if (!mediaListener) {
        mediaListener = function (e) {
          applyTheme(resolveTheme('auto'));
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
    if (stored === 'light' || stored === 'dark') return stored;
    return 'auto';
  }

  function nextState(current) {
    var idx = STATES.indexOf(current);
    return STATES[(idx + 1) % STATES.length];
  }

  document.addEventListener('DOMContentLoaded', function () {
    var initial = getInitialState();
    setState(initial);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        setState(nextState(currentState));
      });
    }
  });
})();
