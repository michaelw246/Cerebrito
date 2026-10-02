/* ================= sessions ================= */
let P = null; // active plan (daily plan lives in state.plan; practice plans are temporary)
function openSession(kind) {
  const t = today();
  if (state.lastDone === t) return;
  if (!state.plan || state.plan.date !== t || (kind === "checkup" && state.plan.kind !== "checkup" && state.plan.idx === 0)) { state.plan = buildPlan(kind); tidyPlan(state.plan); }
  P = state.plan; save(); enterSession(); stepIntro();
}
let returnTo = "map";
function openPractice(step, label, kind) { P = { kind: kind || "practice", label, lv0: levelInfo(state.xp).lvl, date: today(), idx: 0, results: [], steps: [step] }; enterSession(); stepIntro(); }
function openExtra() {
  const rank = SKILLS.slice().sort((a, b) => (state.skills[a].hist.length - state.skills[b].hist.length) || ((state.skills[a].lvl || 0) - (state.skills[b].lvl || 0)));
  const games = shuffle(rank.slice(0, 4)).slice(0, 2).map(e => ({ t: "game", eng: e, variant: pick(ENGINES[e].train), mode: "train" }));
  const ks = knowSteps(4, 5, 8, 8), es = ks.find(k => k.kind === "es"), trs = ks.find(k => k.kind === "tr");
  const seenN = Object.keys(state.srs.tr).length + Object.keys(state.srs.es).length;
  const pk = pick(["palabra", "wordle", "pais", "worldle", "travle", "maptap", "hunt", "pairs", seenN >= 10 ? "rush" : "bee"]);
  P = { kind: "extra", label: "Bonus session", lv0: levelInfo(state.xp).lvl, date: today(), idx: 0, results: [], steps: [games[0], es, games[1], trs, { t: "puzzle", kind: pk, free: true }].filter(Boolean) };
  enterSession(); stepIntro();
}
function enterSession() { if (view !== "session") returnTo = view; view = "session"; tabs.classList.add("hidden"); }
function exitSession() { if (currentAbort) { currentAbort(); currentAbort = null; } P = null; view = returnTo || "map"; render(); }
let lastTitle = "Today's session";
function sessTitle() { if (!P) return lastTitle; return lastTitle = P.kind === "calib" ? "Calibration" : P.kind === "checkup" ? "Check-up" : P.kind === "practice" || P.kind === "extra" ? P.label : "Today's session"; }
function shead() {
  return `<div class="shead"><button class="xbtn" data-s="exit" aria-label="Leave session">${ic("back")}</button><div class="ttl"><i>${ic("compass")}</i><span>${esc(sessTitle())}</span></div><span class="pod co">${ic("sun")}${fmt(state.coins)}</span><span class="ava" style="background-image:url(${IMG.avatar})"></span></div>`;
}
function stepsBar() {
  if (P.steps.length < 2) return "";
  const n = P.steps.map((s, i) => `${i ? `<span class="bar ${i <= P.idx ? "d" : ""}"></span>` : ""}<span class="n ${i < P.idx ? "d" : i === P.idx ? "c" : ""}">${ic(i < P.idx ? "check" : i === P.idx ? stepIcon(s) : "lock")}</span>`).join("");
  return `<div class="steps"><span class="lbl">Step ${Math.min(P.idx + 1, P.steps.length)} of ${P.steps.length}</span><span class="track">${n}</span></div>`;
}
const stepIcon = s => s.t === "game" ? "zap" : s.t === "know" ? (s.kind === "es" ? "cards" : "globe") : (PZK[s.kind] || {}).icon || "target";
document.addEventListener("click", e => {
  if (view !== "session") return; const b = e.target.closest("[data-s]"); if (!b) return; const a = b.dataset.s;
  if (a === "exit") exitSession(); else if (a === "start") beginStep(); else if (a === "next") stepIntro(); else if (a === "finish") finishSession();
});
const curStop = () => stopFor(levelInfo(state.xp).lvl);
/* a knowledge-bank fact as prose: the question, then the answer in bold (plus its explanation if it has one) */
const factHTML = f => `${esc(f.q)} <b class="fa">${esc(f.a)}.</b>${f.why ? ` ${esc(f.why)}` : ""}`;
function stopFact() { const r = ROUTE[curIdx()], f = countryFacts(r.c, 1)[0], mine = (MYSTOPS[r.c] || []).filter(n => STOP_INFO[n]); const html = f ? factHTML(f) : mine.length ? esc(STOP_INFO[pick(mine)].fact) : ""; return html ? `<div class="dyk"><i>${ic("globe")}</i><p><b>${flagOf(r.c)} ${esc(r.name)}.</b> ${html}</p></div>` : ""; }

