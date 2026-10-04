"use strict";
/* ---------- basics ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = n => Number(n).toLocaleString("en-AU", { maximumFractionDigits: 1 });
const dkey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseKey = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return dkey(d); };
const daysBetween = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 86400000);
const today = () => dkey();
const hash = s => { let h = 5381; for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; return h.toString(36); };
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- world ---------- */
const STOPS = ROUTE;



/* Difficulty runs 1..DMAX. Every trial generator reaches its hardest settings by ~22, so levels above that would only inflate scores. */
const DMAX = 25;
const SKILLS = ["speed", "memory", "attention", "flex", "numeracy", "reasoning", "spatial"];
const SKILL_NAMES = { speed: "Speed", memory: "Memory", attention: "Focus", flex: "Flexibility", numeracy: "Numbers", reasoning: "Reasoning", spatial: "Spatial" };

/* ---------- content: bundled banks, kept in sync with the artifact db ---------- */
/* Both banks ship inside the build. A copy in localStorage or the db replaces them only when it's newer
   (your own imports are stamped with the time you made them; the bundled bank with its compile date). */
const BUNDLE = { es: __BANK_ES__, tr: __BANK_TR__ };
let content = { es: [], tr: [], esAt: 0, trAt: 0, esSample: false, trSample: false };

/* ---------- state ---------- */
const LS = "ruta.state.v1", LSC = "ruta.content.v1";
function freshState() {
  const skills = {};
  SKILLS.forEach(k => skills[k] = { lvl: null, best: 0, hist: [], lastV: null });
  return {
    v: 1, updatedAt: 0, xp: 0, maxLvl: 1, streak: 0, bestStreak: 0, freezes: 0, sessions: 0,
    lastDone: null, checkedThrough: null,
    calib: { day: 0, est: {} }, baseline: null, checkups: [],
    skills, srs: { es: {}, tr: {} }, chest: null, plan: null, lastGames: [],
    skin: "andean", sound: true, haptics: true, notice: null,
    log: {}, awards: {}, rec: {},
    pace: { months: 9, start: null }, kst: {},
    coins: 150, owned: ["andean"], joined: null, pz: {}, pzs: { palabra: { played: 0, won: 0, streak: 0, dist: [0, 0, 0, 0, 0, 0, 0] }, pais: { played: 0, won: 0, streak: 0, dist: [0, 0, 0, 0, 0, 0, 0, 0, 0] } }
  };
}
let state = freshState();
try { const s = JSON.parse(localStorage.getItem(LS)); if (s && s.v === 1) state = Object.assign(freshState(), s); } catch (e) {}
function migrate() {
  if (!THEMES.some(t => t.id === state.skin)) state.skin = "andean";
  if (!Array.isArray(state.owned)) state.owned = ["andean"];
  if (!state.owned.includes("andean")) state.owned.push("andean");
  if (!state.joined) { const ds = Object.values(state.skills).flatMap(k => k.hist.map(h => h.d)).sort(); state.joined = ds[0] || today(); }
  const f = freshState(); state.pzs = Object.assign(f.pzs, state.pzs || {});
  if (state.pz && state.pz.date !== today()) state.pz = {};
  Object.values(state.skills).forEach(k => { if (k.lvl) k.lvl = Math.min(k.lvl, DMAX); });
  if (!state.log || typeof state.log !== "object") state.log = {};
  if (!state.pace || ![6, 9, 12].includes(state.pace.months)) state.pace = { months: 9, start: null };
  if (!state.pace.start) state.pace.start = state.joined || today();
  if (!state.kst || typeof state.kst !== "object") state.kst = {};
  if (!state.awards) state.awards = {};
  if (!state.rec) state.rec = {};
  if (!Object.keys(state.log).length) {   // backfill the activity log from what older saves recorded
    Object.values(state.skills).forEach(k => k.hist.forEach(h => { const L = state.log[h.d] || (state.log[h.d] = {}); L.g = (L.g || 0) + 1; }));
    if (state.lastDone) { const L = state.log[state.lastDone] || (state.log[state.lastDone] = {}); L.s = 1; }
  }
  Object.keys(state.calib.est || {}).forEach(k => state.calib.est[k] = Math.min(state.calib.est[k], DMAX));
  if (state.baseline && state.baseline.est) Object.keys(state.baseline.est).forEach(k => state.baseline.est[k] = Math.min(state.baseline.est[k], DMAX));
}
migrate();
function useBank(kind, items, at) { content[kind] = kind === "es" ? normEs(items) : normTr(items); content[kind + "At"] = at || 0; }
useBank("es", BUNDLE.es.items, BUNDLE.es.updatedAt); useBank("tr", BUNDLE.tr.items, BUNDLE.tr.updatedAt);
try {
  const c = JSON.parse(localStorage.getItem(LSC));
  if (c) ["es", "tr"].forEach(k => { if (Array.isArray(c[k]) && c[k].length && (c[k + "At"] || 0) > content[k + "At"]) { content[k] = k === "es" ? normEs(c[k]) : normTr(c[k]); content[k + "At"] = c[k + "At"]; } });
} catch (e) {}
function cacheContent() { try { localStorage.setItem(LSC, JSON.stringify({ es: content.es, esAt: content.esAt, tr: content.tr, trAt: content.trAt })); } catch (e) {} }

let db = null, uid = null, cloudTimer = null, cloudBusy = false, cloudPending = false;
function save() {
  state.updatedAt = Date.now();
  try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) {}
  if (db && uid) { clearTimeout(cloudTimer); cloudTimer = setTimeout(pushCloud, 1200); }
}
async function pushCloud() {
  if (cloudBusy) { cloudPending = true; return; }
  cloudBusy = true;
  try { await db.doc(`data/users/${uid}/state`).set(JSON.parse(JSON.stringify(state))); } catch (e) {}
  cloudBusy = false;
  if (cloudPending) { cloudPending = false; pushCloud(); }
}
async function initCloud() {
  if (!window.claude || typeof window.claude.use !== "function") return;
  try {
    const [d, u] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
    if (!d) return;
    db = d;
    const docs = { es: "content/spanish", tr: "content/travel" };
    await Promise.all(Object.entries(docs).map(async ([k, path]) => {
      const snap = await db.doc(path).get(), d = snap.exists ? snap.data() : null, items = d && d.items, at = (d && d.updatedAt) || 0;
      if (Array.isArray(items) && items.length && at > content[k + "At"]) { useBank(k, items, at); cacheContent(); }
      else if (!d || at < content[k + "At"]) {   // db is missing or older than what we have: bring it up to date
        try { await db.doc(path).set({ items: content[k].map(({ id, ...x }) => x), updatedAt: content[k + "At"] }); } catch (e) {}
      }
    }));
    if (u) uid = await u.id();
    if (uid) {
      const snap = await db.doc(`data/users/${uid}/state`).get();
      if (snap.exists) {
        const remote = snap.data();
        if (remote && remote.v === 1 && view !== "session" && (remote.updatedAt || 0) > (state.updatedAt || 0)) {
          state = Object.assign(freshState(), JSON.parse(JSON.stringify(remote))); migrate();
          try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) {}
        } else if ((state.updatedAt || 0) > (remote.updatedAt || 0)) save();
      } else if (state.updatedAt) save();
    }
    if (view !== "session") { applySkin(); processMissed(); render(); }
  } catch (e) {}
}
function normEs(items) {
  return items.filter(x => x && x.es && x.en).map(x => ({ id: "es:" + String(x.es).trim().toLowerCase(), es: String(x.es).trim(), en: String(x.en).trim(), cat: x.cat || "General", ...(x.pr ? { pr: String(x.pr) } : {}) }));
}
function normTr(items) {
  return items.filter(x => x && x.q && x.a).map(x => ({ id: "tr:" + hash(x.q), cat: x.cat || "Countries", place: x.place || "", country: x.country || "", q: String(x.q), a: String(x.a), wrong: Array.isArray(x.wrong) ? x.wrong.map(String) : [], ...(x.why ? { why: String(x.why) } : {}) }));
}

