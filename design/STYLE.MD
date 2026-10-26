# Style · Bitmap

The system behind albertovaldesrey.com. Black page, off-white type, one orange accent, and a
1-bit "bitmap" layer (dithered pixels, dot-matrix type) that ties it to the hero portrait.
Every value below is a token in `css/main.css` (`:root`); use the token, not the number.

---

## 1. Colour

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0e0f11` | page background |
| `--bg-alt` | `#0a0b0d` | alternate section (projects) |
| `--text` / `--text-bright` | `#e9e7e2` / `#f0eee9` | body text / headlines |
| `--text-2` | text at 72% | secondary text, 8.3:1 on `--bg` |
| `--text-3` | text at 55% | muted text, 5.3:1; nothing fainter passes 4.5:1 |
| `--accent` | `#ff5c33` | the only colour |
| `--line` / `--line-strong` | text at 10% / 12% | hairlines between rows and sections |

Orange is a detail, never a surface: the main button, Doto tags, the barcode, the scan line, skill
labels, links on hover. Black text on orange and orange on black are both 6.2:1.

---

## 2. Type

**Two families.** Archivo (variable width + weight) for everything readable; Doto (dot matrix) for
small data. Loaded from Google Fonts: `Archivo:ital,wdth,wght@0,62..125,100..900;1,100,400..600` and
`Doto:wght@900`.

| Role | Setting |
|---|---|
| Display (name, section titles, statement, "Let's talk", 404) | Archivo 900, `font-stretch: 62.5%`, uppercase, line height ~1 |
| Body | Archivo 400, 16px, line height 1.65, max 65ch |
| UI (buttons, nav, categories) | Archivo 600, 11px uppercase, `--track-caps` (0.12em) |
| Data (dates, numbers, tags, "404", project names) | Doto 900, `--track-dots` (0.04em) |

**Scale.** Text steps follow 1.25 from 16px; display steps are two of those apart.

| Token | Size | Where |
|---|---|---|
| `--fs-label` | 11px | tracked caps labels |
| `--fs-small` | 13px | tags, meta, every Doto label |
| `--fs-body` | 16px | all reading text |
| `--fs-lead` | 20px | contact line, brand in the top bar |
| `--fs-title` | 25px | job titles |
| `--fs-d4` | 26 → 48px | project names (Doto) |
| `--fs-d3` | 40 → 76px | About statement |
| `--fs-d2` | 56 → 119px | section titles |
| `--fs-d1` | 64 → 186px | your name, "Let's talk" |

**Rules**
- Weights 400 (read), 600 (UI), 900 (display + Doto). No others.
- Track only uppercase. Lowercase text gets no letter-spacing.
- Never below 11px; reading text never below 16px.
- No italic accents. Italic only where language needs it (a film title in the bio).
- Headings `text-wrap: balance`, paragraphs `text-wrap: pretty`.
- The hero name is capped by window height too, so the hero always fits the screen.

---

## 3. Spacing

One 8-point scale. Every padding, margin and gap uses it.

| Token | Value |
|---|---|
| `--sp-1` … `--sp-9` | 4, 8, 12, 16, 24, 32, 48, 64, 96px |
| `--sp-section` | 80 → 128px, top and bottom of every section |
| `--sp-head` | 48 → 64px, section title to its content |
| `--pad` | 48px page gutter (24px under 900px) |

Exceptions are alignment, not spacing: the project content indent is the number column plus the
row gap, and the 404 bottom padding equals the top row's height. Each is commented where it lives.

---

## 4. The bitmap layer

- **Hero portrait** (`js/hero.js`): the profile image, Atkinson-dithered into off-white pixels on a
  canvas, backdrop removed by flood fill. ~460 pixels across on desktop, ~276 on phones.
- **Scan line**: an orange band sweeps hair to chin in 3s, pauses 1s, repeats at 10 fps; pauses off
  screen; rests across the eyes with reduced motion. The only ambient motion on the site.
- **Barcode**: "LEDSAV" in ASCII binary, one bar per bit, wide = 1.
- **Dithered glow** (YouTube banner): ordered (Bayer 8×8) dither in orange, kept clear of text.
- Pixels are always square, unsmoothed (`image-rendering: pixelated`), one colour per layer.

---

## 5. Motion

- One entrance: hero elements rise in once (`avr-rise`, spring easing). Sections reveal on scroll.
- Feedback on press, not release (`:active` scale 0.96–0.98).
- `prefers-reduced-motion`: entrances off, scan line parked, nothing loops.

---

## 6. Material

| File | Source |
|---|---|
| `assets/images/og-image.jpg` (1200×630 link preview) | `design/social/og/og-image.html` |
| YouTube banner + previews | `design/social/youtube/banner.html` |
| YouTube watermark | `design/social/youtube/watermark.html` |
| Logo | `design/LOGO.md` |

Render commands are at the top of each source file.
