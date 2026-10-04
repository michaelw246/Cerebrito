/* ================= PUZZLES ================= */
const PZ = [
  { k: "palabra", name: "Palabra", sub: "Guess the Spanish word in 6", icon: "word", col: "#EE7FA6", max: 6 },
  { k: "wordle", name: "Wordle", sub: "Guess the English word in 6", icon: "grid", col: "#15B486", max: 6 },
  { k: "pais", name: "Globle", sub: "Find the mystery country, hot or cold", icon: "globe", col: "#3F7FD8", max: 12 },
  { k: "worldle", name: "Silhouette", sub: "Name the country from its outline", icon: "target", col: "#E9A92E", max: 6 },
  { k: "travle", name: "Travle", sub: "Link two countries over land", icon: "compass", col: "#6D4AF0" },
  { k: "maptap", name: "MapTap", sub: "Pin five places on the map", icon: "pin", col: "#FD6A49" },
  { k: "bee", name: "Spelling Bee", sub: "Find 8–10 words, then go for bonus", icon: "sparkle", col: "#E9A92E" },
  { k: "hunt", name: "Number Hunt", sub: "Tap 1 to 25 in order, fast", icon: "eye", col: "#5054D6" },
  { k: "pairs", name: "Parejas", sub: "Match Spanish words to meanings", icon: "cards", col: "#EE7FA6" },
  { k: "rush", name: "Rapid recall", sub: "60 seconds on what you've learned", icon: "zap", col: "#22BDB0" }
];
const PZK = Object.fromEntries(PZ.map(p => [p.k, p]));
const PZ_HOW = {
  palabra: "Guess the 5-letter Spanish word in 6 tries. Green means right letter, right spot. Orange means it's in the word somewhere else. Type or tap the keys.",
  wordle: "Guess the 5-letter English word in 6 tries. Green means right letter, right spot. Orange means it's in the word somewhere else. Type or tap the keys.",
  pais: "Guess any country. Each guess is coloured by how close its border is to the mystery country: the redder, the closer. Tap the map or type a name.",
  worldle: "Name the country from its outline. Each wrong guess shows how far away it is and which way to head.",
  travle: "Connect two countries by naming the countries in between. Each one has to share a land border with the next. Green is on a shortest route.",
  maptap: "Five places. Drop a pin where you think each one is, then lock it in. The closer you are, the more points. Pinch or use + to zoom for precision.",
  bee: "Make words of 4+ letters from the 7 in the hive. Every word must use the centre letter. Find 8 to 10 words to complete today's Bee, then keep going: every extra word earns bonus coins, and using all 7 letters scores a pangram.",
  rush: "60 seconds of quick two-choice questions from things you've learned. Chain right answers for bonus points.",
  hunt: "Find and tap the numbers 1 to 25 in order as fast as you can. Keep your eyes on the centre and let your side vision do the searching. Wrong taps cost a second.",
  pairs: "Six Spanish words, six meanings, all face down. Flip two at a time to find the matches. Remember where things are to finish in as few flips as possible."
};
const HINTS = 2;   // free hints in every game (Palabra, Wordle, Travle); never drawn from a shared pool
const pzSolvedTotal = () => Object.values(state.pzs || {}).reduce((a, s) => a + (s.won || 0), 0);
const pzPlayedTotal = () => Object.values(state.pzs || {}).reduce((a, s) => a + (s.played || 0), 0);
function viewPuzzles() {
  const pz = state.pz && state.pz.date === today() ? state.pz : {};
  const doneN = PZ.filter(p => p.k !== "rush" && pz[p.k] && pz[p.k].done).length, total = PZ.length - 1;
  const cards = PZ.map(p => {
    const g = pz[p.k], done = g && g.done, s = state.pzs[p.k], live = g && !done && ((g.g && g.g.length) || (g.res && g.res.length) || (g.found && g.found.length));
    const status = p.k === "rush" ? (state.rushBest ? `Best ${fmt(state.rushBest)}` : "Unlimited") : done ? (g.won ? "Solved today" : "Played today") : live ? "In progress" : "Today's puzzle ready";
    return `<article class="pzc" style="--cc:${p.col}"><i>${ic(p.icon)}</i><div class="pzt"><b>${p.name}</b><small>${p.sub}</small><span class="pst ${done ? "ok" : live ? "live" : ""}">${done ? ic("check") : ""}${status}${s && s.played ? ` · ${s.won}/${s.played} won` : ""}${s && s.streak > 1 ? ` · ${ic("flame")}${s.streak}` : ""}</span></div>
      <div class="pzb">${p.k === "rush" ? `<button class="pb main" data-a="pzf" data-k="${p.k}">${ic("play")}Play</button>` : `${!done ? `<button class="pb main" data-a="pzd" data-k="${p.k}">${ic("play")}${live ? "Resume" : "Daily"}</button>` : ""}<button class="pb ${done ? "main" : ""}" data-a="pzf" data-k="${p.k}">${ic("sparkle")}${done ? "Play more" : "Free play"}</button>`}</div></article>`;
  }).join("");
  return `<section class="card pagecard"><div class="eyebrow">Rompecabezas</div><h1>Puzzles</h1><p>A fresh daily version of each, plus unlimited free play. One also turns up in your session each day.</p>
    <div class="pzprog"><div class="gauge"><i style="width:${Math.round(doneN / total * 100)}%"></i></div><span><b>${doneN}</b>/${total} dailies done</span></div></section><div class="pzlist">${cards}</div>`;
}
function puzzleOfDay(t) {
  const pz = state.pz && state.pz.date === t ? state.pz : {}, order = ["palabra", "pais", "hunt", "worldle", "maptap", "pairs", "travle", "wordle", "bee", "rush"];
  const seenN = Object.keys(state.srs.tr).length + Object.keys(state.srs.es).length, start = daysBetween("2026-01-01", t) % order.length;
  for (let j = 0; j < order.length; j++) { const k = order[(start + j) % order.length]; if (k === "rush") { if (seenN >= 20) return k; continue; } if (!(pz[k] && pz[k].done)) return k; }
  return null;
}
const WORLDLE_POOL = () => CTRY.filter(c => c.pool && (WORLD.c[c.key] || "").length > 300);
let _travlePairs = null;
function travlePairs() {
  if (_travlePairs) return _travlePairs;
  const ok = (a, b) => CTRY[a].r === CTRY[b].r || (["eu", "as"].includes(CTRY[a].r) && ["eu", "as"].includes(CTRY[b].r));
  return (_travlePairs = GEO.pairs.filter(([a, b]) => { if (!ok(a, b) || !CTRY[a].pool || !CTRY[b].pool) return false; const d = bfsGeo(a)[b]; return d >= 3 && d <= 6; }));
}
function newPz(kind, seed) {
  const rng = seeded(seed), ri = n => Math.floor(rng() * n);
  if (kind === "palabra") return { a: ri(PALABRAS.length), g: [], rev: [] };
  if (kind === "wordle") return { a: ri(EN.ans5.length), g: [], rev: [] };
  if (kind === "pais") { const all = CTRY.filter(c => c.pool), pool = rng() < 0.35 ? all.filter(c => c.r === "sa" || c.r === "na") : all; return { a: pool[ri(pool.length)].i, g: [], v: 2 }; }
  if (kind === "worldle") { const pool = WORLDLE_POOL(); return { a: pool[ri(pool.length)].i, g: [], v: 2 }; }
  if (kind === "travle") { const P = travlePairs(); const [a, b] = P[ri(P.length)]; return { A: a, B: b, g: [], v: 2 }; }
  if (kind === "maptap") { const idx = new Set(); while (idx.size < 5) idx.add(ri(PLACES.length)); return { places: [...idx], res: [] }; }
  if (kind === "bee") return { a: ri(EN.bp.length), found: [] };
  if (kind === "hunt") { const n = [...Array(25).keys()].map(x => x + 1); for (let i = n.length - 1; i > 0; i--) { const j = ri(i + 1); [n[i], n[j]] = [n[j], n[i]]; } return { grid: n }; }
  if (kind === "pairs") {
    const ok = content.es.filter(x => x.es.length <= 14 && x.en.length <= 16 && !/[/(]/.test(x.en)), seen = ok.filter(x => state.srs.es[x.id]);
    const pool = seen.length >= 4 ? seen : ok, pickN = (arr, n) => { const a = arr.slice(), out = []; while (out.length < n && a.length) out.push(a.splice(ri(a.length), 1)[0]); return out; };
    const chosen = pickN(pool, Math.min(4, pool.length)); chosen.push(...pickN(ok.filter(x => !chosen.includes(x)), 6 - chosen.length));
    const deck = chosen.flatMap(x => [{ id: x.id, s: "es" }, { id: x.id, s: "en" }]); for (let i = deck.length - 1; i > 0; i--) { const j = ri(i + 1); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    return { deck };
  }
  return {};
}
/* older saves stored ISO codes / GEO pair indexes; restart those games in the new format rather than crash */
const pzFresh = (kind, S) => (kind === "pais" || kind === "worldle" || kind === "travle") ? S.v === 2 : true;
function pzState(kind, step) {
  if (step && step.free) { if (!step.st) step.st = newPz(kind, String(Math.random())); return step.st; }
  const t = today();
  if (!state.pz || state.pz.date !== t) state.pz = { date: t };
  if (!state.pz[kind] || !pzFresh(kind, state.pz[kind])) state.pz[kind] = newPz(kind, t + kind);
  return state.pz[kind];
}
function puzzleDone(kind, S, won, tries, max) {
  S.done = true; S.won = won;
  const s = state.pzs[kind] || (state.pzs[kind] = { played: 0, won: 0, streak: 0, dist: [] });
  if (!Array.isArray(s.dist)) s.dist = [];
  s.played++; if (won) { s.won++; s.streak++; s.best = Math.max(s.best || 0, s.streak); if (tries) s.dist[tries - 1] = (s.dist[tries - 1] || 0) + 1; } else s.streak = 0;
  const coins = won ? 20 + Math.max(0, max - tries) * 5 : 5, xp = P.kind === "practice" ? (won ? 20 : 5) : won ? 30 + Math.max(0, max - tries) * 5 : 10;
  if (P.kind === "practice") state.xp += xp;
  addCoins(coins);
  P.results.push({ t: "puzzle", kind, won, xp: P.kind === "practice" ? 0 : xp, coins }); P.idx++; if (P.kind === "practice") bumpMax();
  logDay({ p: 1 });
  if (won && ["wordle", "palabra", "pais", "worldle"].includes(kind)) rec("pz_" + kind, tries, "min");
  const pz = state.pz && state.pz.date === today() ? state.pz : {};
  if (PZ.every(p => p.k === "rush" || (pz[p.k] && pz[p.k].done)) && state.rec.sweepDay !== today()) { state.rec.sweepDay = today(); state.rec.sweeps = (state.rec.sweeps || 0) + 1; }
  checkAwards();
  save();
  return { coins, xp };
}
function pzStats(kind, hl) {
  const s = state.pzs[kind]; if (!s || !s.played) return "";
  const dist = (s.dist || []).slice(0, PZK[kind].max || 0), mx = Math.max(1, ...dist.map(v => v || 0));
  const bars = PZK[kind].max ? `<div class="dist">${Array.from({ length: PZK[kind].max }, (_, i) => `<div><span>${i + 1}</span><i style="--w:${Math.max(6, Math.round((dist[i] || 0) / mx * 100))}%" class="${hl === i + 1 ? "hl" : ""}"><b>${dist[i] || 0}</b></i></div>`).join("")}</div>` : "";
  return `<section class="card pzstats"><div class="eyebrow m">Your ${esc(PZK[kind].name)} stats</div><div class="st4"><div><b>${s.played}</b><small>Played</small></div><div><b>${Math.round(s.won / s.played * 100)}%</b><small>Won</small></div><div><b>${s.streak}</b><small>Streak</small></div><div><b>${s.best || s.streak}</b><small>Best</small></div></div>${bars}</section>`;
}
function shareResult(text) {
  const done = () => toast("Result copied. Paste it anywhere");
  if (navigator.share && matchMedia("(pointer:coarse)").matches) { navigator.share({ text }).catch(() => {}); return; }
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => toast("Couldn't copy"));
}
let pzShareText = "";
function pzResult(kind, won, title, big, sub, extra, rw, opts = {}) {
  pzShareText = opts.share || "";
  return `<div class="play">${shead()}<section class="card scorebig pzres ${won ? "win" : ""}" style="margin-top:14px"><div class="eyebrow ${won ? "g" : ""}">${won ? "Solved" : "The answer"}</div><div class="pzbig">${big}</div><h2 class="h">${esc(title)}</h2><p class="muted">${esc(sub)}</p>
    <div class="pills2"><span class="chip o">${ic("zap")}+${rw.xp} XP</span><span class="chip y">${ic("sun")}+${rw.coins} coins</span>${state.pzs[kind] && state.pzs[kind].streak > 1 ? `<span class="chip m">${ic("flame")}${state.pzs[kind].streak} in a row</span>` : ""}</div>
    ${pzShareText ? `<button class="btn ghost small" data-s="share">${ic("share")}Share result</button>` : ""}</section>${extra || ""}${pzStats(kind, opts.hl)}
  ${P.kind === "practice" && P.steps.length === 1 ? `<button class="btn ghost" data-s="again">${ic("sparkle")}Play another</button>` : ""}${nextBtn()}</div>`;
}
document.addEventListener("click", e => {
  if (view !== "session" || !P) return;
  if (e.target.closest('[data-s="again"]')) { const k = P.steps[0].kind; const label = P.label; exitSession(); openPractice({ t: "puzzle", kind: k, free: true }, label); }
  else if (e.target.closest('[data-s="share"]')) shareResult(pzShareText);
});
const pzTag = (kind, step, cls = "v") => `<span class="chip ${cls}">${ic(PZK[kind].icon)}${PZK[kind].name}<small>${step.free ? "Free" : "Daily"}</small></span>`;
/* a fixed action bar docked at the bottom of the screen, for whatever the main action is right now */
function dockBar(cls = "") {
  const el = document.createElement("div"); el.className = "gbar dock " + cls; document.body.appendChild(el); document.body.classList.add("has-gbar");
  return { el, set(html) { el.innerHTML = html; return el; }, destroy() { el.remove(); if (!$(".gbar")) document.body.classList.remove("has-gbar"); } };
}
/* run something when this puzzle is torn down (exit button, finishing, moving on) */
function pzCleanup(...fns) { currentAbort = () => { fns.forEach(f => { try { f(); } catch (e) {} }); currentAbort = null; }; }
const pzEnd = () => { if (currentAbort) currentAbort(); };

/* ---------- Wordle / Palabra ---------- */
function scoreGuess(g, a) {
  const res = Array(5).fill("x"), cnt = {};
  for (let i = 0; i < 5; i++) { if (g[i] === a[i]) res[i] = "g"; else cnt[a[i]] = (cnt[a[i]] || 0) + 1; }
  for (let i = 0; i < 5; i++) if (res[i] !== "g" && cnt[g[i]]) { res[i] = "y"; cnt[g[i]]--; }
  return res;
}
function runWordle(step) {
  const kind = step.kind, es = kind === "palabra", S = pzState(kind, step);
  const A = es ? PALABRAS[S.a] : [EN.ans5[S.a].toUpperCase(), EN.ans5[S.a], ""], ans = A[0];
  if (S.done) { P.idx++; save(); return stepIntro(); }
  let cur = "", busy = false, giveArmed = false, msgT = 0;
  const rank = { x: 1, y: 2, g: 3 };
  const keyState = () => { const k = {}; S.g.forEach(g => scoreGuess(g, ans).forEach((r, i) => { const c = g[i]; if (!k[c] || rank[r] > rank[k[c]]) k[c] = r; })); return k; };
  const K = es ? ["QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM"] : ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  const kb = dockBar("kbdock");
  app.innerHTML = `<div class="play wplay">${shead()}<section class="pzcard tight"><div class="row2">${pzTag(kind, step, es ? "o" : "m")}<span class="pzbtns"><button class="hintbtn" id="hint" aria-label="Reveal a letter (2 per game)">${ic("bulb")}<span id="hn"></span></button><button class="giveup" id="giveup">Give up</button></span></div></section>
    <div class="bwrap"><div id="wmsg" role="status" aria-live="polite"></div><div class="board" id="board"></div></div><p class="hintrow" id="hintrow"></p></div>`;
  const board = $("#board"), msgEl = $("#wmsg");
  const drawBoard = (revRow = -1) => {
    const rows = []; for (let r = 0; r < 6; r++) {
      const g = S.g[r], sc = g ? scoreGuess(g, ans) : null, isCur = r === S.g.length && !S.done;
      rows.push(`<div class="brow ${isCur ? "cur" : ""}" ${isCur ? 'id="currow"' : ""}>${[0, 1, 2, 3, 4].map(i => { const ch = g ? g[i] : isCur ? (cur[i] || "") : ""; const cls = g ? sc[i] + (r === revRow ? " rev" : "") : isCur && cur[i] ? "f" : ""; return `<span class="tile ${cls}" style="${r === revRow ? `animation-delay:${i * 110}ms` : ""}" ${g ? `aria-label="${ch} ${{ g: "correct", y: "elsewhere", x: "absent" }[sc[i]]}"` : ""}>${esc(ch || "")}</span>`; }).join("")}</div>`);
    }
    board.innerHTML = rows.join("");
    $("#hintrow").innerHTML = S.rev.length ? `${ic("bulb")} ${S.rev.map(i => `Letter ${i + 1} is <b>${ans[i]}</b>`).join(" · ")}` : "";
    $("#hn").textContent = HINTS - S.rev.length; $("#hint").disabled = S.rev.length >= HINTS || S.done;
  };
  const drawKb = () => {
    const ks = keyState(), key = c => `<button class="key ${ks[c] || ""}" data-k="${c}" aria-label="${c}${ks[c] ? " " + { g: "correct", y: "in word", x: "not in word" }[ks[c]] : ""}">${c}</button>`;
    kb.set(`<div class="kb" role="group" aria-label="Keyboard"><div>${[...K[0]].map(key).join("")}</div><div class="${es ? "" : "half"}">${[...K[1]].map(key).join("")}</div><div><button class="key wide enter" data-k="ENTER">Enter</button>${[...K[2]].map(key).join("")}<button class="key wide" data-k="DEL" aria-label="Delete">${ic("del")}</button></div></div>`);
  };
  const say = (m, ms = 1600) => { clearTimeout(msgT); msgEl.textContent = m; msgEl.classList.add("on"); if (ms) msgT = setTimeout(() => msgEl.classList.remove("on"), ms); };
  const draw = rev => { drawBoard(rev); drawKb(); };
  const valid = w => es ? VALID.has(w) : EN.v5.has(w.toLowerCase());
  const press = k => {
    if (busy || S.done) return;
    if (k === "DEL") { cur = cur.slice(0, -1); drawBoard(); return; }
    if (k === "ENTER") {
      if (cur.length < 5) { shake("Not enough letters"); return; }
      if (!valid(cur)) { shake("Not in the word list"); return; }
      S.g.push(cur); cur = ""; save(); const row = S.g.length - 1, won = S.g[row] === ans; busy = true; drawBoard(row);
      setTimeout(() => { drawKb(); tone(won); buzz(won); }, 560);
      setTimeout(() => {
        busy = false;
        if (won) { say(["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"][row], 0); $$(".brow")[row].classList.add("win"); setTimeout(() => end(true), 1300); }
        else if (S.g.length >= 6) end(false); else drawBoard();
      }, 1100);
      return;
    }
    if (cur.length < 5 && /^[A-ZÑ]$/.test(k)) { cur += k; drawBoard(); }
  };
  const shake = msg => { const r = $("#currow"); if (r) { r.classList.remove("shake"); void r.offsetWidth; r.classList.add("shake"); } say(msg); buzz(false); };
  kb.el.addEventListener("click", e => { const b = e.target.closest(".key"); if (b) { press(b.dataset.k); b.blur(); } });
  const onKey = e => {
    if (e.metaKey || e.ctrlKey || e.altKey || $(".scrim")) return;
    if (e.key === "Enter") { e.preventDefault(); press("ENTER"); } else if (e.key === "Backspace") { e.preventDefault(); press("DEL"); }
    else if (/^[a-zñ]$/i.test(e.key)) { const c = e.key.toUpperCase(); if (es || c !== "Ñ") press(c); }
  };
  document.addEventListener("keydown", onKey);
  pzCleanup(() => document.removeEventListener("keydown", onKey), () => kb.destroy(), () => clearTimeout(msgT));
  $("#giveup").onclick = () => {
    const b = $("#giveup");
    if (!giveArmed) { giveArmed = true; b.textContent = "Sure?"; b.classList.add("armed"); setTimeout(() => { if (giveArmed && b.isConnected) { giveArmed = false; b.textContent = "Give up"; b.classList.remove("armed"); } }, 3000); return; }
    end(false, true);
  };
  $("#hint").onclick = () => {
    if (S.rev.length >= HINTS) return;
    const known = new Set(); S.g.forEach(g => scoreGuess(g, ans).forEach((r, i) => r === "g" && known.add(i)));
    const opts = [0, 1, 2, 3, 4].filter(i => !known.has(i) && !S.rev.includes(i));
    if (!opts.length) { say("You've already found every letter's spot"); return; }
    S.rev.push(pick(opts)); save(); drawBoard(); say(`Letter ${S.rev[S.rev.length - 1] + 1} revealed`);
  };
  const end = (won, gaveUp) => {
    pzEnd();
    const rw = puzzleDone(kind, S, won, S.g.length, 6);
    const tiles = `<div class="brow mini">${[...ans].map((c, i) => `<span class="tile g rev" style="animation-delay:${i * 90}ms">${c}</span>`).join("")}</div>`;
    const sub = won ? `Solved in ${S.g.length} ${S.g.length === 1 ? "try" : "tries"}${es ? `. It means "${A[2]}"` : ""}` : gaveUp ? `You gave up, but now you know it${es ? `: "${A[2]}"` : ""}` : `Out of tries${es ? `. It means "${A[2]}"` : ""}`;
    const grid = S.g.map(g => scoreGuess(g, ans).map(r => ({ g: "🟩", y: "🟧", x: "⬜" })[r]).join("")).join("\n");
    app.innerHTML = pzResult(kind, won, es ? A[1] : ans, tiles, sub, es ? `<div class="dyk cortex"><i><img src="${IMG.t_spanish}" alt=""></i><p><b>${esc(A[1])}</b> means "${esc(A[2])}". It's now part of your Palabra history.</p></div>` : "", rw,
      { hl: won ? S.g.length : 0, share: `Cerebrito ${PZK[kind].name} ${step.free ? "" : today() + " "}${won ? S.g.length : "X"}/6\n${grid}` });
    if (won) setTimeout(() => burst(innerWidth / 2, 180, 28), 100);
  };
  draw();
}

/* ---------- geography helpers ---------- */
const R_EARTH = 6371, toR = x => x * Math.PI / 180;
function geo(a, b) {
  const dl = toR(b.lat - a.lat), dn = toR(b.lon - a.lon);
  const h = Math.sin(dl / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dn / 2) ** 2;
  const d = 2 * R_EARTH * Math.asin(Math.min(1, Math.sqrt(h)));
  const y = Math.sin(dn) * Math.cos(toR(b.lat)), x = Math.cos(toR(a.lat)) * Math.sin(toR(b.lat)) - Math.sin(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.cos(dn);
  return { d: Math.round(d), brg: (Math.atan2(y, x) * 180 / Math.PI + 360) % 360 };
}
/* static world map (Home, intros, journey). Interactive maps use MapView. */
function worldSVG({ fills = {}, extra = "", vb = "0 8 1000 380", cls = "" } = {}) {
  let land = "", hi = "";
  for (const [n, d] of Object.entries(WORLD.c)) { if (fills[n]) hi += `<path d="${d}" style="fill:${fills[n]}" class="hl"/>`; else land += d; }
  return `<svg class="wmap ${cls}" viewBox="${vb}" role="img" aria-label="World map"><path d="${land}" class="land"/>${hi}${extra}</svg>`;
}
const fitW = (v, minW) => { if (v[2] >= minW) return v; const cx = v[0] + v[2] / 2, cy = v[1] + v[3] / 2, k = minW / v[2]; return [cx - v[2] * k / 2, cy - v[3] * k / 2, v[2] * k, v[3] * k]; };
const ctryRow = (c, right, cls = "") => `<div class="grow2 ${cls}" data-fly="${c.i}"><span class="f">${ctryFlag(c)}</span><b>${esc(c.n)}</b>${right}</div>`;

/* ---------- Globle ---------- */
function runPais(step) {
  const S = pzState("pais", step), T = CTRY[S.a], MAX = 12;
  if (S.done) { P.idx++; save(); return stepIntro(); }
  app.innerHTML = `<div class="play gplay">${shead()}<section class="pzcard tight"><div class="row2">${pzTag("pais", step, "o")}<span class="eyebrow" id="gcount"></span></div><h2>Find the mystery country</h2><div class="ghints" id="ghints"></div></section>
    <section class="card mapcard live"><div id="gmap"></div><div class="heatkey"><span>Touching</span><i></i><span>Far</span></div></section>
    <div id="glist" class="glist"></div></div>`;
  const used = () => new Set(S.g);
  const map = MapView($("#gmap"), { snap: true, hint: "Tap a country or type below", label: "Interactive world map",
    onTap: (pt, k) => {
      if (k === null) return;
      if (S.g.includes(k)) { const d = borderKm(k, T.i); toast(`${CTRY[k].n}: ${d ? fmt(d) + " km away" : "touching it!"}`); return; }
      bar.select(k);
    } });
  const bar = guessBar({ exclude: used, note: "Tip: tap the map to pick a country",
    onSelect: c => { map.overlay(c ? selRing(c) : ""); if (c) flyNear([c.i]); },
    onSubmit: c => guess(c.i) });
  pzCleanup(() => bar.destroy(), () => map.destroy());
  const selRing = c => `<path d="${WORLD.c[c.key]}" class="selc"/>`;
  const flyNear = idxs => map.flyTo(fitW(bboxOf(idxs, 40), 260), 600);
  const draw = () => {
    const G = S.g.map(i => ({ c: CTRY[i], d: borderKm(i, T.i) })), fills = {};
    G.forEach(g => fills[g.c.i] = heatCol(g.d));
    map.fills(fills); map.overlay("");
    $("#gcount").textContent = `${S.g.length} of ${MAX} guesses`;
    const hints = []; if (S.g.length >= 4) hints.push(`${ic("globe")}In ${REGIONS[T.r]}`); if (S.g.length >= 7) hints.push(`${ic("word")}Starts with ${T.n[0]}`); if (S.g.length >= 10) hints.push(`${ic("compass")}${GEO.adj[T.i].length ? `Borders ${GEO.adj[T.i].length} countr${GEO.adj[T.i].length === 1 ? "y" : "ies"}` : "An island nation"}`);
    $("#ghints").innerHTML = hints.length ? hints.map(h => `<span class="chip">${h}</span>`).join("") : `<p class="muted">Hints unlock after 4, 7 and 10 guesses.</p>`;
    const last = G[G.length - 1], sorted = G.slice().sort((a, b) => a.d - b.d);
    $("#glist").innerHTML = G.length ? `<div class="gtitle"><span>Closest first</span>${last ? `<span>Last: <b style="color:${heatCol(last.d)}">${esc(last.c.n)}</b></span>` : ""}</div>` + sorted.map(g => ctryRow(g.c, `<span class="km">${g.d ? fmt(g.d) + " km" : "Touching"}</span><i class="hb" style="--hc:${heatCol(g.d)}"></i>`, g === last ? "new" : "")).join("") : "";
    $$("#glist [data-fly]").forEach(r => r.onclick = () => flyNear([+r.dataset.fly]));
  };
  const guess = i => {
    S.g.push(i); save();
    const won = i === T.i, d = borderKm(i, T.i);
    tone(won || d < 800); buzz(won);
    if (won || S.g.length >= MAX) return end(won);
    draw(); flyNear([i]);
    toast(`${CTRY[i].n}: ${d ? `${fmt(d)} km, ${heatWord(d).toLowerCase()}` : "touching it! 🔥"}`);
  };
  const end = won => {
    pzEnd(); const rw = puzzleDone("pais", S, won, S.g.length, MAX);
    const emo = S.g.map(i => { const d = borderKm(i, T.i); return i === T.i ? "🟩" : d === 0 ? "🟥" : d < 1500 ? "🟧" : d < 4000 ? "🟨" : "⬜"; }).join("");
    app.innerHTML = pzResult("pais", won, T.n, `<span class="bigflag">${ctryFlag(T)}</span>`, won ? `Found in ${S.g.length} ${S.g.length === 1 ? "guess" : "guesses"}` : "Out of guesses. Here's where it was", `<section class="card mapcard"><div id="rmap"></div></section>`, rw,
      { hl: won ? S.g.length : 0, share: `Cerebrito Globle ${step.free ? "" : today() + " "}${won ? S.g.length : "X"}/${MAX}\n${emo}` });
    const fills = {}; S.g.forEach(i => fills[i] = heatCol(borderKm(i, T.i))); fills[T.i] = "var(--good)";
    const m = MapView($("#rmap"), { label: "Answer map" }); m.fills(fills); setTimeout(() => m.flyTo(fitW(bboxOf([T.i], 40), 300), 900), 250);
    pzCleanup(() => m.destroy());
    if (won) setTimeout(() => burst(innerWidth / 2, 180, 28), 100);
  };
  draw(); if (S.g.length) flyNear([S.g[S.g.length - 1]]);
}

/* ---------- Worldle ---------- */
function runWorldle(step) {
  const S = pzState("worldle", step), T = CTRY[S.a], MAX = 6;
  if (S.done) { P.idx++; save(); return stepIntro(); }
  app.innerHTML = `<div class="play gplay">${shead()}<section class="pzcard tight"><div class="row2">${pzTag("worldle", step, "y")}<span class="eyebrow" id="wcount"></span></div><h2>Which country is this?</h2><div class="ghints" id="whints"></div></section>
    <section class="card silcard"><svg id="sil" viewBox="0 0 1000 400" role="img" aria-label="Country outline"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--p2)"/><stop offset="1" stop-color="var(--s)"/></linearGradient></defs><path d="${WORLD.c[T.key]}" fill="url(#sg)"/></svg></section>
    <div class="wrows" id="wrows"></div></div>`;
  const sil = $("#sil");
  requestAnimationFrame(() => { try { const b = sil.querySelector("path").getBBox(); let { x, y, width: w, height: h } = b; if (w > 600) { const [cx, cy] = proj(T.lat, T.lon); x = cx - 90; y = cy - 60; w = 180; h = 120; } const pad = Math.max(w, h) * 0.1; sil.setAttribute("viewBox", `${x - pad} ${y - pad} ${w + pad * 2} ${h + pad * 2}`); sil.classList.add("on"); } catch (e) {} });
  const bar = guessBar({ exclude: () => new Set(S.g), onSubmit: c => guess(c.i) });
  pzCleanup(() => bar.destroy());
  const prox = d => Math.max(0, Math.round((1 - d / 20037) * 100));
  const draw = () => {
    $("#wcount").textContent = `${S.g.length} of ${MAX}`;
    const rows = S.g.map((i, n) => { const C = CTRY[i], g = geo(C, T), hit = i === T.i; return `<div class="wrow ${n === S.g.length - 1 ? "new" : ""}"><span class="f">${ctryFlag(C)}</span><b>${esc(C.n)}</b><span class="km">${hit ? "" : fmt(g.d) + " km"}</span><span class="ar" aria-label="${hit ? "correct" : "head " + COMPASS[dir8(g.brg)]}">${hit ? "🎉" : ARROWS[dir8(g.brg)]}</span><span class="pr" style="--p:${hit ? 100 : prox(g.d)}%">${hit ? 100 : prox(g.d)}%</span></div>`; });
    for (let k = S.g.length; k < MAX; k++) rows.push(`<div class="wrow empty"><span>${k + 1}</span></div>`);
    $("#wrows").innerHTML = rows.join("");
    const hints = []; if (S.g.length >= 3) hints.push(`${ic("globe")}In ${REGIONS[T.r]}`); if (S.g.length >= 5) hints.push(`${ic("word")}Starts with ${T.n[0]}`);
    $("#whints").innerHTML = hints.map(h => `<span class="chip">${h}</span>`).join("");
  };
  const guess = i => {
    S.g.push(i); save(); const won = i === T.i; tone(won); buzz(won);
    if (won || S.g.length >= MAX) return end(won);
    draw();
  };
  const end = won => {
    pzEnd(); const rw = puzzleDone("worldle", S, won, S.g.length, MAX);
    const emo = S.g.map(i => i === T.i ? "🎉" : ARROWS[dir8(geo(CTRY[i], T).brg)]).join("");
    app.innerHTML = pzResult("worldle", won, T.n, `<span class="bigflag">${ctryFlag(T)}</span>`, won ? `Got it in ${S.g.length}` : "Now you'll know its shape", `<section class="card mapcard"><div id="rmap"></div></section>`, rw,
      { hl: won ? S.g.length : 0, share: `Cerebrito Silhouette ${step.free ? "" : today() + " "}${won ? S.g.length : "X"}/${MAX}\n${emo}` });
    const m = MapView($("#rmap"), { label: "Answer map" }); m.fills({ [T.i]: "var(--s)" }); setTimeout(() => m.flyTo(fitW(bboxOf([T.i], 60), 320), 900), 250);
    pzCleanup(() => m.destroy());
    if (won) setTimeout(() => burst(innerWidth / 2, 180, 28), 100);
  };
  draw();
}

/* ---------- Travle ---------- */
function bfsGeo(a) { const d = { [a]: 0 }, q = [a]; while (q.length) { const u = q.shift(); for (const v of ADJ[u]) if (d[v] === undefined) { d[v] = d[u] + 1; q.push(v); } } return d; }
function runTravle(step) {
  const S = pzState("travle", step), A = S.A, B = S.B, dA = bfsGeo(A), dB = bfsGeo(B), D = dA[B], MAX = (D - 1) + 4;
  if (S.done) { P.idx++; save(); return stepIntro(); }
  if (!Array.isArray(S.hint)) S.hint = [];
  const status = i => dA[i] === undefined || dB[i] === undefined ? "off" : dA[i] + dB[i] === D ? "on" : dA[i] + dB[i] === D + 1 ? "near" : "off";
  const connected = () => { const set = new Set(S.g.concat([B])), seen = new Set([A]), q = [A]; while (q.length) { const u = q.shift(); if (u === B) return true; for (const v of ADJ[u]) if (set.has(v) && !seen.has(v)) { seen.add(v); q.push(v); } } return false; };
  const shortest = () => { const path = [A]; let u = A; while (u !== B) { u = ADJ[u].find(v => dB[v] === dB[u] - 1); path.push(u); } return path; };
  const colors = { on: "#22B07D", near: "#F0A928", off: "#F0607A" };
  app.innerHTML = `<div class="play gplay">${shead()}<section class="pzcard tight"><div class="row2">${pzTag("travle", step)}<span class="eyebrow" id="tcount"></span></div>
    <h2 class="trv"><span>${ctryFlag(CTRY[A])} ${esc(CTRY[A].n)}</span>${ic("arrow")}<span>${ctryFlag(CTRY[B])} ${esc(CTRY[B].n)}</span></h2><p class="muted">The shortest land route crosses <b>${D - 1}</b> countr${D - 1 === 1 ? "y" : "ies"} in between.</p></section>
    <section class="card mapcard live"><div id="tmap"></div></section><div class="tchips" id="tchips"></div>
    <div class="trow"><div class="legend3"><span><i style="background:${colors.on}"></i>On route</span><span><i style="background:${colors.near}"></i>Close</span><span><i style="background:${colors.off}"></i>Off track</span></div><button class="hintbtn" id="thint">${ic("bulb")}Hint <span id="thn"></span></button></div></div>`;
  const ends = [A, B], home = (() => {   // frame both ends plus the centres of a shortest route (a route through Russia shouldn't show all of Siberia)
    const e = bboxOf(ends, 30), r = bboxPts(shortest().map(i => proj(CTRY[i].lat, CTRY[i].lon)), 30);
    const x0 = Math.min(e[0], r[0]), y0 = Math.min(e[1], r[1]);
    return fitW([x0, y0, Math.max(e[0] + e[2], r[0] + r[2]) - x0, Math.max(e[1] + e[3], r[1] + r[3]) - y0], 150);
  })();
  const map = MapView($("#tmap"), { vb: home, snap: true, label: "Route map", onTap: (pt, k) => { if (k === null || ends.includes(k)) return; if (S.g.includes(k)) { toast(`${CTRY[k].n} is already on your list`); return; } bar.select(k); } });
  const bar = guessBar({ exclude: () => new Set(S.g.concat(ends)), onSelect: c => map.overlay(c ? `<path d="${WORLD.c[c.key]}" class="selc"/>` : ""), onSubmit: c => guess(c.i) });
  pzCleanup(() => bar.destroy(), () => map.destroy());
  const draw = () => {
    const fills = { [A]: "var(--p)", [B]: "var(--p)" }; S.g.forEach(i => fills[i] = colors[status(i)]);
    S.hint.forEach(i => { if (!S.g.includes(i)) fills[i] = "color-mix(in srgb,var(--p) 30%,transparent)"; });
    map.fills(fills); map.overlay("");
    $("#tcount").textContent = `${S.g.length} of ${MAX} guesses`;
    $("#tchips").innerHTML = S.g.map(i => `<span class="tchip" style="--hc:${colors[status(i)]}">${ctryFlag(CTRY[i])} ${esc(CTRY[i].n)}</span>`).join("") || `<p class="muted">Name a country that borders ${esc(CTRY[A].n)} and heads towards ${esc(CTRY[B].n)}.</p>`;
    $("#thn").textContent = `(${HINTS - S.hint.length} left)`; $("#thint").disabled = S.hint.length >= HINTS || S.done;
  };
  $("#thint").onclick = () => {
    const next = shortest().slice(1, -1).find(i => !S.g.includes(i) && !S.hint.includes(i));
    if (!next) { toast("Nothing left to hint"); return; }
    if (S.hint.length >= HINTS) { toast("That's both hints for this game"); return; }
    S.hint.push(next); save(); draw(); map.flyTo(fitW(bboxOf([next], 60), 200)); toast("A country on a shortest route is shaded");
  };
  const guess = i => {
    S.g.push(i); save(); const st = status(i), won = connected();
    tone(st === "on"); buzz(st === "on");
    if (won || S.g.length >= MAX) return end(won);
    draw(); toast(st === "on" ? `${CTRY[i].n} is on a shortest route` : st === "near" ? `${CTRY[i].n} is close, one detour` : `${CTRY[i].n} is off track`);
  };
  const end = won => {
    pzEnd(); const rw = puzzleDone("travle", S, won, S.g.length, MAX), path = shortest();
    const emo = S.g.map(i => ({ on: "🟩", near: "🟧", off: "🟥" })[status(i)]).join("");
    app.innerHTML = pzResult("travle", won, `${CTRY[A].n} → ${CTRY[B].n}`, `<span class="bigflag">🧭</span>`, won ? `Linked in ${S.g.length} guesses (perfect is ${D - 1})` : "Out of guesses. Here's one shortest route",
      `<section class="card"><div class="eyebrow m">A shortest route</div><div class="tchips">${path.map(i => `<span class="tchip" style="--hc:${i === A || i === B ? "var(--p)" : colors.on}">${ctryFlag(CTRY[i])} ${esc(CTRY[i].n)}</span>`).join(ic("arrow"))}</div><div id="rmap" style="margin-top:12px"></div></section>`, rw,
      { share: `Cerebrito Travle ${step.free ? "" : today() + " "}${CTRY[A].n} → ${CTRY[B].n}: ${won ? S.g.length + " guesses" : "X"} (par ${D - 1})\n${emo}` });
    const m = MapView($("#rmap"), { vb: home, label: "Route map" }), f = {}; path.forEach(i => f[i] = colors.on); f[A] = f[B] = "var(--p)"; m.fills(f);
    pzCleanup(() => m.destroy());
    if (won) setTimeout(() => burst(innerWidth / 2, 180, 28), 100);
  };
  draw();
}

/* ---------- MapTap ---------- */
function runMaptap(step) {
  const S = pzState("maptap", step);
  if (S.done) { P.idx++; save(); return stepIntro(); }
  const ptsFor = d => d < 25 ? 100 : Math.round(100 * Math.exp(-(d - 25) / 1100));
  let pin = null, revealed = false;
  app.innerHTML = `<div class="play gplay">${shead()}<section class="pzcard tight"><div class="row2">${pzTag("maptap", step, "o")}<span class="eyebrow" id="mround"></span></div><h2 id="mq"></h2><p class="muted" id="msub"></p></section>
    <section class="card mapcard live tall"><div id="mmap"></div></section><div class="mdots" id="mdots"></div></div>`;
  const dock = dockBar();
  const map = MapView($("#mmap"), { cls: "tap", minW: 18, vb: [90, 20, 820, 340], hint: "Drag and pinch to explore. Tap to drop your pin", label: "Map, tap to place your pin", onTap: pt => { if (revealed) return; pin = pt; drawPin(); drawDock(); buzz(true); } });
  pzCleanup(() => dock.destroy(), () => map.destroy());
  const place = () => PLACES[S.places[S.res.length - (revealed ? 1 : 0)]];
  const drawPin = () => {
    const u = map.unit(); let h = "";
    if (pin) { const [x, y] = proj(pin.lat, pin.lon); h += pinSVG(x, y, "mine"); }
    if (revealed) { const r = S.res[S.res.length - 1], pl = place(), [px, py] = proj(pl.lat, pl.lon), [tx, ty] = proj(r.lat, r.lon); h = `<line x1="${tx}" y1="${ty}" x2="${px}" y2="${py}" class="tline"/>` + pinSVG(tx, ty, "mine") + pinSVG(px, py, "truth"); }
    map.overlay(h);
  };
  const pinSVG = (x, y, cls) => `<g class="pinm ${cls}" style="transform:translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scale(var(--u))"><circle r="15" class="halo"/><circle r="7"/></g>`;
  const drawHead = () => {
    const pl = place(), i = S.res.length - (revealed ? 1 : 0), total = S.res.reduce((a, r) => a + r.p, 0);
    $("#mround").textContent = `Place ${i + 1} of 5 · ${total} pts`; $("#mq").textContent = `Where is ${pl.n}?`; $("#msub").textContent = pl.c === pl.n ? "" : `In ${pl.c}`;
    $("#mdots").innerHTML = S.places.map((_, j) => { const r = S.res[j]; return `<i class="${r ? (r.p >= 70 ? "g" : r.p >= 30 ? "y" : "r") : j === i ? "c" : ""}">${r ? r.p : ""}</i>`; }).join("");
  };
  const drawDock = () => {
    if (revealed) {
      const r = S.res[S.res.length - 1], last = S.res.length >= 5;
      dock.set(`<div class="mres"><div><b>${r.d < 25 ? "Bullseye!" : fmt(r.d) + " km away"}</b><small>+${r.p} points${r.p >= 90 ? " 🎯" : ""}</small></div><button class="gsubmit" id="mnext">${last ? "See results" : "Next place"}${ic("arrow")}</button></div>`);
      $("#mnext").onclick = () => { if (last) return end(); revealed = false; pin = null; drawHead(); drawPin(); drawDock(); map.flyTo([90, 20, 820, 340], 700); };
    } else dock.set(`<div class="grow"><div class="gfield static">${ic("pin")}<span>${pin ? "Pin dropped · tap to move it" : "Tap the map to drop a pin"}</span></div><button class="gsubmit" id="mlock" ${pin ? "" : "disabled"}>Lock in</button></div>`), $("#mlock").onclick = lock;
  };
  const lock = () => {
    if (!pin || revealed) return;
    const pl = place(), d = geo(pin, pl).d, p = ptsFor(d);
    S.res.push({ d, p, lat: +pin.lat.toFixed(2), lon: +pin.lon.toFixed(2) }); save(); revealed = true;
    tone(d < 800); buzz(d < 800);
    drawHead(); drawPin(); drawDock();
    const [a, b] = [proj(pin.lat, pin.lon), proj(pl.lat, pl.lon)]; map.flyTo(fitW(bboxPts([a, b], 40), 90), 800);
    if (p >= 90) { const r = map.svg.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 20); }
  };
  const end = () => {
    pzEnd(); const total = S.res.reduce((a, r) => a + r.p, 0), won = total >= 250; rec("maptap", total);
    const rw = puzzleDone("maptap", S, won, won ? 1 : 3, 3);
    const rows = S.places.map((pi, j) => `<div class="wrow"><span class="pn">${j + 1}</span><b>${esc(PLACES[pi].n)}</b><span class="km">${fmt(S.res[j].d)} km</span><span class="pr" style="--p:${S.res[j].p}%">${S.res[j].p}</span></div>`).join("");
    app.innerHTML = pzResult("maptap", won, `${total} / 500`, `<span class="bigflag">📍</span>`, total >= 400 ? "Human GPS" : won ? "Sharp sense of place" : "Keep tapping, it gets easier",
      `<section class="card mapcard"><div id="rmap"></div></section><div class="wrows">${rows}</div>`, rw,
      { share: `Cerebrito MapTap ${step.free ? "" : today() + " "}${total}/500\n${S.res.map(r => r.p >= 70 ? "🟩" : r.p >= 30 ? "🟨" : "🟥").join("")}` });
    const m = MapView($("#rmap"), { label: "Your pins" }), pts = [];
    m.overlay(S.places.map((pi, j) => { const pl = PLACES[pi], r = S.res[j], [px, py] = proj(pl.lat, pl.lon), [tx, ty] = proj(r.lat, r.lon); pts.push([px, py], [tx, ty]); return `<line x1="${tx}" y1="${ty}" x2="${px}" y2="${py}" class="tline"/>${pinSVG(tx, ty, "mine")}${pinSVG(px, py, "truth")}`; }).join(""));
    setTimeout(() => m.flyTo(fitW(bboxPts(pts, 30), 200), 900), 250);
    pzCleanup(() => m.destroy());
    if (won) setTimeout(() => burst(innerWidth / 2, 180, 28), 100);
  };
  drawHead(); drawDock(); drawPin();
}

/* ---------- Spelling Bee ---------- */
function runBee(step) {
  const S = pzState("bee", step), [outer, center] = EN.bp[S.a], L = new Set((outer + center).split(""));
  if (S.done) { P.idx++; save(); return stepIntro(); }
  const answers = EN.bee.filter(w => w.length >= 4 && w.includes(center) && [...w].every(c => L.has(c)));
  const isPan = w => new Set(w).size === 7, pts = w => (w.length === 4 ? 1 : w.length) + (isPan(w) ? 7 : 0);
  const max = answers.reduce((a, w) => a + pts(w), 0);
  // today's Bee is complete at `goal` words (8-10, fewer only for a small hive); every word after that earns bonus coins
  const goal = Math.min(answers.length, clamp(Math.round(answers.length * .3), 8, 10)), BONUS = 5;
  const RANKS = [[0, "Beginner"], [.05, "Good start"], [.15, "Solid"], [.25, "Nice"], [.4, "Great"], [.5, "Amazing"], [.7, "Genius"]];
  let ring = outer.split(""), cur = "", msgT = 0;
  app.innerHTML = `<div class="play bplay">${shead()}<section class="pzcard tight"><div class="row2">${pzTag("bee", step, "y")}<span class="eyebrow" id="bcount"></span></div>
      <div class="beegoal" id="bgoal"></div>
      <div class="beerank"><b id="brank"></b><span id="bscore"></span></div><div class="gauge beeg"><i id="bgauge"></i>${RANKS.slice(1).map(r => `<s style="left:${r[0] / .7 * 100}%"></s>`).join("")}</div></section>
    <div class="beeword" id="bword" aria-live="polite"></div><div class="beemsg" id="bmsg" role="status"></div>
    <div class="hive" id="hive"></div>
    <div class="beebtns"><button class="btn ghost small" id="bdel">Delete</button><button class="iconbtn big" id="bshuf" aria-label="Shuffle letters">${ic("shuffle")}</button><button class="btn small" id="bent">Enter</button></div>
    <details class="card found" id="bfound"><summary></summary><div class="fwords" id="bwords"></div></details>
    <button class="btn green" id="bfin"></button></div>`;
  const hex = (c, cls, i) => `<button class="hex ${cls}" data-l="${c}" style="--i:${i}" aria-label="${c}">${c.toUpperCase()}</button>`;
  const drawHive = () => { $("#hive").innerHTML = hex(center, "mid", 0) + ring.map((c, i) => hex(c, "", i + 1)).join(""); };
  const drawWord = () => { $("#bword").innerHTML = cur ? [...cur].map(c => `<span class="${c === center ? "c" : L.has(c) ? "" : "bad"}">${c.toUpperCase()}</span>`).join("") + `<i class="caret"></i>` : `<span class="ph">Type or tap letters</span>`; };
  const drawScore = () => {
    const score = S.found.reduce((a, w) => a + pts(w), 0), frac = score / max, rk = RANKS.filter(r => frac >= r[0]).pop()[1], next = RANKS.find(r => frac < r[0]);
    $("#brank").textContent = rk; $("#bscore").textContent = `${score} pts${next ? ` · ${Math.ceil(next[0] * max - score)} to ${next[1]}` : ""}`;
    $("#bgauge").style.width = Math.min(100, frac / .7 * 100) + "%"; $("#bcount").textContent = `${S.found.length} of ${answers.length} words`;
    $("#bfound").querySelector("summary").innerHTML = `<span>Found <b>${S.found.length}</b></span><span class="fprev">${S.found.slice(-4).reverse().map(w => esc(w)).join(" · ") || "Nothing yet"}</span>`;
    const n = S.found.length, met = n >= goal;
    $("#bgoal").className = "beegoal" + (met ? " met" : "");
    $("#bgoal").innerHTML = `<div class="bgdots">${Array.from({ length: goal }, (_, i) => `<i class="${i < n ? "on" : ""}" style="--i:${i}"></i>`).join("")}</div>
      <span>${met ? `${ic("check")}Today's Bee done! ${n > goal ? `<b>+${(n - goal) * BONUS}</b> bonus coins so far.` : ""} Keep going: +${BONUS} coins a word` : `<b>${n}/${goal}</b> words to complete today's Bee`}</span>`;
    $("#bfin").innerHTML = met ? `${ic("check")}Collect & finish` : `${ic("check")}Finish early`; $("#bfin").classList.toggle("ghost", !met);
    $("#bwords").innerHTML = S.found.slice().sort().map(w => `<span class="${isPan(w) ? "pan" : ""}">${w}</span>`).join("") || `<span class="muted">Your words will collect here.</span>`;
  };
  const say = (m, good) => { clearTimeout(msgT); const el = $("#bmsg"); el.textContent = m; el.className = "beemsg on " + (good ? "good" : ""); msgT = setTimeout(() => { el.className = "beemsg"; }, 1400); };
  const add = c => { if (cur.length < 19) { cur += c; drawWord(); } };
  const enter = () => {
    const w = cur; cur = ""; drawWord();
    const bad = m => { say(m); buzz(false); const el = $("#bword"); el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); };
    if (!w) return;
    if (w.length < 4) return bad("Too short");
    if ([...w].some(c => !L.has(c))) return bad("Bad letters");
    if (!w.includes(center)) return bad("Missing centre letter");
    if (S.found.includes(w)) return bad("Already found");
    if (!answers.includes(w)) return bad("Not in word list");
    S.found.push(w); const hit = S.found.length === goal; if (isPan(w)) state.rec.pangrams = (state.rec.pangrams || 0) + 1; save(); tone(true); buzz(true); say(isPan(w) ? `Pangram! +${pts(w)}` : `${w.length >= 7 ? "Awesome!" : w.length >= 5 ? "Nice!" : "Good!"} +${pts(w)}`, true); drawScore();
    if (isPan(w)) burst(innerWidth / 2, 300, 24);
    if (hit) { setTimeout(() => { burst(innerWidth / 2, 140, 36); toast(`Today's Bee complete! Every extra word is +${BONUS} coins`); }, 500); }
  };
  $("#hive").onclick = e => { const b = e.target.closest(".hex"); if (b) add(b.dataset.l); };
  $("#bdel").onclick = () => { cur = cur.slice(0, -1); drawWord(); };
  $("#bshuf").onclick = () => { ring = shuffle(ring); const h = $("#hive"); h.classList.remove("spin"); void h.offsetWidth; h.classList.add("spin"); drawHive(); };
  $("#bent").onclick = enter;
  let finArmed = false;
  $("#bfin").onclick = () => {
    if (S.found.length >= goal || finArmed) return end();
    finArmed = true; say(`${goal - S.found.length} more word${goal - S.found.length === 1 ? "" : "s"} to complete it. Tap again to finish anyway.`);
    setTimeout(() => { finArmed = false; }, 3000);
  };
  const onKey = e => {
    if (e.metaKey || e.ctrlKey || e.altKey || $(".scrim")) return;
    if (e.key === "Enter") { e.preventDefault(); enter(); } else if (e.key === "Backspace") { e.preventDefault(); cur = cur.slice(0, -1); drawWord(); }
    else if (e.key === " ") { e.preventDefault(); $("#bshuf").click(); } else if (/^[a-z]$/i.test(e.key)) add(e.key.toLowerCase());
  };
  document.addEventListener("keydown", onKey);
  pzCleanup(() => document.removeEventListener("keydown", onKey), () => clearTimeout(msgT));
  const end = () => {
    pzEnd(); const score = S.found.reduce((a, w) => a + pts(w), 0), won = S.found.length >= goal;
    const rw = puzzleDone("bee", S, won, won ? 1 : 3, 3), extra = won ? (S.found.length - goal) * BONUS : 0;
    if (extra) { addCoins(extra); rw.coins += extra; P.results[P.results.length - 1].coins += extra; save(); }
    const missed = answers.filter(w => !S.found.includes(w)), pans = answers.filter(isPan), rk = RANKS.filter(r => score / max >= r[0]).pop()[1];
    app.innerHTML = pzResult("bee", won, `${rk} · ${score} points`, `<span class="bigflag">🐝</span>`, `${S.found.length} words (today's goal: ${goal})${extra ? `, +${extra} bonus coins` : ""}. Pangram${pans.length > 1 ? "s" : ""}: ${pans.join(", ")}`,
      `<section class="card"><div class="eyebrow m">Words you missed</div><div class="fwords">${missed.slice(0, 60).map(w => `<span class="${isPan(w) ? "pan" : ""}">${w}</span>`).join("") || "None. Incredible."}</div></section>`, rw,
      { share: `Cerebrito Spelling Bee ${step.free ? "" : today() + " "}${rk}: ${S.found.length} words, ${score} pts` });
  };
  drawHive(); drawWord(); drawScore();
}

