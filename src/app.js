/* ================= helpers ================= */
let view = "map", currentAbort = null, artN = 0;
const app = $("#app"), tabs = $("#tabs");
function seeded(str) { let a = parseInt(hash(str), 36) >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const stopsReached = () => Math.min(ROUTE.length, state.maxLvl || 1);
function themeOpen(t) { return state.owned.includes(t.id) || (t.stop && stopsReached() >= t.stop); }
function applySkin() {
  const t = THEMES.find(x => x.id === state.skin);
  document.documentElement.setAttribute("data-skin", t && themeOpen(t) ? t.id : "andean");
}
function addCoins(n) { state.coins = Math.max(0, (state.coins || 0) + n); }
function themeArt(t, cls = "") {
  const a = t.art, id = "ta" + (++artN);
  let g = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a.sky[0]}"/><stop offset="1" stop-color="${a.sky[1]}"/></linearGradient></defs><rect width="320" height="200" fill="url(#${id})"/>`;
  if (a.stars) for (let i = 0; i < 40; i++) { const r = seeded(id + i); g += `<circle cx="${(r() * 320).toFixed(1)}" cy="${(r() * 120).toFixed(1)}" r="${(r() * 1.4 + .4).toFixed(1)}" fill="#fff" opacity="${(r() * .6 + .3).toFixed(2)}"/>`; }
  g += `<circle cx="232" cy="${a.stars ? 52 : 72}" r="${a.stars ? 16 : 26}" fill="${a.sun}" opacity=".95"/>`;
  const far = "M0 140 L40 98 L78 122 L128 62 L176 116 L226 84 L270 112 L320 90 V200 H0Z";
  g += `<path d="${far}" fill="${a.far}"/>`;
  if (a.peaks) g += `<path d="M128 62 L116 76 L124 74 L132 80 L140 73 Z M226 84 L216 95 L224 93 L232 98 Z" fill="#fff" opacity=".95"/>`;
  if (a.mirror) g += `<g transform="translate(0 280) scale(1 -1)" opacity=".35"><path d="${far}" fill="${a.far}"/></g><rect y="140" width="320" height="60" fill="${a.near}" opacity=".6"/><path d="M0 170 H320 M30 184 H290" stroke="#fff" stroke-width="2" opacity=".6"/>`;
  else if (a.sea) g += `<path d="M0 158 Q80 140 160 156 T320 150 V200 H0Z" fill="${a.near}"/><rect y="176" width="320" height="24" fill="${a.ground}" opacity=".85"/><path d="M20 186 h40 M120 192 h60 M230 186 h50" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>`;
  else g += `<path d="M0 164 Q70 130 150 160 T320 150 V200 H0Z" fill="${a.near}"/><path d="M0 184 Q100 168 200 184 T320 180 V200 H0Z" fill="${a.ground}"/>`;
  if (a.jungle) for (let i = 0; i < 9; i++) g += `<circle cx="${i * 40 + 10}" cy="${170 + (i % 2) * 8}" r="${22 + (i % 3) * 5}" fill="${i % 2 ? a.near : a.ground}"/>`;
  return `<svg class="${cls}" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${g}</svg>`;
}
const APP_NAME = "Cerebrito";
const TABN = { map: "Home", train: "Mind", part: "Mind", recall: "Long-term memory", journey: "Journey", country: "Journey", puzzles: "Puzzles", pass: "You", shop: "Shop", awards: "Awards", stats: "Stats" };
function header() {
  return `<header class="top"><div class="logo"><img src="${IMG.logo}" alt="" width="36" height="36"><span><b>${APP_NAME}</b><small>${TABN[view] || ""}</small></span></div>
  <div class="pods"><span class="pod fl" title="Day streak">${ic("flame")}${state.streak}</span><button class="pod co" data-a="tab" data-t="shop" title="Coins, open the shop">${ic("sun")}${fmt(state.coins)}</button></div></header>`;
}
function sheet(html) {
  const s = document.createElement("div"); s.className = "scrim";
  s.innerHTML = `<div class="sheet" role="dialog">${html}<button class="btn ghost" data-close>Close</button></div>`;
  s.addEventListener("click", e => { if (e.target === s || e.target.closest("[data-close]")) setTimeout(() => s.remove(), 0); });
  document.body.appendChild(s); return s;
}
function planToday() {
  const t = today();
  if (state.lastDone === t) return null;
  if (!state.plan || state.plan.date !== t) { state.plan = buildPlan("auto"); tidyPlan(state.plan); save(); }
  return state.plan;
}
function tidyPlan(p) { p.steps = p.steps.filter(s => s.t !== "puzzle" || s.kind); return p; }
function estMins(p) { let s = 0; p.steps.forEach(x => { s += x.t === "game" ? (x.mode === "assess" ? 100 : 80) : x.t === "know" ? 12 + x.ids.length * 5 : 120; }); return Math.max(3, Math.round(s / 60)); }
const pillarWord = { speed: "Agility", memory: "Memory", attention: "Focus", flex: "Switchback", numeracy: "Numbers", reasoning: "Logic", spatial: "Compass" };

/* ================= render + tabs ================= */
function render() {
  if (view === "session") return;
  tabs.classList.remove("hidden");
  $$("button", tabs).forEach(b => b.setAttribute("aria-current", b.dataset.tab === ({ shop: "pass", awards: "pass", stats: "pass", part: "train", recall: "train", country: "journey" }[view] || view) ? "page" : "false"));
  const V = { map: viewMap, train: viewTrain, recall: viewRecall, journey: viewJourney, country: viewCountry, puzzles: viewPuzzles, part: viewPart, pass: viewPass, shop: viewShop, awards: viewAwards, stats: viewStats };
  app.innerHTML = header() + (V[view] || viewMap)();
  setTimeout(flushAwards, 400);
  window.scrollTo(0, 0);
  if (view === "map") startCountdownTick();

}
tabs.addEventListener("click", e => { const b = e.target.closest("button[data-tab]"); if (!b) return; view = b.dataset.tab; render(); });

/* ================= HOME ================= */
function greeting() { const h = new Date().getHours(); return h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches"; }
function stepInfo(s) {
  if (s.t === "game") { const P = PILLARS[s.eng]; return { img: IMG[P.img], name: `${P.name} game`, sub: s.mode === "assess" || s.mode === "recheck" ? "Measures your level, ~75 sec" : "Adapts to you, 60 sec" }; }
  if (s.t === "know") return s.kind === "es" ? { img: IMG.t_spanish, name: "Spanish cards", sub: `${s.ids.length} cards, tap the meaning` } : { img: IMG.t_travel, name: "Knowledge cards", sub: `${s.ids.length} quick questions` };
  const p = PZK[s.kind] || PZK.pais; return { icon: p.icon, name: p.name, sub: p.sub };
}
function viewMap() {
  const notice = state.notice ? `<div class="notice">${esc(state.notice)}<button class="btn small ghost" data-a="dismiss">Got it</button></div>` : "";
  const doneToday = state.lastDone === today(), h = new Date().getHours();
  const line = doneToday ? "Today's session is done. Keep going if you like." : state.streak > 0 && h >= 18 ? `Your ${state.streak}-day streak needs today's session. About ${estMins(planToday())} minutes.` : state.streak > 0 ? `Day ${state.streak + 1} of your streak is one session away.` : "Here's today's session. One tap to start.";
  return `${notice}<section class="greet"><h1>${greeting()}, Michael</h1><p class="${!doneToday && state.streak > 0 && h >= 18 ? "risk" : ""}">${esc(line)}</p>${weekStrip()}</section>
  ${dailyCard()}${homeExtras()}${journeyCard()}`;
}
/* quick ways to keep going once the session is done (or alongside it) */
function homeExtras() {
  const due = dueCount("es") + dueCount("tr"), pz = state.pz && state.pz.date === today() ? state.pz : {}, left = PZ.filter(p => p.k !== "rush" && !(pz[p.k] && pz[p.k].done)), pd = puzzleOfDay(today());
  const tiles = [];
  if (due) tiles.push(`<button class="qtile" data-a="review"><i style="--qc:var(--t)">${ic("cards")}</i><b>${due} due</b><small>Reviews ready</small></button>`);
  if (left.length && pd && pd !== "rush") tiles.push(`<button class="qtile" data-a="pzd" data-k="${pd}"><i style="--qc:${PZK[pd].col}">${ic(PZK[pd].icon)}</i><b>${PZK[pd].name}</b><small>${left.length} dailies left</small></button>`);
  tiles.push(`<button class="qtile" data-a="tab" data-t="awards"><i style="--qc:var(--g)">${ic("medal")}</i><b>${AWARDS.filter(a => state.awards[a.id]).length}/${AWARDS.length}</b><small>Awards</small></button>`);
  return `<div class="qtiles n${tiles.length}">${tiles.join("")}</div>`;
}
function dailyCard() {
  const t = today();
  if (state.lastDone === t) {
    if (state.chest && state.chest.date === t && !state.chest.opened) return `<section class="card hero done-hero"><div class="flare1"></div><div class="flare2"></div><div class="eyebrow">Today's reward</div>${chestHTML()}</section>`;
    const nextMsg = state.calib.day > 0 && state.calib.day < 3 ? `Calibration day ${state.calib.day + 1} unlocks tomorrow` : "Your next session unlocks at midnight";
    return `<section class="card hero done-hero"><div class="flare1"></div><div class="flare2"></div><div class="heroimg"><img src="${IMG.hero}" alt=""><span class="tl">${ic("check")}Done for today</span></div><h2>Done for today</h2><p class="d">Your streak is safe. ${nextMsg} <span id="cd"></span></p><button class="btn green" data-a="extra">${ic("play")}Start another session</button><p class="muted" style="text-align:center;margin-top:8px">Bonus sessions earn XP and grow your trees. Only one a day counts for your streak.</p></section>`;
  }
  const p = planToday();
  const pillars = [...new Set(p.steps.filter(s => s.t === "game").map(s => s.eng))].slice(0, 3);
  const trees = pillars.length ? pillars : ["memory"];
  const title = p.kind === "calib" ? `Calibration, day ${p.day} of 3` : p.kind === "checkup" ? "Monthly check-up" : "Today's session";
  const why = p.kind === "calib" ? "Three short days to measure where each skill starts." : p.kind === "checkup" ? "Re-measure all seven skills against your starting point." : "Your weakest skills get the most practice.";
  const steps = p.steps.map((s, i) => { const f = stepInfo(s), done = i < p.idx, cur = i === p.idx;
    return `<li class="${done ? "done" : cur ? "cur" : ""}"><span class="sth">${f.img ? `<img src="${f.img}" alt="">` : ic(f.icon)}</span><span class="stx"><b>${esc(f.name)}</b><small>${esc(f.sub)}</small></span><span class="stc">${done ? ic("check") : i + 1}</span></li>`; }).join("");
  const resume = p.idx > 0 && p.idx < p.steps.length;
  const cu = checkupDue() && p.kind !== "checkup" && p.idx === 0 ? `<button class="btn ghost" data-a="checkup">${ic("brain")}Do the monthly check-up instead</button>` : "";
  return `<section class="card hero"><div class="flare1"></div><div class="flare2"></div>
    <div class="trees n${trees.length}">${trees.map(k => `<img src="${IMG[PILLARS[k].img]}" alt="${esc(PILLARS[k].name)} tree">`).join("")}</div>
    <div class="hrow"><div><h2>${esc(title)}</h2><p class="d">${esc(why)}</p></div><span class="chip v">${ic("clock")}~${estMins(p)} min</span></div>
    <ol class="steplist">${steps}</ol>
    <button class="btn" data-a="go">${ic("play")}${resume ? `Continue, step ${p.idx + 1} of ${p.steps.length}` : "Start session"}</button>${cu}</section>`;
}
let cdTimer = null;
function startCountdownTick() {
  clearInterval(cdTimer);
  const upd = () => { const el = $("#cd"); if (!el) { clearInterval(cdTimer); return; } const now = new Date(), mid = new Date(now); mid.setHours(24, 0, 0, 0); const m = Math.ceil((mid - now) / 60000); el.textContent = `(${Math.floor(m / 60)}h ${m % 60}m)`; if (dkey() !== state.lastDone) { clearInterval(cdTimer); processMissed(); render(); } };
  upd(); cdTimer = setInterval(upd, 30000);
}
function chestHTML() {
  return `<button class="chest wiggle" data-a="chest" aria-label="Open the gift box"><span class="lid"></span><span class="lock"></span><span class="base"></span></button><span class="unbox">Tap to open</span>
  <div class="chesttitle">Caja sorpresa</div><div class="loot"><span class="chip w">${ic("sun")}Coins</span><span class="chip w">${ic("zap")}Bonus XP</span><span class="chip w">${ic("snow")}A streak freeze?</span></div><div class="reward" id="reward"></div>`;
}
function openChest(b) {
  if (b.classList.contains("open") || !state.chest || state.chest.opened) return;
  b.classList.remove("wiggle"); b.classList.add("open");
  const r = Math.random(), coins = rnd(20, 60), bits = [`+${coins} coins`]; addCoins(coins);
  if (r < 0.06) { state.xp += 150; bits.push("+150 XP jackpot"); }
  else if (r < 0.22 && state.freezes < 2) { state.freezes++; bits.push("a streak freeze"); }
  else if (r < 0.45) { const c2 = rnd(30, 60); addCoins(c2); bits.push(`+${c2} bonus coins`); }
  else { const x = rnd(20, 60); state.xp += x; bits.push(`+${x} XP`); }
  state.chest.opened = true; const un = bumpMax(); save();
  const rect = b.getBoundingClientRect(); burst(rect.left + rect.width / 2, rect.top + 30, 30); tone(true); buzz(true);
  const rw = $("#reward"); if (rw) rw.textContent = bits.join(", ");
  const ub = b.parentElement && b.parentElement.querySelector(".unbox"); if (ub) ub.textContent = "Listo";
  if (un.length) toast(`Unlocked ${un.map(u => u.name).join(" and ")}. Equip it in the Shop.`);
  setTimeout(() => { if (view !== "session") render(); }, 2200);
}
function bumpMax() {
  const l = levelInfo(state.xp).lvl, before = state.maxLvl || 1;
  if (l > before) { state.maxLvl = l; return THEMES.filter(t => t.stop > before && t.stop <= Math.min(l, STOPS.length) && !state.owned.includes(t.id)); }
  return [];
}

/* ================= MIND ================= */
const SKILL_INFO = {
  speed: "How fast your brain takes in information and reacts. It underpins almost every other skill and is usually the first to slow with age.",
  memory: "Working memory: holding and using information for a few seconds, like directions or a phone number. Its partner, long-term memory, is trained by your Recall decks.",
  attention: "Staying locked on what matters while ignoring distractions.",
  flex: "Switching between rules or tasks quickly without getting stuck on the old one.",
  numeracy: "Mental maths and number sense: estimating, calculating and comparing on the fly.",
  reasoning: "Spotting patterns and rules, the foundation of problem solving.",
  spatial: "Picturing and rotating shapes and places in your head, the skill behind navigation."
};
let partKey = null;
function viewTrain() {
  const planted = SKILLS.filter(k => state.skills[k].lvl).length;
  const cards = SKILLS.map(k => { const P = PILLARS[k], sk = state.skills[k], L = sk.lvl || 0;
    return `<button class="part" style="--tc:${P.col}" data-a="part" data-k="${k}"><span class="pimg"><img src="${IMG[P.img]}" alt="" class="${L ? "" : "un"}"></span><span class="ptx"><b>${P.name}</b><small>${L ? `Level ${L.toFixed(1)} · ${stageFor(L)}` : "Not measured yet"}</small><small>${sk.hist.length} session${sk.hist.length === 1 ? "" : "s"} trained</small></span>${ic("arrow")}</button>`; }).join("");
  const es = knowStats("es"), tr = knowStats("tr");
  return `<section class="card pagecard mindhead"><div class="eyebrow">Bienvenido</div><h1>Welcome inside your brain</h1><p>These are the parts of your mind you're training. Tap any part to see how it's growing and train it on its own.</p>
    <div class="statrow"><span class="chip v">${ic("brain")}${planted} of 7 measured</span><span class="chip m">${ic("check")}${es.mastered + tr.mastered} memories locked in</span></div></section>
  <div class="parts">${cards}</div>
  <button class="card ltm" data-a="tab" data-t="recall"><span class="pimg"><img src="${IMG.t_travel}" alt=""></span><span class="ptx"><b>Long-term memory</b><small>Part of Memory. Your Spanish and knowledge decks: places, history, people, health and tech.</small><small>${es.mastered + tr.mastered} locked in · ${es.learning + tr.learning} learning</small></span>${ic("arrow")}</button>`;
}
function viewPart() {
  const k = partKey, P = PILLARS[k], sk = state.skills[k], L = sk.lvl || 0, h = sk.hist;
  const last = h.length ? h[h.length - 1].d : null;
  const scores = h.slice(-20).map(x => x.s), mx = Math.max(1, ...scores);
  const spark = scores.length > 1 ? `<svg class="spark" viewBox="0 0 300 80" preserveAspectRatio="none"><polyline points="${scores.map((s, i) => `${(i / (scores.length - 1) * 300).toFixed(1)},${(76 - s / mx * 68).toFixed(1)}`).join(" ")}"/></svg>` : `<p class="muted">Train it a couple of times and your score trend appears here.</p>`;
  const es = knowStats("es"), tr = knowStats("tr");
  const ltm = k === "memory" ? `<section class="card"><div class="eyebrow g">Long-term memory</div><p class="muted" style="color:var(--ink2);margin-top:4px">The Memory game trains short-term, working memory. Your long-term memory is trained by Recall: Spanish and your knowledge decks, spaced so they stick.</p><div class="statrow"><span class="chip m">${es.mastered + tr.mastered} locked in</span><span class="chip v">${es.learning + tr.learning} learning</span></div><button class="btn ghost" data-a="tab" data-t="recall">${ic("cards")}Open Recall</button></section>` : "";
  return `<button class="backlink" data-a="tab" data-t="train">${ic("back")}Your brain</button>
  <section class="card parthero" style="--tc:${P.col}"><img src="${IMG[P.img]}" alt="${esc(P.name)} tree"><div class="eyebrow">${esc(P.es)}</div><h1>${esc(P.name)}</h1><p>${esc(SKILL_INFO[k])}</p>
    <div class="pstats"><div><small>Level</small><b>${L ? L.toFixed(1) : "–"}</b></div><div><small>Stage</small><b>${stageFor(L)}</b></div><div><small>Sessions</small><b>${h.length}</b></div><div><small>Best</small><b>${sk.best ? fmt(sk.best) : "–"}</b></div></div>
    ${L ? `<div class="gauge" style="margin-top:12px"><i style="width:${Math.round((L % 1) * 100)}%;background:${P.col}"></i></div><small class="muted">${Math.round((L % 1) * 100)}% of the way to level ${Math.floor(L) + 1}${last ? ` · last trained ${esc(last.slice(5))}` : ""}</small>` : `<small class="muted">Train it once to measure your starting level.</small>`}
    <button class="btn" data-a="trainpart" data-k="${k}">${ic("play")}Train ${esc(P.name)}</button></section>
  <section class="card"><div class="eyebrow m">Score trend, last ${Math.min(20, h.length)} sessions</div>${spark}</section>${ltm}`;
}
function catRows(withBtn) {
  return CATS.map(c => { const st = knowStats("tr", c.id); if (!st.total) return ""; const pct = Math.round(st.mastered / st.total * 100);
    return `<div class="crow" style="--cc:${c.col}"><i>${ic(c.icon)}</i><div class="cm"><div class="ct"><b>${esc(c.id)}</b><span>${st.mastered}/${st.total}</span></div><small>${esc(c.sub)}</small><div class="gauge thin"><i style="width:${Math.max(pct, st.learning ? 2 : 0)}%"></i></div></div>${withBtn ? `<button class="lb" data-a="learn" data-k="tr" data-c="${esc(c.id)}" ${st.fresh ? "" : "disabled"}>${ic("sparkle")}5</button>` : ""}</div>`; }).join("");
}

/* ================= RECALL (Spanish + knowledge) ================= */
function dueCount(kind, cat) { const t = today(), srs = state.srs[kind]; return content[kind].filter(it => (!cat || it.cat === cat) && srs[it.id] && srs[it.id].due <= t).length; }
const dShort = k => new Date(parseKey(k)).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
function catLine(kind, c) {
  // where this category is up to: the lesson under way, and how often you're right lately vs the fortnight before
  const nx = nextNew(kind, 1, kind === "es" ? null : c)[0], l = nx && lessonFor(kind, nx), lp = l && lessonProgress(l, kind);
  const now = catAccuracy(c, 0, 14), prev = catAccuracy(c, 14, 28);
  const trend = now && prev && prev.n >= 5 ? Math.round((now.acc - prev.acc) * 100) : null;
  return `<div class="dmeta">${l ? `<span>${ic("book")}Now: <b>${esc(l.name)}</b> ${lp.seen}/${lp.total}</span>` : `<span>${ic("check")}Every card met</span>`}
    ${now ? `<span class="acc">${Math.round(now.acc * 100)}% right${trend !== null && Math.abs(trend) >= 3 ? ` <em class="${trend > 0 ? "up" : "down"}">${trend > 0 ? "▲" : "▼"}${Math.abs(trend)}</em>` : ""}</span>` : ""}</div>`;
}
function viewRecall() {
  const es = knowStats("es"), tr = knowStats("tr");
  const locked = es.mastered + tr.mastered, learning = es.learning + tr.learning;
  const deck = (id, name, sub, visual, col, st, kind, cat) => `<article class="deck" style="--cc:${col}"><div class="dtop">${visual}<div class="dtx"><b>${esc(name)}</b><small>${esc(sub)}</small></div></div>
    <div class="dnum"><span><b>${st.mastered}</b>/${st.total} locked in</span>${dueCount(kind, cat) ? `<span class="due">${dueCount(kind, cat)} due</span>` : st.learning ? `<span>${st.learning} learning</span>` : ""}</div><div class="gauge thin dual"><i class="lrn" style="width:${Math.round((st.mastered + st.learning) / Math.max(1, st.total) * 100)}%"></i><i style="width:${Math.max(Math.round(st.mastered / Math.max(1, st.total) * 100), st.learning ? 3 : 0)}%"></i></div>
    ${catLine(kind, cat || "Spanish")}
    <div class="dbtns"><button data-a="learn" data-k="${kind}" ${cat ? `data-c="${esc(cat)}"` : ""} ${st.fresh ? "" : "disabled"}>${ic("sparkle")}Next lesson</button><button data-a="rush" ${cat ? `data-c="${esc(cat)}"` : `data-c="Spanish"`}>${ic("zap")}Rush</button></div></article>`;
  const esSt = { ...es, total: content.es.length };
  const decks = deck("es", "Spanish", "Your Argentine word bank", `<img src="${IMG.t_spanish}" alt="">`, "#EE7FA6", esSt, "es", null)
    + CATS.map(c => deck(c.id, c.id, c.sub, `<i>${ic(c.icon)}</i>`, c.col, knowStats("tr", c.id), "tr", c.id)).join("");
  const pc = paceInfo(), met = pc.total - pc.U, late = pc.finish > pc.goal;
  const path = `<section class="card pathcard"><div class="eyebrow v">${ic("calendar")}Your learning path</div>
    <h2>All ${fmt(pc.total)} cards by <span>${esc(dShort(pc.goal))}</span></h2>
    <div class="pchips" role="group" aria-label="Goal">${[6, 9, 12].map(m => `<button data-a="pace" data-m="${m}" class="${state.pace.months === m ? "on" : ""}">${m} months</button>`).join("")}</div>
    <div class="ptrack"><i class="met" style="--w:${met / pc.total * 100}%"></i><i class="lock" style="--w:${locked / pc.total * 100}%"></i></div>
    <div class="plegend"><span><i class="lock"></i><b>${fmt(locked)}</b> locked in</span><span><i class="met"></i><b>${fmt(met)}</b> met</span><span><i></i><b>${fmt(pc.U)}</b> to go</span></div>
    <p>${pc.U ? `${pc.perDay} new a day, as short lessons, alongside your reviews. ${late ? `You're a little behind: at most 16 new a day, the last arrives around <b>${esc(dShort(addDays(pc.finish, -30)))}</b>.` : `You'll meet the last card around <b>${esc(dShort(addDays(pc.finish, -30)))}</b>, leaving a month for it all to settle.`}` : "You've met every card. Reviews now keep them locked in."}</p></section>`;
  return `<button class="backlink" data-a="tab" data-t="train">${ic("back")}Your brain</button><section class="card pagecard"><div class="eyebrow g">Memoria</div><h1>Long-term memory</h1><p>Spanish and everything you've seen, learned and been curious about. Cards come back right before you'd forget them, so they stick for good.</p>
    <div class="statrow"><span class="chip m">${ic("check")}${locked} locked in</span><span class="chip v">${ic("clock")}${learning} learning</span><span class="chip o">${ic("bulb")}${dueCount("es") + dueCount("tr")} due today</span></div></section>
  ${dueCount("es") + dueCount("tr") ? `<button class="btn green" data-a="review">${ic("cards")}Review ${dueCount("es") + dueCount("tr")} due card${dueCount("es") + dueCount("tr") === 1 ? "" : "s"}</button>` : ""}
  ${path}
  <button class="card rushcard" data-a="rush"><span class="rz">${ic("zap")}</span><span><b>Rapid recall</b><small>60 seconds of rapid-fire questions on things you've learned${state.rushBest ? ` · best ${fmt(state.rushBest)}` : ""}</small></span>${ic("play")}</button>
  <div class="secrow"><div><h2 class="sec">${ic("cards")}Your subjects</h2><p>Your daily session already pulls from all of these. Tap Next lesson to go further in one.</p></div></div>
  <div class="decks">${decks}</div>
`;
}

/* ================= JOURNEY: around the world ================= */
let jCont = null;
const curIdx = () => (levelInfo(state.xp).lvl - 1) % ROUTE.length;
function contOf(i) { return CONTINENTS.find(c => c.id === ROUTE[i].cont); }
function countryFacts(c, n = 3) {
  const names = [ROUTE.find(r => r.c === c).name].concat(BANK_NAME[c] || []);
  let pool = content.tr.filter(x => names.includes(x.country) && x.cat === "Countries");
  if (pool.length < n) pool = pool.concat(content.tr.filter(x => names.includes(x.country) && x.cat !== "Countries"));
  return shuffle(pool).slice(0, n);
}
function mapSVG(contId, { small = false } = {}) {
  const cur = curIdx(), ids = ROUTE.map((r, i) => ({ ...r, i })).filter(r => !contId || r.cont === contId);
  const pts = ids.map(r => proj(r.lat, r.lon));
  let x0 = Math.min(...pts.map(p => p[0])), x1 = Math.max(...pts.map(p => p[0])), y0 = Math.min(...pts.map(p => p[1])), y1 = Math.max(...pts.map(p => p[1]));
  const pad = contId ? 28 : 10; x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
  const ar = small ? 1 : 1.05; let w = x1 - x0, h = y1 - y0;
  if (w / h < ar) { const nw = h * ar; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / ar; y0 -= (nh - h) / 2; h = nh; }
  if (!contId) { x0 = 0; y0 = 10; w = 1000; h = WORLD.H - 20; }
  const k = w / 300, routeSet = new Map(ROUTE.map((r, i) => [MAPNAME[r.c] || r.name, i]));
  let land = "", hi = "";
  for (const [name, d] of Object.entries(WORLD.c)) {
    const i = routeSet.get(name);
    if (i === undefined) land += d;
    else hi += `<path d="${d}" class="${i < cur ? "cd" : i === cur ? "cc" : "cl"}"/>`;
  }
  const line = pts.map(p => p.map(v => v.toFixed(1)).join(",")).join(" ");
  const doneIdx = ids.filter(r => r.i <= cur).length;
  const doneLine = pts.slice(0, doneIdx).map(p => p.map(v => v.toFixed(1)).join(",")).join(" ");
  const marks = ids.map((r, j) => { const [x, y] = pts[j], st = r.i < cur ? "d" : r.i === cur ? "c" : "l", R = (st === "c" ? 13 : 8.6) * k;
    if (st === "c") return `<g class="mk c" data-a="stop" data-i="${r.i}"><circle cx="${x}" cy="${y}" r="${R * 1.6}" class="pulse"/><clipPath id="av${r.i}"><circle cx="${x}" cy="${y}" r="${R}"/></clipPath><circle cx="${x}" cy="${y}" r="${R + 1.6 * k}" fill="#fff"/><image href="${IMG.avatar}" x="${x - R}" y="${y - R}" width="${R * 2}" height="${R * 2}" clip-path="url(#av${r.i})" preserveAspectRatio="xMidYMid slice"/></g>`;
    return `<g class="mk ${st}" data-a="stop" data-i="${r.i}"><circle cx="${x}" cy="${y}" r="${R}" ${VISITED.has(r.c) && st === "l" ? `class="vb"` : ""}/>${small ? "" : `<text x="${x}" y="${y + 3.1 * k}" font-size="${8.8 * k}">${st === "d" ? "✓" : r.i + 1}</text>`}</g>`; }).join("");
  return `<svg class="wmap" viewBox="${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" style="--k:${k}" role="img" aria-label="Map"><path d="${land}" class="land"/>${hi}
    <polyline points="${line}" class="rt" style="stroke-width:${1.6 * k}px;stroke-dasharray:${2 * k} ${3 * k}"/>${doneIdx > 1 ? `<polyline points="${doneLine}" class="rtd" style="stroke-width:${2.4 * k}px"/>` : ""}${marks}</svg>`;
}
function journeyCard() {
  const li = levelInfo(state.xp), pct = Math.round(li.into / li.need * 100), i = curIdx(), r = ROUTE[i], ct = contOf(i), nx = ROUTE[(i + 1) % ROUTE.length];
  return `<button class="card jcard" data-a="tab" data-t="journey"><span class="jart">${mapSVG(ct.id, { small: true })}</span>
    <span class="jtx"><small>Around the world · level ${li.lvl}</small><b>${flagOf(r.c)} ${esc(r.name)}</b><span class="gauge"><i style="width:${pct}%"></i></span><small>${li.need - li.into} XP to ${esc(nx.name)}</small></span>${ic("arrow")}</button>`;
}
function playJourney() { if (state.lastDone !== today()) openSession("auto"); else openExtra(); }
function levelCard(withBtn = true) {
  const li = levelInfo(state.xp), pct = Math.round(li.into / li.need * 100), i = curIdx(), r = ROUTE[i], nx = ROUTE[(i + 1) % ROUTE.length], ct = contOf(i);
  return `<section class="card lvcard2"><button class="lvtop" data-a="country" data-i="${i}"><span class="bigflag">${flagOf(r.c)}</span><span class="lvt"><small>Level ${li.lvl} · ${esc(ct.name)}</small><b>${esc(r.name)}</b><small>${VISITED.has(r.c) ? "You've been here · " : ""}tap to explore</small></span>${ic("arrow")}</button>
    <div class="xprow"><span><b>${li.into}</b> / ${li.need} XP</span><span>${li.need - li.into} XP to ${flagOf(nx.c)} ${esc(nx.name)}</span></div><div class="gauge big"><i style="width:${pct}%"></i></div>
    ${withBtn ? `<button class="btn" data-a="playj">${ic("play")}${state.lastDone !== today() ? "Continue your journey" : "Keep exploring"}</button><p class="muted" style="text-align:center;margin-top:8px">${state.lastDone !== today() ? "Plays today's session: games, cards and a puzzle." : "A bonus round of games, cards and a puzzle. Every bit of XP moves you closer."}</p>` : ""}</section>`;
}
function viewJourney() {
  const cur = curIdx(), sel = CONTINENTS.find(c => c.id === jCont) || contOf(cur);
  const chips = CONTINENTS.map(c => { const idx = c.list.map(code => ROUTE.findIndex(r => r.c === code)); const done = idx.filter(i => i < cur).length;
    return `<button data-a="cont" data-k="${c.id}" aria-pressed="${c.id === sel.id}">${esc(c.name)} <small>${done}/${c.list.length}</small></button>`; }).join("");
  const rows = sel.list.map(code => { const i = ROUTE.findIndex(r => r.c === code), r = ROUTE[i], st = i < cur ? "done" : i === cur ? "cur" : "lock";
    return `<button class="crow2 ${st}" data-a="country" data-i="${i}"><span class="lvn">${st === "done" ? ic("check") : i + 1}</span><span class="fl">${flagOf(code)}</span><span class="cn"><b>${esc(r.name)}</b><small>${st === "cur" ? "You're here" : st === "done" ? "Explored" : `Level ${i + 1}`}${VISITED.has(code) ? " · been here" : ""}</small></span>${st === "lock" ? ic("lock") : ic("arrow")}</button>`; }).reverse().join("");
  const contDone = CONTINENTS.filter(c => c.list.every(code => ROUTE.findIndex(r => r.c === code) < cur)).length;
  return `<section class="card pagecard"><div class="eyebrow">Vuelta al mundo</div><h1>Around the world</h1><p>Six continents, ${ROUTE.length} countries, one per level, finishing back home in Australia.</p>
    <div class="statrow"><span class="chip v">${ic("globe")}${cur} of ${ROUTE.length} explored</span><span class="chip m">${ic("trophy")}${contDone} of 6 continents</span></div></section>
  <div class="filters">${chips}</div>
  <section class="card mapcard"><div class="mh"><b>${esc(sel.name)}</b><small>${esc(sel.es)} · ${sel.list.length} countries</small></div>${mapSVG(sel.id)}</section>
  ${levelCard()}
  <div class="secrow"><div><h2 class="sec">${ic("compass")}${esc(sel.name)} route</h2><p>Climb from the bottom. Tap any country to explore it.</p></div></div>
  <div class="route">${rows}</div>`;
}
let countryIdx = 0;
function viewCountry() {
  const i = countryIdx, r = ROUTE[i], cur = curIdx(), ct = contOf(i), st = i < cur ? "Explored" : i === cur ? "You're here" : `Unlocks at level ${i + 1}`;
  const facts = i <= cur ? countryFacts(r.c, 4) : [], mine = (MYSTOPS[r.c] || []).filter(n => STOP_INFO[n]);
  return `<button class="backlink" data-a="tab" data-t="journey">${ic("back")}Around the world</button>
  <section class="card chero"><span class="flagxl">${flagOf(r.c)}</span><div class="eyebrow">${esc(ct.name)} · level ${i + 1}</div><h1>${esc(r.name)}</h1><p>${st}${VISITED.has(r.c) ? " · you've been here" : ""}</p>
    <div class="facts"><div><small>Capital</small><b>${esc(r.cap)}</b></div><div><small>Continent</small><b>${esc(ct.name)}</b></div></div></section>
  ${i === cur ? levelCard() : i > cur ? `<section class="card"><p class="muted">Locked. ${i - cur} more level${i - cur > 1 ? "s" : ""} to go. Facts about ${esc(r.name)} appear here once you arrive.</p><button class="btn" data-a="playj">${ic("play")}Keep exploring</button></section>` : ""}
  <section class="card mapcard">${mapSVG(ct.id)}</section>
  ${mine.length ? `<div class="secrow"><div><h2 class="sec">${ic("mountain")}Your stops</h2><p>Places you went in real life.</p></div></div><div class="mine">${mine.map(n => `<div><b>${esc(n)}${STOP_INFO[n].alt ? ` · ${fmt(STOP_INFO[n].alt)} m` : ""}</b><p>${esc(STOP_INFO[n].fact)}</p></div>`).join("")}</div>` : ""}
  ${facts.length ? `<div class="secrow"><div><h2 class="sec">${ic("bulb")}Quick facts</h2><p>From your knowledge decks.</p></div></div><div class="mine">${facts.map(f => `<div><b>${esc(f.q)}</b><p><strong>${esc(f.a)}</strong>${f.why ? `. ${esc(f.why)}` : ""}</p></div>`).join("")}</div>` : ""}`;
}
function celebrate(beforeLvl, afterLvl) {
  if (afterLvl <= beforeLvl) return;
  const bi = (beforeLvl - 1) % ROUTE.length, ai = (afterLvl - 1) % ROUTE.length, r = ROUTE[ai], bc = contOf(bi), ac = contOf(ai), newCont = bc.id !== ac.id;
  const o = document.createElement("div"); o.className = "lvlup";
  o.innerHTML = `<div class="lvbox ${newCont ? "cont" : ""}">${newCont ? `<div class="medal">${ic("trophy")}</div><div class="eyebrow">Continent complete</div><h2>${esc(bc.name)} explored!</h2><p>All ${bc.list.length} countries done. Next up: <b>${esc(ac.name)}</b>, starting in ${flagOf(r.c)} ${esc(r.name)}.</p><div class="lvmap">${mapSVG(null, { small: true })}</div>`
    : `<span class="flagxl">${flagOf(r.c)}</span><div class="eyebrow">Level ${afterLvl} · new country</div><h2>Welcome to ${esc(r.name)}</h2><p>Capital: ${esc(r.cap)}${VISITED.has(r.c) ? ". You've been here before" : ""}.</p><div class="lvmap">${mapSVG(ac.id, { small: true })}</div>`}
    <button class="btn" data-lv="explore">${ic("compass")}Explore ${esc(r.name)}</button><button class="btn ghost" data-lv="close">Continue</button></div>`;
  document.body.appendChild(o);
  setTimeout(() => { burst(innerWidth / 2, innerHeight * .35, newCont ? 60 : 34); if (newCont) setTimeout(() => burst(innerWidth / 2, innerHeight * .3, 50), 400); tone(true); }, 250);
  o.addEventListener("click", e => { const b = e.target.closest("[data-lv]"); if (!b) return; o.remove(); if (b.dataset.lv === "explore") { if (view === "session") { P = null; } countryIdx = ai; view = "country"; tabs.classList.remove("hidden"); render(); } });
}
function stopSheet(i) {
  const r = ROUTE[i], cur = curIdx();
  if (i > cur) { sheet(`<div class="eyebrow m">${esc(r.country)} · level ${i + 1}</div><h3>${flagOf(r.c)} ${esc(r.name)}</h3><p class="muted">Locked. ${i - cur} more level${i - cur > 1 ? "s" : ""} to go.${VISITED.has(r.c) ? " You've been here in real life, so this one will feel familiar." : ""}</p>`); return; }
  const facts = countryFacts(r.c, 3), mine = (MYSTOPS[r.c] || []).filter(n => STOP_INFO[n]);
  sheet(`<div class="eyebrow">${esc(r.country)} · level ${i + 1}${VISITED.has(r.c) ? " · you've been here" : ""}</div><h3>${flagOf(r.c)} ${esc(r.name)}</h3>
    <div class="facts"><div><small>Capital</small><b>${esc(r.cap)}</b></div></div>
    ${mine.length ? `<div class="eyebrow m" style="margin-top:12px">Your stops</div><div class="mine">${mine.map(n => `<div><b>${esc(n)}${STOP_INFO[n].alt ? ` · ${fmt(STOP_INFO[n].alt)} m` : ""}</b><p>${esc(STOP_INFO[n].fact)}</p></div>`).join("")}</div>` : ""}
    ${facts.length ? `<div class="eyebrow m" style="margin-top:12px">Quick facts</div><div class="mine">${facts.map(f => `<div><b>${esc(f.q)}</b><p><strong>${esc(f.a)}</strong>${f.why ? `. ${esc(f.why)}` : ""}</p></div>`).join("")}</div>` : ""}
    ${i === cur && state.lastDone !== today() ? `<button class="btn" data-a="go" data-close>${ic("play")}Start today's session</button>` : ""}`);
}


/* ================= PASSPORT ================= */
let radarMode = "latest";
function radarSVG(sets) {
  const W = 340, c = 170, R = 108, n = SKILLS.length;
  const pt = (i, v) => { const a = (-90 + i * 360 / n) * Math.PI / 180; return [c + Math.cos(a) * R * v / 100, c + Math.sin(a) * R * v / 100]; };
  let g = [25, 50, 75, 100].map(v => `<polygon class="ringl" points="${SKILLS.map((_, i) => pt(i, v).join(",")).join(" ")}"/>`).join("");
  g += SKILLS.map((_, i) => { const [x, y] = pt(i, 100); return `<line class="axis" x1="${c}" y1="${c}" x2="${x}" y2="${y}"/>`; }).join("");
  sets.forEach(s => { const P = SKILLS.map((k, i) => pt(i, Math.max(4, s.scores[k] || 0))); g += `<polygon class="${s.cls}" points="${P.map(p => p.join(",")).join(" ")}"/>`; if (s.cls === "now") g += P.map((p, i) => s.scores[SKILLS[i]] ? `<circle class="vtx" cx="${p[0]}" cy="${p[1]}" r="6"/>` : "").join(""); });
  g += SKILLS.map((k, i) => { const [x, y] = pt(i, 126); return `<text class="ax" x="${x}" y="${y + 5}" text-anchor="${Math.abs(x - c) < 10 ? "middle" : x > c ? "start" : "end"}">${PILLARS[k].es}</text>`; }).join("");
  return `<svg viewBox="-50 0 ${W + 100} ${W}" role="img" aria-label="Skill profile"><defs><radialGradient id="rg"><stop offset="0" stop-color="var(--s)" stop-opacity=".35"/><stop offset="1" stop-color="var(--p)" stop-opacity=".35"/></radialGradient></defs>${g}</svg>`;
}
function viewPass() {
  const li = levelInfo(state.xp), es = knowStats("es"), tr = knowStats("tr");
  const countries = curIdx() + 1, allC = ROUTE.length;
  let radar, head;
  if (!state.baseline) {
    const partial = {}; Object.entries(state.calib.est).forEach(([k, v]) => partial[k] = estScore(v));
    head = `${Object.keys(partial).length} of 7 pillars measured`;
    radar = `<div class="radar">${radarSVG([{ scores: partial, cls: "now" }])}</div><p class="muted" style="text-align:center">Finish the 3-day calibration to lock in your baseline.</p>`;
  } else {
    const last = state.checkups[state.checkups.length - 1];
    const cur = last ? last.scores : state.baseline.scores;
    const avg = o => SKILLS.reduce((a, k) => a + (o[k] || 0), 0) / SKILLS.length;
    const delta = last ? Math.round((avg(last.scores) - avg(state.baseline.scores)) / Math.max(1, avg(state.baseline.scores)) * 100) : 0;
    head = `7 brain pillars assessed${last ? `<span class="chip m">${delta >= 0 ? "+" : ""}${delta}%</span>` : ""}`;
    const sets = radarMode === "base" || !last ? [{ scores: state.baseline.scores, cls: "now" }] : [{ scores: state.baseline.scores, cls: "base" }, { scores: cur, cls: "now" }];
    radar = `<div class="radar">${radarSVG(sets)}</div><div class="toggle2"><button data-a="rm" data-k="base" aria-pressed="${radarMode === "base" || !last}"><i></i>Baseline (${esc(state.baseline.date.slice(5))})</button>${last ? `<button data-a="rm" data-k="latest" aria-pressed="${radarMode !== "base"}"><i></i>Latest check-up</button>` : ""}</div>`;
  }
  const nextCU = state.baseline ? addDays((state.checkups[state.checkups.length - 1] || state.baseline).date, 28) : null;
  const cuBtn = !state.baseline ? `<button class="btn" disabled>${ic("brain")}Check-up after baseline</button>`
    : checkupDue() && state.lastDone !== today() ? `<button class="btn" data-a="checkup">${ic("brain")}Start brain re-calibration</button>`
    : `<button class="btn" disabled>${ic("brain")}Next check-up ${esc(new Date(parseKey(nextCU)).toLocaleDateString("en-AU", { day: "numeric", month: "short" }))}</button>`;
  const pzw = pzSolvedTotal(), pzp = PZ.filter(p => p.k !== "rush").reduce((a, p) => a + ((state.pzs[p.k] || {}).played || 0), 0);
  const todayXp = (state.plan && state.plan.date === today() ? state.plan.results.reduce((a, r) => a + (r.xp || 0), 0) : 0);
  return `<section class="card pp"><span class="ribbon">${ic("trophy", "xs")}Lvl ${li.lvl} ${titleFor(li.lvl)}</span>
    <div class="bigava" style="background-image:url(${IMG.avatar})"><span>${ic("check")}</span></div>
    <h1>Michael</h1><p class="since">${ic("hiker")}Training since ${esc(new Date(parseKey(state.joined)).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }))}</p>
    <div class="stat3"><div><b>${ic("clock")}${state.sessions}</b><span>Days travelled</span></div><div><b>${ic("flame")}${state.streak}</b><span>Day streak</span></div><div><b>${ic("globe")}${countries}/${allC}</b><span>Countries</span></div></div></section>
  <section class="card streakcard"><div class="sch"><span class="flame">${ic("flame")}</span><div><b>${state.streak} day${state.streak === 1 ? "" : "s"}</b><small>${state.streak ? (state.lastDone === today() ? "Streak safe for today" : "Do today's session to keep it") : "Start a streak today"} · best ${state.bestStreak}</small></div>${state.freezes ? `<span class="chip">${ic("snow")}${state.freezes}</span>` : ""}</div>${weekStrip()}</section>
  <div class="hub">
    <button class="card shopcard" data-a="tab" data-t="awards"><span class="pin" style="background:var(--gl);color:var(--gd)">${ic("medal")}</span><span><b>Awards</b><small>${AWARDS.filter(a => state.awards[a.id]).length} of ${AWARDS.length} earned</small></span>${ic("arrow")}</button>
    <button class="card shopcard" data-a="tab" data-t="stats"><span class="pin">${ic("chart")}</span><span><b>Stats</b><small>${activeDays()} active day${activeDays() === 1 ? "" : "s"} · calendar and trends</small></span>${ic("arrow")}</button>
    <button class="card shopcard" data-a="tab" data-t="shop"><span class="pin" style="background:var(--sl);color:var(--sd)">${ic("store")}</span><span><b>Shop</b><small>${fmt(state.coins)} coins · ${state.freezes} freeze${state.freezes === 1 ? "" : "s"}</small></span>${ic("arrow")}</button>
  </div>
  <section class="card"><div class="radarhead"><span class="pin">${ic("brain")}</span><div><b>Cognitive radar</b><small>${head}</small></div></div>${radar}</section>
  ${cuBtn}
  <h2 class="sec" style="justify-content:space-between">Expedition journal</h2>
  <div class="journal">
    <div class="jc" style="--jb:var(--pl);--jf:var(--pd)"><div class="t"><i>${ic("zap")}</i><small>${todayXp ? `+${todayXp} today` : ""}</small></div><b>${fmt(state.xp)}</b><span>Total XP</span></div>
    <div class="jc" style="--jb:var(--tl);--jf:var(--td)"><div class="t"><i>${ic("grid")}</i><small>${pzp ? Math.round(pzw / pzp * 100) + "% won" : ""}</small></div><b>${pzw}</b><span>Puzzles solved</span></div>
    <div class="jc" style="--jb:var(--gl);--jf:var(--gd)"><div class="t"><i>${ic("sun")}</i><small>${state.bestStreak && state.bestStreak === state.streak ? "Record!" : ""}</small></div><b>${state.bestStreak} <em>${state.bestStreak === 1 ? "day" : "days"}</em></b><span>Longest streak</span></div>
    <div class="jc" style="--jb:var(--sl);--jf:var(--sd)"><div class="t"><i>${ic("passport")}</i><small>${esc(ROUTE[curIdx()].name)}</small></div><b>${stopsReached()}</b><span>Passport stamps</span></div>
  </div>
  <h2 class="sec">Knowledge</h2>
  <section class="card" style="padding:6px 18px">
    <div class="kn"><img src="${IMG.t_spanish}" alt=""><div style="min-width:110px"><b>Spanish</b><small>${es.mastered} locked in, ${es.learning} learning</small></div><div class="gauge green thin"><i style="width:${Math.round(es.mastered / Math.max(1, content.es.length) * 100)}%"></i></div></div>
  </section>
  <section class="card kpanel" style="padding:8px 16px">${catRows(false)}</section>
  <details class="set"><summary>${ic("cards")}Library</summary><div class="inner">
    <p class="muted">Spanish: ${content.es.length} cards. Knowledge: ${fmt(content.tr.length)} questions. New cards arrive a few a day; reviews come back just before you'd forget them.</p>
    <textarea id="esIn" placeholder="Spanish, one per line: spanish - english&#10;# Category lines are optional"></textarea>
    <div class="row"><button class="btn small ghost" data-a="imp" data-k="es" data-m="add">Add words</button><button class="btn small ghost" data-a="imp" data-k="es" data-m="replace">Replace list</button></div>
    <textarea id="trIn" placeholder="# Country&#10;Place | Question | Answer | wrong 1; wrong 2; wrong 3"></textarea>
    <div class="row"><button class="btn small ghost" data-a="imp" data-k="tr" data-m="add">Add facts</button><button class="btn small ghost" data-a="imp" data-k="tr" data-m="replace">Replace list</button></div>
  </div></details>
  <details class="set"><summary>${ic("gear")}Settings</summary><div class="inner">
    <button class="tog" data-a="tog" data-k="sound" aria-pressed="${state.sound}">Sound effects<span class="sl"></span></button>
    <button class="tog" data-a="tog" data-k="haptics" aria-pressed="${state.haptics}">Vibration (Android)<span class="sl"></span></button>
    <button class="btn small ghost" data-a="onb">${ic("play")}Replay the walkthrough</button>
    <button class="btn small ghost" data-a="reset">Reset all progress</button>
  </div></details>`;
}

/* ================= SHOP ================= */
let shopFilter = "all", shopSel = null;
function viewShop() {
  const eq = THEMES.find(t => t.id === document.documentElement.getAttribute("data-skin")) || THEMES[0];
  const sel = THEMES.find(t => t.id === shopSel) || eq;
  const list = THEMES.filter(t => shopFilter === "all" || (shopFilter === "open" ? themeOpen(t) : !themeOpen(t)));
  const nOpen = THEMES.filter(themeOpen).length;
  const cards = list.map(t => {
    const open = themeOpen(t), isEq = t.id === eq.id;
    const status = isEq ? `<small class="ok">Equipped</small>` : open ? `<small>Tap to equip</small>` : t.legend ? `<small>Complete the trail</small>` : `<small>${ic("lock")}${t.stop ? `${esc(STOPS[t.stop - 1].name)} or ` : ""}${t.price} coins</small>`;
    return `<button class="th" data-a="sel" data-id="${t.id}" aria-pressed="${sel.id === t.id}"><div class="pic">${themeArt(t)}${isEq ? '<span class="tag eq">Equipped</span>' : open ? '<span class="tag">Ready</span>' : t.legend ? '<span class="tag lg">Legend</span>' : ""}${open ? "" : `<span class="lk"><span>${ic("lock")}</span></span>`}</div><b>${esc(t.name)}</b>${status}<span class="sw3">${t.sw.map(c => `<i style="background:${c}"></i>`).join("")}</span></button>`;
  }).join("");
  let cta;
  if (sel.id === eq.id) cta = `<button class="btn" disabled>${ic("check")}Equipped</button>`;
  else if (themeOpen(sel)) cta = `<button class="btn" data-a="equip" data-id="${sel.id}">${ic("check")}Apply ${esc(sel.name)}</button>`;
  else if (sel.legend) cta = `<button class="btn" disabled>${ic("lock")}Reach Canada to unlock</button>`;
  else cta = `<button class="btn" data-a="buy" data-id="${sel.id}" ${state.coins >= sel.price ? "" : "disabled"}>${ic("sun")}${state.coins >= sel.price ? `Buy for ${sel.price} coins` : `${sel.price - state.coins} more coins needed`}</button>`;
  return `<button class="backlink" data-a="tab" data-t="pass">${ic("back")}Back to You</button><div class="shophead"><div><div class="eyebrow">La tienda</div><h1>Shop</h1></div><span class="chip w">${ic("sun")}${fmt(state.coins)}</span></div>
  <p class="muted" style="color:var(--ink2);margin-top:6px">Earn coins from sessions and extras. Themes also unlock free as you reach their stop on your journey.</p>
  <div class="filters"><button data-a="sf" data-k="all" aria-pressed="${shopFilter === "all"}">All themes</button><button data-a="sf" data-k="open" aria-pressed="${shopFilter === "open"}">Unlocked (${nOpen})</button><button data-a="sf" data-k="lock" aria-pressed="${shopFilter === "lock"}">Locked (${THEMES.length - nOpen})</button></div>
  <section class="card tint equipped" style="margin-top:8px"><span class="badge3d">${ic("palette")}</span><div><div class="eyebrow m">Current style</div><b>${esc(eq.name)}</b></div><span class="chip m" style="margin-left:auto">Active</span></section>
  <div class="themes">${cards}</div>${cta}
  <h2 class="sec">Supplies</h2>
  <section class="card" style="padding:6px 16px">
    <div class="supply"><i style="background:#E3F1FB;color:#2F84C4">${ic("snow")}</i><div><b>Streak freeze</b><small>Covers one missed day. You can hold 2, you have ${state.freezes}.</small></div><button class="btn" data-a="buyf" ${state.freezes >= 2 || state.coins < 250 ? "disabled" : ""}>${ic("sun")}250</button></div>
  </section>`;
}

/* ================= import ================= */
function parseEs(text) {
  let cat = "General"; const out = [];
  text.split(/\r?\n/).forEach(line => {
    const l = line.trim(); if (!l) return;
    if (l.startsWith("#")) { cat = l.replace(/^#+/, "").trim() || "General"; return; }
    const m = l.split(/\t| [-–—=:] |[-–—=:]|,/);
    if (m.length < 2) return;
    const es = m[0].trim(), en = m.slice(1).join(", ").trim();
    if (es && en) out.push({ es, en, cat });
  });
  return normEs(out);
}
function parseTr(text) {
  let country = ""; const out = [];
  text.split(/\r?\n/).forEach(line => {
    const l = line.trim(); if (!l) return;
    if (l.startsWith("#")) { country = l.replace(/^#+/, "").trim(); return; }
    const p = l.split("|").map(s => s.trim());
    if (p.length < 3) return;
    out.push({ place: p[0], country, q: p[1], a: p[2], wrong: p[3] ? p[3].split(";").map(s => s.trim()).filter(Boolean) : [] });
  });
  return normTr(out);
}
async function importContent(kind, mode) {
  const ta = $(kind === "es" ? "#esIn" : "#trIn"); const items = kind === "es" ? parseEs(ta.value) : parseTr(ta.value);
  if (!items.length) { toast(kind === "es" ? "No words found. Use one per line: spanish - english" : "No facts found. Use: Place | Question | Answer"); return; }
  let list = mode === "replace" ? items : content[kind].concat(items);
  const seen = new Set(); list = list.filter(x => !seen.has(x.id) && seen.add(x.id));
  content[kind] = list; content[kind + "At"] = Date.now(); cacheContent();
  if (db) { try { await db.doc(kind === "es" ? "content/spanish" : "content/travel").set({ items: list.map(({ id, ...x }) => x), updatedAt: content[kind + "At"] }); } catch (e) {} }
  toast(`${items.length} ${kind === "es" ? "words" : "facts"} loaded`);
  render();
}

/* ================= actions ================= */
let resetArmed = false;
document.addEventListener("click", e => {
  const b = e.target.closest("[data-a]"); if (!b || !document.body.contains(b)) return;
  const a = b.dataset.a;
  if (a === "tab") { view = b.dataset.t; render(); }
  else if (a === "go") openSession("auto");
  else if (a === "checkup") openSession("checkup");
  else if (a === "dismiss") { state.notice = null; save(); render(); }
  else if (a === "onb") showOnboarding();
  else if (a === "chest") openChest(b);
  else if (a === "stop") stopSheet(+b.dataset.i);
  else if (a === "country") { countryIdx = +b.dataset.i; view = "country"; render(); }
  else if (a === "playj") playJourney();
  else if (a === "cont") { jCont = b.dataset.k; const y = scrollY; render(); scrollTo(0, y); }
  else if (a === "part") { partKey = b.dataset.k; view = "part"; render(); }
  else if (a === "trainpart") { const k = b.dataset.k; openPractice({ t: "game", eng: k, variant: pick(ENGINES[k].train), mode: "train" }, `${PILLARS[k].name} training`, "extra"); }
  else if (a === "extra") openExtra();
  else if (a === "review") {
    const steps = [["es", queueFor("es", 0, 15)], ["tr", queueFor("tr", 0, 15)]].filter(x => x[1].length).map(([kind, ids]) => ({ t: "know", kind, ids }));
    if (steps.length) { P = { kind: "practice", label: "Reviews", lv0: levelInfo(state.xp).lvl, date: today(), idx: 0, results: [], steps }; enterSession(); stepIntro(); }
  }
  else if (a === "learn") { const k = b.dataset.k, c = b.dataset.c; const ids = nextNew(k, 5, c); if (ids.length) openPractice({ t: "know", kind: k, ids }, k === "es" ? "Spanish" : c || "Knowledge"); }
  else if (a === "pace") { state.pace.months = +b.dataset.m; save(); const y = scrollY; render(); scrollTo(0, y); toast(`Goal: everything in ${b.dataset.m} months. That's ${paceInfo().perDay} new cards a day.`); }
  else if (a === "pzd") openPractice({ t: "puzzle", kind: b.dataset.k }, PZK[b.dataset.k].name);
  else if (a === "pzf") openPractice({ t: "puzzle", kind: b.dataset.k, free: true }, PZK[b.dataset.k].name);
  else if (a === "rush") openPractice({ t: "puzzle", kind: "rush", cat: b.dataset.c || null }, b.dataset.c ? `${b.dataset.c} rush` : "Rapid recall");
  else if (a === "puzzle") openPractice({ t: "puzzle", kind: b.dataset.k }, "Bonus puzzle");
  else if (a === "rm") { radarMode = b.dataset.k; render(); }
  else if (a === "sf") { shopFilter = b.dataset.k; render(); }
  else if (a === "sel") { shopSel = b.dataset.id; const y = scrollY; render(); scrollTo(0, y); }
  else if (a === "equip") { state.skin = b.dataset.id; applySkin(); save(); shopSel = null; render(); toast("Theme applied"); }
  else if (a === "buy") { const t = THEMES.find(x => x.id === b.dataset.id); if (t && state.coins >= t.price) { addCoins(-t.price); state.owned.push(t.id); state.skin = t.id; applySkin(); save(); shopSel = null; render(); burst(innerWidth / 2, 200, 24); toast(`${t.name} is yours`); } }
  else if (a === "buyf") { if (state.coins >= 250 && state.freezes < 2) { addCoins(-250); state.freezes++; save(); const y = scrollY; render(); scrollTo(0, y); toast("Streak freeze added"); } }
  else if (a === "tog") { state[b.dataset.k] = !state[b.dataset.k]; save(); b.setAttribute("aria-pressed", state[b.dataset.k]); }
  else if (a === "imp") importContent(b.dataset.k, b.dataset.m);
  else if (a === "reset") {
    if (!resetArmed) { resetArmed = true; b.textContent = "Tap again to wipe everything"; setTimeout(() => { resetArmed = false; if (b.isConnected) b.textContent = "Reset all progress"; }, 4000); return; }
    state = freshState(); migrate(); save(); applySkin(); resetArmed = false; view = "map"; render(); toast("Progress reset");
  }
});