/* ---------- activity log + personal records ---------- */
/* log[date] = { s: daily session done, f: streak freeze used, g: games, c: cards, p: puzzles, xp } */
function logDay(f, d = today()) { const L = state.log[d] || (state.log[d] = {}); for (const [k, v] of Object.entries(f)) L[k] = k === "s" || k === "f" ? v : (L[k] || 0) + v; }
const activeDays = () => Object.entries(state.log).filter(([, L]) => L.s || L.g || L.c || L.p).length;
/* rec(key, value, "max"|"min") keeps personal bests; returns true when it's a new record */
function rec(key, v, mode = "max") { const o = state.rec[key]; if (o === undefined || (mode === "max" ? v > o : v < o)) { state.rec[key] = v; return o !== undefined; } return false; }

/* ---------- progression ---------- */
function levelInfo(xp) {
  let lvl = 1, acc = 0, need = 120;
  while (xp >= acc + need) { acc += need; lvl++; need = 120 + 20 * (lvl - 1); }
  return { lvl, into: xp - acc, need };
}
function stopFor(lvl) {
  const i = (lvl - 1) % STOPS.length;
  return { ...STOPS[i], i, lap: Math.floor((lvl - 1) / STOPS.length) + 1 };
}
const skillScore = k => clamp(Math.round((state.skills[k].lvl || 0) * 4), 0, 100);
const estScore = est => clamp(Math.round(est * 4), 0, 100);

function processMissed() {
  if (!state.lastDone) return;
  const t = today();
  const from = state.checkedThrough && state.checkedThrough > state.lastDone ? state.checkedThrough : state.lastDone;
  const missed = daysBetween(from, t) - 1;
  state.checkedThrough = addDays(t, -1);
  if (missed <= 0) return;
  /* Missing a day costs the streak (unless a freeze covers it), never XP or levels:
     punishing a lapse makes people less likely to come back, which is the opposite of the point. */
  let used = 0, broke = false;
  for (let i = 0; i < missed; i++) {
    if (state.freezes > 0 && !broke) { state.freezes--; used++; logDay({ f: 1 }, addDays(from, i + 1)); }
    else broke = true;
  }
  const lostStreak = state.streak;
  if (broke) state.streak = 0;
  const bits = [`You missed ${missed} day${missed > 1 ? "s" : ""}.`];
  if (used) bits.push(`${used} streak freeze${used > 1 ? "s" : ""} kept your streak alive.`);
  if (broke) bits.push(lostStreak > 1 ? `Your ${lostStreak}-day streak reset. Today is day one of the next one.` : "Today's a fresh start.");
  state.notice = bits.join(" ");
  save();
}

/* ---------- feedback: sound, haptics, confetti ---------- */
let actx = null;
function tone(ok) {
  if (!state.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = ok ? [660, 990] : [196, 147];
    notes.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t0 = actx.currentTime + i * 0.07;
      o.type = ok ? "triangle" : "sawtooth"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(ok ? 0.18 : 0.08, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);
      o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + 0.16);
    });
  } catch (e) {}
}
function buzz(ok) { if (state.haptics && navigator.vibrate) try { navigator.vibrate(ok ? 12 : [30, 40, 30]); } catch (e) {} }
function burst(x, y, n = 14) {
  if (reduced) return;
  const cs = getComputedStyle(document.documentElement);
  const cols = ["--a1", "--a2", "--a3", "--a4", "--a5"].map(v => cs.getPropertyValue(v).trim());
  for (let i = 0; i < n; i++) {
    const b = document.createElement("i");
    b.className = "bit";
    const ang = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 90;
    b.style.cssText = `left:${x}px;top:${y}px;background:${pick(cols)};--tx:${Math.cos(ang) * dist}px;--ty:${Math.sin(ang) * dist - 30}px;--rot:${rnd(-200, 200)}deg`;
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 900);
  }
}
function toast(msg) {
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2600);
}

/* ---------- trial helpers ---------- */
function once(fn) { let d = false; return (...a) => { if (!d) { d = true; fn(...a); } }; }
function timeBar(el, ms) {
  const i = el.querySelector("i"); if (!i) return;
  i.style.transition = "none"; i.style.width = "100%";
  void i.offsetWidth;
  i.style.transition = `width ${ms}ms linear`; i.style.width = "0%";
}
/* generic multiple-choice trial */
function choice(stage, { top = "", options, correct, limit, render, cls = "" }, done) {
  stage.innerHTML = `${top}<div class="opts ${cls}">${options.map((o, i) => `<button class="opt ${cls.includes("pats") ? "pbtn" : ""}" data-i="${i}">${render ? render(o) : esc(o)}</button>`).join("")}</div>${limit ? '<div class="tlimit"><i></i></div>' : ""}`;
  let over = false, t = null;
  if (limit) { timeBar(stage.querySelector(".tlimit"), limit); t = setTimeout(() => finish(-1), limit); }
  const h = e => { const b = e.target.closest(".opt"); if (b && stage.contains(b)) { e.preventDefault(); finish(+b.dataset.i); } };
  stage.addEventListener("pointerdown", h);
  function finish(i) {
    if (over) return; over = true; clearTimeout(t); stage.removeEventListener("pointerdown", h);
    const bs = $$(".opt", stage);
    if (bs[correct]) bs[correct].classList.add("right");
    if (i >= 0 && i !== correct && bs[i]) bs[i].classList.add("wrong");
    done(i === correct);
  }
  return () => { over = true; clearTimeout(t); stage.removeEventListener("pointerdown", h); };
}
function withOptions(ans, wrongs) {
  const seen = new Set([String(ans)]), out = [ans];
  for (const w of wrongs) { if (out.length >= 4) break; if (!seen.has(String(w))) { seen.add(String(w)); out.push(w); } }
  const opts = shuffle(out);
  return { options: opts, correct: opts.findIndex(o => String(o) === String(ans)) };
}
function numWrongs(ans, spread = 10) {
  const sw = n => { const s = String(Math.abs(n)); if (s.length < 2) return n + 3; const a = s.split(""); [a[a.length - 1], a[a.length - 2]] = [a[a.length - 2], a[a.length - 1]]; return Number(a.join("")); };
  const c = shuffle([ans + 1, ans - 1, ans + spread, ans - spread, ans + 2, ans - 2, sw(ans), ans + 2 * spread]).filter(x => x >= 0 && x !== ans);
  let k = 3; while (c.length < 6) c.push(ans + k++);
  return c;
}

