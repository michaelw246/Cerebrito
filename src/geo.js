/* ================= GEOGRAPHY KIT: countries, distances, interactive map, guess bar ================= */
/* Every geography puzzle shares these pieces so they look and behave the same:
   - CTRY: all 176 countries on the map (index-aligned with GEO), with display names, flags, regions and aliases
   - borderKm / centroid geo(): Globle measures border-to-border, Worldle centre-to-centre
   - MapView: pan (drag), pinch / wheel / button zoom, tap-vs-drag detection, animated fly-to
   - guessBar: docked search field with type-ahead, browse sheet, and a Guess button that's always in reach */

const CTRY = __COUNTRIES__.map(([n, iso, r, pool, al], i) => ({ i, n, iso, r, pool: !!pool, al, key: GEO.names[i], lat: GEO.cent[i][0], lon: GEO.cent[i][1] }));
const CTRY_KEY = Object.fromEntries(CTRY.map(c => [c.key, c]));
const fold = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
CTRY.forEach(c => { c.f = fold(c.n); c.fa = c.al.map(fold); });
const ctryFlag = c => flagOf(c.iso);
/* PAIS / ROUTE codes -> map country (first match wins; Somaliland and N. Cyprus share flags with their neighbours) */
const ctryOfIso = iso => CTRY.find(c => c.iso === iso && c.pool) || CTRY.find(c => c.iso === iso);
/* Travle: Natural Earth folds French Guiana into France, which lets "land routes" hop the Atlantic. Cut those edges. */
const ADJ = GEO.adj.map((a, i) => a.filter(j => !((CTRY[i].iso === "FR" && CTRY[j].r === "sa") || (CTRY[j].iso === "FR" && CTRY[i].r === "sa"))));

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const ARROWS = ["⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️"];
const dir8 = brg => Math.round(brg / 45) % 8;

/* --- border-to-border distance (what makes Globle feel right: neighbours are 0 km) --- */
const _verts = {};
function vertsOf(i) {
  if (_verts[i]) return _verts[i];
  const nums = (WORLD.c[CTRY[i].key] || "").match(/-?[\d.]+/g) || [], pts = [];
  for (let k = 0; k + 1 < nums.length; k += 2) pts.push({ lat: WORLD.LAT0 - +nums[k + 1] * 360 / 1000, lon: +nums[k] * 360 / 1000 - 180 });
  const step = Math.max(1, Math.floor(pts.length / 160));
  return (_verts[i] = pts.filter((_, k) => k % step === 0));
}
const _bkm = {};
function borderKm(i, j) {
  if (i === j) return 0;
  if (GEO.adj[i].includes(j)) return 0;
  const key = i < j ? i + "," + j : j + "," + i;
  if (_bkm[key] !== undefined) return _bkm[key];
  const A = vertsOf(i), B = vertsOf(j); let best = Infinity;
  for (const a of A) {
    const ca = Math.cos(toR(a.lat));
    for (const b of B) {
      const dl = toR(b.lat - a.lat), dn = toR(b.lon - a.lon);
      const h = Math.sin(dl / 2) ** 2 + ca * Math.cos(toR(b.lat)) * Math.sin(dn / 2) ** 2;
      if (h < best) best = h;
    }
  }
  return (_bkm[key] = Math.round(2 * R_EARTH * Math.asin(Math.min(1, Math.sqrt(best)))));
}
/* continuous heat ramp: touching = deep red, far = pale */
const HEAT = [[0, [176, 20, 32]], [500, [234, 56, 56]], [1500, [247, 124, 30]], [3000, [242, 172, 34]], [5000, [236, 211, 92]], [8000, [140, 196, 238]], [15000, [104, 150, 230]]];
function heatCol(d) {
  for (let k = 1; k < HEAT.length; k++) if (d <= HEAT[k][0]) {
    const [d0, c0] = HEAT[k - 1], [d1, c1] = HEAT[k], t = (d - d0) / (d1 - d0);
    return `rgb(${c0.map((v, m) => Math.round(v + (c1[m] - v) * t)).join(",")})`;
  }
  return `rgb(${HEAT[HEAT.length - 1][1].join(",")})`;
}
const heatWord = d => d === 0 ? "Touching!" : d < 500 ? "Scorching" : d < 1500 ? "Hot" : d < 3000 ? "Warm" : d < 6000 ? "Cool" : "Cold";

