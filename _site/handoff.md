# Handoff — Publications Page Revamp + README/License

## Goal

Improve the Longitudinal Modelling Group website's **publications page** and supporting docs:
1. Richer, more visual **featured publication cards**.
2. Move the full publication list out of the cramped sidebar box into the **main page body, grouped by year**.
3. Make adding/featuring a paper a **single-file edit** (previously required editing two YAML files with different schemas).
4. Improve the **README** for new contributors.
5. Document **licensing** (content CC BY 4.0, code MIT).

## Current State

All work is **complete and verified** via `bundle exec jekyll build` (clean build, no Liquid warnings). **Nothing has been committed yet** — all changes are in the working tree on branch `master`.

## Files Changed

**Publications page**
- `_data/publications.yml` — **NEW** single unified data file (38 papers, newest first). Header comment has a copy-paste template. `featured: true` + `category`/`image`/`description` promotes a paper to a card.
- `_data/publications_featured.yml` — **DELETED** (merged into unified file).
- `_data/publications_latest.yml` — **DELETED** (merged into unified file).
- `_layouts/publications.html` — rewritten: Bootstrap `row-cols` card grid with category badges + hover lift; new "All Publications" section grouped by year via `group_by_exp`.
- `_layouts/publications-sidebar.html` — removed the `.latest-publications-box`; sidebar now shows only the table of contents (auto-populates from the new h2/h3 anchors).
- `_sass/_custom.scss` — replaced `.latest-publications-box`/`#latest-publications` styles with a `// --- Publications page ---` block (`.publication-card`, `.publication-badge-*`, `.btn-outline-purple`, `.publication-year-heading`, `.publication-list`).
- `assets/theme/css/main.scss` — removed the now-unused `.publication-thumbnail` rule.
- `search.json` — `site.data.publications_latest` → `site.data.publications` (all 38 papers now searchable).
- `pages/publications.md` — page title `"Featured Publications"` → `"Publications"`.

**Docs / license**
- `README.md` — added: table of contents, "Running the Site Locally", "How the Site is Deployed", "Repository Structure" table, "Software" content subsection, "License" section; updated the Publications add-a-paper instructions for the unified file (dates must be **unquoted**); fixed stale Publications description.
- `LICENSE` — **NEW** MIT License, `Copyright (c) 2025 Longitudinal Modelling Group`. (`_config.yml:36` already excludes it from the built site.)

## What Changed Conceptually

- Featured cards: image-topped with a purple **Methods** / dark-purple **Applied** badge, hover lift matching the site's existing `.training-card` aesthetic, footer with a journal button + optional Editorial/News outline buttons.
- Full list: **All Publications** heading with year subheadings (2026→2021 descending, newest-first within year); each year is a TOC anchor (`#pubs-YYYY`).
- Licensing split: **content = CC BY 4.0** (already in footer via `site.author`), **code = MIT** (new `LICENSE` + README section). Footer intentionally left showing only CC BY 4.0 — that's the correct notice for site visitors; the code license lives in the repo for developers.

## What I Tried That Failed (and the workaround)

- The 8 featured papers had **no publication dates**. I fetched them from **Crossref** by DOI. Parsing the JSON with `python` failed — on this Windows machine `python`/`python3` are the **Microsoft Store stub** (no real interpreter), and no `jq` is installed. **Workaround:** parsed the Crossref responses with `curl` + `grep`, taking `published-print` (falling back to `published-online`). Dates are correct; where only a month was available, the day defaults to `01` (only affects within-year ordering).
- Note: `node` is **also not available** on this machine — used `ruby -rjson` to validate `search.json`.

## What To Do Next