/* ---------- engines ---------- */
const INK = [{ n: "Red", es: "Rojo", c: "#D62839" }, { n: "Blue", es: "Azul", c: "#2F6FDF" }, { n: "Green", es: "Verde", c: "#2E9E5B" }, { n: "Yellow", es: "Amarillo", c: "#E0A800" }];
const arrowSVG = dir => `<svg viewBox="0 0 40 40"><path d="${dir ? "M8 20h22M21 11l9 9-9 9" : "M32 20H10M19 11l-9 9 9 9"}" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SLOT_POS = Array.from({ length: 8 }, (_, i) => { const a = (i * 45 - 90) * Math.PI / 180; return [50 + 38 * Math.cos(a), 50 + 38 * Math.sin(a)]; });
const arenaHTML = (extra = "") => `<div class="arena"><span class="fix">+</span>${SLOT_POS.map(([x, y], i) => `<button class="slot" data-i="${i}" style="left:${x}%;top:${y}%" disabled></button>`).join("")}${extra}</div>`;

function memoryTrial(mode) {
  return (d, stage, done) => {
    const n = d <= 4 ? 3 : d <= 11 ? 4 : 5;
    const k = Math.min(n * n - 3, 2 + Math.ceil(d * 0.55));
    const cells = shuffle([...Array(n * n).keys()]).slice(0, k);
    stage.innerHTML = `<div class="hint">Watch</div><div class="grid" style="--n:${n}">${Array.from({ length: n * n }, (_, i) => `<button class="cell" data-i="${i}" disabled aria-label="Tile ${i + 1}"></button>`).join("")}</div>`;
    const els = $$(".cell", stage), timers = [], T = (f, ms) => timers.push(setTimeout(f, ms));
    let over = false, tEnd;
    if (mode === "all") { T(() => cells.forEach(c => els[c].classList.add("lit")), 250); tEnd = 250 + 700 + 170 * k; T(() => cells.forEach(c => els[c].classList.remove("lit")), tEnd); }
    else {
      const on = Math.max(260, 560 - d * 14), gap = 150;
      cells.forEach((c, j) => { T(() => els[c].classList.add("lit"), 250 + j * (on + gap)); T(() => els[c].classList.remove("lit"), 250 + j * (on + gap) + on); });
      tEnd = 250 + k * (on + gap);
    }
    const expected = mode === "reverse" ? cells.slice().reverse() : cells;
    let idx = 0; const found = new Set();
    T(() => { if (over) return; els.forEach(e => e.disabled = false); $(".hint", stage).textContent = mode === "all" ? "Tap every tile that lit up" : mode === "order" ? "Tap them in the same order" : "Tap them in reverse order"; }, tEnd + 100);
    const h = e => {
      const b = e.target.closest(".cell"); if (!b || b.disabled || over) return; e.preventDefault();
      const i = +b.dataset.i; let ok;
      if (mode === "all") { ok = cells.includes(i) && !found.has(i); if (ok) found.add(i); }
      else { ok = i === expected[idx]; if (ok) idx++; }
      if (ok) { b.classList.add("hit"); b.disabled = true; }
      else {
        b.classList.add("miss"); over = true; els.forEach(x => x.disabled = true);
        cells.forEach(c => { if (!els[c].classList.contains("hit")) els[c].classList.add("show"); });
        timers.push(setTimeout(() => done(false), 700)); return;
      }
      if (mode === "all" ? found.size === k : idx === k) { over = true; done(true); }
    };
    stage.addEventListener("pointerdown", h);
    return () => { over = true; timers.forEach(clearTimeout); stage.removeEventListener("pointerdown", h); };
  };
}

/* N-back: is this letter the same as the one N steps ago? The best-studied working-memory trainer.
   Keeps its own history across trials; when N changes (difficulty moves) the stream restarts with a short warm-up. */
function nbackTrial() {
  const L = "BCDFGHJKLMNPRSTVXZ"; let hist = [], N = 0;
  return (d, stage, done) => {
    const n = d <= 5 ? 1 : d <= 14 ? 2 : 3, show = Math.max(700, 1500 - d * 30), limit = Math.max(1400, 3200 - d * 70);
    const timers = [], T = (f, ms) => timers.push(setTimeout(f, ms)); let cleanup = null, over = false;
    const nextLetter = () => { const back = hist.length >= n ? hist[hist.length - n] : null; if (back && Math.random() < 0.35) return back; let c; do c = pick(L.split("")); while (c === back); return c; };
    const card = (c, sub) => `<div class="hint">${n === 1 ? "Same letter as the one just before?" : `Same letter as ${n} steps back?`}</div><div class="nbk"><div class="nbstrip">${hist.slice(-4).map((_, i, a) => `<i class="${i === a.length - n ? "tgt" : ""}"></i>`).join("")}</div><div class="nbcard"><span>${c}</span></div><small>${sub}</small></div>`;
    const probe = () => {
      if (over) return;
      const c = nextLetter(), match = hist.length >= n && hist[hist.length - n] === c; hist.push(c); if (hist.length > 12) hist.shift();
      cleanup = choice(stage, { top: card(c, `${n}-back`), options: ["match", "new"], correct: match ? 0 : 1, limit, cls: "nbopts",
        render: o => o === "match" ? `${ic("check")}Match` : `${ic("x")}New` }, ok => { over = true; done(ok); });
    };
    if (n !== N) { hist = []; N = n; }
    if (hist.length < n) {
      // warm-up: show the first N letters to hold in mind
      const need = n - hist.length;
      for (let k = 0; k < need; k++) T(() => { if (over) return; const c = nextLetter(); hist.push(c); stage.innerHTML = card(c, k === 0 && n > 1 ? `Remember these ${n}` : "Remember it"); }, k * show);
      T(probe, need * show);
    } else probe();
    return () => { over = true; timers.forEach(clearTimeout); if (cleanup) cleanup(); };
  };
}

function speedTrial(mode) {
  return (d, stage, done) => {
    const timers = [], T = (f, ms) => timers.push(setTimeout(f, ms));
    let over = false, h = null;
    const end = ok => { if (over) return; over = true; if (h) stage.removeEventListener("pointerdown", h); timers.forEach(clearTimeout); done(ok); };
    if (mode === "count") {
      const k = rnd(3, Math.min(12, 4 + Math.floor(d / 2)));
      const dur = Math.max(120, 900 - d * 40);
      const spots = shuffle([...Array(25).keys()]).slice(0, k).map(p => [14 + (p % 5) * 18 + rnd(-4, 4), 14 + Math.floor(p / 5) * 18 + rnd(-4, 4)]);
      stage.innerHTML = `<div class="hint">Count the dots</div><div class="arena"><span class="fix">+</span><div class="field"></div></div><div class="optwrap" style="width:100%"></div>`;
      const field = $(".field", stage);
      T(() => { field.innerHTML = spots.map(([x, y]) => `<i class="d" style="left:${x}%;top:${y}%"></i>`).join(""); $(".fix", stage).style.opacity = 0; }, 400);
      T(() => { field.innerHTML = ""; field.classList.add("mask"); }, 400 + dur);
      T(() => {
        field.classList.remove("mask"); $(".hint", stage).textContent = "How many?";
        const lo = Math.max(1, k - rnd(0, 3)); const opts = [lo, lo + 1, lo + 2, lo + 3];
        const wrap = $(".optwrap", stage);
        timers.push(null);
        const inner = choice(wrap, { options: opts, correct: opts.indexOf(k), limit: 5000 }, ok => end(ok));
        timers.cleanupInner = inner;
      }, 650 + dur);
      return () => { over = true; timers.forEach(t => t && clearTimeout(t)); if (timers.cleanupInner) timers.cleanupInner(); };
    }
    // keeps getting harder all the way to DMAX: shorter flashes, more distractors, then distractors that look like the target
    const dur = mode === "odd" ? Math.max(70, 700 - d * 30) : Math.max(34, 620 - d * 27);
    const target = rnd(0, 7);
    stage.innerHTML = `<div class="hint">${mode === "odd" ? "Spot the odd one out" : "Watch for the pink diamond"}</div>${arenaHTML()}`;
    const slots = $$(".slot", stage);
    const nd = d > 5 ? Math.min(7, Math.floor((d - 4) / 2)) : 0;
    const others = shuffle([0, 1, 2, 3, 4, 5, 6, 7].filter(x => x !== target)).slice(0, nd);
    T(() => {
      $(".fix", stage).style.opacity = .25;
      if (mode === "odd") {
        const oddCls = d <= 6 ? "sq" : d <= 12 ? "cir alt" : d <= 18 ? "cir big" : "cir near";
        slots.forEach((s, i) => s.innerHTML = `<span class="shape ${i === target ? oddCls : "cir"}"></span>`);
      } else {
        slots[target].innerHTML = '<span class="shape dia"></span>';
        others.forEach(i => slots[i].innerHTML = `<span class="shape dia ${d > 17 ? "near" : d > 9 ? "alt" : "hol"}"></span>`);
      }
    }, 450);
    T(() => slots.forEach(s => { s.innerHTML = ""; s.classList.add("mask"); }), 450 + dur);
    T(() => {
      slots.forEach(s => { s.classList.remove("mask"); s.classList.add("live"); s.disabled = false; });
      $(".hint", stage).textContent = mode === "odd" ? "Where was the odd one?" : "Where was it?";
      h = e => { const b = e.target.closest(".slot"); if (!b || b.disabled) return; e.preventDefault(); const i = +b.dataset.i; slots[target].classList.add("right"); if (i !== target) b.classList.add("wrong"); end(i === target); };
      stage.addEventListener("pointerdown", h);
      T(() => { slots[target].classList.add("right"); end(false); }, 4000);
    }, 450 + dur + 220);
    return () => { over = true; timers.forEach(clearTimeout); if (h) stage.removeEventListener("pointerdown", h); };
  };
}

function stroopTrial(lang) {
  return (d, stage, done) => {
    const ink = rnd(0, 3);
    const cong = Math.random() < Math.max(0.1, 0.45 - d * 0.025);
    const word = cong ? ink : pick([0, 1, 2, 3].filter(x => x !== ink));
    const order = d > 8 ? shuffle([0, 1, 2, 3]) : [0, 1, 2, 3];
    return choice(stage, {
      top: `<div class="hint">Tap the colour of the ink, not the word</div><div class="stroop" style="color:${INK[ink].c}">${INK[word][lang]}</div>`,
      options: order, correct: order.indexOf(ink), limit: Math.max(750, 2600 - d * 90),
      render: o => `<span class="sw" style="background:${INK[o].c}" aria-label="${INK[o].n}"></span>`
    }, done);
  };
}
function flankerTrial() {
  return (d, stage, done) => {
    const dir = rnd(0, 1), incong = Math.random() < Math.min(0.75, 0.35 + d * 0.03), n = d > 8 ? 7 : 5, mid = Math.floor(n / 2);
    const row = Array.from({ length: n }, (_, i) => i === mid ? dir : d > 12 ? (Math.random() < 0.7 ? 1 - dir : dir) : incong ? 1 - dir : dir);
    return choice(stage, {
      top: `<div class="hint">Which way does the middle arrow point?</div><div class="arrows">${row.map(r => arrowSVG(r)).join("")}</div>`,
      options: [0, 1], correct: dir, limit: Math.max(550, 2000 - d * 70), render: o => `<span class="arrows">${arrowSVG(o)}</span>`
    }, done);
  };
}

const FLEX = {
  numbers: { rules: [["Odd", "Even"], ["Low", "High"]], names: ["Odd or even?", "Lower or higher than 5?"],
    gen(rule) { const v = pick([1, 2, 3, 4, 6, 7, 8, 9]); return { html: `<span>${v}</span>`, side: rule === 0 ? (v % 2 ? 0 : 1) : (v < 5 ? 0 : 1) }; } },
  letters: { rules: [["Vowel", "Consonant"], ["A–M", "N–Z"]], names: ["Vowel or consonant?", "First or second half of the alphabet?"],
    gen(rule) { const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; const vow = "AEIOU"; const c = Math.random() < 0.4 ? pick(vow.split("")) : pick(L.split("")); return { html: `<span>${c}</span>`, side: rule === 0 ? (vow.includes(c) ? 0 : 1) : (L.indexOf(c) < 13 ? 0 : 1) }; } },
  shapes: { rules: [["Circle", "Square"], ["Orange", "Purple"]], names: ["Circle or square?", "Orange or purple?"],
    gen(rule) { const sh = rnd(0, 1), co = rnd(0, 1); return { html: `<span class="fshape ${sh ? "square" : "circle"}" style="background:${co ? "#6B4FBB" : "#F28C28"}"></span>`, side: rule === 0 ? sh : co }; } }
};
const FLEX_COL = ["#E8950C", "#2F7BEA"];
function flexTrial(kind) {
  let prev = null;
  return (d, stage, done) => {
    const F = FLEX[kind];
    const pSwitch = Math.min(0.55, 0.15 + d * 0.03);
    const rule = prev === null ? rnd(0, 1) : (Math.random() < pSwitch ? 1 - prev : prev); prev = rule;
    const s = F.gen(rule);
    const col = FLEX_COL[rule];
    const label = d <= 6 ? F.names[rule] : "Follow the frame colour";
    // each button shows both rules, colour-coded to their frame; early levels dim the inactive rule
    const btn = side => `<span class="two"><span style="color:${FLEX_COL[0]}" class="${rule === 0 || d > 3 ? "" : "dim"}">${F.rules[0][side]}</span><span style="color:${FLEX_COL[1]}" class="${rule === 1 || d > 3 ? "" : "dim"}">${F.rules[1][side]}</span></span>`;
    return choice(stage, {
      top: `<div class="hint" style="color:${col};font-weight:700">${label}</div><div class="fcard" style="--rule:${col}">${s.html}</div>`,
      options: [0, 1], correct: s.side, limit: Math.max(900, 3200 - d * 100), render: btn
    }, done);
  };
}

