/* ================= AWARDS ================= */
/* Badges reward the behaviours that make training work (showing up, spacing, breadth), not just high scores.
   Each one reports [progress, goal] so locked badges show how close you are. */
const mastered = kind => Object.values(state.srs[kind]).filter(r => (r.iv || INT[r.b] || 0) >= 14).length;
const pzWon = k => (state.pzs[k] && state.pzs[k].won) || 0;
const AWARDS = [
  { id: "streak3", g: "Habit", name: "Spark", desc: "A 3-day streak", icon: "flame", col: "#FD6A49", p: () => [state.bestStreak, 3] },
  { id: "streak7", g: "Habit", name: "On fire", desc: "A 7-day streak", icon: "flame", col: "#F04E2A", p: () => [state.bestStreak, 7] },
  { id: "streak30", g: "Habit", name: "Unstoppable", desc: "A 30-day streak", icon: "flame", col: "#D7301B", p: () => [state.bestStreak, 30] },
  { id: "streak100", g: "Habit", name: "Centurion", desc: "A 100-day streak", icon: "trophy", col: "#B8860B", p: () => [state.bestStreak, 100] },
  { id: "sess1", g: "Habit", name: "First steps", desc: "Finish your first daily session", icon: "check", col: "#15B486", p: () => [state.sessions, 1] },
  { id: "sess25", g: "Habit", name: "Regular", desc: "Finish 25 daily sessions", icon: "calendar", col: "#15B486", p: () => [state.sessions, 25] },
  { id: "sess100", g: "Habit", name: "Devoted", desc: "Finish 100 daily sessions", icon: "calendar", col: "#0E8F69", p: () => [state.sessions, 100] },
  { id: "baseline", g: "Mind", name: "Baseline", desc: "Complete the 3-day calibration", icon: "brain", col: "#6D4AF0", p: () => [state.calib.day, 3] },
  { id: "checkup", g: "Mind", name: "Check-up", desc: "Complete a monthly check-up", icon: "chart", col: "#6D4AF0", p: () => [state.checkups.length, 1] },
  { id: "allround", g: "Mind", name: "All-rounder", desc: "Every skill at level 5 or higher", icon: "sparkle", col: "#8B6CFF", p: () => [SKILLS.filter(k => (state.skills[k].lvl || 0) >= 5).length, 7] },
  { id: "bloom", g: "Mind", name: "In bloom", desc: "Any skill reaches level 10", icon: "sparkle", col: "#9B7BF0", p: () => [Math.floor(Math.max(...SKILLS.map(k => state.skills[k].lvl || 0))), 10] },
  { id: "combo10", g: "Mind", name: "Locked on", desc: "A x10 combo in a brain game", icon: "zap", col: "#F5B83D", p: () => [state.rec.combo || 0, 10] },
  { id: "nback3", g: "Mind", name: "Three back", desc: "Reach 3-back in N-back", icon: "brain", col: "#5054D6", p: () => [state.rec.nback || 0, 3] },
  { id: "cards25", g: "Memory", name: "Locked in", desc: "25 cards remembered for 2+ weeks", icon: "cards", col: "#22BDB0", p: () => [mastered("es") + mastered("tr"), 25] },
  { id: "cards100", g: "Memory", name: "Librarian", desc: "100 cards remembered for 2+ weeks", icon: "cards", col: "#16A57A", p: () => [mastered("es") + mastered("tr"), 100] },
  { id: "spanish50", g: "Memory", name: "Hablante", desc: "50 Spanish words locked in", icon: "word", col: "#EE7FA6", p: () => [mastered("es"), 50] },
  { id: "recall300", g: "Memory", name: "Quick draw", desc: "Score 300+ in Rapid recall", icon: "zap", col: "#22BDB0", p: () => [state.rushBest || 0, 300] },
  { id: "puzzles10", g: "Puzzles", name: "Puzzler", desc: "Solve 10 puzzles", icon: "grid", col: "#3F7FD8", p: () => [pzSolvedTotal(), 10] },
  { id: "puzzles100", g: "Puzzles", name: "Puzzle master", desc: "Solve 100 puzzles", icon: "medal", col: "#2559A8", p: () => [pzSolvedTotal(), 100] },
  { id: "wordle2", g: "Puzzles", name: "Wordsmith", desc: "Solve Wordle or Palabra in 2", icon: "word", col: "#15B486", p: () => [Math.min(state.rec.pz_wordle || 9, state.rec.pz_palabra || 9) <= 2 ? 1 : 0, 1] },
  { id: "globle3", g: "Puzzles", name: "Cartographer", desc: "Find a Globle country in 3 guesses or fewer", icon: "globe", col: "#3F7FD8", p: () => [(state.rec.pz_pais || 99) <= 3 ? 1 : 0, 1] },
  { id: "worldle1", g: "Puzzles", name: "Shape shifter", desc: "Name a Worldle country first try", icon: "target", col: "#E9A92E", p: () => [(state.rec.pz_worldle || 99) === 1 ? 1 : 0, 1] },
  { id: "maptap400", g: "Puzzles", name: "Human GPS", desc: "Score 400+ in MapTap", icon: "pin", col: "#FD6A49", p: () => [state.rec.maptap || 0, 400] },
  { id: "pangram", g: "Puzzles", name: "Pangram!", desc: "Find a Spelling Bee pangram", icon: "sparkle", col: "#E9A92E", p: () => [state.rec.pangrams || 0, 1] },
  { id: "hunt25", g: "Puzzles", name: "Eagle eye", desc: "Clear Number Hunt in under 25 seconds", icon: "eye", col: "#6D4AF0", p: () => [state.rec.hunt && state.rec.hunt < 25 ? 1 : 0, 1] },
  { id: "pairs", g: "Puzzles", name: "Perfect pairs", desc: "Clear Parejas with 3 misses or fewer", icon: "cards", col: "#EE7FA6", p: () => [state.rec.pairsPerfect || 0, 1] },
  { id: "sweep", g: "Puzzles", name: "Clean sweep", desc: "Play every daily puzzle in one day", icon: "check", col: "#15B486", p: () => [state.rec.sweeps || 0, 1] },
  { id: "lvl5", g: "Journey", name: "Explorer", desc: "Reach level 5", icon: "compass", col: "#FD6A49", p: () => [state.maxLvl || 1, 5] },
  { id: "sa", g: "Journey", name: "Sudamericano", desc: "Explore all of South America", icon: "mountain", col: "#16A57A", p: () => [Math.min(state.maxLvl - 1, 10), 10] },
  { id: "half", g: "Journey", name: "Globetrotter", desc: "Explore 32 countries", icon: "globe", col: "#3F7FD8", p: () => [Math.min(state.maxLvl - 1, 32), 32] }
];
let awardQueue = [];
function checkAwards() {
  const fresh = [];
  AWARDS.forEach(a => { if (state.awards[a.id]) return; let p; try { p = a.p(); } catch (e) { return; } if (p[0] >= p[1]) { state.awards[a.id] = today(); fresh.push(a); } });
  if (fresh.length) { awardQueue.push(...fresh); setTimeout(flushAwards, 900); }
  return fresh;
}
function flushAwards() {
  if (!awardQueue.length || $(".awardpop")) return;
  if ($(".lvlup") || $(".scrim") || $(".count")) { setTimeout(flushAwards, 1200); return; }   // wait for modals and countdowns
  const a = awardQueue.shift(), el = document.createElement("div");
  el.className = "awardpop"; el.setAttribute("role", "status");
  el.innerHTML = `<span class="abadge" style="--ac:${a.col}">${ic(a.icon)}</span><div><small>Award unlocked</small><b>${esc(a.name)}</b><span>${esc(a.desc)}</span></div>`;
  document.body.appendChild(el); tone(true);
  const r = el.getBoundingClientRect(); burst(r.left + 40, r.top + 30, 16);
  el.onclick = () => { el.remove(); view = "awards"; if (P) { if (currentAbort) currentAbort(); P = null; } tabs.classList.remove("hidden"); render(); };
  setTimeout(() => { el.classList.add("out"); setTimeout(() => { el.remove(); flushAwards(); }, 300); }, 3600);
}
function awardTile(a) {
  const got = state.awards[a.id]; let p = [0, 1]; try { p = a.p(); } catch (e) {}
  const pct = got ? 100 : Math.round(clamp(p[0] / p[1], 0, 1) * 100);
  return `<div class="award ${got ? "got" : ""}" style="--ac:${a.col}"><span class="abadge">${ic(a.icon)}</span><b>${esc(a.name)}</b><small>${esc(a.desc)}</small>${got ? `<em>${ic("check")}${esc(new Date(parseKey(got)).toLocaleDateString("en-AU", { day: "numeric", month: "short" }))}</em>` : p[1] > 1 ? `<div class="gauge thin"><i style="width:${pct}%"></i></div><em>${fmt(Math.min(p[0], p[1]))}/${fmt(p[1])}</em>` : `<em>${ic("lock")}Locked</em>`}</div>`;
}
function viewAwards() {
  const n = AWARDS.filter(a => state.awards[a.id]).length, groups = [...new Set(AWARDS.map(a => a.g))];
  return `<button class="backlink" data-a="tab" data-t="pass">${ic("back")}Back to You</button><section class="card pagecard"><div class="eyebrow">Logros</div><h1>Awards</h1><p>Badges for the habits that make training work: showing up, spacing it out, and breadth.</p>
    <div class="pzprog"><div class="gauge"><i style="width:${Math.round(n / AWARDS.length * 100)}%"></i></div><span><b>${n}</b>/${AWARDS.length} earned</span></div></section>
    ${groups.map(g => `<h2 class="sec">${esc(g)}</h2><div class="awards">${AWARDS.filter(a => a.g === g).sort((x, y) => (state.awards[y.id] ? 1 : 0) - (state.awards[x.id] ? 1 : 0)).map(awardTile).join("")}</div>`).join("")}`;
}

