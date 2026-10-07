# Cerebrito

Personal daily brain-training app: seven adaptive brain games (Mind), spaced-repetition recall of Spanish and a
~1,000-question knowledge bank, ten daily puzzles, and an "Around the world" journey (one country per level, six continents).
Ships as **one self-contained `index.html`** (no framework, no server).

## Rebuild
    pip install -r requirements.txt
    python build.py              # writes ./index.html  (or: python build.py out.html)
    python tools/tests/smoke.py  # loads the build in Chromium and walks every screen, game and puzzle; fails on any JS error

The build also writes the site icons beside `index.html`: `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest` and
`icons/` (home-screen icons and `og-image.jpg`, the link-preview card). Browsers and other apps fetch these by URL, so they
must be deployed with the page: on Netlify (cerebritotraining.netlify.app) publish the folder, not just `index.html`.
The site URL used for link previews is `SITE_URL` in `build.py`.

Or publish as an artifact: upload `index.html` with capabilities `{db: {}, user: {}, sample: {}}`. `db` syncs progress
(outside the artifact runtime it falls back to `localStorage`); `sample` powers "Tell me the full story" on a card's
More sheet (hidden when unavailable).

## Layout
    build.py                 src/* + assets/* + content/travel.json + backup/spanish-wordbank.json -> index.html
    src/
      engine.js              state, activity log, progression, SRS scheduler, the brain-game engines, content sync
      data.js                themes, route (64 countries), capitals, pillars, icons, MapTap places, inlined world map
      geo.js                 geography kit: 176-country table, border distances, MapView (pan/pinch/zoom), guess bar, sheets
      app.js                 views: Home, Mind (+ skill pages), Long-term memory, Journey, Country, You, Shop; navigation
      session.js             session flow: intros, brain games, knowledge cards (recall + self-grading), results, celebrations
      puzzles.js             Puzzles tab + Palabra, Wordle, Globle, Silhouette, Travle, MapTap, Spelling Bee, Rapid recall,
                             Number Hunt, Parejas
      awards.js              awards, Stats page (activity heatmap, trends), week streak strip
      onboard.js             animated first-run walkthrough (also replayable from Settings)
      style.css              "light glass" design system (themes via data-skin, dark mode via prefers-color-scheme)
    assets/
      fonts/                 Outfit (OFL) for the link-preview card
      brand/                 the logo: the Memory bonsai-brain painting with its pot label removed, as square + rounded icons,
                             favicon and apple-touch-icon (regenerate with tools/make_brand.py)
      images/                the nine bonsai-brain trees, mountaineer avatar + hero (source PNGs)
      images/earth/          map imagery (tools/make_earth.py): base.jpg for the whole map + 10,800 px land tiles for zooming in,
                             NASA Blue Marble colour fused with Natural Earth relief (both public domain, via PyPI basemap-data)
      data/                  valid.txt (Spanish guesses), geo.json (borders/centroids/Travle pairs), countries.json
                             (names, flags, regions, aliases), enwords.json (Wordle + Bee), worldpaths.json; source/ = Natural Earth 110m
    content/
      facts/facts1-7.py      the knowledge bank (question, answer, 3 wrong options[, why]), chained imports
      facts/revise.py        quality pass keyed by question text: fairer options, explanations, standalone rewordings
      facts/explain.py       an explanation for every other card, keyed by card id (compile fails on stale keys)
      facts/retire.py        cards taken out: too well known, brand trivia, duplicates (compile checks each exists)
      compile_bank.py        facts + revisions -> travel.json (interleaves the categories, stamps a version)
      travel.json            compiled bank (bundled into the build and synced to the artifact db at content/travel)
    tools/
      make_brand.py          regenerate assets/brand from assets/images/tree-memory.png
      make_world.py make_geo.py make_words.py make_countries.py    regenerate assets/data/*
      make_earth.py          regenerate the satellite imagery;  make_borders.py  1:50m borders (npm world-atlas) for zoomed-in maps
      tests/smoke.py         full-app smoke test
      dev-tests/             older Playwright scratch scripts (hard-coded /tmp paths)
    backup/
      spanish-wordbank.json  your Spanish list (bundled; artifact db: content/spanish)
      progress-snapshot.json your saved progress at export time (artifact db: data/users/<id>/state)

## How the training works
- **Brain games** adapt every trial (difficulty 1–25). Calibration measures each skill over three days; daily sessions
  lean towards your weakest skills. Memory includes N-back.
- **Recall** uses an SM-2 style scheduler (per-card ease + interval). New cards start as multiple choice; established ones
  switch to free recall with Forgot / Hard / Got it / Easy self-grading. A round never repeats a card or pairs two
  that give each other away; misses are explained, listed at the end and due tomorrow.
- **Curriculum**: new cards arrive as lessons (a knowledge topic or a Spanish word group) in the bank's order. A goal of
  6, 9 or 12 months (Long-term memory page) sets how many new cards each day brings; each subject shows its lesson
  under way and accuracy over the last 14 days with its trend. Every card has a More sheet with the full context.
- **Puzzles** have a seeded daily version plus unlimited free play, with stats, distributions and share text.
- **Streaks** reset on a missed day unless a freeze covers it; missing a day never costs XP or levels.

## Data model notes
- Local keys: `localStorage` state key `ruta.state.v1` (kept for continuity), content cache `ruta.content.v1`.
- Artifact db docs: `content/spanish`, `content/travel` (`{items:[...], updatedAt}`), `data/users/<id>/state`.
- Content versions: bundled, cached and db copies of each bank carry `updatedAt`; the newest wins and an older db copy is updated.
- Add knowledge: append rows in `content/facts/*.py` (or fix one in `revise.py`), run `python content/compile_bank.py`, rebuild.
- Level -> country: `ROUTE[(level-1) % 64]` (see `data.js`). Themes unlock at the route index of their `at` country.