function genArith(d) {
  let a, b, op;
  if (d <= 3) { op = pick(["+", "-"]); a = rnd(2, 9); b = rnd(2, 9); }
  else if (d <= 6) { op = pick(["+", "-", "×"]); if (op === "×") { a = rnd(2, 9); b = rnd(2, 9); } else { a = rnd(11, 59); b = rnd(3, 29); } }
  else if (d <= 10) { op = pick(["+", "-", "×"]); if (op === "×") { a = rnd(12, 25); b = rnd(3, 9); } else { a = rnd(24, 99); b = rnd(13, 79); } }
  else if (d <= 14) { op = pick(["+", "-", "×", "÷"]); if (op === "×") { a = rnd(11, 19); b = rnd(11, 19); } else if (op === "÷") { b = rnd(3, 12); a = b * rnd(6, 25); } else { a = rnd(120, 499); b = rnd(24, 99); } }
  else { op = pick(["+", "-", "×", "÷"]); if (op === "×") { a = rnd(13, 39); b = rnd(12, 29); } else if (op === "÷") { b = rnd(6, 19); a = b * rnd(12, 49); } else { a = rnd(230, 999); b = rnd(120, 499); } }
  if (op === "-" && b > a) [a, b] = [b, a];
  const ans = op === "+" ? a + b : op === "-" ? a - b : op === "×" ? a * b : a / b;
  return { q: `${a} ${op === "-" ? "−" : op} ${b}`, a: ans, w: numWrongs(ans, op === "×" ? Math.max(a, b) : 10) };
}
function genPercent(d) {
  if (d <= 4) { const p = pick([10, 50, 25]), base = rnd(2, 20) * 20, a = base * p / 100; return { q: `${p}% of ${base}`, a, w: numWrongs(a, Math.max(2, a / 2)) }; }
  if (d <= 8) { const p = pick([5, 15, 20, 30, 75]), base = rnd(2, 15) * 20, a = base * p / 100; return { q: `${p}% of ${base}`, a, w: numWrongs(a, 5) }; }
  if (d <= 12) { const p = pick([10, 15, 20, 25, 30]), base = rnd(2, 20) * 20, a = base * (100 - p) / 100; return { q: `A$${base} with ${p}% off`, a, w: numWrongs(a, base * 0.05).concat([base * p / 100]) }; }
  if (d <= 15 || Math.random() < 0.6) { const p = pick([6, 8, 12, 16, 18, 24, 36, 44]), base = 50 * rnd(3, 19), a = base * p / 100; return { q: `${p}% of ${base}`, a, w: numWrongs(a, Math.round(base * 0.02) || 2) }; }
  const [P, r] = pick([[1000, 10], [2000, 5], [1000, 20], [500, 10], [4000, 5]]); const a = Math.round(P * (1 + r / 100) ** 2);
  return { q: `A$${fmt(P)} at ${r}% a year, compounded for 2 years`, a, w: [P + 2 * P * r / 100, a + 10, a - 10, a + 100] };
}
const FX = [{ c: "COP", r: 2600 }, { c: "ARS", r: 700 }, { c: "CLP", r: 620 }, { c: "BOB", r: 4.5 }, { c: "PEN", r: 2.4 }, { c: "BRL", r: 3.6 }];
function genFx(d) {
  const cur = pick(FX);
  const aud = d <= 5 ? rnd(1, 10) * 10 : d <= 10 ? rnd(3, 30) * 5 : rnd(12, 180);
  const local = Math.round(aud * cur.r * 10) / 10;
  const close = d > 10 ? [0.93, 1.07, 0.85, 1.15] : [0.8, 1.25, 0.9, 1.1];
  if (d > 6 && Math.random() < 0.4) {
    const w = close.map(m => Math.round(local * m)).concat([local * 10, local / 10]);
    return { q: `A$${fmt(aud)} in ${cur.c}`, sub: `At ${fmt(cur.r)} ${cur.c} per A$1`, a: fmt(local), w: w.map(fmt) };
  }
  const w = close.map(m => Math.round(aud * m)).concat([aud * 10, Math.round(aud / 10)]);
  return { q: `${fmt(local)} ${cur.c} in A$`, sub: `At ${fmt(cur.r)} ${cur.c} per A$1`, a: "A$" + fmt(aud), w: w.map(x => "A$" + fmt(x)) };
}
function niceStep(x) { const p = Math.pow(10, Math.floor(Math.log10(Math.max(10, x)))); for (const m of [5, 2, 1]) if (m * p <= x) return m * p; return p; }
function genEstimate(d) {
  let a, b;
  if (d <= 5) { a = rnd(12, 49); b = rnd(12, 49); } else if (d <= 10) { a = rnd(23, 99); b = rnd(23, 99); } else { a = rnd(110, 899); b = rnd(12, 99); }
  const v = a * b, step = niceStep(v / (d <= 5 ? 4 : d <= 10 ? 7 : 12));
  const c = Math.round(v / step) * step;
  const w = shuffle([-2, -1, 1, 2]).map(k => c + k * step).filter(x => x > 0);
  return { q: `${a} × ${b}`, sub: "Closest estimate?", a: fmt(c), w: w.map(fmt), limit: Math.max(2500, 6500 - d * 200) };
}
function numTrial(gen) {
  return (d, stage, done) => {
    const g = gen(d);
    const { options, correct } = withOptions(typeof g.a === "number" ? g.a : g.a, g.w);
    return choice(stage, {
      top: `${g.sub ? `<div class="hint">${esc(g.sub)}</div>` : '<div class="hint"></div>'}<div class="prompt ${g.q.length > 14 ? "mid" : ""}">${esc(g.q)}</div>`,
      options, correct, limit: g.limit || Math.max(3000, 10000 - d * 350), render: o => esc(typeof o === "number" ? fmt(o) : o)
    }, done);
  };
}

