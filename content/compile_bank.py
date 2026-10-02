"""Compile the knowledge bank: content/facts/*.py -> content/travel.json (what the app loads from its database).
Each fact row: (category, topic, question, answer, wrong1, wrong2, wrong3). Rows are interleaved across the six app categories."""
import sys, os, json
from collections import OrderedDict, Counter
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, f"{HERE}/facts")
from facts6 import F      # facts1 -> ... -> facts6 each import the previous list
F = [r for r in F if not r[2].startswith("What does 'allillanchu?' mean")]   # Quechua: keep only añay + tupananchiskama
HIST = {"Pyramids","Sphinx","Valley of the Kings","Karnak","Hatshepsut","Alexander & Ptolemies","Caesar & Cleopatra","Hawara Labyrinth","Colosseum","Gladiators","Aqueducts","Monuments of Rome","Pompeii & Vesuvius","Vatican","Incas","Pizarro & the conquest","Cusco & Sacred Valley","Machu Picchu","Aztecs & pyramids","Berlin Wall","Hitler & the Nazis","WWI","WWII","Samurai & katana","Alcatraz","China"}
PEOPLE = {"Alexander the Great","Genghis Khan","Napoleon","Other great leaders","Alan Turing & Enigma","Pablo Escobar","Nimsdai","Elon Musk"}
NATURE = {"The 8,000ers","Annapurna & Nepal","Huaraz & Cordillera Blanca","Death Road & summits","Pumas & jaguars","Amazon"}
def cat(r):
    c, p = r[0], r[1]
    if c == "Health": return "Health & fitness"
    if p in PEOPLE: return "Notable people"
    if c == "AI & Tech": return "AI & tech"
    if p in NATURE: return "Mountains & nature"
    if p in HIST or c == "World Wars": return "History"
    return "Countries"
qs = Counter(r[2] for r in F); assert not [q for q, c in qs.items() if c > 1], "duplicate question"
assert not [r for r in F if r[3] in r[4:]], "answer repeated among wrong options"
by = OrderedDict((k, []) for k in ["Countries","History","Notable people","Health & fitness","Mountains & nature","AI & tech"])
for r in F: by[cat(r)].append(r)
out = []
while any(by.values()):
    for k in by:
        if by[k]: out.append((k, by[k].pop(0)))
items = [{"cat": k, "place": r[1], "country": r[0], "q": r[2], "a": r[3], "wrong": list(r[4:])} for k, r in out]
json.dump({"items": items, "updatedAt": 1790899200000}, open(f"{HERE}/travel.json", "w"), ensure_ascii=False)
print(len(items), "questions", dict(Counter(i["cat"] for i in items)))
