"""Natural Earth 110m (world-atlas TopoJSON) -> projected SVG path per country.
Output: assets/data/worldpaths.json  {H, c:{country name: svg path}}
Projection: equirectangular, 1000 units wide, lat 84N..58S. (data.js already has the result baked in.)"""
import json, os
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
d = json.load(open(f"{ROOT}/assets/data/source/world-atlas-countries-110m.json"))
sx, sy = d["transform"]["scale"]; tx, ty = d["transform"]["translate"]
arcs = []
for a in d["arcs"]:
    x = y = 0; pts = []
    for dx, dy in a:
        x += dx; y += dy; pts.append((x * sx + tx, y * sy + ty))
    arcs.append(pts)
W = 1000; LAT0 = 84; LAT1 = -58; H = (LAT0 - LAT1) / 360 * W
def P(lon, lat): return ((lon + 180) / 360 * W, (LAT0 - max(LAT1, min(LAT0, lat))) / 360 * W)
def ring(r):
    pts = []
    for i in r:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts.extend(a if not pts else a[1:])
    return pts
def path(rings):
    out = []
    for r in rings:
        pp = [P(*p) for p in ring(r)]
        segs = [[]]
        for p in pp:
            if segs[-1] and abs(p[0] - segs[-1][-1][0]) > 300: segs.append([])
            segs[-1].append(p)
        for s in segs:
            q = [s[0]]
            for p in s[1:]:
                if abs(p[0] - q[-1][0]) + abs(p[1] - q[-1][1]) > 0.7: q.append(p)
            if len(q) < 3: continue
            out.append("M" + " ".join(f"{x:.1f},{y:.1f}" for x, y in q) + "Z")
    return "".join(out)
res = {}
for g in d["objects"]["countries"]["geometries"]:
    t = g.get("type")
    if t == "Polygon": rings = g["arcs"]
    elif t == "MultiPolygon": rings = [r for poly in g["arcs"] for r in poly]
    else: continue
    res[g["properties"]["name"]] = path(rings)
json.dump({"H": H, "c": res}, open(f"{ROOT}/assets/data/worldpaths.json", "w"))
print(len(res), "countries")
