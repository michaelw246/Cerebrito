"""Country adjacency graph + centroids + Travle start/end pairs.
Output: assets/data/geo.json  {names, adj, cent(lat,lon), pairs}"""
import json, os, re, random
from collections import deque
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
d = json.load(open(f"{ROOT}/assets/data/source/world-atlas-countries-110m.json"))
geoms = [g for g in d["objects"]["countries"]["geometries"] if g.get("type") in ("Polygon", "MultiPolygon") and g["properties"]["name"] != "Antarctica"]
names = [g["properties"]["name"] for g in geoms]
arcown = {}
for gi, g in enumerate(geoms):
    rings = g["arcs"] if g["type"] == "Polygon" else [r for p in g["arcs"] for r in p]
    for r in rings:
        for a in r: arcown.setdefault(a if a >= 0 else ~a, set()).add(gi)   # shared arc = shared border
adj = {i: set() for i in range(len(names))}
for s in arcown.values():
    s = list(s)
    for i in s:
        for j in s:
            if i != j: adj[i].add(j)
wp = json.load(open(f"{ROOT}/assets/data/worldpaths.json"))["c"]
cent = {}
for n, p in wp.items():
    best = max(p.split("M")[1:], key=len)      # biggest ring ~ mainland
    pts = [tuple(map(float, x.split(","))) for x in re.findall(r"-?[\d.]+,-?[\d.]+", best)]
    x = sum(a for a, b in pts) / len(pts); y = sum(b for a, b in pts) / len(pts)
    cent[n] = (round(84 - y * 360 / 1000, 2), round(x * 360 / 1000 - 180, 2))
def bfs(a):
    dist = {a: 0}; q = deque([a])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in dist: dist[v] = dist[u] + 1; q.append(v)
    return dist
pairs = []
for a in [i for i in range(len(names)) if adj[i]]:
    for b, dd in bfs(a).items():
        if a < b and 3 <= dd <= 6: pairs.append((a, b, dd))
random.seed(7); random.shuffle(pairs)
KNOWN = ["Argentina","Bolivia","Brazil","Chile","Colombia","Ecuador","Peru","Paraguay","Uruguay","Venezuela","Mexico","Guatemala","Honduras","Nicaragua","Costa Rica","Panama","United States of America","Canada","France","Spain","Portugal","Germany","Italy","Switzerland","Austria","Poland","Czechia","Hungary","Croatia","Serbia","Montenegro","Albania","Greece","Bulgaria","Romania","Ukraine","Belarus","Lithuania","Latvia","Finland","Sweden","Norway","Denmark","Netherlands","Belgium","Slovakia","Slovenia","Russia","Turkey","Georgia","Iran","Iraq","Syria","Jordan","Israel","Saudi Arabia","Egypt","Libya","Tunisia","Algeria","Morocco","Sudan","Ethiopia","Kenya","Uganda","Tanzania","Dem. Rep. Congo","Angola","Zambia","Zimbabwe","Mozambique","Namibia","Botswana","South Africa","Nigeria","Niger","Chad","Mali","Senegal","Ghana","Cameroon","India","Pakistan","Afghanistan","Nepal","Bangladesh","Myanmar","Thailand","Laos","Cambodia","Vietnam","Malaysia","China","Mongolia","Kazakhstan","Uzbekistan","North Korea","South Korea","Oman","Yemen"]
pairs = [p for p in pairs if names[p[0]] in KNOWN and names[p[1]] in KNOWN][:400]
json.dump({"names": names, "adj": [sorted(adj[i]) for i in range(len(names))], "cent": [cent.get(n, (0, 0)) for n in names], "pairs": [[a, b] for a, b, _ in pairs]},
          open(f"{ROOT}/assets/data/geo.json", "w"), separators=(",", ":"), ensure_ascii=False)
print(len(names), "countries,", len(pairs), "travle pairs")