/* --- map geometry helpers --- */
const MAP_H = WORLD.H;
function bboxOf(idxs, pad = 30) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  idxs.forEach(i => {
    // skip far-flung overseas parts (French Guiana, Hawaii...) so a route or country frames its mainland
    const [cx, cy] = proj(CTRY[i].lat, CTRY[i].lon);
    const subs = (WORLD.c[CTRY[i].key] || "").split("M").map(d => { const n = (d.match(/-?[\d.]+/g) || []).map(Number), xs = n.filter((_, k) => !(k & 1)), ys = n.filter((_, k) => k & 1); return xs.length ? [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] : null; }).filter(Boolean);
    const near = subs.filter(([a, b, c, d]) => Math.hypot(Math.max(a - cx, 0, cx - c), Math.max(b - cy, 0, cy - d)) < 140);
    (near.length ? near : subs).forEach(([a, b, c, d]) => { x0 = Math.min(x0, a); y0 = Math.min(y0, b); x1 = Math.max(x1, c); y1 = Math.max(y1, d); });
  });
  if (!isFinite(x0)) return [0, 0, 1000, MAP_H];
  // countries straddling the antimeridian (Russia, Fiji) would zoom out to the whole world; use their mainland centroid instead
  if (x1 - x0 > 600 && idxs.length === 1) { const [cx, cy] = proj(CTRY[idxs[0]].lat, CTRY[idxs[0]].lon); return [cx - 120, cy - 70, 240, 140]; }
  return [x0 - pad, y0 - pad, x1 - x0 + pad * 2, y1 - y0 + pad * 2];
}
const bboxPts = (pts, pad = 30) => { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); return [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + pad * 2, Math.max(...ys) - Math.min(...ys) + pad * 2]; };
const unproj = (x, y) => ({ lat: WORLD.LAT0 - y * 360 / 1000, lon: x * 360 / 1000 - 180 });