function genSeq(d) {
  const types = d <= 3 ? ["add"] : d <= 6 ? ["add", "sub", "geo"] : d <= 10 ? ["inc", "sq", "alt", "geo"] : d <= 14 ? ["inter", "fib", "dbl1", "inc"] : ["inc2", "prime", "sqc", "mulsub", "inter"];
  const t = pick(types); let s = [];
  const L = d <= 6 ? 5 : 6;
  if (t === "add") { const k = rnd(2, 9), a = rnd(1, 20); for (let i = 0; i < L; i++) s.push(a + i * k); }
  if (t === "sub") { const k = rnd(2, 9), a = rnd(50, 99); for (let i = 0; i < L; i++) s.push(a - i * k); }
  if (t === "geo") { const r = pick([2, 3]), a = rnd(1, r === 2 ? 6 : 3); for (let i = 0; i < L; i++) s.push(a * r ** i); }
  if (t === "inc") { let v = rnd(1, 10), k = rnd(1, 3); for (let i = 0; i < L; i++) { s.push(v); v += k + i; } }
  if (t === "inc2") { let v = rnd(1, 10), k = rnd(1, 4); for (let i = 0; i < L; i++) { s.push(v); v += k; k += 2; } }
  if (t === "sq") { const o = rnd(1, 5); for (let i = 0; i < L; i++) s.push((i + o) ** 2); }
  if (t === "sqc") { const o = rnd(2, 5), c = rnd(-3, 5); for (let i = 0; i < L; i++) s.push((i + o) ** 2 + c); }
  if (t === "alt") { let v = rnd(10, 30); const p = rnd(4, 9), q = rnd(1, p - 1); for (let i = 0; i < L; i++) { s.push(v); v += i % 2 ? -q : p; } }
  if (t === "inter") { const a = rnd(1, 9), k1 = rnd(2, 5), b = rnd(30, 60), k2 = rnd(2, 6); for (let i = 0; i < 7; i++) s.push(i % 2 ? b - Math.floor(i / 2) * k2 : a + (i / 2) * k1); }
  if (t === "fib") { let a = rnd(1, 5), b = rnd(2, 7); for (let i = 0; i < L; i++) { s.push(a); [a, b] = [b, a + b]; } }
  if (t === "dbl1") { let v = rnd(1, 5); for (let i = 0; i < L; i++) { s.push(v); v = v * 2 + 1; } }
  if (t === "mulsub") { let v = rnd(2, 5); const c = rnd(1, 4); for (let i = 0; i < 5; i++) { s.push(v); v = v * 3 - c; } }
  if (t === "prime") { const P = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61]; const st = rnd(0, 10); s = P.slice(st, st + L); }
  const ans = s[s.length - 1], shown = s.slice(0, -1);
  const last = shown[shown.length - 1], prev = shown[shown.length - 2];
  const w = [last + (last - prev), ans + 1, ans - 1, ans + 2, ans - (last - prev), ans + (ans - last)].filter(x => x !== ans && x >= 0);
  return { q: shown.join(", ") + ", ?", a: ans, w: w.concat(numWrongs(ans, 3)) };
}
function genLetters(d) {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; let idx = [];
  if (d <= 4) { const k = rnd(1, 2), s = rnd(0, 25 - k * 4); for (let i = 0; i < 5; i++) idx.push(s + i * k); }
  else if (d <= 9) { const k = rnd(2, 4), back = Math.random() < 0.4; if (back) { const s = rnd(k * 4, 25); for (let i = 0; i < 5; i++) idx.push(s - i * k); } else { const s = rnd(0, 25 - k * 4); for (let i = 0; i < 5; i++) idx.push(s + i * k); } }
  else if (d <= 14) { let v = rnd(0, 6), k = 1; for (let i = 0; i < 6; i++) { idx.push(v); v += k; k++; } }
  else { const s = rnd(0, 4); for (let i = 0; i < 7; i++) idx.push(i % 2 ? 25 - s - Math.floor(i / 2) : s + i / 2); }
  const ans = A[idx[idx.length - 1]], shown = idx.slice(0, -1).map(i => A[i]);
  const ai = idx[idx.length - 1];
  const w = [ai + 1, ai - 1, ai + 2, ai - 2, ai + 3].filter(i => i >= 0 && i < 26).map(i => A[i]);
  return { q: shown.join(" ") + " ?", a: ans, w };
}
const PROPS = [
  { max: 3, list: [{ f: n => n % 2 === 0, lo: 2, hi: 40 }] },
  { max: 6, list: [{ f: n => n % 5 === 0, lo: 5, hi: 90 }, { f: n => n % 3 === 0, lo: 6, hi: 60 }] },
  { max: 10, list: [{ f: n => n % 4 === 0, lo: 8, hi: 96 }, { f: n => n % 6 === 0, lo: 12, hi: 96 }, { f: n => n % 7 === 0, lo: 14, hi: 98 }, { f: n => Number.isInteger(Math.sqrt(n)), lo: 4, hi: 100 }] },
  { max: 14, list: [{ f: n => n > 1 && [...Array(Math.floor(Math.sqrt(n))).keys()].slice(2).every(k => n % k) && n % 2 !== 0 || n === 2, lo: 11, hi: 97 }, { f: n => n % 9 === 0, lo: 18, hi: 144 }, { f: n => n % 12 === 0, lo: 24, hi: 180 }] },
  { max: 99, list: [{ f: n => n % 13 === 0, lo: 26, hi: 208 }, { f: n => n % 17 === 0, lo: 34, hi: 255 }, { f: n => Number.isInteger(Math.cbrt(n)) && Math.round(Math.cbrt(n)) ** 3 === n, lo: 8, hi: 343 }] }
];
function isPrime(n) { if (n < 2) return false; for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; }
function genOdd(d) {
  const tier = PROPS.find(p => d <= p.max); let P = pick(tier.list);
  if (tier.max === 14 && P === tier.list[0]) P = { f: isPrime, lo: 11, hi: 97 };
  const yes = [], no = [];
  for (let g = 0; g < 4000 && (yes.length < 3 || no.length < 1); g++) {
    const n = rnd(P.lo, P.hi);
    if (P.f(n)) { if (yes.length < 3 && !yes.includes(n)) yes.push(n); }
    else if (no.length < 1 && (P.f === isPrime ? n % 2 : true)) no.push(n);
  }
  while (yes.length < 3) yes.push(yes.length ? yes[0] * (yes.length + 1) : 2);
  const opts = shuffle([...yes, no[0] ?? 1]);
  return { options: opts, correct: opts.indexOf(no[0] ?? 1) };
}
function reasonTrial(kind) {
  return (d, stage, done) => {
    if (kind === "oddnum") {
      const g = genOdd(d);
      return choice(stage, { top: '<div class="hint">Three share a rule. Tap the odd one out.</div><div class="prompt mid">Odd one out</div>', options: g.options, correct: g.correct, limit: Math.max(3500, 11000 - d * 350) }, done);
    }
    const g = kind === "letters" ? genLetters(d) : genSeq(d);
    const { options, correct } = withOptions(g.a, g.w);
    return choice(stage, { top: `<div class="hint">What comes next?</div><div class="prompt seq ${g.q.length > 16 ? "mid" : ""}">${esc(g.q)}</div>`, options, correct, limit: Math.max(4000, 13000 - d * 400), render: o => esc(typeof o === "number" ? fmt(o) : o) }, done);
  };
}