/* ---------- Rapid recall ---------- */
function rushDeck(cat) {
  const esAll = content.es, trAll = content.tr;
  const es = (!cat || cat === "Spanish") ? esAll.map(x => ({ kind: "es", id: x.id, q: x.es, a: x.en, w: shuffle(esAll.filter(y => y.id !== x.id && y.cat === x.cat).map(y => y.en)).concat(shuffle(esAll).slice(0, 3).map(y => y.en)), seen: !!state.srs.es[x.id], place: "Spanish" })) : [];
  const tr = (!cat || cat !== "Spanish") ? trAll.filter(x => !cat || x.cat === cat).map(x => ({ kind: "tr", id: x.id, q: x.q, a: x.a, w: x.wrong, seen: !!state.srs.tr[x.id], place: x.place })) : [];
  const all = es.concat(tr), seen = shuffle(all.filter(x => x.seen)), fresh = shuffle(all.filter(x => !x.seen));
  const out = []; while (seen.length || fresh.length) { if (seen.length) out.push(seen.pop()); if (fresh.length) out.push(fresh.pop()); if (fresh.length && Math.random() < .5) out.push(fresh.pop()); }
  return out;
}
function runRush(step) {
  const deck = rushDeck(step.cat), dur = 60000; let di = 0;
  app.innerHTML = `<div class="play">${shead()}<div class="hud"><div class="timer">${ic("clock")}<div class="gauge"><i id="clk"></i></div><b id="secs">1:00</b></div><span class="combo off" id="combo">x1</span></div>
  <div class="scorecard"><span class="coin">${ic("zap")}</span><div><small>Score</small><b id="score">0</b></div><span class="chip v">${esc(step.cat || "Everything")}</span></div><div class="stage" id="stage"></div></div>`;
  const stage = $("#stage"), clk = $("#clk"), scoreEl = $("#score"), secsEl = $("#secs"), comboEl = $("#combo");
  const r = { score: 0, combo: 0, maxCombo: 0, right: 0, n: 0, ended: false, tEnd: 0, cleanup: null };
  let raf = 0, cdT = [], nextT = 0;
  currentAbort = () => { r.ended = true; cancelAnimationFrame(raf); clearTimeout(nextT); cdT.forEach(clearTimeout); if (r.cleanup) r.cleanup(); $(".count") && $(".count").remove(); };
  if (!deck.length) { stage.innerHTML = `<p class="muted">Nothing to recall yet. Learn a few cards first.</p>`; return; }
  const cd = document.createElement("div"); cd.className = "count"; document.body.appendChild(cd);
  [3, 2, 1].forEach((n, i) => cdT.push(setTimeout(() => { cd.innerHTML = `<span>${n}</span>`; }, i * 520)));
  cdT.push(setTimeout(() => { cd.remove(); r.tEnd = performance.now() + dur; tick(); next(); }, 1560));
  function tick() { if (r.ended) return; const left = r.tEnd - performance.now(); clk.style.width = `${clamp(left / dur, 0, 1) * 100}%`; const sl = Math.max(0, Math.ceil(left / 1000)); secsEl.textContent = `${Math.floor(sl / 60)}:${String(sl % 60).padStart(2, "0")}`; if (left <= 0) { finish(); return; } raf = requestAnimationFrame(tick); }
  function next() {
    if (r.ended) return; if (performance.now() >= r.tEnd) { finish(); return; }
    const it = deck[di++ % deck.length];
    const wrong = (it.w || []).filter(w => w && w !== it.a)[0] || (deck.find(x => x.a !== it.a) || {}).a || "None of these";
    const { options, correct } = withOptions(it.a, [wrong]);
    stage.classList.remove("ok", "bad");
    const top = `<div class="kcardw"><div class="kcard">${it.place ? `<div class="eyebrow m" style="margin-bottom:4px">${esc(it.place)}${it.seen ? "" : " · new"}</div>` : ""}<div class="prompt mid ${it.q.length > 60 ? "small" : ""}">${esc(it.q)}</div></div></div>`;
    r.cleanup = choice(stage, { top, options, correct, cls: "one" }, ok => {
      if (r.ended) return; r.n++; tone(ok); buzz(ok); stage.classList.add(ok ? "ok" : "bad");
      if (!it.seen) { grade(it.kind, it.id, ok ? 3 : 1); it.seen = true; }
      if (ok) { r.right++; r.combo++; r.maxCombo = Math.max(r.maxCombo, r.combo); const m = r.combo >= 10 ? 2 : r.combo >= 5 ? 1.5 : 1; r.score += Math.round(10 * m); scoreEl.textContent = fmt(r.score);
        if (r.combo >= 3) { comboEl.classList.remove("off"); comboEl.innerHTML = `x${m} ${ic("flame")}`; } }
      else { r.combo = 0; comboEl.classList.add("off"); }
      nextT = setTimeout(next, ok ? 300 : 1300);
    });
  }
  function finish() {
    if (r.ended) return; r.ended = true; cancelAnimationFrame(raf); clearTimeout(nextT); if (r.cleanup) r.cleanup(); currentAbort = null;
    const prev = state.rushBest || 0; state.rushBest = Math.max(prev, r.score);
    const coins = Math.min(25, 5 + r.right), xp = P.kind === "practice" ? 0 : 20 + r.right;
    addCoins(coins); P.results.push({ t: "puzzle", kind: "rush", xp, coins }); P.idx++;
    const s = state.pzs.rush || (state.pzs.rush = { played: 0, won: 0, streak: 0, dist: [] }); s.played++;
    logDay({ p: 1 }); checkAwards();
    save();
    const acc = r.n ? r.right / r.n : 0, stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc >= 0.4 ? 1 : 0;
    app.innerHTML = `<div class="play">${shead()}<section class="card scorebig" style="margin-top:14px"><div class="eyebrow m">Rapid recall</div><b>${fmt(r.score)} <small>pts</small></b>${r.score > prev && prev ? `<div class="near">${ic("trophy")}New best!</div>` : prev ? `<div class="near">${ic("flame")}Your best is ${fmt(state.rushBest)}</div>` : ""}</section>
    <section class="card acc"><span class="coin">${ic("check")}</span><div><div class="eyebrow m">Correct</div><b>${r.right} of ${r.n}</b></div><span class="stars">${[0, 1, 2].map(k => ic("star", k < stars ? "on" : "")).join("")}</span></section>
    <div class="pills2">${xp ? `<span class="chip o">${ic("zap")}+${xp} XP</span>` : ""}<span class="chip y">${ic("sun")}+${coins} coins</span><span class="chip v">${ic("flame")}Best combo x${r.maxCombo}</span></div>${P.kind === "practice" && P.steps.length === 1 ? `<button class="btn ghost" data-s="again">${ic("sparkle")}Play again</button>` : ""}${nextBtn()}</div>`;
    if (r.score > prev && prev) setTimeout(() => burst(innerWidth / 2, 180, 24), 100);
  }
}

