2026-04-10: Frontmatter parsing in `build.js` must treat quoted YAML values as either double-quoted or single-quoted, and regexes must not use a shared closing character class when apostrophes can appear in the value.

2026-04-10: A two-group grab helper (`m[1] ?? m[2]`) keeps the parser simple while supporting both quote styles without touching timestamp handling.