const rot = (p, n) => p.map((_, idx) => { const r = Math.floor(idx / n), c = idx % n; return p[(n - 1 - c) * n + r]; });
const mir = (p, n) => p.map((_, idx) => { const r = Math.floor(idx / n), c = idx % n; return p[r * n + (n - 1 - c)]; });
const rotK = (p, n, k) => { let q = p; for (let i = 0; i < k; i++) q = rot(q, n); return q; };
const same = (a, b) => a.every((v, i) => v === b[i]);
function genPattern(n) {
  for (;;) {
    const p = Array.from({ length: n * n }, () => Math.random() < 0.45 ? 1 : 0);
    const cnt = p.reduce((a, b) => a + b, 0); if (cnt < n || cnt > n * n - n) continue;
    const rs = [0, 1, 2, 3].map(k => rotK(p, n, k)), m = mir(p, n);
    if (rs.some((a, i) => rs.some((b, j) => i < j && same(a, b)))) continue;
    if (rs.some(a => same(a, m))) continue;
    return p;
  }
}
const patHTML = (p, n) => `<span class="pat" style="--n:${n}">${p.map(v => `<i${v ? ' class="on"' : ""}></i>`).join("")}</span>`;
function spatialTrial(kind) {
  return (d, stage, done) => {
    const n = d <= 4 ? 3 : d <= 10 ? 4 : 5, p = genPattern(n), m = mir(p, n);
    let opts, correct, top;
    const limit = Math.max(3000, 12000 - d * 400);
    if (kind === "mirror") {
      const ks = shuffle([0, 1, 2, 3]).slice(0, 3);
      const list = ks.map(k => rotK(p, n, k)).concat([rotK(m, n, rnd(0, 3))]);
      opts = shuffle(list.map((q, i) => ({ q, odd: i === 3 }))); correct = opts.findIndex(o => o.odd);
      top = '<div class="hint">Three are the same shape turned. One is flipped. Tap it.</div>';
    } else {
      let k, instr = "";
      if (kind === "rotate") { k = d <= 3 ? 1 : pick([1, 2, 3]); instr = k === 1 ? "Turn it 90° clockwise" : k === 2 ? "Turn it 180°" : "Turn it 90° anticlockwise"; }
      else { k = rnd(1, 3); }
      const ans = rotK(p, n, k);
      const wr = [];
      if (kind === "rotate") { [1, 2, 3].filter(x => x !== k).forEach(x => wr.push(rotK(p, n, x))); wr.push(rotK(m, n, k)); }
      else { shuffle([0, 1, 2, 3]).slice(0, 3).forEach(x => wr.push(rotK(m, n, x))); if (d > 8) { const nm = p.slice(); const c = rnd(0, n * n - 1); nm[c] = 1 - nm[c]; const cand = rotK(nm, n, rnd(1, 3)); if (![0, 1, 2, 3].some(x => same(rotK(p, n, x), cand))) wr[2] = cand; } }
      const list = [ans].concat(wr.slice(0, 3));
      opts = shuffle(list.map((q, i) => ({ q, odd: i === 0 }))); correct = opts.findIndex(o => o.odd);
      top = `<div class="hint">${kind === "rotate" ? instr : "Which one is this shape, just turned?"}</div><div class="target">${patHTML(p, n)}</div>`;
    }
    return choice(stage, { top, options: opts, correct, limit, render: o => patHTML(o.q, n), cls: "pats" }, done);
  };
}