/* ================= MapView ================= */
function MapView(host, o = {}) {
  const minW = o.minW || 36, ease = t => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  host.innerHTML = `<div class="mapv ${o.cls || ""}"><svg class="wmap" role="img" aria-label="${esc(o.label || "World map")}" preserveAspectRatio="xMidYMid meet">
    <image href="${IMG.earth}" x="0" y="0" width="1000" height="${MAP_H}" preserveAspectRatio="none" class="earth"/><g class="hires"></g>
    <g class="lands">${CTRY.map(c => `<path data-k="${c.i}" d="${WORLD.c[c.key]}"/>`).join("")}</g><path class="b50" d="${BORDERS50}"/><g class="ov"></g></svg>
    <div class="mapctl"><button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="out" aria-label="Zoom out">−</button><button type="button" data-z="fit" aria-label="Reset view">${ic("globe")}</button></div>
    ${o.hint ? `<div class="maphint">${esc(o.hint)}</div>` : ""}</div>`;
  const wrap = host.firstElementChild, svg = $("svg", wrap), ov = $(".ov", svg), paths = $$("path[data-k]", svg);
  // Keep two-finger gestures on the map from zooming the whole page. iOS Safari ignores touch-action for pinch,
  // so its proprietary gesture events and multi-touch moves are cancelled here too.
  const stopPage = e => { if (!e.touches || e.touches.length > 1) e.preventDefault(); };
  wrap.addEventListener("touchstart", stopPage, { passive: false }); wrap.addEventListener("touchmove", stopPage, { passive: false });
  ["gesturestart", "gesturechange", "gestureend"].forEach(t => wrap.addEventListener(t, e => e.preventDefault()));
  let vb = (o.vb || [0, 0, 1000, MAP_H]).slice(), home = vb.slice(), anim = 0, dead = false;
  const ar = () => { const r = svg.getBoundingClientRect(); return r.width && r.height ? r.width / r.height : 1000 / MAP_H; };
  const fitAR = v => { const a = ar(), cx = v[0] + v[2] / 2, cy = v[1] + v[3] / 2; let w = v[2], h = v[3]; if (w / h < a) w = h * a; else h = w / a; return [cx - w / 2, cy - h / 2, w, h]; };
  /* The satellite image always fills the frame: you can't zoom out past its edges or pan into empty space. */
  const clampVB = v => {
    let [x, y, w, h] = v; const a = w / h, maxW = Math.min(1000, MAP_H * a), cx = x + w / 2, cy = y + h / 2;
    if (w > maxW) { w = maxW; h = w / a; } if (w < minW) { w = minW; h = w / a; }
    return [clamp(cx - w / 2, 0, 1000 - w), clamp(cy - h / 2, 0, MAP_H - h), w, h];   // resize about the centre
  };
  /* Sharp imagery: once you zoom in past what the whole-map image can show at this screen's pixel density, the
     10,800 px tiles under the view fade in on top. Tiles well outside the view are dropped again. */
  const hires = $(".hires", svg), tiles = new Map(), TU = EARTH.tile / EARTH.w * 1000, baseRes = 4096 / 1000;
  const updateTiles = () => {
    const r = svg.getBoundingClientRect(); if (!r.width) return;
    if (r.width * (window.devicePixelRatio || 1) / vb[2] < baseRes * 1.1) { if (tiles.size) { hires.textContent = ""; tiles.clear(); } return; }
    const c0 = Math.floor(vb[0] / TU), c1 = Math.floor((vb[0] + vb[2]) / TU), r0 = Math.floor(vb[1] / TU), r1 = Math.floor((vb[1] + vb[3]) / TU);
    for (let rr = r0; rr <= r1; rr++) for (let cc = c0; cc <= c1; cc++) {
      const k = `r${rr}c${cc}`; if (tiles.has(k) || !EARTH.t[k]) continue;
      const h = Math.min(EARTH.tile, EARTH.h - rr * EARTH.tile) / EARTH.w * 1000, im = document.createElementNS("http://www.w3.org/2000/svg", "image");
      // a hair of overlap hides seams between neighbouring tiles
      im.setAttribute("href", EARTH.t[k]); im.setAttribute("x", cc * TU - .02); im.setAttribute("y", rr * TU - .02); im.setAttribute("width", TU + .04); im.setAttribute("height", h + .04); im.setAttribute("preserveAspectRatio", "none");
      hires.appendChild(im); tiles.set(k, { im, rr, cc });
    }
    tiles.forEach((t, k) => { if (t.rr < r0 - 1 || t.rr > r1 + 1 || t.cc < c0 - 1 || t.cc > c1 + 1) { t.im.remove(); tiles.delete(k); } });
  };
  const apply = () => {
    svg.setAttribute("viewBox", vb.map(v => v.toFixed(2)).join(" ")); updateTiles();
    svg.classList.toggle("zin", vb[2] < 130);   // zoomed in: the coarse outlines give way to the imagery's coastline and 1:50m borders
    const r = svg.getBoundingClientRect(); if (r.width) svg.style.setProperty("--u", Math.max(vb[2] / r.width, vb[3] / r.height).toFixed(4)); // map units per screen px, so pins keep a constant size
    if (o.onView) o.onView(vb);
  };
  const toMap = (cx, cy) => { const m = svg.getScreenCTM(); if (!m) return [0, 0]; const p = svg.createSVGPoint(); p.x = cx; p.y = cy; const q = p.matrixTransform(m.inverse()); return [q.x, q.y]; };
  const pxPerUnit = () => { const m = svg.getScreenCTM(); return m ? m.a : 1; };
  function zoomAt(f, mx, my) {
    cancelAnimationFrame(anim);
    const [x, y, w, h] = vb, nw = clamp(w / f, minW, 1000), k = nw / w;
    vb = clampVB([mx - (mx - x) * k, my - (my - y) * k, nw, h * k]); apply();
  }
  function flyTo(target, ms = 650) {
    cancelAnimationFrame(anim);
    const from = vb.slice(), to = clampVB(fitAR(target)), t0 = performance.now();
    if (reduced || ms <= 0) { vb = to; apply(); return; }
    const step = now => {
      if (dead) return; const t = Math.min(1, (now - t0) / ms), e = ease(t);
      const w = Math.exp(Math.log(from[2]) + (Math.log(to[2]) - Math.log(from[2])) * e), k = (w - from[2]) / ((to[2] - from[2]) || 1);
      const lerp = (a, b) => a + (b - a) * (to[2] === from[2] ? e : clamp(k, 0, 1));
      vb = [lerp(from[0], to[0]), lerp(from[1], to[1]), w, w / (to[2] / to[3])]; apply();
      if (t < 1) anim = requestAnimationFrame(step); else { vb = to; apply(); }
    };
    anim = requestAnimationFrame(step);
  }
  /* pointers: one finger pans, two pinch; a short still press is a tap */
  const pts = new Map(); let gesture = null;
  svg.addEventListener("pointerdown", e => {
    if (e.button > 0) return;
    wrap.classList.add("touched"); cancelAnimationFrame(anim); svg.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) gesture = { x0: e.clientX, y0: e.clientY, t0: performance.now(), moved: false, multi: false, vb0: vb.slice() };
    else if (gesture) { gesture.multi = true; gesture.pinch = pinchState(); }
  });
  const pinchState = () => { const [a, b] = [...pts.values()]; return { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, m: toMap((a.x + b.x) / 2, (a.y + b.y) / 2), vb: vb.slice() }; };
  svg.addEventListener("pointermove", e => {
    if (!pts.has(e.pointerId) || !gesture) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size >= 2 && gesture.pinch) {
      const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y) || 1, P = gesture.pinch;
      const nw = clamp(P.vb[2] * P.d / d, minW, 1000), k = nw / P.vb[2];
      vb = [P.m[0] - (P.m[0] - P.vb[0]) * k, P.m[1] - (P.m[1] - P.vb[1]) * k, nw, P.vb[3] * k];
      // keep the pinch midpoint under the fingers
      const mid = toMapWith(vb, (a.x + b.x) / 2, (a.y + b.y) / 2); vb[0] += P.m[0] - mid[0]; vb[1] += P.m[1] - mid[1];
      vb = clampVB(vb); apply(); gesture.moved = true; return;
    }
    const dx = e.clientX - gesture.x0, dy = e.clientY - gesture.y0;
    if (!gesture.moved && Math.hypot(dx, dy) < 7) return;
    if (!gesture.moved) svg.classList.add("dragging");
    gesture.moved = true;
    const u = 1 / pxPerUnit(), g0 = gesture.vb0;
    vb = clampVB([g0[0] - dx * u * (vb[2] / g0[2]), g0[1] - dy * u * (vb[2] / g0[2]), vb[2], vb[3]]); apply();
  });
  const toMapWith = (v, cx, cy) => { const r = svg.getBoundingClientRect(), s = Math.min(r.width / v[2], r.height / v[3]); const ox = (r.width - v[2] * s) / 2, oy = (r.height - v[3] * s) / 2; return [v[0] + (cx - r.left - ox) / s, v[1] + (cy - r.top - oy) / s]; };
  const up = e => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (pts.size === 1 && gesture) { const [p] = pts.values(); gesture.x0 = p.x; gesture.y0 = p.y; gesture.vb0 = vb.slice(); gesture.pinch = null; return; }
    if (pts.size) return;
    svg.classList.remove("dragging");
    const g = gesture; gesture = null;
    if (!g || g.moved || g.multi || e.type === "pointercancel" || performance.now() - g.t0 > 700) return;
    const [mx, my] = toMap(e.clientX, e.clientY);
    let k = null; const hit = document.elementFromPoint(e.clientX, e.clientY);
    if (hit && hit.closest && svg.contains(hit)) { const pth = hit.closest("path[data-k]"); if (pth) k = +pth.dataset.k; }
    if (k === null && o.snap) {             // tiny countries: snap to the nearest centroid within ~22px
      const lim = 22 / pxPerUnit(); let best = lim;
      CTRY.forEach(c => { const [x, y] = proj(c.lat, c.lon), d = Math.hypot(x - mx, y - my); if (d < best) { best = d; k = c.i; } });
    }
    if (o.onTap) o.onTap({ x: mx, y: my, ...unproj(mx, my) }, k);
  };
  svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
  svg.addEventListener("wheel", e => { e.preventDefault(); const [mx, my] = toMap(e.clientX, e.clientY); zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? .01 : .0022)), mx, my); }, { passive: false });
  $(".mapctl", wrap).addEventListener("click", e => {
    const b = e.target.closest("[data-z]"); if (!b) return;
    const z = b.dataset.z, cx = vb[0] + vb[2] / 2, cy = vb[1] + vb[3] / 2;
    if (z === "fit") flyTo(home, 500); else { const to = clampVB([0, 0, vb[2] / (z === "in" ? 2 : .5), vb[3] / (z === "in" ? 2 : .5)]); flyTo([cx - to[2] / 2, cy - to[3] / 2, to[2], to[3]], 320); }
  });
  const api = {
    el: wrap, svg,
    fills(f) { paths.forEach(p => { const v = f[p.dataset.k]; if (v) { p.style.fill = v; p.classList.add("hl"); } else { p.style.fill = ""; p.classList.remove("hl"); } }); return api; },
    cls(map) { paths.forEach(p => { p.setAttribute("class", map[p.dataset.k] || ""); }); return api; },
    overlay(html) { ov.innerHTML = html; return api; },
    flyTo, home(v) { home = v.slice(); return api; },
    view: () => vb.slice(), unit: () => 1 / pxPerUnit(),
    destroy() { dead = true; cancelAnimationFrame(anim); }
  };
  requestAnimationFrame(() => { if (dead) return; vb = clampVB(fitAR(vb)); home = vb.slice(); apply(); });
  apply();
  return api;
}

