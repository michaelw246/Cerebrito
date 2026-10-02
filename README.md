# Cerebrito

Personal daily brain-training app: seven adaptive brain games (Mind), spaced-repetition recall of Spanish + a ~1,000-question
knowledge bank, eight puzzles, and an "Around the world" journey (one country per level, six continents).
Ships as **one self-contained `index.html`** (no framework, no server).

## Rebuild
    pip install -r requirements.txt
    python build.py              # writes ./index.html  (or: python build.py out.html)

`index.html` here is byte-identical to the published build. To publish: upload it as an artifact (it syncs progress via the
artifact runtime's `db`; outside that runtime it falls back to `localStorage`).

## Layout
    build.py                 src/* + assets/* -> index.html (images re-encoded to WebP data URIs)
    src/
      engine.js              state, progression/levels, SRS (spaced repetition), 7 brain-game engines, cloud sync
      data.js                themes, route (64 countries / 6 continents), capitals, bonsai metadata, icons, MapTap places, inlined world map
      app.js                 views: Home, Mind (+ skill pages), Long-term memory, Journey, Country, You, Shop; navigation
      session.js             session flow: intros, brain games, knowledge cards, results, level-up/continent celebrations
      puzzles.js             Puzzles tab + Palabra, Wordle, Globle, Worldle, Travle, MapTap, Spelling Bee, Rapid recall
      style.css              "light glass" design system (themes via data-skin)
    assets/
      images/                the nine bonsai-brain trees, mountaineer avatar + hero (source PNGs)
      data/                  valid.txt (Spanish guesses), geo.json (borders/centroids/Travle pairs),
                             enwords.json (Wordle + Bee), worldpaths.json (map paths); source/ = Natural Earth 110m
    content/
      facts/facts1-6.py      the knowledge bank (question, answer, 3 wrong options), chained imports
      compile_bank.py        facts -> travel.json (interleaves the 6 categories)
      travel.json            compiled bank (also loaded into the artifact db at content/travel)
    tools/
      make_world.py  make_geo.py  make_words.py     regenerate assets/data/* (verified identical to shipped files)
      dev-tests/             Playwright scratch scripts + scenario JSONs used during development (hard-coded /tmp paths)
    backup/
      spanish-wordbank.json  your 328-card Spanish list (artifact db: content/spanish)
      progress-snapshot.json your saved progress at export time (artifact db: data/users/<id>/state)

## Data model notes
- Local keys: `localStorage` state key `ruta.state.v1` (kept for continuity), content cache `ruta.content.v1`.
- Artifact db docs: `content/spanish`, `content/travel` ({items:[...]}), `data/users/<id>/state`.
- Add knowledge: edit/append rows in `content/facts/*.py`, run `python content/compile_bank.py`, then load `content/travel.json`
  into the db doc `content/travel`.
- Level -> country: `ROUTE[(level-1) % 64]` (see `data.js`). Themes unlock at the route index of their `at` country.
