# Logo — Nest

A cube with its front corner opened and a sphere held inside: **life held by technology**.
It evolves the previous notched-cube mark; the ember sphere is the site's one orange accent.

All files live in `assets/logos/` (web icons) and `assets/logos/avr/` (SVG masters).
Every master is pure vector: no live text, no rasters, no filters.

## Versions

| File | Use |
|---|---|
| `avr-symbol-dark.svg` | Primary. Colour symbol on dark backgrounds (the site, dark UI). |
| `avr-symbol-light.svg` | Colour symbol on light backgrounds. |
| `avr-symbol-small.svg` | Small-size cut (no sphere shading, larger sphere). Use at **39 px and below**. |
| `avr-symbol-mono.svg` | One-colour black: print, embossing, stamps, single-ink uses. |
| `avr-symbol-white.svg` | One-colour white on photos or busy dark backgrounds. |
| `avr-symbol-ember.svg` | One-colour ember, for playful single-colour uses. |
| `avr-horizontal-{dark,light,mono}.svg` | Symbol + name, side by side. Headers, email signatures, README. |
| `avr-stacked-{dark,light,mono}.svg` | Symbol above name. Square formats, title slides, posters. |

## Colour

| Role | HEX | Where |
|---|---|---|
| Top face | `#f0eee9` (dark bg) / `#d9d4cb` (light bg) | lit face, cavity floor |
| Side face | `#a8a297` / `#8e887e` | left face, right cavity wall |
| Shadow face | `#46474d` / `#232428` | right face, left cavity wall |
| Sphere | `#ff5c33` | the ember accent (same as the site's `--accent`) |
| Sphere shade | `#b5360f` | crescent on the sphere |
| Background | `#0e0f11` | app icon tile, theme colour |

The three-tone shading is what makes the mark read as 3D. When only one colour is possible, use the
`mono` / `white` / `ember` files: they separate the faces with gaps and keep the sphere in the hollow.

## Clear space and minimum size

- **Clear space:** keep at least one sphere diameter (≈ 20 % of the symbol's width) free on every side.
- **Minimum size:** colour symbol 40 px; below that use `avr-symbol-small.svg` (works down to 16 px).
  Horizontal lockup: 24 px tall minimum, or the name stops reading.

## Don't

- Recolour individual faces or swap the light direction (light always comes from the top).
- Use `avr-symbol-light.svg` on dark backgrounds or `avr-symbol-dark.svg` on light ones.
- Add gradients, glows, outlines or drop shadows; stretch, rotate or skew the cube.
- Retype the name in another font or setting. The wordmark is outlined Archivo, already kerned.

## Notes

- Wordmark: **ALBERTO VALDÉS REY** outlined from **Archivo** (SIL Open Font License, logo use permitted)
  at the site's display setting: width 62.5 (extra-condensed), weight 900, uppercase, +0.01em tracking,
  the font's own kerning pairs applied. Horizontal: cap height 84 of the 256 symbol box, cap block centred
  on the cube, starting 78 units after it. Stacked: cap height 56, one line, 60 units below the cube.
- The horizontal lockup is extra-wide (about 5:1); below ~300 px wide use the stacked lockup or the
  symbol alone.
- A trademark search was not done. Run one before registering the mark.
