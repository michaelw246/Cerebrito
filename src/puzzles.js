/* ================= PUZZLES ================= */
const PZ = [
  { k: "palabra", name: "Palabra", sub: "Spanish Wordle, 6 guesses", icon: "word", col: "#EE7FA6" },
  { k: "wordle", name: "Wordle", sub: "The English original, 6 guesses", icon: "grid", col: "#15B486" },
  { k: "pais", name: "Globle", sub: "Find the mystery country by distance", icon: "globe", col: "#3F7FD8" },
  { k: "worldle", name: "Worldle", sub: "Name the country from its shape", icon: "target", col: "#E9A92E" },
  { k: "travle", name: "Travle", sub: "Link two countries through their neighbours", icon: "compass", col: "#6D4AF0" },
  { k: "maptap", name: "MapTap", sub: "Tap where five places are on the map", icon: "mountain", col: "#FD6A49" },
  { k: "bee", name: "Spelling Bee", sub: "Make words from seven letters", icon: "sparkle", col: "#E9A92E" },
  { k: "rush", name: "Rapid recall", sub: "60 seconds on what you've learned", icon: "zap", col: "#22BDB0" }
];
const PZK = Object.fromEntries(PZ.map(p => [p.k, p]));
const PZ_HOW = {
  palabra: "Guess the 5-letter Spanish word in 6 tries. Green is the right spot, orange is in the word but elsewhere. Stuck? Give up to see it.",
  wordle: "Guess the 5-letter English word in 6 tries. Green is the right spot, orange is in the word but elsewhere.",
  pais: "Guess any country. The map colours each guess by how close it is to the mystery country, red hot to blue cold.",
  worldle: "Name the country from its outline. Each wrong guess tells you how far away you are and which direction to head.",
  travle: "Get from one country to another by naming the countries in between. Each one must share a land border with the next.",
  maptap: "Five places, one tap each. Tap where you think it is on the map. The closer you are, the more points you get.",
  bee: "Make words of 4+ letters using the 7 letters. Every word must use the centre letter. A word using all 7 is a pangram.",
  rush: "60 seconds of quick two-choice questions. Chain right answers for bonus points. Wrong answers show you the right one."
};
function viewPuzzles() {
  const pz = state.pz && state.pz.date === today() ? state.pz : {};
  const cards = PZ.map(p => {
    const g = pz[p.k], done = g && g.done, s = state.pzs[p.k];
    const status = p.k === "rush" ? (state.rushBest ? `Best ${fmt(state.rushBest)}` : "Unlimited") : done ? (g.won ? "Today's solved" : "Today's played") : "Today's puzzle ready";
    return `<article class="pzc" style="--cc:${p.col}"><i>${ic(p.icon)}</i><div class="pzt"><b>${p.name}</b><small>${p.sub}</small><span class="pst ${done ? "ok" : ""}">${done ? ic("check") : ""}${status}${s && s.played ? ` · won ${s.won}/${s.played}` : ""}</span></div>
      <div class="pzb">${p.k === "rush" ? `<button class="pb main" data-a="pzf" data-k="${p.k}">${ic("play")}Play</button>` : `${!done ? `<button class="pb main" data-a="pzd" data-k="${p.k}">${ic("play")}Daily</button>` : ""}<button class="pb ${done ? "main" : ""}" data-a="pzf" data-k="${p.k}">${ic("sparkle")}${done ? "Play more" : "Free play"}</button>`}</div></article>`;
  }).join("");
  return `<section class="card pagecard"><div class="eyebrow">Rompecabezas</div><h1>Puzzles</h1><p>A new daily version of each one, plus unlimited free play. One of them also turns up in your session each day.</p></section><div class="pzlist">${cards}</div>`;
}
function puzzleOfDay(t) {
  const pz = state.pz && state.pz.date === t ? state.pz : {}, order = ["palabra", "pais", "worldle", "maptap", "travle", "wordle", "bee", "rush"];
  const seenN = Object.keys(state.srs.tr).length + Object.keys(state.srs.es).length, start = daysBetween("2026-01-01", t) % order.length;
  for (let j = 0; j < order.length; j++) { const k = order[(start + j) % order.length]; if (k === "rush") { if (seenN >= 20) return k; continue; } if (!(pz[k] && pz[k].done)) return k; }
  return null;
}
function newPz(kind, seed) {
  const rng = seeded(seed), ri = n => Math.floor(rng() * n);
  if (kind === "palabra") return { a: ri(PALABRAS.length), g: [], rev: [] };
  if (kind === "wordle") return { a: ri(EN.ans5.length), g: [], rev: [] };
  if (kind === "pais") { const pool = rng() < 0.4 ? PAIS.filter(c => c.r === "sa" || c.r === "na") : PAIS; return { a: pool[ri(pool.length)].c, g: [] }; }
  if (kind === "worldle") { const pool = PAIS.filter(p => WORLD.c[mapNameOf(p)] && WORLD.c[mapNameOf(p)].length > 300); return { a: pool[ri(pool.length)].c, g: [] }; }
  if (kind === "travle") return { a: ri(GEO.pairs.length), g: [] };
  if (kind === "maptap") { const idx = new Set(); while (idx.size < 5) idx.add(ri(PLACES.length)); return { places: [...idx], res: [] }; }
  if (kind === "bee") return { a: ri(EN.bp.length), found: [] };
  return {};
}
function pzState(kind, step) {
  if (step && step.free) { if (!step.st) step.st = newPz(kind, String(Math.random())); return step.st; }
  const t = today();
  if (!state.pz || state.pz.date !== t) state.pz = { date: t };
  if (!state.pz[kind]) state.pz[kind] = newPz(kind, t + kind);
  return state.pz[kind];
}
function puzzleDone(kind, S, won, tries, max) {
  S.done = true; S.won = won;
  const s = state.pzs[kind] || (state.pzs[kind] = { played: 0, won: 0, streak: 0, dist: [] });
  s.played++; if (won) { s.won++; s.streak++; } else s.streak = 0;
  const coins = won ? 20 + Math.max(0, max - tries) * 5 : 5, xp = P.kind === "practice" ? (won ? 20 : 5) : won ? 30 + Math.max(0, max - tries) * 5 : 10;
  if (P.kind === "practice") state.xp += xp;
  addCoins(coins);
  P.results.push({ t: "puzzle", kind, won, xp: P.kind === "practice" ? 0 : xp, coins }); P.idx++; if (P.kind === "practice") bumpMax(); save();
  return { coins, xp };
}
function pzResult(kind, won, title, big, sub, extra, rw) {
  return `<div class="play">${shead()}<section class="card scorebig" style="margin-top:14px"><div class="eyebrow ${won ? "g" : ""}">${won ? "Solved" : "The answer"}</div><div style="margin:14px 0 6px;display:flex;justify-content:center">${big}</div><h2 class="h" style="font-weight:800;font-size:28px">${esc(title)}</h2><p class="muted" style="color:var(--ink2)">${esc(sub)}</p></section>${extra || ""}
  <div class="pills2"><span class="chip o">${ic("zap")}+${rw.xp} XP</span><span class="chip y">${ic("sun")}+${rw.coins} coins</span>${state.pzs[kind] ? `<span class="chip m">${ic("flame")}Win streak ${state.pzs[kind].streak}</span>` : ""}</div>
  ${P.kind === "practice" && P.steps.length === 1 ? `<button class="btn ghost" data-s="again">${ic("sparkle")}Play another</button>` : ""}${nextBtn()}</div>`;
}
document.addEventListener("click", e => { if (view === "session" && e.target.closest('[data-s="again"]') && P) { const k = P.steps[0].kind; const label = P.label; exitSession(); openPractice({ t: "puzzle", kind: k, free: true }, label); } });

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
  let cur = "", busy = false, giveArmed = false;
  const rank = { x: 1, y: 2, g: 3 };
  const keyState = () => { const k = {}; S.g.forEach(g => scoreGuess(g, ans).forEach((r, i) => { const c = g[i]; if (!k[c] || rank[r] > rank[k[c]]) k[c] = r; })); return k; };
  const draw = (revRow = -1) => {
    const rows = []; for (let r = 0; r < 6; r++) {
      const g = S.g[r], sc = g ? scoreGuess(g, ans) : null, isCur = r === S.g.length;
      rows.push(`<div class="brow" ${isCur ? 'id="currow"' : ""}>${[0, 1, 2, 3, 4].map(i => { const ch = g ? g[i] : isCur ? (cur[i] || "") : ""; const cls = g ? sc[i] + (r === revRow ? " rev" : "") : isCur && cur[i] ? "f" : ""; return `<span class="tile ${cls}" style="${r === revRow ? `animation-delay:${i * 90}ms` : ""}">${esc(ch || "")}</span>`; }).join("")}</div>`);
    }
    const ks = keyState(), K = es ? ["QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM"] : ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    const kb = `<div class="kb"><div>${[...K[0]].map(c => `<button class="key ${ks[c] || ""}" data-k="${c}">${c}</button>`).join("")}</div><div>${[...K[1]].map(c => `<button class="key ${ks[c] || ""}" data-k="${c}">${c}</button>`).join("")}</div><div><button class="key wide enter" data-k="ENTER">Enter</button>${[...K[2]].map(c => `<button class="key ${ks[c] || ""}" data-k="${c}">${c}</button>`).join("")}<button class="key wide" data-k="DEL" aria-label="Delete">${ic("del")}</button></div></div>`;
    const hintRow = S.rev.length ? `<p class="muted" style="text-align:center;margin-top:8px;color:var(--ink2)">Hints: ${S.rev.map(i => `letter ${i + 1} is <b>${ans[i]}</b>`).join(", ")}</p>` : "";
    app.innerHTML = `<div class="play">${shead()}<section class="card" style="margin-top:8px;padding:14px 16px"><span class="chip v">${ic(es ? "word" : "grid")}${es ? "Palabra · Spanish" : "Wordle · English"}${step.free ? " · free play" : " · daily"}</span>
      <div class="pzhead" style="margin-top:10px"><div><b>Attempt ${Math.min(S.g.length + 1, 6)} of 6</b><div class="adots">${[0, 1, 2, 3, 4, 5].map(i => `<i class="${i < S.g.length ? "u" : i === S.g.length ? "c" : ""}"></i>`).join("")}</div></div>
      <span class="pzbtns"><button class="hintbtn" id="hint" ${state.hints > 0 && S.rev.length < 2 ? "" : "disabled"}>${ic("bulb")}${state.hints}</button><button class="giveup" id="giveup">${giveArmed ? "Tap again" : "Give up"}</button></span></div></section>
      <div class="board">${rows.join("")}</div>${hintRow}<div class="legend3"><span><i style="background:#2BC99A"></i>Right spot</span><span><i style="background:#FD6A49"></i>In word</span><span><i style="background:var(--ink3)"></i>Not in it</span></div>${kb}</div>`;
    $("#giveup").onclick = () => { if (!giveArmed) { giveArmed = true; draw(); setTimeout(() => { if (giveArmed && !S.done) { giveArmed = false; if ($("#giveup")) $("#giveup").textContent = "Give up"; } }, 3000); return; } giveArmed = false; end(false, true); };
    $("#hint").onclick = () => { if (state.hints <= 0 || S.rev.length >= 2) return; const known = new Set(); S.g.forEach(g => scoreGuess(g, ans).forEach((r, i) => r === "g" && known.add(i))); const opts = [0, 1, 2, 3, 4].filter(i => !known.has(i) && !S.rev.includes(i)); if (!opts.length) { toast("You've already found every letter's spot"); return; } state.hints--; S.rev.push(pick(opts)); save(); draw(); };
  };
  const valid = w => es ? VALID.has(w) : EN.v5.has(w.toLowerCase());
  const press = k => {
    if (busy || S.done) return;
    if (k === "DEL") { cur = cur.slice(0, -1); draw(); return; }
    if (k === "ENTER") {
      if (cur.length < 5) { shake("Five letters needed"); return; }
      if (!valid(cur)) { shake("Not in the word list"); return; }
      S.g.push(cur); cur = ""; save(); const row = S.g.length - 1; busy = true; draw(row); tone(S.g[row] === ans); buzz(S.g[row] === ans);
      setTimeout(() => { busy = false; if (S.g[row] === ans || S.g.length >= 6) end(S.g[row] === ans); }, 700);
      return;
    }
    if (cur.length < 5) { cur += k; draw(); }
  };
  const shake = msg => { const r = $("#currow"); if (r) { r.classList.remove("shake"); void r.offsetWidth; r.classList.add("shake"); } toast(msg); buzz(false); };
  const h = e => { const b = e.target.closest(".key"); if (!b || view !== "session") return; press(b.dataset.k); };
  app.addEventListener("click", h);
  currentAbort = () => app.removeEventListener("click", h);
  const end = (won, gaveUp) => {
    app.removeEventListener("click", h); currentAbort = null;
    const rw = puzzleDone(kind, S, won, S.g.length, 6);
    const tiles = `<div class="brow" style="width:min(100%,300px)">${[...ans].map(c => `<span class="tile g">${c}</span>`).join("")}</div>`;
    const sub = `${es ? A[2] : ""}${won ? `${es ? ", s" : "S"}olved in ${S.g.length} ${S.g.length === 1 ? "try" : "tries"}` : gaveUp ? `${es ? ". " : ""}You gave up, but now you know it` : ""}`;
    app.innerHTML = pzResult(kind, won, es ? A[1] : ans, tiles, sub, es ? `<div class="dyk cortex"><i><img src="${IMG.t_spanish}" alt=""></i><p><b>Palabra.</b> ${esc(A[1])} means "${esc(A[2])}".</p></div>` : "", rw);
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
function heat(d) { return d < 500 ? ["Burning hot", "#E4412B"] : d < 1500 ? ["Hot", "#F39B2E"] : d < 3000 ? ["Warm", "#D9A226"] : d < 6000 ? ["Cool", "#2FB896"] : ["Cold", "#3D8FE0"]; }
function worldSVG({ fills = {}, extra = "", vb = "0 8 1000 380", cls = "" } = {}) {
  let land = "", hi = "";
  for (const [n, d] of Object.entries(WORLD.c)) { if (fills[n]) hi += `<path d="${d}" style="fill:${fills[n]}" class="hl"/>`; else land += d; }
  return `<svg class="wmap ${cls}" viewBox="${vb}" role="img" aria-label="World map"><path d="${land}" class="land"/>${hi}${extra}</svg>`;
}
let pickRegion = "all", pickSel = null;
function pickerHTML(exclude, list = PAIS) {
  const chips = REGION_CHIPS.map(([k, n]) => `<button data-r="${k}" aria-pressed="${pickRegion === k}">${n}</button>`).join("");
  const items = list.filter(x => list !== PAIS || pickRegion === "all" || x.r === pickRegion).sort((a, b) => a.n.localeCompare(b.n)).map(x => `<button class="cbtn" data-c="${x.c}" aria-pressed="${pickSel === x.c}" ${exclude.includes(x.c) ? "disabled" : ""}><span class="f">${x.c.length === 2 ? flagOf(x.c) : ""}</span>${esc(x.n)}</button>`).join("");
  const sel = pickSel ? list.find(x => x.c === pickSel) : null;
  return `<section class="card" style="margin-top:14px;padding:14px"><b class="h" style="font-size:18px;font-weight:700">Pick your guess</b>
    ${list === PAIS ? `<div class="filters" style="margin:10px -14px 0;padding:2px 14px 6px" id="rch">${chips}</div>` : ""}<div class="cgrid" id="cgrid">${items}</div></section>
    ${sel ? `<div class="selbar">${sel.c.length === 2 ? `<span class="f">${flagOf(sel.c)}</span>` : ""}<div><small>Selected</small><b>${esc(sel.n)}</b></div></div>` : ""}
    <button class="btn" id="submit" ${sel ? "" : "disabled"}>Submit guess${ic("target")}</button>`;
}
function bindPicker(redraw, onSubmit) {
  const r = $("#rch"); if (r) r.onclick = e => { const b = e.target.closest("[data-r]"); if (!b) return; pickRegion = b.dataset.r; const y = scrollY; redraw(); scrollTo(0, y); };
  $("#cgrid").onclick = e => { const b = e.target.closest("[data-c]"); if (!b || b.disabled) return; pickSel = b.dataset.c; const y = scrollY; redraw(); scrollTo(0, y); };
  $("#submit").onclick = () => { if (!pickSel) return; const c = pickSel; pickSel = null; onSubmit(c); };
}

/* ---------- Globle ---------- */
function runPais(step) {
  const S = pzState("pais", step), T = PAIS.find(c => c.c === S.a), MAX = 8;
  if (S.done) { P.idx++; save(); return stepIntro(); }
  currentAbort = () => {}; pickSel = null;
  const draw = () => {
    const G = S.g.map(c => { const C = PAIS.find(x => x.c === c); const g = geo(C, T); return { C, d: g.d, brg: g.brg }; });
    const fills = {}; G.forEach(g => fills[mapNameOf(g.C)] = heat(g.d)[1]);
    const last = G[G.length - 1];
    const hints = []; if (S.g.length >= 3) hints.push(`It's in ${REGIONS[T.r]}`); if (S.g.length >= 5) hints.push(`It starts with ${T.n[0]}`);
    const logs = G.slice().sort((a, b) => a.d - b.d).map(g => `<div class="gl" style="--hc:${heat(g.d)[1]}"><div class="f">${flagOf(g.C.c)}</div><b>${esc(g.C.n)}</b><small>${fmt(g.d)} km <span class="ar" style="transform:rotate(${Math.round(g.brg)}deg)">↑</span></small></div>`).join("");
    app.innerHTML = `<div class="play">${shead()}<section class="pzcard"><div class="row2"><span class="chip o">${ic("globe")}Globle${step.free ? " · free play" : " · daily"}</span><span class="eyebrow">${S.g.length}/${MAX} guesses</span></div><h2>Find the mystery country</h2>${hints.length ? `<p class="muted" style="margin-top:6px;color:var(--ink2)">${esc(hints.join(". "))}.</p>` : ""}</section>
      <section class="radarbox">${last ? `<div class="latest">${flagOf(last.C.c)} ${esc(last.C.n)}<span class="heat" style="color:${heat(last.d)[1]}">${fmt(last.d)} km, ${heat(last.d)[0]}</span></div>` : `<div class="latest">${ic("target")}Guess any country to start</div>`}
      <div class="mapscroll">${worldSVG({ fills })}</div><div class="heatscale"></div><div class="heatlbl"><span>Hot</span><span>Warm</span><span>Cold</span></div></section>
      ${logs ? `<div class="glog">${logs}</div>` : ""}${pickerHTML(S.g)}</div>`;
    bindPicker(draw, c => { S.g.push(c); const won = c === S.a; save(); tone(won); buzz(won); if (won || S.g.length >= MAX) return end(won); const y = scrollY; draw(); scrollTo(0, Math.min(y, 200)); });
  };
  const end = won => {
    currentAbort = null; const rw = puzzleDone("pais", S, won, S.g.length, MAX);
    app.innerHTML = pzResult("pais", won, T.n, `<span style="font-size:84px;line-height:1">${flagOf(T.c)}</span>`, won ? `Found in ${S.g.length} ${S.g.length === 1 ? "guess" : "guesses"}` : "Better luck next time", `<section class="card">${worldSVG({ fills: { [mapNameOf(T)]: "var(--s)" } })}</section>`, rw);
    if (won) setTimeout(() => burst(innerWidth / 2, 180, 28), 100);
  };
  draw();
}

/* ---------- Worldle ---------- */
function runWorldle(step) {
  const S = pzState("worldle", step), T = PAIS.find(c => c.c === S.a), MAX = 6;
  if (S.done) { P.idx++; save(); return stepIntro(); }
  currentAbort = () => {}; pickSel = null;
  const draw = () => {
    const rows = S.g.map(c => { const C = PAIS.find(x => x.c === c), g = geo(C, T), pr = Math.max(0, Math.round(100 - g.d / 200)); return `<div class="wrow"><span class="f">${flagOf(c)}</span><b>${esc(C.n)}</b><span>${fmt(g.d)} km</span><span class="ar" style="transform:rotate(${Math.round(g.brg)}deg)">${c === S.a ? "🎯" : "↑"}</span><span class="pr">${c === S.a ? 100 : pr}%</span></div>`; }).join("");
    app.innerHTML = `<div class="play">${shead()}<section class="pzcard"><div class="row2"><span class="chip y">${ic("target")}Worldle${step.free ? " · free play" : " · daily"}</span><span class="eyebrow">${S.g.length}/${MAX} guesses</span></div><h2>Which country is this?</h2></section>
      <section class="card silcard"><svg id="sil" viewBox="0 0 1000 400"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--p2)"/><stop offset="1" stop-color="var(--s)"/></linearGradient></defs><path d="${WORLD.c[mapNameOf(T)]}" fill="url(#sg)"/></svg></section>
      ${rows ? `<div class="wrows">${rows}</div>` : ""}${pickerHTML(S.g)}</div>`;
    const sil = $("#sil"); requestAnimationFrame(() => { try { const b = sil.querySelector("path").getBBox(), pad = Math.max(b.width, b.height) * 0.12; sil.setAttribute("viewBox", `${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`); } catch (e) {} });
    bindPicker(draw, c => { S.g.push(c); const won = c === S.a; save(); tone(won); buzz(won); if (won || S.g.length >= MAX) return end(won); draw(); });
  };
  const end = won => {
    currentAbort = null; const rw = puzzleDone("worldle", S, won, S.g.length, MAX);
    app.innerHTML = pzResult("worldle", won, T.n, `<span style="font-size:84px;line-height:1">${flagOf(T.c)}</span>`, won ? `Got it in ${S.g.length}` : "Now you'll know its shape", "", rw);
    if (won) setTimeout(() => burst(innerWidth / 2, 180, 28), 100);
  };
  draw();
}

/* ---------- Travle ---------- */
function bfsGeo(a) { const d = { [a]: 0 }, q = [a]; while (q.length) { const u = q.shift(); for (const v of GEO.adj[u]) if (d[v] === undefined) { d[v] = d[u] + 1; q.push(v); } } return d; }
function runTravle(step) {
  const S = pzState("travle", step), [A, B] = GEO.pairs[S.a], dA = bfsGeo(A), dB = bfsGeo(B), D = dA[B], MAX = (D - 1) + 4;
  if (S.done) { P.idx++; save(); return stepIntro(); }
  currentAbort = () => {}; pickSel = null;
  const nm = i => GEO.names[i] === "United States of America" ? "United States" : GEO.names[i];
  const cands = Object.keys(dA).map(Number).filter(i => i !== A && i !== B && dA[i] <= D && dB[i] !== undefined && dB[i] <= D).map(i => ({ c: "g" + i, n: nm(i), i }));
  const status = i => dA[i] + dB[i] === D ? "on" : dA[i] + dB[i] === D + 1 ? "near" : "off";
  const connected = () => { const set = new Set(S.g.concat([B])), seen = new Set([A]), q = [A]; while (q.length) { const u = q.shift(); if (u === B) return true; for (const v of GEO.adj[u]) if (set.has(v) && !seen.has(v)) { seen.add(v); q.push(v); } } return false; };
  const colors = { on: "#2BC99A", near: "#F5B83D", off: "#FF5C7A" };
  const draw = () => {
    const fills = { [GEO.names[A]]: "var(--p)", [GEO.names[B]]: "var(--p)" }; S.g.forEach(i => fills[GEO.names[i]] = colors[status(i)]);
    const ids = [A, B].concat(cands.filter(c => dA[c.i] + dB[c.i] <= D + 1).map(c => c.i), S.g), pts = ids.map(i => proj(GEO.cent[i][0], GEO.cent[i][1]));
    let x0 = Math.min(...pts.map(p => p[0])) - 40, x1 = Math.max(...pts.map(p => p[0])) + 40, y0 = Math.min(...pts.map(p => p[1])) - 40, y1 = Math.max(...pts.map(p => p[1])) + 40;
    let w = x1 - x0, h = y1 - y0; if (w / h < 1.4) { const nw = h * 1.4; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / 1.4; y0 -= (nh - h) / 2; h = nh; }
    const chips = S.g.map(i => `<span class="tchip" style="--hc:${colors[status(i)]}">${esc(nm(i))}</span>`).join("");
    app.innerHTML = `<div class="play">${shead()}<section class="pzcard"><div class="row2"><span class="chip v">${ic("compass")}Travle${step.free ? " · free play" : " · daily"}</span><span class="eyebrow">${S.g.length}/${MAX} guesses</span></div><h2>${esc(nm(A))} → ${esc(nm(B))}</h2><p class="muted" style="color:var(--ink2);margin-top:4px">Shortest route crosses ${D - 1} countr${D - 1 === 1 ? "y" : "ies"} in between.</p></section>
      <section class="card mapcard">${worldSVG({ fills, vb: `${x0.toFixed(0)} ${y0.toFixed(0)} ${w.toFixed(0)} ${h.toFixed(0)}` })}</section>
      ${chips ? `<div class="tchips">${chips}</div><div class="legend3"><span><i style="background:#2BC99A"></i>On a shortest route</span><span><i style="background:#F5B83D"></i>Close</span><span><i style="background:#FF5C7A"></i>Off track</span></div>` : ""}
      ${pickerHTML(S.g.map(i => "g" + i), cands)}</div>`;
    bindPicker(draw, c => { const i = +c.slice(1); S.g.push(i); save(); const won = connected(); tone(status(i) === "on"); buzz(status(i) === "on"); if (won || S.g.length >= MAX) return end(won); draw(); });
  };
  const end = won => {
    currentAbort = null; const rw = puzzleDone("travle", S, won, S.g.length, MAX);
    const path = [A]; let u = A; while (u !== B) { u = GEO.adj[u].find(v => dB[v] === dB[u] - 1); path.push(u); }
    app.innerHTML = pzResult("travle", won, `${nm(A)} → ${nm(B)}`, `<span style="font-size:56px;line-height:1">🧭</span>`, `${won ? `Linked in ${S.g.length} guesses. ` : ""}One shortest route: ${path.map(nm).join(" → ")}`, "", rw);
    if (won) setTimeout(() => burst(innerWidth / 2, 180, 28), 100);
  };
  draw();
}

/* ---------- MapTap ---------- */
function runMaptap(step) {
  const S = pzState("maptap", step);
  if (S.done) { P.idx++; save(); return stepIntro(); }
  currentAbort = () => {}; let tapped = null;
  const ptsFor = d => Math.round(100 * Math.exp(-d / 1200));
  const draw = () => {
    const i = S.res.length, pl = PLACES[S.places[i]], total = S.res.reduce((a, r) => a + r.p, 0);
    let extra = "";
    if (tapped) { const [tx, ty] = proj(tapped.lat, tapped.lon), [px, py] = proj(pl.lat, pl.lon); extra = `<line x1="${tx}" y1="${ty}" x2="${px}" y2="${py}" class="tline"/><circle cx="${tx}" cy="${ty}" r="5" class="tap"/><circle cx="${px}" cy="${py}" r="6" class="true"/>`; }
    const r = tapped ? S.res[S.res.length - 1] : null;
    app.innerHTML = `<div class="play">${shead()}<section class="pzcard"><div class="row2"><span class="chip o">${ic("mountain")}MapTap${step.free ? " · free play" : " · daily"}</span><span class="eyebrow">Round ${Math.min(i + (tapped ? 0 : 1), 5)} of 5 · ${total} pts</span></div><h2>Where is ${esc(pl.n)}?</h2><p class="muted" style="color:var(--ink2);margin-top:2px">${esc(pl.c)}</p></section>
      <section class="card mapcard"><div class="mapscroll big" id="msc">${worldSVG({ extra, cls: "tapmap" })}</div><p class="muted" style="text-align:center;margin-top:6px">Scroll sideways, then tap your guess</p></section>
      ${r ? `<section class="card acc"><span class="coin">${ic("target")}</span><div><div class="eyebrow m">${fmt(r.d)} km away</div><b>+${r.p} points</b></div></section><button class="btn green" id="mnext">${S.res.length >= 5 ? "See results" : "Next place"}${ic("arrow")}</button>` : ""}</div>`;
    const msc = $("#msc"); if (!tapped) msc.scrollLeft = (msc.scrollWidth - msc.clientWidth) * 0.45;
    else { const [px] = proj(pl.lat, pl.lon); msc.scrollLeft = px / 1000 * msc.scrollWidth - msc.clientWidth / 2; }
    const svg = $(".tapmap");
    if (!tapped) svg.addEventListener("click", e => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse()); tapped = { lat: 84 - p.y * 360 / 1000, lon: p.x * 360 / 1000 - 180 }; const d = geo(tapped, pl).d; S.res.push({ d, p: ptsFor(d) }); save(); tone(d < 800); buzz(d < 800); const y = scrollY; draw(); scrollTo(0, y); });
    const nb = $("#mnext"); if (nb) nb.onclick = () => { tapped = null; if (S.res.length >= 5) return end(); draw(); scrollTo(0, 0); };
  };
  const end = () => {
    currentAbort = null; const total = S.res.reduce((a, r) => a + r.p, 0), won = total >= 250;
    const rw = puzzleDone("maptap", S, won, won ? 1 : 3, 3);
    const rows = S.places.map((pi, j) => `<div class="wrow"><b>${esc(PLACES[pi].n)}</b><span>${fmt(S.res[j].d)} km</span><span class="pr">${S.res[j].p}</span></div>`).join("");
    app.innerHTML = pzResult("maptap", won, `${total} / 500`, `<span style="font-size:56px;line-height:1">📍</span>`, won ? "Sharp sense of place" : "Keep tapping, it gets easier", `<div class="wrows">${rows}</div>`, rw);
  };
  draw();
}