/* ---------- Number Hunt (Schulte table) ---------- */
/* A classic attention and visual-search drill: fix your gaze near the centre and find each number with
   peripheral vision. Times fall quickly with practice, which makes it very satisfying to repeat. */
function runHunt(step) {
  const S = pzState("hunt", step);
  if (S.done) { P.idx++; save(); return stepIntro(); }
  let next = 1, t0 = 0, raf = 0, pen = 0, misses = 0, ended = false;
  app.innerHTML = `<div class="play hplay">${shead()}<section class="pzcard tight"><div class="row2">${pzTag("hunt", step)}<span class="eyebrow">${state.rec.hunt ? `Best ${state.rec.hunt.toFixed(1)}s` : "No best yet"}</span></div>
    <div class="hhead"><div><small>Find</small><b id="hnext">1</b></div><div><small>Time</small><b id="htime">0.0</b></div></div></section>
    <div class="hgrid5" id="hgrid">${S.grid.map(n => `<button class="hcell" data-n="${n}" aria-label="${n}" disabled>${n}</button>`).join("")}</div><p class="muted hnote">Keep your eyes near the centre</p></div>`;
  const grid = $("#hgrid"), tEl = $("#htime"), nEl = $("#hnext");
  const cd = document.createElement("div"); cd.className = "count"; document.body.appendChild(cd); const cdT = [];
  [3, 2, 1].forEach((n, i) => cdT.push(setTimeout(() => { cd.innerHTML = `<span>${n}</span>`; }, i * 520)));
  cdT.push(setTimeout(() => { cd.remove(); $$(".hcell").forEach(b => b.disabled = false); t0 = performance.now(); tick(); }, 1560));
  const elapsed = () => (performance.now() - t0) / 1000 + pen;
  const tick = () => { if (ended) return; tEl.textContent = elapsed().toFixed(1); raf = requestAnimationFrame(tick); };
  pzCleanup(() => { ended = true; cancelAnimationFrame(raf); cdT.forEach(clearTimeout); cd.remove(); });
  grid.addEventListener("pointerdown", e => {
    const b = e.target.closest(".hcell"); if (!b || b.disabled || ended || !t0) return; e.preventDefault();
    const n = +b.dataset.n;
    if (n === next) {
      b.classList.add("hit"); b.disabled = true; buzz(true); next++;
      if (next > 25) return finish();
      nEl.textContent = next; nEl.parentElement.classList.remove("pop"); void nEl.offsetWidth; nEl.parentElement.classList.add("pop");
    } else if (n > next) { pen += 1; misses++; b.classList.remove("miss"); void b.offsetWidth; b.classList.add("miss"); buzz(false); tEl.parentElement.classList.add("pen"); setTimeout(() => tEl.parentElement.classList.remove("pen"), 400); }
  });
  const finish = () => {
    ended = true; cancelAnimationFrame(raf); const secs = +elapsed().toFixed(1), prev = state.rec.hunt;
    const best = rec("hunt", secs, "min"); pzEnd();
    const won = secs < 60, rw = puzzleDone("hunt", S, won, 1, 1);
    tone(true);
    app.innerHTML = pzResult("hunt", won, `${secs.toFixed(1)} seconds`, `<span class="bigflag">🎯</span>`, `${misses ? `${misses} wrong tap${misses > 1 ? "s" : ""} (+${misses}s)` : "No wrong taps"}. ${best ? `New best, down from ${prev.toFixed(1)}s!` : prev && prev < secs ? `Your best is ${prev.toFixed(1)}s.` : "Under 30 seconds is sharp; under 20 is elite."}`,
      "", rw, { share: `Cerebrito Number Hunt ${step.free ? "" : today() + " "}${secs.toFixed(1)}s${misses ? ` (${misses} miss)` : ""}` });
    if (best || secs < 25) setTimeout(() => burst(innerWidth / 2, 180, 28), 100);
  };
}