function stepIntro() {
  if (P.idx >= P.steps.length) return finishSession();
  const s = P.steps[P.idx], st = curStop();
  let t1, t2, how, chips, duo, icon = stepIcon(s);
  if (s.t === "game") {
    const v = ENGINES[s.eng].variants[s.variant], sk = state.skills[s.eng], pl = PILLARS[s.eng];
    const secs = s.mode === "recheck" ? 45 : s.mode === "train" || s.mode === "practice" ? 60 : 75;
    t1 = pl.name; t2 = v.name;
    how = v.how + (s.mode === "train" ? " It adapts as you go, so aim for accuracy first." : s.mode === "practice" ? " Practice only, your level won't change." : s.mode === "recheck" ? " A quick recheck to confirm your day 1 score." : " Starts easy and gets harder until it finds your level.");
    chips = `<span class="chip m">${ic("clock")}${secs} sec</span><span class="chip y">${ic("brain")}${pl.es}</span>`;
    duo = `<div><i>${ic("zap")}</i><span><small>Your level</small><b>${sk.lvl ? sk.lvl.toFixed(1) : "New"}</b></span></div><div><i class="g">${ic("star")}</i><span><small>Best score</small><b class="g">${sk.best ? fmt(sk.best) : "None yet"}</b></span></div>`;
  } else if (s.t === "know") {
    const srs = state.srs[s.kind], nNew = s.ids.filter(id => !srs[id]).length, nRev = s.ids.length - nNew;
    t1 = s.kind === "es" ? "Palabras" : P.kind === "practice" && P.label !== "Knowledge" ? P.label : "World"; t2 = s.kind === "es" ? "del día" : "knowledge";
    how = (s.kind === "es" ? "New words start as multiple choice. Words you know come back as recall: say it in your head, reveal, and rate yourself honestly." : `A mix from ${[...new Set(s.ids.map(id => (content.tr.find(x => x.id === id) || {}).cat).filter(Boolean))].join(", ") || "your categories"}. Familiar cards switch to recall: think of the answer before you reveal it.`) + " Anything you miss comes back at the end of the round.";
    chips = `<span class="chip m">${ic("cards")}${s.ids.length} cards</span><span class="chip y">${ic(s.kind === "es" ? "word" : "globe")}${s.kind === "es" ? "Vocabulario" : "Cultura"}</span>`;
    duo = `<div><i>${ic("clock")}</i><span><small>To review</small><b>${nRev}</b></span></div><div><i class="g">${ic("sparkle")}</i><span><small>New today</small><b class="g">${nNew}</b></span></div>`;
  } else {
    const pzd = PZK[s.kind] || PZK.pais, ps = state.pzs[s.kind];
    t1 = pzd.name; t2 = s.kind === "rush" ? "60 seconds" : s.free ? "free play" : "daily";
    how = PZ_HOW[s.kind] + (s.kind === "rush" && s.cat ? ` Questions from ${s.cat}.` : "");
    chips = `<span class="chip m">${ic("clock")}${s.kind === "rush" ? "60 sec" : s.kind === "hunt" ? "~30 sec" : s.kind === "pairs" ? "~1–2 min" : "~2–4 min"}</span><span class="chip y">${ic(pzd.icon)}Puzzle</span>`;
    duo = s.kind === "rush" ? `<div><i>${ic("trophy")}</i><span><small>Best score</small><b>${state.rushBest ? fmt(state.rushBest) : "None yet"}</b></span></div><div><i class="g">${ic("check")}</i><span><small>Locked in</small><b class="g">${knowStats("es").mastered + knowStats("tr").mastered}</b></span></div>`
      : `<div><i>${ic("trophy")}</i><span><small>Solved</small><b>${ps ? `${ps.won} / ${ps.played}` : "0 / 0"}</b></span></div><div><i class="g">${ic("flame")}</i><span><small>Win streak</small><b class="g">${ps ? ps.streak : 0}</b></span></div>`;
  }
  const himg = s.t === "game" ? IMG[PILLARS[s.eng].img] : s.t === "know" ? IMG[KNOW[s.kind].img] : s.kind === "rush" ? IMG.t_travel : null;
  const pzArt = () => s.kind === "hunt" ? `<div class="art huntart">${shuffle([...Array(16).keys()].map(n => n + 1)).map(n => `<span class="${n <= 3 ? "hit" : ""}">${n}</span>`).join("")}</div>`
    : s.kind === "pairs" ? `<div class="art pairart">${[["hola", "es"], ["hello", "en"], ["?"], ["?"], ["gracias", "es"], ["?"]].map(([w, c]) => `<span class="${c || ""}">${w === "?" ? ic("sparkle") : w}</span>`).join("")}</div>`
    : (s.kind === "palabra" || s.kind === "wordle" || s.kind === "bee") ? `<div class="art" style="background:linear-gradient(160deg,var(--pl),var(--tl))"><div style="display:grid;grid-template-columns:repeat(5,44px);gap:6px">${[...(s.kind === "palabra" ? "PLAZA" : s.kind === "bee" ? "HONEY" : "WORLD")].map((c, i) => `<span class="tile ${["g", "y", "x", "g", "g"][i]}" style="width:44px;font-size:20px">${c}</span>`).join("")}</div></div>` : `<div class="art">${worldSVG({ fills: s.kind === "pais" ? { Brazil: "#F39B2E", Peru: "#E4412B", Canada: "#3D8FE0" } : {} })}</div>`;
  const top = himg ? `<div class="heroimg"><img src="${himg}" alt=""><span class="tl">${ic(icon)}${s.t === "game" ? esc(PILLARS[s.eng].es) : s.kind === "es" ? "Vocabulario" : s.kind === "rush" ? "Rápido" : "Recuerdos"}</span></div>`
    : `<div class="heroimg">${pzArt()}<span class="tl">${ic(icon)}${s.free ? "Free play" : "Daily puzzle"}</span></div>`;
  app.innerHTML = `<div class="play">${shead()}${stepsBar()}
  <section class="card intro">${top}<span class="tagline">${ic("globe")}Level ${levelInfo(state.xp).lvl} · ${flagOf(st.c)} ${esc(st.name)}</span>
    <div class="tr"><h1 class="${Math.max(t1.length, t2.length) > 8 ? "long" : ""}">${esc(t1)}<span>${esc(t2)}</span></h1></div>
    <div class="chiprow">${chips}</div><p class="how">${esc(how)}</p>
    <div class="duo">${duo}</div>
    <button class="btn" data-s="start" style="margin-top:20px">${ic("play")}Start</button>
    <p class="foot">${ic(s.t === "puzzle" && ["palabra", "wordle", "pais", "worldle", "travle", "bee"].includes(s.kind) ? "word" : "grid")}${s.t === "puzzle" && ["palabra", "wordle", "bee"].includes(s.kind) ? "Type or tap the letters" : s.t === "puzzle" && ["pais", "worldle", "travle"].includes(s.kind) ? "Type a country or tap the map" : "Tap only, no typing"}</p></section>${stopFact()}</div>`;
  window.scrollTo(0, 0);
}
function beginStep() { const s = P.steps[P.idx]; if (s.t === "game") runGame(s); else if (s.t === "know") runKnow(s); else ({ palabra: runWordle, wordle: runWordle, pais: runPais, worldle: runWorldle, travle: runTravle, maptap: runMaptap, bee: runBee, rush: runRush, hunt: runHunt, pairs: runPairs }[s.kind] || runPais)(s); }
function nextBtn(label) { const last = P.idx >= P.steps.length; return `<button class="btn green" data-s="${last ? "finish" : "next"}">${last ? (P.kind === "practice" || P.kind === "extra" ? "Collect & finish" : "Finish today's session") : label || "Next challenge"}${ic("play")}</button>`; }