/* ================= bottom sheet ================= */
function bottomSheet(html, { onClose, cls = "" } = {}) {
  const s = document.createElement("div"); s.className = "scrim";
  s.innerHTML = `<div class="sheet ${cls}" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  const close = () => { if (!s.isConnected) return; s.classList.add("out"); setTimeout(() => s.remove(), 180); document.removeEventListener("keydown", key); if (onClose) onClose(); };
  const key = e => { if (e.key === "Escape") close(); };
  s.addEventListener("click", e => { if (e.target === s || e.target.closest("[data-close]")) close(); });
  document.addEventListener("keydown", key);
  // drag the handle down to dismiss
  const sh = $(".sheet", s); let y0 = null;
  sh.addEventListener("pointerdown", e => { if (e.target.closest(".grab")) { y0 = e.clientY; sh.setPointerCapture(e.pointerId); } });
  sh.addEventListener("pointermove", e => { if (y0 !== null) sh.style.transform = `translateY(${Math.max(0, e.clientY - y0)}px)`; });
  sh.addEventListener("pointerup", e => { if (y0 === null) return; const d = e.clientY - y0; y0 = null; if (d > 80) close(); else sh.style.transform = ""; });
  document.body.appendChild(s);
  return { el: s, sheet: sh, close };
}

/* ================= guess bar (docked) ================= */
/* The guess UI lives in a bar docked to the bottom of the screen, so Submit is always one thumb-reach away.
   Type to filter (accent- and alias-aware), or browse by region. Selecting from the map works too. */
function searchCtry(q, pool, exclude) {
  const f = fold(q); if (!f) return [];
  const out = [];
  pool.forEach(c => {
    if (exclude.has(c.i)) return;
    let s = -1;
    if (c.f === f || c.fa.includes(f)) s = 0;
    else if (c.f.startsWith(f)) s = 1;
    else if (c.fa.some(a => a.startsWith(f))) s = 2;
    else if (c.f.split(" ").some(w => w.startsWith(f))) s = 3;
    else if (f.length > 2 && c.f.includes(f)) s = 4;
    if (s >= 0) out.push([s, c]);
  });
  return out.sort((a, b) => a[0] - b[0] || a[1].n.localeCompare(b[1].n)).slice(0, 6).map(x => x[1]);
}
function guessBar({ pool = CTRY, exclude = () => new Set(), onSelect, onSubmit, verb = "Guess", placeholder = "Type a country…", note }) {
  const bar = document.createElement("div"); bar.className = "gbar"; bar.setAttribute("role", "search");
  document.body.appendChild(bar); document.body.classList.add("has-gbar");
  let sel = null, q = "", hi = 0, dead = false;
  const flagHTML = c => `<span class="f">${ctryFlag(c)}</span>`;
  function draw(keepFocus) {
    if (dead) return;
    const ex = exclude(), sug = sel ? [] : searchCtry(q, pool, ex);
    hi = Math.min(hi, Math.max(0, sug.length - 1));
    bar.innerHTML = `${sug.length ? `<ul class="gsug" role="listbox">${sug.map((c, j) => `<li role="option" aria-selected="${j === hi}"><button type="button" data-pick="${c.i}">${flagHTML(c)}<span>${esc(c.n)}</span>${ic("arrow")}</button></li>`).join("")}</ul>`
      : q && !sel ? `<div class="gsug empty">${ex.size && searchCtry(q, pool, new Set()).length ? "Already guessed" : "No country matches that"}</div>` : ""}
      <div class="grow">${sel
        ? `<button type="button" class="gpill" data-clear aria-label="Clear selection">${flagHTML(sel)}<b>${esc(sel.n)}</b><i>${ic("x")}</i></button><button type="button" class="gsubmit" data-submit>${esc(verb)}${ic("arrow")}</button>`
        : `<label class="gfield">${ic("search")}<input type="text" inputmode="search" enterkeyhint="go" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="${esc(placeholder)}" value="${esc(q)}" aria-label="Search countries"></label><button type="button" class="gbrowse" data-browse aria-label="Browse all countries">${ic("list")}<span>Browse</span></button>`}</div>
      ${note && !q && !sel ? `<div class="gnote">${esc(note)}</div>` : ""}`;
    const inp = $("input", bar);
    if (inp) {
      inp.oninput = () => { q = inp.value; hi = 0; draw(true); };
      inp.onkeydown = e => {
        const s = searchCtry(q, pool, exclude());
        if (e.key === "ArrowDown") { hi = Math.min(hi + 1, s.length - 1); draw(true); e.preventDefault(); }
        else if (e.key === "ArrowUp") { hi = Math.max(hi - 1, 0); draw(true); e.preventDefault(); }
        else if (e.key === "Enter" && s.length) { e.preventDefault(); pick(s[hi].i, true); }
      };
      if (keepFocus) { inp.focus(); inp.setSelectionRange(q.length, q.length); }
    }
  }
  function pick(i, viaKeyboard) {
    const c = CTRY[i]; if (!c || exclude().has(i)) return;
    sel = c; q = ""; draw();
    if (onSelect) onSelect(c);
    if (viaKeyboard) { const b = $("[data-submit]", bar); if (b) b.focus(); }
  }
  bar.addEventListener("pointerdown", e => { if (e.target.closest("[data-pick],[data-submit],[data-clear],[data-browse]")) e.preventDefault(); }); // keep the keyboard up while tapping a suggestion
  bar.addEventListener("click", e => {
    const p = e.target.closest("[data-pick]"); if (p) return pick(+p.dataset.pick);
    if (e.target.closest("[data-clear]")) { sel = null; draw(true); if (onSelect) onSelect(null); return; }
    if (e.target.closest("[data-submit]")) { if (!sel) return; const c = sel; sel = null; q = ""; draw(); onSubmit(c); return; }
    if (e.target.closest("[data-browse]")) browse();
  });
  function browse() {
    let reg = "all", bq = "";
    const sh = bottomSheet(`<div class="bhead"><h3>Pick a country</h3><button class="iconbtn" data-close aria-label="Close">${ic("x")}</button></div>
      <label class="gfield light">${ic("search")}<input type="text" inputmode="search" autocomplete="off" placeholder="Filter" aria-label="Filter countries"></label>
      <div class="filters" id="breg">${REGION_CHIPS.map(([k, n]) => `<button data-r="${k}" aria-pressed="${k === "all"}">${n}</button>`).join("")}</div><div class="cgrid" id="bgrid"></div>`, { cls: "tall" });
    const grid = $("#bgrid", sh.el), ex = exclude();
    const fill = () => {
      const f = fold(bq), list = pool.filter(c => (reg === "all" || c.r === reg) && (!f || c.f.includes(f) || c.fa.some(a => a.includes(f)))).sort((a, b) => a.n.localeCompare(b.n));
      grid.innerHTML = list.map(c => `<button class="cbtn" data-c="${c.i}" ${ex.has(c.i) ? "disabled" : ""}>${flagHTML(c)}<span>${esc(c.n)}</span></button>`).join("") || `<p class="muted">Nothing matches.</p>`;
    };
    $("#breg", sh.el).onclick = e => { const b = e.target.closest("[data-r]"); if (!b) return; reg = b.dataset.r; $$("#breg button", sh.el).forEach(x => x.setAttribute("aria-pressed", x === b)); fill(); };
    $("input", sh.el).oninput = e => { bq = e.target.value; fill(); };
    grid.onclick = e => { const b = e.target.closest("[data-c]"); if (!b || b.disabled) return; sh.close(); pick(+b.dataset.c); };
    fill();
  }
  draw();
  return {
    select(i) { if (i === null) { sel = null; draw(); } else pick(i); },
    selected: () => sel,
    refresh: () => draw(),
    destroy() { dead = true; bar.remove(); document.body.classList.remove("has-gbar"); }
  };
}

/* keep docked bars above the on-screen keyboard (iOS Safari doesn't shrink fixed elements' containing block) */
(function () {
  const vv = window.visualViewport; if (!vv) return;
  const upd = () => document.documentElement.style.setProperty("--kb", Math.max(0, innerHeight - vv.height - vv.offsetTop) + "px");
  vv.addEventListener("resize", upd); vv.addEventListener("scroll", upd);
})();
