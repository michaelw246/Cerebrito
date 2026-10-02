/* ================= FIRST-RUN WALKTHROUGH ================= */
/* Five short, animated slides that explain the daily loop and why it works. Shown once on first launch
   (after cloud sync has had a chance to restore state), and replayable from Settings.
   Swipe, tap the arrows, or use the keyboard; Skip is always available. */
function forgettingCurve() {
  // memory strength over ~30 days: without review it collapses; each spaced review resets it and it decays more slowly.
  // A square-root time axis gives the crowded early days room, which is also where most forgetting happens.
  const W = 300, H = 150, X = d => 12 + Math.sqrt(d / 30) * (W - 24), Y = r => H - 12 - r * (H - 30);
  const pts = (from, to, S) => { const p = []; for (let d = from; d <= to + 1e-9; d += (to - from) / 40) p.push(`${X(d).toFixed(1)},${Y(Math.exp(-(d - from) / S)).toFixed(1)}`); return p; };
  const reviews = [[0, 1, 1.2], [1, 3, 2.6], [3, 7, 6], [7, 16, 14], [16, 30, 40]];
  const spaced = reviews.map(([a, b, S]) => pts(a, b, S).join(" ")).join(" ");
  const none = pts(0, 30, 1.6).join(" ");
  const dots = reviews.slice(1).map(([a], i) => `<g class="rv" style="--d:${1.2 + i * .45}s"><line x1="${X(a)}" y1="${Y(1)}" x2="${X(a)}" y2="${H - 12}"/><circle cx="${X(a)}" cy="${Y(1)}" r="5"/><text x="${X(a)}" y="${H + 2}">day ${a}</text></g>`).join("");
  return `<svg class="fcurve" viewBox="0 0 ${W} ${H}" role="img" aria-label="Memory fades fast without review, and more slowly after each spaced review">
    <line x1="12" y1="${H - 12}" x2="${W - 6}" y2="${H - 12}" class="ax"/><line x1="12" y1="14" x2="12" y2="${H - 12}" class="ax"/>
    <text x="16" y="12" class="lbl">memory</text><text x="${W - 8}" y="${H - 2}" class="lbl end">time</text>
    <polyline points="${none}" class="none" pathLength="1"/><polyline points="${spaced}" class="spaced" pathLength="1"/>${dots}</svg>`;
}
function onboardSlides() {
  const nextStop = ROUTE[(curIdx() + 1) % ROUTE.length];
  const trees = SKILLS.map((k, i) => `<figure style="--i:${i};--tc:${PILLARS[k].col}"><img src="${IMG[PILLARS[k].img]}" alt=""><figcaption>${esc(PILLARS[k].name)}</figcaption><i><b></b></i></figure>`).join("");
  const steps = [["zap", "Brain game", "Adapts as you play"], ["cards", "Spanish cards", "Words due today"], ["zap", "Brain game", "Your weakest skill"], ["globe", "Knowledge cards", "Facts that stick"], ["grid", "Daily puzzle", "Globle, Wordle…"]];
  return [
    { k: "hello", t: "Welcome to Cerebrito", b: "A few minutes a day to keep your mind sharp and remember what you learn, for good.",
      art: `<div class="ob-hero"><span class="glow"></span><img src="${IMG.mark}" alt="The Cerebrito bonsai brain">${[0, 1, 2, 3, 4, 5].map(i => `<i class="sp" style="--i:${i}"></i>`).join("")}</div>` },
    { k: "session", t: "One session a day", b: "Each day mixes brain games, recall cards and a puzzle, built for you. One tap to start, about seven minutes to finish.",
      art: `<div class="ob-sess"><div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" class="trk"/><circle cx="60" cy="60" r="50" class="fill" pathLength="1"/></svg><b>~7</b><small>min</small></div>
        <ol>${steps.map(([icn, n, s], i) => `<li style="--i:${i}"><span>${ic(icn)}</span><div><b>${n}</b><small>${s}</small></div></li>`).join("")}</ol></div>` },
    { k: "skills", t: "Seven skills, growing", b: "Every game adjusts after each answer to stay just hard enough. Three short calibration days find your starting point, then your weakest skills get the most practice.",
      art: `<div class="ob-trees">${trees}</div>` },
    { k: "memory", t: "Remember it for good", b: "Most forgetting happens in the first days. Cards return just before you'd forget, and each review makes the memory last longer. Familiar cards ask you to recall the answer before you see it.",
      art: `<div class="ob-curve">${forgettingCurve()}<div class="ob-key"><span class="k1"></span><em>With spaced reviews</em><span class="k2"></span><em>Without</em></div></div>` },
    { k: "streak", t: "Show up, travel further", b: `Each session moves you along a journey around the world. Next stop: ${nextStop.name}. A streak freeze covers the odd missed day, and missing one never costs you progress.`,
      art: `<div class="ob-streak"><div class="days">${["M", "T", "W", "T", "F", "S", "S"].map((d, i) => `<span style="--i:${i}"><i>${ic("flame")}</i><small>${d}</small></span>`).join("")}</div>
        <div class="stamp2"><span>${flagOf(nextStop.c)}</span><div><small>Next country</small><b>${esc(nextStop.name)}</b></div></div></div>` }
  ];
}
function showOnboarding() {
  if ($(".onb")) return;
  const slides = onboardSlides(), last = slides.length - 1;
  const firstRun = !state.sessions && state.calib.day === 0;
  const o = document.createElement("div"); o.className = "onb"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Welcome walkthrough");
  o.innerHTML = `<div class="ob-top"><img src="${IMG.logo}" alt=""><b>Cerebrito</b><button class="ob-skip" data-ob="skip">Skip</button></div>
    <div class="ob-track">${slides.map((s, i) => `<section class="ob-slide ob-${s.k}" aria-hidden="${i ? "true" : "false"}"><div class="ob-art">${s.art}</div><div class="ob-txt"><h2>${esc(s.t)}</h2><p>${esc(s.b)}</p></div></section>`).join("")}</div>
    <div class="ob-foot"><div class="ob-dots">${slides.map((_, i) => `<button data-ob="${i}" aria-label="Slide ${i + 1}"></button>`).join("")}</div>
      <div class="ob-btns"><button class="iconbtn big ob-back" data-ob="prev" aria-label="Back">${ic("back")}</button><button class="btn ob-next" data-ob="next"></button></div></div>`;
  document.body.appendChild(o); document.body.classList.add("ob-open");
  const track = $(".ob-track", o), secs = $$(".ob-slide", o), dots = $$(".ob-dots button", o), nextB = $(".ob-next", o), backB = $(".ob-back", o);
  let cur = 0;
  const go = i => {
    cur = clamp(i, 0, last);
    track.style.transform = `translateX(${-cur * 100}%)`;
    secs.forEach((s, j) => { s.setAttribute("aria-hidden", j !== cur); s.classList.remove("on"); });
    void secs[cur].offsetWidth; secs[cur].classList.add("on");        // restart this slide's animations
    dots.forEach((d, j) => d.setAttribute("aria-current", j === cur));
    nextB.innerHTML = cur === last ? `${ic("play")}${firstRun ? "Start calibration" : "Let's go"}` : `Next${ic("arrow")}`;
    backB.style.visibility = cur ? "visible" : "hidden";
  };
  const close = start => {
    state.introSeen = true; save();
    o.classList.add("out"); document.body.classList.remove("ob-open"); document.removeEventListener("keydown", key);
    setTimeout(() => o.remove(), 320);
    if (start && view !== "session" && state.lastDone !== today()) openSession("auto");
  };
  o.addEventListener("click", e => {
    const b = e.target.closest("[data-ob]"); if (!b) return; const a = b.dataset.ob;
    if (a === "skip") close(false); else if (a === "prev") go(cur - 1); else if (a === "next") { if (cur === last) close(true); else go(cur + 1); } else go(+a);
  });
  const key = e => { if (e.key === "ArrowRight") go(cur + 1); else if (e.key === "ArrowLeft") go(cur - 1); else if (e.key === "Escape") close(false); else if (e.key === "Enter") { e.preventDefault(); if (cur === last) close(true); else go(cur + 1); } };
  document.addEventListener("keydown", key);
  // swipe: the track follows the finger, then snaps
  let sx = null, sy = 0, dx = 0, horiz = null;
  track.addEventListener("dragstart", e => e.preventDefault());
  track.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; dx = 0; horiz = null; });
  track.addEventListener("pointermove", e => {
    if (sx === null) return; dx = e.clientX - sx;
    if (horiz === null && Math.hypot(dx, e.clientY - sy) > 8) { horiz = Math.abs(dx) > Math.abs(e.clientY - sy); if (horiz) { track.setPointerCapture(e.pointerId); track.classList.add("drag"); } }
    if (horiz) track.style.transform = `translateX(calc(${-cur * 100}% + ${dx * (cur === 0 && dx > 0 || cur === last && dx < 0 ? .3 : 1)}px))`;
  });
  const end = () => { if (sx === null) return; sx = null; track.classList.remove("drag"); if (horiz && Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); else go(cur); };
  track.addEventListener("pointerup", end); track.addEventListener("pointercancel", end);
  go(0);
}
function maybeOnboard() { if (!state.introSeen && view !== "session" && !$(".lvlup")) showOnboarding(); }