/* ---------- brain game ---------- */
function runGame(step) {
  const eng = ENGINES[step.eng], v = eng.variants[step.variant], practice = step.mode === "practice";
  const assess = step.mode === "assess" || step.mode === "recheck";
  const dur = step.mode === "recheck" ? 45000 : assess ? 75000 : 60000;
  let d = assess ? 2 : clamp(Math.round(state.skills[step.eng].lvl || 2), 1, DMAX);
  const trial = v.make();
  app.innerHTML = `<div class="play">${shead()}<div class="hud"><div class="timer">${ic("clock")}<div class="gauge"><i id="clk"></i></div><b id="secs">${dur / 1000}</b></div><span class="combo off" id="combo">x1 combo</span></div>
  <div class="scorecard"><span class="coin img"><img src="${IMG[PILLARS[step.eng].img]}" alt=""></span><div><small>Score</small><b id="score">0</b></div><span class="chip v">${esc(v.name)}</span></div>
  <div class="stage" id="stage"></div></div>`;
  const stage = $("#stage"), clk = $("#clk"), scoreEl = $("#score"), secsEl = $("#secs"), comboEl = $("#combo");
  const r = { trials: [], score: 0, combo: 0, maxCombo: 0, up: 0, firstErr: !assess, cleanup: null, token: 0, ended: false, tEnd: 0 };
  let raf = 0, cdT = [];
  currentAbort = () => { r.ended = true; cancelAnimationFrame(raf); cdT.forEach(clearTimeout); if (r.cleanup) r.cleanup(); $(".count") && $(".count").remove(); };
  const cd = document.createElement("div"); cd.className = "count"; document.body.appendChild(cd);
  [3, 2, 1].forEach((n, i) => cdT.push(setTimeout(() => { cd.innerHTML = `<span>${n}</span>`; }, i * 520)));
  cdT.push(setTimeout(() => { cd.remove(); r.tEnd = performance.now() + dur; tick(); next(); }, 1560));
  function tick() { if (r.ended) return; const left = r.tEnd - performance.now(); clk.style.width = `${clamp(left / dur, 0, 1) * 100}%`; const sl = Math.max(0, Math.ceil(left / 1000)); secsEl.textContent = `${Math.floor(sl / 60)}:${String(sl % 60).padStart(2, "0")}`; if (left <= 0) { finish(); return; } raf = requestAnimationFrame(tick); }
  function next() {
    if (r.ended) return; if (performance.now() >= r.tEnd) { finish(); return; }
    const tok = ++r.token; stage.classList.remove("ok", "bad");
    r.cleanup = trial(d, stage, ok => { if (tok !== r.token || r.ended) return; r.token++; answer(ok); });
  }
  function answer(ok) {
    r.trials.push({ d, ok });
    stage.classList.add(ok ? "ok" : "bad"); tone(ok); buzz(ok);
    if (ok) {
      r.combo++; r.maxCombo = Math.max(r.maxCombo, r.combo);
      const mult = r.combo >= 10 ? 2 : r.combo >= 5 ? 1.5 : 1, pts = Math.round(10 * d * mult); r.score += pts; scoreEl.textContent = fmt(r.score);
      const f = document.createElement("span"); f.className = "float"; f.textContent = "+" + pts; stage.appendChild(f); setTimeout(() => f.remove(), 700);
      if (r.combo >= 3) { comboEl.classList.remove("off"); comboEl.innerHTML = `x${mult} combo ${ic("flame")}`; comboEl.classList.remove("pop"); void comboEl.offsetWidth; comboEl.classList.add("pop"); }
      if (r.combo % 5 === 0) { const rc = comboEl.getBoundingClientRect(); burst(rc.left + rc.width / 2, rc.top + 10, 14); }
    } else { r.combo = 0; comboEl.classList.add("off"); }
    if (!r.firstErr) { if (ok) d = Math.min(DMAX, d + 2); else { r.firstErr = true; d = Math.max(1, d - 1); } }
    else if (ok) { if (++r.up >= 2) { d = Math.min(DMAX, d + 1); r.up = 0; } }
    else { d = Math.max(1, d - 1); r.up = 0; }
    setTimeout(next, ok ? 280 : 650);
  }
  function finish() {
    if (r.ended) return; r.ended = true; cancelAnimationFrame(raf); if (r.cleanup) r.cleanup(); currentAbort = null;
    const ts = r.trials, half = ts.slice(Math.floor(ts.length / 2)), src = half.length >= 3 ? half : ts;
    const est = src.length ? src.reduce((a, t) => a + t.d, 0) / src.length : d;
    const acc = ts.length ? ts.filter(t => t.ok).length / ts.length : 0;
    const sk = state.skills[step.eng], oldL = sk.lvl, prevBest = sk.best;
    const ghost = ghostFor(step.eng);
    let lvlTitle = "Level", lvlLine = "", lvlSub = "";
    if (practice) { lvlTitle = "Practice"; lvlLine = "No change"; lvlSub = `Level stays ${oldL ? oldL.toFixed(1) : "unset"}`; }
    else if (P.kind === "calib") {
      if (step.mode === "recheck") { const first = state.calib.est.speed; state.calib.est.speed = first ? (first + est) / 2 : est; sk.lvl = state.calib.est.speed; }
      else { state.calib.est[step.eng] = est; sk.lvl = est; }
      lvlTitle = "Measured"; lvlLine = `Level ${est.toFixed(1)}`; lvlSub = "Part of your baseline";
    } else if (P.kind === "checkup") {
      P.checkup = P.checkup || {}; P.checkup[step.eng] = est;
      lvlTitle = "Measured"; lvlLine = `Level ${est.toFixed(1)}`; lvlSub = state.baseline ? `Baseline ${(state.baseline.est && state.baseline.est[step.eng] || 0).toFixed(1)}` : "";
    } else {
      sk.lvl = oldL ? oldL * 0.5 + est * 0.5 : est;
      const diff = sk.lvl - (oldL || 0);
      lvlTitle = "Training level"; lvlLine = `${oldL ? oldL.toFixed(1) : "–"} → ${sk.lvl.toFixed(1)} ${diff > 0.05 ? "▲" : diff < -0.05 ? "▼" : ""}`; lvlSub = `${PILLARS[step.eng].name} tree: ${stageFor(sk.lvl).toLowerCase()}`;
      sk.lastV = step.variant;
    }
    if (!practice) { sk.hist.push({ d: today(), s: r.score, v: step.variant, m: step.mode }); if (sk.hist.length > 150) sk.hist.shift(); }
    logDay({ g: 1 }); rec("combo", r.maxCombo);
    if (step.variant === "nback" && ts.length) { const top = Math.max(...ts.filter(t => t.ok).map(t => t.d), 0); rec("nback", top <= 5 ? 1 : top <= 14 ? 2 : 3); }
    sk.best = Math.max(sk.best, r.score);
    const xp = practice ? 0 : 20 + Math.round(acc * 20), coins = practice ? Math.min(15, 3 + Math.round(acc * 8)) : 5 + Math.round(acc * 10);
    addCoins(coins);
    P.results.push({ t: "game", eng: step.eng, score: r.score, est, acc, xp, coins }); P.idx++;
    checkAwards(); save();
    let near = "";
    if (r.score > prevBest && prevBest > 0) near = `New personal best in ${PILLARS[step.eng].name}!`;
    else if (prevBest > 0 && r.score === prevBest) near = "Matched your best exactly.";
    else if (prevBest > 0 && prevBest - r.score <= prevBest * 0.15) near = `Just ${fmt(prevBest - r.score)} pts off your best (${fmt(prevBest)}).`;
    else if (prevBest > 0) near = `Your best is ${fmt(prevBest)}.`;
    else if (ghost) near = `${ghost.label}: ${fmt(ghost.s)}.`;
    const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc >= 0.4 ? 1 : 0;
    app.innerHTML = `<div class="play">${shead()}
    <div class="rhero"><img src="${IMG[PILLARS[step.eng].img]}" alt=""><div class="cap"><span class="chip">${ic("trophy")}${acc >= 0.8 ? "Excelente!" : "Round complete"}</span><h2>${esc(PILLARS[step.eng].name)} · ${esc(v.name)}</h2></div></div>
    <section class="card scorebig"><div class="eyebrow m">Total round score</div><b>${fmt(r.score)} <small>pts</small></b>${near ? `<div class="near">${ic("flame")}${esc(near)}</div>` : ""}</section>
    <section class="card tint acc"><span class="coin">${ic("check")}</span><div><div class="eyebrow m">Accuracy</div><b>${Math.round(acc * 100)}% across ${ts.length}</b></div><span class="stars">${[0, 1, 2].map(i => ic("star", i < stars ? "on" : "")).join("")}</span></section>
    <div class="two2"><div class="card"><div class="eyebrow">${ic("zap")}Best combo</div><b class="o">x${r.maxCombo}</b><small>${r.maxCombo >= 10 ? "Double points unlocked" : r.maxCombo >= 5 ? "1.5x points unlocked" : "Chain 5 for 1.5x"}</small></div><div class="card"><div class="eyebrow">${ic("brain")}${esc(lvlTitle)}</div><b>${esc(lvlLine)}</b><small>${esc(lvlSub)}</small></div></div>
    <div class="pills2">${xp ? `<span class="chip o">${ic("zap")}+${xp} XP</span>` : ""}<span class="chip y">${ic("sun")}+${coins} coins</span></div>
    ${nextBtn()}</div>`;
    window.scrollTo(0, 0);
    if (near.startsWith("New personal")) { const rc = $(".scorebig b").getBoundingClientRect(); burst(rc.left + rc.width / 2, rc.top + 30, 26); }
  }
}
function ghostFor(eng) {
  const h = state.skills[eng].hist; if (!h.length) return null;
  const t = today(); let best = null;
  for (const e of h) { if (daysBetween(e.d, t) >= 25) best = e; }
  if (best) return { label: `You, ${daysBetween(best.d, t)} days ago`, s: best.s };
  const first = h[0]; if (first.d === t) return null;
  return { label: "Your first go", s: first.s };
}