const ENGINES = {
  speed: { assess: "position", train: ["odd", "count"], variants: {
    position: { name: "Flash", how: "A pink diamond flashes around the circle. Tap where it was.", make: () => speedTrial("position") },
    odd: { name: "Odd flash", how: "Eight shapes flash. Tap where the odd one was.", make: () => speedTrial("odd") },
    count: { name: "Quick count", how: "Dots flash for a moment. Tap how many.", make: () => speedTrial("count") } } },
  memory: { assess: "all", train: ["order", "reverse", "nback"], variants: {
    nback: { name: "N-back", how: "Letters appear one by one. Tap Match when a letter is the same as the one N steps back, New when it isn't.", make: () => nbackTrial() },
    all: { name: "Grid recall", how: "Tiles light up together. Tap all of them.", make: () => memoryTrial("all") },
    order: { name: "Trail", how: "Tiles light up one by one. Tap them in the same order.", make: () => memoryTrial("order") },
    reverse: { name: "Rewind", how: "Tiles light up one by one. Tap them in reverse.", make: () => memoryTrial("reverse") } } },
  attention: { assess: "ink", train: ["flanker", "inkes"], variants: {
    ink: { name: "Ink", how: "Tap the colour the word is printed in, not what it says.", make: () => stroopTrial("n") },
    inkes: { name: "Tinta", how: "Same as Ink, but the words are in Spanish. Tap the ink colour.", make: () => stroopTrial("es") },
    flanker: { name: "Arrows", how: "Tap the way the middle arrow points. Ignore the rest.", make: () => flankerTrial() } } },
  flex: { assess: "numbers", train: ["letters", "shapes"], variants: {
    numbers: { name: "Switch", how: "Amber frame: odd or even. Blue frame: lower or higher than 5. The frame can switch any time.", make: () => flexTrial("numbers") },
    letters: { name: "Letter switch", how: "Amber frame: vowel or consonant. Blue frame: A–M or N–Z. The frame can switch any time.", make: () => flexTrial("letters") },
    shapes: { name: "Shape switch", how: "Amber frame: circle or square. Blue frame: orange or purple. The frame can switch any time.", make: () => flexTrial("shapes") } } },
  numeracy: { assess: "arith", train: ["percent", "fx", "estimate"], variants: {
    arith: { name: "Quick maths", how: "Pick the right answer before the bar runs out.", make: () => numTrial(genArith) },
    percent: { name: "Percentages", how: "Percentages, discounts and interest. Pick the answer.", make: () => numTrial(genPercent) },
    fx: { name: "Exchange", how: "Convert at the rate shown. Pick the answer.", make: () => numTrial(genFx) },
    estimate: { name: "Ballpark", how: "Don't calculate. Pick the closest estimate, fast.", make: () => numTrial(genEstimate) } } },
  reasoning: { assess: "numbers", train: ["letters", "oddnum"], variants: {
    numbers: { name: "Sequences", how: "Find the rule. Pick the next number.", make: () => reasonTrial("numbers") },
    letters: { name: "Letter runs", how: "Find the rule. Pick the next letter.", make: () => reasonTrial("letters") },
    oddnum: { name: "Odd one out", how: "Three numbers share a rule. Tap the one that doesn't.", make: () => reasonTrial("oddnum") } } },
  spatial: { assess: "match", train: ["mirror", "rotate"], variants: {
    match: { name: "Turned", how: "Find the option that's the same shape, just rotated.", make: () => spatialTrial("match") },
    mirror: { name: "Flipped", how: "Three are rotations of one shape. Tap the mirror image.", make: () => spatialTrial("mirror") },
    rotate: { name: "Turn it", how: "Picture the turn. Tap the shape it becomes.", make: () => spatialTrial("rotate") } } }
};

/* ---------- knowledge (spaced repetition) ---------- */
/* Scheduler: SM-2 style. Each card keeps an interval (iv, days) and an ease (e).
   Quality q: 1 forgot, 2 hard, 3 good, 4 easy (true/false still accepted).
   A brand-new card answered right comes back tomorrow, not in a week: one lucky multiple-choice
   guess is not a memory. Intervals then expand by the ease factor; a lapse resets to 1 day and makes the card a little harder. */
const INT = [0, 1, 3, 7, 14, 30, 60];
const boxOf = iv => iv >= 60 ? 6 : iv >= 30 ? 5 : iv >= 14 ? 4 : iv >= 7 ? 3 : iv >= 3 ? 2 : 1;
function sched(prev, q, t) {
  if (q === true) q = 3; else if (q === false || !q) q = 1;
  if (!prev) { const iv = q >= 4 ? 3 : 1; return { b: boxOf(iv), iv, e: q >= 4 ? 2.6 : q === 2 ? 2.3 : 2.5, due: addDays(t, iv), n: 1, ok: q >= 2 ? 1 : 0, lp: q === 1 ? 1 : 0, last: t }; }
  const r = { ...prev };
  if (!r.iv) { r.iv = INT[r.b] || 1; r.e = 2.5; r.lp = 0; }
  r.n = (r.n || 0) + 1;
  if (q === 1) { r.lp = (r.lp || 0) + 1; r.e = Math.max(1.3, r.e - 0.2); r.iv = 1; }
  else {
    r.ok = (r.ok || 0) + 1;
    const late = r.due ? Math.max(0, daysBetween(r.due, t)) : 0;          // remembered despite being overdue: count the real gap
    const base = r.iv + late * (q === 2 ? 0.25 : 0.5);
    const next = q === 2 ? base * 1.2 : q === 3 ? base * r.e : base * r.e * 1.35;
    r.iv = clamp(Math.round(Math.max(next, r.iv + 1)), 1, 365);
    r.e = clamp(r.e + (q === 2 ? -0.15 : q === 4 ? 0.12 : 0), 1.3, 3.2);
  }
  r.b = boxOf(r.iv); r.due = addDays(t, r.iv); r.last = t;
  return r;
}
function grade(kind, id, q) { return (state.srs[kind][id] = sched(state.srs[kind][id], q, today())); }
const ivLabel = d => d <= 1 ? "1 day" : d < 14 ? `${d} days` : d < 60 ? `${Math.round(d / 7)} wks` : d < 365 ? `${Math.round(d / 30)} mo` : "1 yr";
/* ---------- curriculum ----------
   New cards arrive as short lessons: a topic (knowledge) or a word group (Spanish), taught in the bank's order so each
   fact builds on the last. A lesson already under way is finished before a new one opens, and lessons follow the bank's
   interleaving of categories, so the days stay varied. Pace is set by a goal (6, 9 or 12 months to meet everything). */