/* ================= STATS ================= */
function heatmap(weeks = 15) {
  const t = today(), end = parseKey(t), dow = (end.getDay() + 6) % 7, start = addDays(t, -(weeks * 7 - 1) - (6 - dow));
  let cells = "", months = "", lastM = -1;
  for (let w = 0; w < weeks; w++) {
    const wkStart = addDays(start, w * 7), m = parseKey(wkStart).getMonth();
    months += `<span style="grid-column:${w + 1}">${m !== lastM ? parseKey(wkStart).toLocaleDateString("en-AU", { month: "short" }) : ""}</span>`; lastM = m;
    for (let d = 0; d < 7; d++) {
      const k = addDays(start, w * 7 + d), L = state.log[k] || {}, future = k > t;
      const v = (L.s ? 3 : 0) + Math.min(3, (L.g || 0) + (L.p || 0) + Math.ceil((L.c || 0) / 8));
      const lv = future ? "fut" : L.f && !L.s ? "frz" : v >= 5 ? "l4" : v >= 3 ? "l3" : v >= 2 ? "l2" : v >= 1 ? "l1" : "";
      cells += `<i class="${lv} ${k === t ? "today" : ""}" style="grid-column:${w + 1};grid-row:${d + 1}" title="${k}"></i>`;
    }
  }
  return `<div class="hmap"><div class="hmonths" style="grid-template-columns:repeat(${weeks},1fr)">${months}</div><div class="hgrid" style="grid-template-columns:repeat(${weeks},1fr)">${cells}</div>
    <div class="hkey"><span>Less</span><i></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i><span>More</span><i class="frz"></i><span>Freeze</span></div></div>`;
}
function weekStrip() {
  const t = today(), d0 = parseKey(t), dow = (d0.getDay() + 6) % 7, mon = addDays(t, -dow), names = ["M", "T", "W", "T", "F", "S", "S"];
  return `<div class="wstrip">${names.map((n, i) => { const k = addDays(mon, i), L = state.log[k] || {}, st = L.s ? "done" : L.f ? "frz" : k === t ? "today" : k < t ? "miss" : ""; return `<div class="${st}"><small>${n}</small><i>${L.s ? ic("check") : L.f ? ic("snow") : ""}</i></div>`; }).join("")}</div>`;
}
function viewStats() {
  const days = activeDays(), srsAll = [...Object.values(state.srs.es), ...Object.values(state.srs.tr)];
  const reviews = srsAll.reduce((a, r) => a + (r.n || 0), 0), recalled = srsAll.reduce((a, r) => a + (r.ok || 0), 0);
  const games = SKILLS.reduce((a, k) => a + state.skills[k].hist.length, 0);
  const tile = (icon, v, l, col) => `<div class="jc" style="--jb:color-mix(in srgb,${col} 16%,transparent);--jf:${col}"><div class="t"><i>${ic(icon)}</i></div><b>${v}</b><span>${l}</span></div>`;
  const skillRows = SKILLS.map(k => { const P = PILLARS[k], h = state.skills[k].hist.slice(-12).map(x => x.s), mx = Math.max(1, ...h), L = state.skills[k].lvl || 0;
    return `<button class="srow" data-a="part" data-k="${k}" style="--tc:${P.col}"><img src="${IMG[P.img]}" alt=""><span><b>${P.name}</b><small>${L ? `Level ${L.toFixed(1)}` : "Not measured"}</small></span>${h.length > 1 ? `<svg viewBox="0 0 100 30" preserveAspectRatio="none"><polyline points="${h.map((s, i) => `${(i / (h.length - 1) * 100).toFixed(1)},${(28 - s / mx * 26).toFixed(1)}`).join(" ")}"/></svg>` : `<svg viewBox="0 0 100 30"></svg>`}</button>`; }).join("");
  const pzRows = PZ.filter(p => state.pzs[p.k] && state.pzs[p.k].played).map(p => { const s = state.pzs[p.k]; return `<div class="crow" style="--cc:${p.col}"><i>${ic(p.icon)}</i><div class="cm"><div class="ct"><b>${p.name}</b><span>${p.k === "rush" ? `Best ${fmt(state.rushBest || 0)}` : `${Math.round(s.won / s.played * 100)}% won`}</span></div><small>${s.played} played${p.k !== "rush" ? ` · streak ${s.streak} · best ${s.best || s.streak}` : ""}</small></div></div>`; }).join("");
  return `<button class="backlink" data-a="tab" data-t="pass">${ic("back")}Back to You</button><section class="card pagecard"><div class="eyebrow">Estadísticas</div><h1>Your stats</h1><p>Every day you've trained since ${esc(new Date(parseKey(state.joined)).toLocaleDateString("en-AU", { day: "numeric", month: "long" }))}.</p>${heatmap()}</section>
  <div class="journal">${tile("calendar", days, "Days active", "var(--p)")}${tile("flame", `${state.bestStreak}`, "Longest streak", "var(--s)")}${tile("brain", games, "Brain games", "#5054D6")}${tile("cards", fmt(reviews), "Cards reviewed", "var(--t)")}
    ${tile("check", reviews ? Math.round(recalled / reviews * 100) + "%" : "–", "Recall success", "#16A57A")}${tile("grid", pzSolvedTotal(), "Puzzles solved", "#3F7FD8")}</div>
  <h2 class="sec">${ic("brain")}Skill trends</h2><section class="card srows">${skillRows}</section>
  ${pzRows ? `<h2 class="sec">${ic("grid")}Puzzles</h2><section class="card kpanel">${pzRows}</section>` : ""}`;
}