/* ---------- knowledge cards ---------- */
/* How a card is asked depends on how well you know it:
   - first meeting: fair multiple choice (even a wrong guess primes learning), then the explanation
   - early reviews: multiple choice or true/false, in either direction for Spanish
   - established cards: free recall. Think of the answer, reveal, then grade yourself.
     Recall is harder than recognition, and that effort is exactly what makes memories last.
   Missed cards come back once at the end of the round, so you leave having got them right. */
const SPEAK_LANGS = ["es-AR", "es-419", "es-US", "es-MX", "es-ES", "es"];
function speakEs(text) {
  try {
    const ss = window.speechSynthesis; if (!ss) return;
    const vs = ss.getVoices(), v = SPEAK_LANGS.map(l => vs.find(x => x.lang.replace("_", "-").toLowerCase().startsWith(l.toLowerCase()))).find(Boolean);
    const u = new SpeechSynthesisUtterance(text); u.lang = v ? v.lang : "es-AR"; if (v) u.voice = v; u.rate = .92;
    ss.cancel(); ss.speak(u);
  } catch (e) {}
}
const canSpeak = () => !!window.speechSynthesis;
function cardMode(kind, it, r) {
  if (!r) return "mc";
  const iv = r.iv || INT[r.b] || 1, longAns = kind === "tr" && it.a.length > 34;
  if (iv >= 3 || (longAns && r.n >= 1)) return Math.random() < (longAns ? .9 : .7) ? "recall" : "mc";
  return kind === "tr" && Math.random() < 0.3 ? "tf" : "mc";
}
function runKnow(step) {
  const kind = step.kind, items = Object.fromEntries(content[kind].map(it => [it.id, it]));
  const queue = step.ids.filter(id => items[id]).map(id => ({ id, retry: false })), total = queue.length;
  let i = 0, right = 0, firstTry = 0, done = 0, keyH = null, autoT = 0;
  const dock = dockBar("kdock"); dock.el.hidden = true;
  const cleanup = () => { clearTimeout(autoT); if (keyH) document.removeEventListener("keydown", keyH); dock.destroy(); try { speechSynthesis.cancel(); } catch (e) {} };
  currentAbort = () => { cleanup(); currentAbort = null; };
  const onKeys = f => { if (keyH) document.removeEventListener("keydown", keyH); keyH = e => { if (e.metaKey || e.ctrlKey || e.altKey) return; f(e); }; document.addEventListener("keydown", keyH); };
  const show = () => {
    clearTimeout(autoT);
    if (i >= queue.length) return end();
    const slot = queue[i], it = items[slot.id], r = state.srs[kind][it.id], isNew = !r;
    const mode = slot.retry ? "mc" : cardMode(kind, it, r);
    let prompt, sub, ans, wrongs, prLine = "", speakTxt = "", answerSide = "";
    if (kind === "es") {
      const produce = mode === "recall" ? Math.random() < .7 : !isNew && (r.b || 1) >= 2 && Math.random() < .5;
      const pool = content.es.filter(x => x.id !== it.id), dist = shuffle(pool.filter(x => x.cat === it.cat)).concat(shuffle(pool.filter(x => x.cat !== it.cat)));
      if (produce) { prompt = it.en; sub = mode === "recall" ? "Say it in Spanish" : "How do you say it in Spanish?"; ans = it.es; wrongs = dist.map(x => x.es); answerSide = "es"; }
      else { prompt = it.es; sub = mode === "recall" ? "What does it mean?" : "Choose the best translation"; ans = it.en; wrongs = dist.map(x => x.en); speakTxt = it.es; if (it.pr) prLine = it.pr; }
    } else {
      prompt = it.q; ans = it.a; sub = mode === "recall" ? "Think of the answer" : "Choose the answer";
      let w = it.wrong.slice();
      if (w.length < 3) { const same = content.tr.filter(x => x.cat === it.cat && x.a !== it.a).map(x => x.a); w = w.concat(shuffle(same)); }
      wrongs = shuffle(w.slice(0, Math.max(3, it.wrong.length)));
    }
    let tfShown = null;
    if (mode === "tf") { const truth = Math.random() < 0.5; tfShown = truth ? it.a : wrongs[0]; sub = "True or false?"; }
    const tagL = slot.retry ? `<span class="chip o">${ic("bulb")}Try again</span>` : isNew ? `<span class="chip m">${ic("sparkle")}New ${kind === "es" ? "word" : "fact"}</span>` : `<span class="chip">${ic(mode === "recall" ? "brain" : "clock")}${mode === "recall" ? "Recall" : "Review"}</span>`;
    const tagR = `<span class="chip">${esc(kind === "es" ? it.cat.replace(/^New: /, "") : it.cat || "Knowledge")}</span>`;
    const spk = speakTxt && canSpeak() ? `<button class="iconbtn spk" id="spk" aria-label="Hear it">${ic("sound")}</button>` : "";
    app.innerHTML = `<div class="play kplay">${shead()}<div class="kprog"><span class="chip">${ic("cards")}${Math.min(done + 1, queue.length)} of ${queue.length}</span><div class="gauge"><i style="width:${done / queue.length * 100}%"></i></div></div>
    <div class="stage kstage" id="stage"></div></div>`;
    const stage = $("#stage");
    const card = `<div class="kcardw"><div class="kcard ${mode}"><div class="kt">${tagL}${tagR}</div>${kind === "tr" && it.place ? `<div class="eyebrow m kplace">${esc(it.place)}</div>` : ""}
      <div class="prompt ${prompt.length > 60 ? "mid small" : prompt.length > 16 ? "mid" : ""}">${esc(prompt)}</div>${prLine ? `<p class="sub">[${esc(prLine)}]</p>` : ""}${spk}
      ${tfShown !== null ? `<div class="tfans"><small>Answer</small><b>${esc(tfShown)}</b></div>` : ""}<div class="kreveal" id="krev"></div></div></div>`;
    const why = it.why ? `<p class="why">${ic("bulb")}<span>${esc(it.why)}</span></p>` : "";
    const finishCard = (q, ok) => {
      if (!slot.retry) { grade(kind, it.id, q); if (ok) firstTry++; }
      if (ok) right++;
      if (!ok && !slot.retry) queue.push({ id: it.id, retry: true });
      done++; save();
    };
    const next = () => { i++; show(); };
    if (mode === "recall") {
      stage.innerHTML = card + `<div class="kq"><b>${esc(sub)}</b><span class="muted">then reveal</span></div>`;
      if (speakTxt) bindSpeak(speakTxt);
      dock.el.hidden = false;
      dock.set(`<button class="btn reveal" id="krv">${ic("eye")}Show answer</button>`);
      const reveal = () => {
        $("#krev").innerHTML = `<div class="kans"><small>Answer</small><b>${esc(ans)}</b>${kind === "es" && it.pr && answerSide === "es" ? `<p class="sub">[${esc(it.pr)}]</p>` : ""}${answerSide === "es" && canSpeak() ? `<button class="iconbtn spk" id="spk2" aria-label="Hear it">${ic("sound")}</button>` : ""}</div>${why}`;
        $(".kcard").classList.add("open");
        if (answerSide === "es") { const b = $("#spk2"); if (b) b.onclick = () => speakEs(it.es); speakEs(it.es); }
        const rec = state.srs[kind][it.id], opts = [[1, "Forgot", "again"], [2, "Hard", "hard"], [3, "Got it", "good"], [4, "Easy", "easy"]];
        dock.set(`<div class="grades">${opts.map(([q, l, c]) => `<button class="gbtn ${c}" data-q="${q}"><b>${l}</b><small>${q === 1 ? "Today" : ivLabel(sched(rec, q, today()).iv)}</small></button>`).join("")}</div>`);
        const pickQ = q => { const ok = q >= 2; tone(ok); buzz(ok); finishCard(q, ok); next(); };
        dock.el.querySelectorAll("[data-q]").forEach(b => b.onclick = () => pickQ(+b.dataset.q));
        onKeys(e => { if (/^[1-4]$/.test(e.key)) pickQ(+e.key); });
      };
      $("#krv").onclick = reveal;
      onKeys(e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); reveal(); } });
      window.scrollTo(0, 0); return;
    }
    const tf = mode === "tf", correctTF = tf ? (tfShown === it.a ? 0 : 1) : -1;
    const { options, correct } = tf ? { options: ["True", "False"], correct: correctTF } : withOptions(ans, wrongs);
    stage.innerHTML = "";
    dock.el.hidden = true;
    const L = "ABCD";
    const cleanupChoice = choice(stage, { top: card + `<div class="kq"><b>${esc(sub)}</b></div>`, options, correct, cls: tf ? "tf" : "one letters", render: o => tf ? esc(o) : `<span class="L">${L[options.indexOf(o)]}</span><span>${esc(o)}</span>` }, ok => {
      onKeys(() => {});
      finishCard(ok ? 3 : 1, ok);
      tone(ok); buzz(ok);
      const fb = ok ? `<div class="fbbar ok">${ic("check")}<span>${pick(["Excelente!", "Genial!", "Buenísimo!", "Qué bueno!", "Dale!"])}${slot.retry ? " Locked in for now." : ""}</span></div>` : `<div class="fbbar no">${ic("bulb")}<span>It's <b>${esc(tf ? `${correctTF === 0 ? "true" : "false"}: ${it.a}` : ans)}</b>. ${slot.retry ? "You'll see it again tomorrow." : "One more try at the end."}</span></div>`;
      if (speakTxt || answerSide === "es") speakEs(it.es);
      if (ok && !why) { dock.el.hidden = false; dock.set(fb); autoT = setTimeout(next, 900); return; }
      dock.el.hidden = false; dock.set(`${fb}${why}<button class="btn" id="kcont">Continue${ic("arrow")}</button>`);
      $("#kcont").onclick = next;
      onKeys(e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); next(); } });
    });
    if (speakTxt) bindSpeak(speakTxt);
    onKeys(e => { const k = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 }[e.key.toLowerCase()]; const bs = $$(".opt", stage); if (k !== undefined && bs[k]) bs[k].dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); });
    window.scrollTo(0, 0);
  };
  const bindSpeak = t => { const b = $("#spk"); if (b) b.onclick = () => speakEs(t); };
  const end = () => {
    cleanup(); currentAbort = null;
    const xp = P.kind === "practice" ? firstTry * 2 : firstTry * 3, coins = firstTry;
    if (P.kind === "practice") state.xp += xp;
    addCoins(coins);
    P.results.push({ t: "know", kind, right: firstTry, total, xp: P.kind === "practice" ? 0 : xp, coins }); P.idx++; if (P.kind === "practice") bumpMax();
    logDay({ c: total }); checkAwards();
    save();
    const st = knowStats(kind), acc = total ? firstTry / total : 0, stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc >= 0.4 ? 1 : 0, missed = total - firstTry;
    app.innerHTML = `<div class="play">${shead()}
    <section class="card scorebig" style="margin-top:14px"><div class="eyebrow m">${kind === "es" ? "Palabras" : "Knowledge"}</div><b>${firstTry}<small> / ${total}</small></b><div class="near">${ic(missed ? "bulb" : "trophy")}${missed ? `${missed} missed, then practised again. They're back tomorrow.` : "Clean sweep. Those just got pushed further out."}</div></section>
    <section class="card tint acc"><span class="coin">${ic("check")}</span><div><div class="eyebrow m">Locked in (2+ weeks)</div><b>${st.mastered} of ${content[kind].length}</b></div><span class="stars">${[0, 1, 2].map(k => ic("star", k < stars ? "on" : "")).join("")}</span></section>
    <div class="two2"><div class="card tint"><div class="eyebrow">${ic("clock")}Learning</div><b class="o">${st.learning}</b><small>In rotation</small></div><div class="card tint"><div class="eyebrow">${ic("sparkle")}Not seen</div><b>${fmt(st.fresh)}</b><small>A few new each day</small></div></div>
    <div class="pills2"><span class="chip o">${ic("zap")}+${xp} XP</span><span class="chip y">${ic("sun")}+${coins} coins</span></div>
    ${nextBtn()}</div>`;
    window.scrollTo(0, 0);
  };
  if (!queue.length) return end();
  show();
}

/* ---------- daily puzzles ---------- */
/* ---------- finish ---------- */
function finishSession() {
  if (!P) { view = "map"; render(); return; }
  if (P.kind === "practice" || P.kind === "extra") {
    const lv0 = P.lv0 || levelInfo(state.xp).lvl;
    const c = P.results.reduce((a, r) => a + (r.coins || 0), 0), x = P.kind === "extra" ? P.results.reduce((a, r) => a + (r.xp || 0), 0) : 0;
    if (x) state.xp += x; const un = bumpMax(); logDay({ xp: x }); checkAwards(); save();
    toast(`${x ? `+${x} XP, ` : ""}+${c} coins${un.length ? `. Unlocked ${un.map(u => u.name).join(", ")}` : ""}`); exitSession(); celebrate(lv0, levelInfo(state.xp).lvl); return;
  }
  const p = state.plan, t = today();
  if (!p || p.finished) { view = "map"; render(); return; }
  p.finished = true;
  const before = levelInfo(state.xp).lvl;
  const stepXp = p.results.reduce((a, r) => a + (r.xp || 0), 0), stepCoins = p.results.reduce((a, r) => a + (r.coins || 0), 0);
  state.streak = state.lastDone === t ? state.streak : state.streak + 1;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  const bonus = 20 + Math.min(state.streak, 10) * 2;
  state.xp += stepXp + bonus; state.sessions++; state.lastDone = t; state.checkedThrough = addDays(t, -1);
  logDay({ s: 1, xp: stepXp + bonus });
  addCoins(20);
  let froze = false;
  if (state.streak > 0 && state.streak % 7 === 0 && state.freezes < 2) { state.freezes++; froze = true; }
  state.lastGames = p.steps.filter(s => s.t === "game").map(s => s.eng);
  let reveal = "";
  if (p.kind === "calib") {
    state.calib.day = p.day;
    if (p.day === 3) {
      const scores = {}; SKILLS.forEach(k => scores[k] = estScore(state.calib.est[k] || 0));
      state.baseline = { date: t, scores, est: { ...state.calib.est } };
      reveal = `<section class="card"><div class="radarhead"><span class="pin">${ic("brain")}</span><div><b>Your baseline</b><small>Daily Rutas now lean toward your weaker pillars</small></div></div><div class="radar">${radarSVG([{ scores, cls: "now" }])}</div></section>`;
    }
  }
  if (p.kind === "checkup") {
    const scores = {}; SKILLS.forEach(k => scores[k] = estScore((p.checkup || {})[k] || 0));
    state.checkups.push({ date: t, scores });
    reveal = `<section class="card"><div class="radarhead"><span class="pin">${ic("brain")}</span><div><b>Check-up vs baseline</b><small>Dashed line is where you started</small></div></div><div class="radar">${radarSVG([{ scores: state.baseline.scores, cls: "base" }, { scores, cls: "now" }])}</div></section>`;
  }
  const unlocked = bumpMax();
  const after = levelInfo(state.xp).lvl;
  checkAwards();
  state.chest = { date: t, opened: false };
  const kind = p.kind; sessTitle(); state.plan = null; P = null;
  save();
  const st = stopFor(after), sf = countryFacts(st.c, 1)[0], info = { fact: sf ? factHTML(sf) : "" };
  const moved = after > before ? `<section class="card newstop">${`<span class="stamp">${flagOf(st.c)}</span>`}<div><div class="eyebrow">${ic("target", "xs")} New country reached</div><b>${esc(st.name)}</b><p class="muted" style="color:var(--ink2)">${esc(st.country)}, level ${st.i + 1}${unlocked.length ? `. Unlocked the ${esc(unlocked.map(u => u.name).join(" and "))} theme` : ""}</p></div></section>${info.fact ? `<div class="dyk" style="margin-top:0"><i>${ic("mountain")}</i><p><b>Did you know?</b> ${info.fact}</p></div>` : ""}` : "";
  app.innerHTML = `<div class="play">${shead()}<section class="cleared"><div class="fig"><img src="${IMG.hero}" alt=""><span class="chip">${ic("check")}Sesión completada</span></div>
    <h1>${kind === "calib" ? `<span>Excelente!</span> Calibration day ${state.calib.day} done` : kind === "checkup" ? "<span>Listo!</span> Check-up complete" : "<span>Excelente trabajo!</span>"}</h1><p>${kind === "calib" && state.calib.day < 3 ? "One step closer to your full baseline." : "Every tree got a little water today."}</p></section>
    <div class="bigstats"><div class="card"><div class="t">Expedition XP<i>${ic("zap")}</i></div><b>+${stepXp + bonus}<small> XP</small></b><div class="sub">${bonus} XP streak bonus, +${stepCoins + 20} coins</div></div>
    <div class="card"><div class="t">Daily streak<i>${ic("flame")}</i></div><b>${state.streak}<small> ${state.streak === 1 ? "day" : "days"}</small></b><div class="sub">${froze ? "+1 freeze earned" : state.streak % 7 ? `Freeze at ${Math.ceil(state.streak / 7) * 7} days` : "Freezes full"}</div></div></div>
    ${moved}${reveal}
    <section class="chestbox">${chestHTML()}</section>
    <button class="btn green" data-a="tab" data-t="map">${ic("sparkle")}Collect & continue</button>
    <button class="btn ghost" data-a="tab" data-t="train">See my grove</button></div>`;
  window.scrollTo(0, 0);
  setTimeout(() => burst(innerWidth / 2, 140, 34), 200);
  if (after > before) setTimeout(() => celebrate(before, after), 900);
}

/* ---------- boot ---------- */