const lessonName = (kind, it) => kind === "es" ? it.cat.replace(/^New: /, "") : it.place;
const catOf = (kind, it) => kind === "es" ? "Spanish" : it.cat;
const _lessons = {};
function lessonsOf(kind) {
  if (_lessons[kind] && _lessons[kind].src === content[kind]) return _lessons[kind].list;
  const m = new Map();
  content[kind].forEach(it => { const n = lessonName(kind, it); if (!m.has(n)) m.set(n, { name: n, cat: catOf(kind, it), ids: [] }); m.get(n).ids.push(it.id); });
  _lessons[kind] = { src: content[kind], list: [...m.values()] };
  return _lessons[kind].list;
}
function lessonFor(kind, id) { return lessonsOf(kind).find(l => l.ids.includes(id)); }
function lessonProgress(l, kind) { const srs = state.srs[kind]; return { seen: l.ids.filter(id => srs[id]).length, total: l.ids.length }; }
function nextNew(kind, n, cat) {
  const srs = state.srs[kind], L = lessonsOf(kind).filter(l => !cat || l.cat === cat);
  const open = L.filter(l => l.ids.some(id => srs[id]) && l.ids.some(id => !srs[id])).sort((a, b) => lessonProgress(b, kind).seen / b.ids.length - lessonProgress(a, kind).seen / a.ids.length);
  const out = [];
  for (const l of open.concat(L.filter(l => !l.ids.some(id => srs[id])))) { for (const id of l.ids) if (!srs[id] && out.length < n) out.push(id); if (out.length >= n) break; }
  return out;
}
const PACE_BUFFER = 30;   // meet every card a month before the goal, so the last ones have time to settle
function paceInfo() {
  const unseen = k => content[k].filter(it => !state.srs[k][it.id]).length, uEs = unseen("es"), uTr = unseen("tr"), U = uEs + uTr;
  const total = content.es.length + content.tr.length, start = state.pace.start || today();
  const goal = addDays(start, Math.round(state.pace.months * 30.44)), meetBy = addDays(goal, -PACE_BUFFER);
  const daysLeft = Math.max(1, daysBetween(today(), meetBy));
  const perDay = U ? clamp(Math.ceil(U / daysLeft), 3, 16) : 0;
  const es = U ? Math.min(uEs, Math.max(uEs ? 1 : 0, Math.round(perDay * uEs / U))) : 0;
  const metToday = (state.log[today()] || {}).n || 0;
  const finish = U ? addDays(today(), Math.ceil(U / perDay) + PACE_BUFFER) : addDays(today(), PACE_BUFFER);
  return { U, total, perDay, es, tr: Math.min(uTr, perDay - es), goal, finish, metToday, onTrack: Math.ceil(U / Math.max(1, daysLeft)) <= 16 };
}
// two cards that give each other away (same answer, or one's answer sits in the other's question) never share a round
function clash(kind, a, b) {
  if (kind === "es") return a.es === b.es || a.en === b.en;
  const A = a.a.toLowerCase(), B = b.a.toLowerCase(), qa = a.q.toLowerCase(), qb = b.q.toLowerCase();
  const inQ = (ans, q) => ans.replace(/^(the|a|an|about) /, "").length >= 4 && q.includes(ans.replace(/^(the|a|an|about) /, ""));
  return A === B || inQ(A, qb) || inQ(B, qa);
}
function queueFor(kind, maxNew, maxRev, cat) {
  const items = content[kind], srs = state.srs[kind], t = today(), byId = Object.fromEntries(items.map(it => [it.id, it]));
  // most overdue first, relative to the card's own interval (a 1-day card 3 days late is more at risk than a 60-day card 3 days late)
  const risk = it => { const r = srs[it.id]; return daysBetween(r.due, t) / Math.max(1, r.iv || INT[r.b] || 1); };
  const picked = [], ok = it => !picked.some(p => clash(kind, p, it));
  nextNew(kind, maxNew * 2, cat).map(id => byId[id]).forEach(it => { if (picked.length < maxNew && ok(it)) picked.push(it); });
  const fresh = picked.slice(); picked.length = 0;
  const due = items.filter(it => srs[it.id] && srs[it.id].due <= t && (!cat || it.cat === cat)).sort((a, b) => risk(b) - risk(a));
  for (const it of due) { if (picked.length >= maxRev) break; if (ok(it) && !fresh.some(f => clash(kind, f, it))) picked.push(it); }
  // reviews first (a warm-up of retrieval), spread so cards from one topic aren't back to back, then today's lesson in order
  const spread = [], rest = shuffle(picked);
  while (rest.length) { const last = spread[spread.length - 1], j = rest.findIndex(it => !last || lessonName(kind, it) !== lessonName(kind, last)); spread.push(rest.splice(j < 0 ? 0 : j, 1)[0]); }
  return spread.concat(fresh).map(it => it.id);
}
/* per-category tracking: lifetime answers plus a per-day log, for accuracy and trend */
function trackAnswer(kind, it, ok) {
  const c = catOf(kind, it), k = state.kst[c] || (state.kst[c] = [0, 0]); k[0] += ok ? 1 : 0; k[1]++;
  const L = state.log[today()] || (state.log[today()] = {}), d = L.k || (L.k = {}), e = d[c] || (d[c] = [0, 0]); e[0] += ok ? 1 : 0; e[1]++;
}
function catAccuracy(c, from, to) {   // days [from, to) back from today
  let r = 0, n = 0;
  for (let i = from; i < to; i++) { const L = state.log[addDays(today(), -i)]; const e = L && L.k && L.k[c]; if (e) { r += e[0]; n += e[1]; } }
  return n ? { acc: r / n, n } : null;
}
function knowStats(kind, cat) {
  let m = 0, l = 0, n = 0; const srs = state.srs[kind];
  content[kind].forEach(it => { if (cat && it.cat !== cat) return; n++; const r = srs[it.id]; if (r) { if (r.b >= 4) m++; else l++; } });
  return { mastered: m, learning: l, fresh: n - m - l, total: n };
}

/* ---------- plans ---------- */
function checkupDue() {
  if (!state.baseline) return false;
  const last = state.checkups.length ? state.checkups[state.checkups.length - 1].date : state.baseline.date;
  return daysBetween(last, today()) >= 28;
}
// today's new cards at the chosen pace, less any already met today (e.g. from a Learn button)
function todaysNew() {
  const pc = paceInfo(), left = Math.max(0, pc.perDay - pc.metToday), f = pc.perDay ? left / pc.perDay : 0;
  return { es: Math.round(pc.es * f), tr: left - Math.round(pc.es * f) };
}
function knowSteps(sweepEs, sweepTr, revEs, revTr) {
  const out = [];
  const e = queueFor("es", sweepEs, revEs); if (e.length) out.push({ t: "know", kind: "es", ids: e });
  const r = queueFor("tr", sweepTr, revTr); if (r.length) out.push({ t: "know", kind: "tr", ids: r });
  return out;
}
function buildPlan(kind) {
  const t = today();
  if (state.calib.day < 3) {
    const day = state.calib.day + 1;
    const games = day === 1 ? [["speed"], ["memory"]] : day === 2 ? [["attention"], ["flex"]] : [["numeracy"], ["reasoning"], ["spatial"], ["speed", "recheck"]];
    const steps = games.map(([e, m]) => ({ t: "game", eng: e, variant: ENGINES[e].assess, mode: m || "assess" }));
    return { date: t, kind: "calib", day, idx: 0, results: [], steps: steps.concat(knowSteps(day === 3 ? 15 : 25, day === 3 ? 6 : 8, 10, 6)) };
  }
  if (kind === "checkup") {
    return { date: t, kind: "checkup", idx: 0, results: [], steps: SKILLS.map(e => ({ t: "game", eng: e, variant: ENGINES[e].assess, mode: "assess" })) };
  }
  const cand = SKILLS.map(k => ({ k, w: (110 - skillScore(k)) * (state.lastGames.includes(k) ? 0.35 : 1) }));
  const chosen = [];
  for (let n = 0; n < 2; n++) {
    const pool = cand.filter(c => !chosen.includes(c.k)); const tot = pool.reduce((a, c) => a + c.w, 0);
    let x = Math.random() * tot; for (const c of pool) { x -= c.w; if (x <= 0) { chosen.push(c.k); break; } }
    if (chosen.length === n) chosen.push(pool[pool.length - 1].k);
  }
  const steps = chosen.map(e => { const tr = ENGINES[e].train; const opts = tr.filter(v => v !== state.skills[e].lastV); return { t: "game", eng: e, variant: pick(opts.length ? opts : tr), mode: "train" }; });
  const nw = todaysNew(), ks = knowSteps(nw.es, nw.tr, 15, 15), es = ks.find(k => k.kind === "es"), trs = ks.find(k => k.kind === "tr");
  const seq = [steps[0], es, steps[1], trs, { t: "puzzle", kind: puzzleOfDay(t) }].filter(Boolean);
  return { date: t, kind: "daily", idx: 0, results: [], steps: seq };
}