/* ---------- Spelling Bee ---------- */
function runBee(step) {
  const S = pzState("bee", step), [outer, center] = EN.bp[S.a], L = new Set((outer + center).split(""));
  if (S.done) { P.idx++; save(); return stepIntro(); }
  const answers = EN.bee.filter(w => w.length >= 4 && w.includes(center) && [...w].every(c => L.has(c)));
  const isPan = w => new Set(w).size === 7, pts = w => (w.length === 4 ? 1 : w.length) + (isPan(w) ? 7 : 0);
  const max = answers.reduce((a, w) => a + pts(w), 0);
  const RANKS = [[0, "Beginner"], [.05, "Good start"], [.15, "Solid"], [.25, "Nice"], [.4, "Great"], [.5, "Amazing"], [.7, "Genius"]];
  let ring = outer.split(""), cur = "";
  currentAbort = () => {};
  const draw = (msg = "") => {
    const score = S.found.reduce((a, w) => a + pts(w), 0), frac = score / max, rk = RANKS.filter(r => frac >= r[0]).pop()[1];
    const hex = (c, cls, i) => `<button class="hex ${cls}" data-l="${c}" style="--i:${i}">${c.toUpperCase()}</button>`;
    app.innerHTML = `<div class="play">${shead()}<section class="pzcard"><div class="row2"><span class="chip y">${ic("sparkle")}Spelling Bee${step.free ? " · free play" : " · daily"}</span><span class="eyebrow">${S.found.length} of ${answers.length} words</span></div>
      <div class="beerank"><b>${rk}</b><span>${score} pts</span></div><div class="gauge"><i style="width:${Math.min(100, frac / .7 * 100)}%"></i></div></section>
      <div class="beeword">${cur ? [...cur].map(c => `<span class="${c === center ? "c" : ""}">${c.toUpperCase()}</span>`).join("") : `<span class="ph">Tap letters</span>`}</div><div class="beemsg">${esc(msg)}</div>
      <div class="hive">${hex(center, "mid", 0)}${ring.map((c, i) => hex(c, "", i + 1)).join("")}</div>
      <div class="beebtns"><button class="btn ghost small" id="bdel">Delete</button><button class="btn ghost small" id="bshuf" aria-label="Shuffle">Shuffle</button><button class="btn small" id="bent">Enter</button></div>
      <section class="card"><div class="eyebrow m">Found</div><div class="found">${S.found.slice().sort().map(w => `<span class="${isPan(w) ? "pan" : ""}">${w}</span>`).join("") || `<span class="muted">Nothing yet</span>`}</div></section>
      <button class="btn green" id="bfin">${ic("check")}Finish</button></div>`;
    $(".hive").onclick = e => { const b = e.target.closest(".hex"); if (!b) return; cur += b.dataset.l; draw(); };
    $("#bdel").onclick = () => { cur = cur.slice(0, -1); draw(); };
    $("#bshuf").onclick = () => { ring = shuffle(ring); draw(); };
    $("#bent").onclick = () => {
      const w = cur; cur = "";
      if (w.length < 4) return draw("Too short"), buzz(false);
      if (!w.includes(center)) return draw("Missing the centre letter"), buzz(false);
      if (S.found.includes(w)) return draw("Already found"), buzz(false);
      if (!answers.includes(w)) return draw("Not in the word list"), buzz(false);
      S.found.push(w); save(); tone(true); buzz(true); draw(isPan(w) ? "Pangram! +" + pts(w) : `+${pts(w)}`); if (isPan(w)) burst(innerWidth / 2, 300, 20);
    };
    $("#bfin").onclick = () => end();
  };
  const end = () => {
    currentAbort = null; const score = S.found.reduce((a, w) => a + pts(w), 0), won = score / max >= .25;
    const rw = puzzleDone("bee", S, won, won ? 1 : 3, 3);
    const missed = answers.filter(w => !S.found.includes(w)), pans = answers.filter(isPan);
    app.innerHTML = pzResult("bee", won, `${score} points`, `<span style="font-size:56px;line-height:1">🐝</span>`, `${S.found.length} of ${answers.length} words. Pangram${pans.length > 1 ? "s" : ""}: ${pans.join(", ")}`, `<section class="card"><div class="eyebrow m">Words you missed</div><div class="found">${missed.slice(0, 40).map(w => `<span class="${isPan(w) ? "pan" : ""}">${w}</span>`).join("")}</div></section>`, rw);
  };
  draw();
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
  let raf = 0, cdT = [];
  currentAbort = () => { r.ended = true; cancelAnimationFrame(raf); cdT.forEach(clearTimeout); if (r.cleanup) r.cleanup(); $(".count") && $(".count").remove(); };
  const cd = document.createElement("div"); cd.className = "count"; document.body.appendChild(cd);
  [3, 2, 1].forEach((n, i) => cdT.push(setTimeout(() => { cd.innerHTML = `<span>${n}</span>`; }, i * 520)));
  cdT.push(setTimeout(() => { cd.remove(); r.tEnd = performance.now() + dur; tick(); next(); }, 1560));
  function tick() { if (r.ended) return; const left = r.tEnd - performance.now(); clk.style.width = `${clamp(left / dur, 0, 1) * 100}%`; const sl = Math.max(0, Math.ceil(left / 1000)); secsEl.textContent = `${Math.floor(sl / 60)}:${String(sl % 60).padStart(2, "0")}`; if (left <= 0) { finish(); return; } raf = requestAnimationFrame(tick); }
  function next() {
    if (r.ended) return; if (performance.now() >= r.tEnd || !deck.length) { finish(); return; }
    const it = deck[di++ % deck.length];
    const wrong = (it.w || []).filter(w => w && w !== it.a)[0] || (deck.find(x => x.a !== it.a) || {}).a || "None of these";
    const { options, correct } = withOptions(it.a, [wrong]);
    stage.classList.remove("ok", "bad");
    const top = `<div class="kcardw"><div class="kcard">${it.place ? `<div class="eyebrow m" style="margin-bottom:4px">${esc(it.place)}${it.seen ? "" : " · new"}</div>` : ""}<div class="prompt mid ${it.q.length > 60 ? "small" : ""}">${esc(it.q)}</div></div></div>`;
    r.cleanup = choice(stage, { top, options, correct, cls: "one" }, ok => {
      if (r.ended) return; r.n++; tone(ok); buzz(ok); stage.classList.add(ok ? "ok" : "bad");
      if (!it.seen) { grade(it.kind, it.id, ok); it.seen = true; }
      if (ok) { r.right++; r.combo++; r.maxCombo = Math.max(r.maxCombo, r.combo); const m = r.combo >= 10 ? 2 : r.combo >= 5 ? 1.5 : 1; r.score += Math.round(10 * m); scoreEl.textContent = fmt(r.score);
        if (r.combo >= 3) { comboEl.classList.remove("off"); comboEl.innerHTML = `x${m} ${ic("flame")}`; } }
      else { r.combo = 0; comboEl.classList.add("off"); }
      setTimeout(next, ok ? 300 : 1300);
    });
  }
  function finish() {
    if (r.ended) return; r.ended = true; cancelAnimationFrame(raf); if (r.cleanup) r.cleanup(); currentAbort = null;
    const prev = state.rushBest || 0; state.rushBest = Math.max(prev, r.score);
    const coins = Math.min(25, 5 + r.right), xp = P.kind === "practice" ? 0 : 20 + r.right;
    addCoins(coins); P.results.push({ t: "puzzle", kind: "rush", xp, coins }); P.idx++; save();
    const acc = r.n ? r.right / r.n : 0, stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc >= 0.4 ? 1 : 0;
    app.innerHTML = `<div class="play">${shead()}<section class="card scorebig" style="margin-top:14px"><div class="eyebrow m">Rapid recall</div><b>${fmt(r.score)} <small>pts</small></b>${r.score > prev && prev ? `<div class="near">${ic("trophy")}New best!</div>` : prev ? `<div class="near">${ic("flame")}Your best is ${fmt(state.rushBest)}</div>` : ""}</section>
    <section class="card acc"><span class="coin">${ic("check")}</span><div><div class="eyebrow m">Correct</div><b>${r.right} of ${r.n}</b></div><span class="stars">${[0, 1, 2].map(k => ic("star", k < stars ? "on" : "")).join("")}</span></section>
    <div class="pills2">${xp ? `<span class="chip o">${ic("zap")}+${xp} XP</span>` : ""}<span class="chip y">${ic("sun")}+${coins} coins</span><span class="chip v">${ic("flame")}Best combo x${r.maxCombo}</span></div>${P.kind === "practice" && P.steps.length === 1 ? `<button class="btn ghost" data-s="again">${ic("sparkle")}Play again</button>` : ""}${nextBtn()}</div>`;
    if (r.score > prev && prev) setTimeout(() => burst(innerWidth / 2, 180, 24), 100);
  }
}
