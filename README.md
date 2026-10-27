# albertovaldesrey.com

Personal site of Alberto Valdés Rey, served by GitHub Pages at
**https://www.albertovaldesrey.com** (this is the `Ledsav.github.io` user site). A plain
static site: no build step, no dependencies.

## Structure

```
index.html          the whole site (one page)
404.html            not-found page
css/main.css        all styles; design tokens live in :root
js/                 hero.js (bitmap portrait), nav.js, projects.js, reveal.js
assets/             icons, images, logos, 3D model
design/             STYLE.MD (design system), LOGO.md, logo slides, social/ (YouTube banner, OG image sources)
CNAME               custom domain for GitHub Pages
robots.txt, sitemap.xml
.nojekyll           serve files as-is, no Jekyll
```

`reference/` (moodboard images) is local only and git-ignored.

## Run it locally

Needs Python 3 (or any static file server).

```bash
git clone https://github.com/Ledsav/ledsav.github.io.git
cd ledsav.github.io
python -m http.server 8000
```

Then open http://localhost:8000. In VS Code the *Dev* task does the same.

The design system is documented in `design/STYLE.MD`; use the tokens in `css/main.css`.
Social assets and how to re-render them are in `design/social/README.md`.

## Deploy

Push to `main`. GitHub Pages publishes the repo root of `main` (*Settings → Pages →
Deploy from a branch → main / (root)*).

- **Domain:** `CNAME` holds `www.albertovaldesrey.com`; the DNS records live at the domain
  registrar (`www` points at `ledsav.github.io`, the apex at GitHub Pages' `A` records), not
  in this repo.
- **Project sites:** the Projects section links to `/track-lab/` and `/tarot-web/`. Those are
  separate repos ([track-lab](https://github.com/Ledsav/track-lab),
  [tarot-web](https://github.com/Ledsav/tarot-web)) published as GitHub Pages project sites,
  which inherit this custom domain.
