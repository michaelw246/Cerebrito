"""Detailed land borders for the zoomed-in map: assets/data/borders50.txt (one SVG path, map units).

Natural Earth 1:50m via the npm package world-atlas (countries-50m.json, TopoJSON). Only arcs shared by two countries
are kept: coastlines come from the satellite imagery, which at zoom is sharper than any outline.
    python tools/make_borders.py path/to/world-atlas/countries-50m.json
"""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAT0, STEP, MIN_GAP = 84, 0.05, 0.06   # map's top latitude; coordinate rounding and minimum point spacing (map units)

def main(src):
    t = json.load(open(src)); sx, sy = t["transform"]["scale"]; tx, ty = t["transform"]["translate"]
    users = {}
    def walk(arcs, gid):
        for a in arcs:
            if isinstance(a, list): walk(a, gid)
            else: users.setdefault(a if a >= 0 else ~a, set()).add(gid)
    for g in t["objects"]["countries"]["geometries"]: walk(g.get("arcs", []), g.get("id") or id(g))
    out = []
    for i, arc in enumerate(t["arcs"]):
        if len(users.get(i, ())) < 2: continue
        x = y = 0; pts = []
        for dx, dy in arc:
            x += dx; y += dy; lon, lat = x * sx + tx, y * sy + ty
            if lat < -58: continue
            p = (round((lon + 180) / 360 * 1000 / STEP) * STEP, round((LAT0 - lat) / 360 * 1000 / STEP) * STEP)
            if not pts or abs(p[0] - pts[-1][0]) + abs(p[1] - pts[-1][1]) >= MIN_GAP: pts.append(p)
        if len(pts) > 1: out.append("M" + " ".join(f"{a:g},{b:g}" for a, b in pts))
    d = "".join(out); open(f"{ROOT}/assets/data/borders50.txt", "w").write(d)
    print(len(out), "border lines,", len(d) // 1000, "KB")

if __name__ == "__main__":
    main(sys.argv[1])