/* ---------- Parejas (pairs memory) ---------- */
/* Concentration with your own vocabulary: remembering where each card was trains visuospatial working
   memory, and matching a word to its meaning is one more retrieval of it. */
function runPairs(step) {
  const S = pzState("pairs", step), items = Object.fromEntries(content.es.map(x => [x.id, x]));
  if (S.done) { P.idx++; save(); return stepIntro(); }
  const deck = S.deck.filter(c => items[c.id]);
  if (!deck.length) { P.idx++; save(); return stepIntro(); }
  let open = [], matched = new Set(), flips = 0, misses = 0, busy = false, t0 = performance.now();
  app.innerHTML = `<div class="play pplay">${shead()}<section class="pzcard tight"><div class="row2">${pzTag("pairs", step, "o")}<span class="eyebrow" id="pstat"></span></div><h2>Find the six pairs</h2><p class="muted"><span class="dot es"></span>Spanish <span class="dot en"></span>English</p></section>
    <div class="pgrid" id="pgrid">${deck.map((c, i) => `<button class="pcard" data-i="${i}" aria-label="Card ${i + 1}"><span class="back">${ic("brain")}</span><span class="face ${c.s}">${esc(c.s === "es" ? items[c.id].es : items[c.id].en)}</span></button>`).join("")}</div></div>`;
  const cards = $$(".pcard"), stat = () => { $("#pstat").textContent = `${matched.size} of ${deck.length / 2} · ${misses} miss${misses === 1 ? "" : "es"}`; };
  let flipT = 0; pzCleanup(() => clearTimeout(flipT));
  $("#pgrid").addEventListener("click", e => {
    const b = e.target.closest(".pcard"); if (!b || busy) return; const i = +b.dataset.i;
    if (matched.has(deck[i].id) || open.includes(i)) return;
    b.classList.add("up"); open.push(i); flips++;
    if (deck[i].s === "es") speakEs(items[deck[i].id].es);
    if (open.length < 2) return;
    const [a, c] = open;
    if (deck[a].id === deck[c].id) {
      matched.add(deck[a].id); open = []; tone(true); buzz(true);
      [a, c].forEach(k => cards[k].classList.add("got")); stat();
      if (matched.size === deck.length / 2) setTimeout(finish, 650);
    } else {
      misses++; busy = true; buzz(false); stat();
      [a, c].forEach(k => cards[k].classList.add("no"));
      flipT = setTimeout(() => { [a, c].forEach(k => cards[k].classList.remove("up", "no")); open = []; busy = false; }, 950);
    }
  });
  stat();
  const finish = () => {
    pzEnd(); const secs = Math.round((performance.now() - t0) / 1000), perfect = misses <= 3;
    if (perfect) state.rec.pairsPerfect = (state.rec.pairsPerfect || 0) + 1;
    rec("pairs", misses, "min");
    const rw = puzzleDone("pairs", S, true, Math.min(6, 1 + Math.floor(misses / 2)), 6);
    const words = [...new Set(deck.map(c => c.id))].map(id => items[id]);
    app.innerHTML = pzResult("pairs", true, misses ? `${misses} miss${misses > 1 ? "es" : ""}` : "Flawless", `<span class="bigflag">🃏</span>`, `All six pairs in ${flips} flips and ${secs} seconds.${perfect ? " A sharp memory." : ""}`,
      `<section class="card"><div class="eyebrow m">Today's words</div><div class="pwords">${words.map(w => `<div><b>${esc(w.es)}</b><span>${esc(w.en)}</span></div>`).join("")}</div></section>`, rw,
      { share: `Cerebrito Parejas ${step.free ? "" : today() + " "}${misses} misses, ${flips} flips` });
    if (perfect) setTimeout(() => burst(innerWidth / 2, 180, 28), 100);
  };
}