1. **Review** the publications page visually: `bundle exec jekyll serve` → http://localhost:4000/publications/. Check card layout (2-col desktop / 1-col mobile), badges, hover lift, and the year-grouped list + sidebar TOC.
2. **Commit** the changes (all currently uncommitted on `master`). Suggested grouping: (a) publications revamp, (b) README improvements, (c) LICENSE. Repo convention is to branch off `master` and open a PR rather than commit directly.
3. **Optional / declined so far:**
   - Adding an MIT line to the footer was discussed and **left out** (footer's CC BY 4.0 is the right notice for visitors). To add it later, set `license:` in `_data/footer.yml` — `_includes/footer.html:69-71` already renders it.
   - Verify the featured papers' exact publication days if precise within-year ordering matters (some default to `-01`).

---

# Handoff (later session) — Website "stand-out" enhancements (polish, performance, search, interactive features)

> Separate, later effort layered on top of the publications revamp above. Both sets of changes are uncommitted together on `master`.

## Goal

Elevate the site (Jekyll + Petridish theme, deploys via GitHub Pages) from a clean template into something distinctive, without external runtime services. Delivered in rounds: visual/brand polish → performance & accessibility → site search → animated homepage hero → SASS code-quality refactor → three "stand-out" interactive features (SITAR playground, scroll-reveal, collaboration map), then heavy iteration on the SITAR playground and the collaboration map.

## Current State

All work is **uncommitted on `master`** and verified via `bundle exec jekyll build` (clean builds). Nothing committed — the user commits separately. Most-recently-iterated pieces: the **SITAR playground** (`/training/expl_guides/sitar/`) and the **collaboration map** (`/contact/`).

## Environment / build notes (important)

- **Ruby/Jekyll not on PATH by default.** Prefix: `$env:Path = "C:\Ruby33-x64\bin;$env:Path"; bundle exec jekyll build`.
- **Transient Windows file-lock**: `jekyll build` intermittently exits 1 with a bundler stack trace **without regenerating `_site`**. Not a real error — **re-run** and confirm `exit: 0` / that output actually changed.
- **`node` and `python` unavailable** — can't `node --check` JS. Simulate math in PowerShell; validate JSON with `ConvertFrom-Json`.
- **`_includes/collab_map.html` is ~59 KB** (embeds the Natural Earth 1:110m world outline as one giant SVG `<path d="…">`). Read tool **cannot read it whole** — use `offset`/`limit` or Grep, and only Edit the small marker/script sections (never rewrite the file).

## Files Being Worked On (key ones)

**Interactive features (newest, most-iterated):**
- `assets/theme/js/sitar-playground.js` — SITAR growth-curve widget logic.
- `training/expl_guides/sitar.md` — SITAR guide page (widget markup, sliders, legend, replay/reset).
- `_includes/collab_map.html` — inline-SVG collaboration map (Liquid over `_data/collaborators.yml`; embedded world path; raise-to-front `<script>`).
- `_data/collaborators.yml` — institution list (name/city/lat/lng; `home: true` marks Bristol).
- `assets/theme/js/hero-trajectories.js` — animated homepage banner canvas.
- `assets/theme/js/scroll-reveal.js` — fade-in-on-scroll for cards.
- `_sass/_custom.scss` — all custom styles (playground, collab map, hero, search, etc.).

**Also touched earlier:** `_config.yml`, `_includes/{head,navbar,header,card,footer}.html`, `_layouts/{people,publications}.html`, `_sass/_main.scss`, `pages/{home,research,contact,software,blog,404,search}.md`, `search.json` (NEW), `pages/search.md` (NEW).

## What Has Changed (by feature)

- **Brand polish**: links/banner → brand purple `#670267`, footer `#360353` (`_config.yml`); removed "cutting-edge" buzzwords; British spelling; navbar/dropdown aria; friendlier `404.md`; deleted shipped JS source-maps.
- **Performance & a11y**: `defer` on jQuery/Popper/Bootstrap + font `preconnect` (`head.html`); `loading="lazy" decoding="async"` on below-the-fold images site-wide.
- **Blog tag filtering**: `archive_permalink: /blog/` activates theme tag badges; vanilla-JS filter + notice in `pages/blog.md`.
- **Site search**: `search.json` Liquid index + `/search/` page (debounced vanilla JS) + navbar search form. (`search.json` reads `site.data.publications` — the unified file from the effort above; leave as-is.)
- **Animated hero**: homepage banner = purple gradient with self-drawing SITAR-style growth curves + axes (`hero-trajectories.js`); `home.md` has `animated_hero: true`; branch in `header.html`.
- **SASS refactor** (zero visual change, diff-verified): nesting, shared vars, dead-code removal, `$seminar-purple`, `@each` for `.card-bg-*` in `_main.scss`.
- **SITAR playground**: reproduces the Cole teaching diagram — thick dark mean **S-curve with a pubertal spurt that flattens to an adult-height plateau**. Guided animation plays each effect **one at a time**, sliding deviation curves **out from the mean and back** (size = red vertical shift, timing = blue **horizontal translation of the whole curve**, intensity = green age-scale stretch); then interactive α/β/γ sliders + Replay/Reset. Curves drawn **parametrically as (x,y) points** so timing truly slides sideways; a plot **clip region** stops curves below the x-axis and `V_MAX` gives headroom so raised curves aren't cut. Card sized for laptops (canvas 280px, card max-width 680px). Pacing = timing constants at top of the JS (`MEAN_DRAW_MS`/`SLIDE_MS`/`HOLD_MS`/`RETRACT_MS`).
- **Scroll-reveal**: `scroll-reveal.js` (deferred from `head.html`); reduced-motion/no-JS safe.
- **Collaboration map** (`/contact/`): replaced static `collabs.jpg` with an interactive SVG world map. Bristol is the hub (lines radiate from it) **but its own dot/label are not drawn**. Hover/focus shows the **institution name** (not city) on a **leader line with white halo**, edge-aware `text-anchor` by longitude, and a raise-to-front script. Full-bleed width (`94vw`, max 1150px). viewBox `139 40 775 350` (widened east for Japan, south for Melbourne). **Currently 23 dots / 23 connection lines**; accessible name list is `visually-hidden`. Dots r=2.5.

## What I Tried That Failed (and the workaround)

- **`node --check` on JS** — node unavailable → simulated curve/geometry math in PowerShell (verified mean monotonic, timing is a rigid horizontal translation, raised curves fit `V_MAX`, all markers inside viewBox).
- **`jekyll build` exit-1 file lock** (twice) — reported failure but `_site` unchanged → re-run and verify.
- **SITAR timing looked like a vertical fan, not a slide** — value-of-x re-sampled a fixed width, so a monotonic curve's horizontal shift read as vertical → switched all drawing to **parametric points**, translating x for timing.
- **Flat kinks / clipping** — old hard `Math.min/max` clamps → replaced with a **plot clip region** + continuous mean function (smooth everywhere).
- **Tohoku (Japan) / Melbourne off the map** — coords outside original viewBox → widened viewBox east and south.

## What To Do Next

1. **Visual review** (`bundle exec jekyll serve`, PATH prefix): SITAR guide (guided animation then sliders; timing must read as a clear left/right slide); `/contact/` (hover names readable in the European cluster; all 23 institutions placed sensibly, none clipped at edges); homepage hero; scroll-reveal; `/search/` + navbar search.
2. **Commit** (all uncommitted on `master`; branch + PR per repo convention). Suggested grouping: (a) polish/perf/a11y, (b) search, (c) hero + scroll-reveal, (d) SITAR playground, (e) collaboration map — plus the separate publications revamp above.
3. **Optional polish**: SITAR pacing / plateau decay; European map leader offset (`cy | minus: 12/16` in `collab_map.html`).
4. **Out of scope / declined by user**: unfinished training guides & tutorial links (user authoring — do not touch), image recompression, site `title` change, SEO/JSON-LD, People-page role grouping.
