"""English word lists for Wordle + Spelling Bee.
Needs: pip install wordfreq english-words
Output: assets/data/enwords.json  {bee, w5, ans5, bp (bee puzzles: [outer letters, centre]), v5 (valid Wordle guesses)}"""
import json, os, random
from english_words import get_english_words_set
from wordfreq import top_n_list, zipf_frequency
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
dic = get_english_words_set(["gcide"], lower=True, alpha=True)
common = [w for w in top_n_list("en", 60000) if w in dic and w.isascii() and w.isalpha() and 4 <= len(w) <= 12]
bee = [w for w in common if zipf_frequency(w, "en") >= 2.6]
w5 = [w for w in common if len(w) == 5]
ans5 = [w for w in w5 if zipf_frequency(w, "en") >= 3.6 and not w.endswith("s")]
random.seed(3)
pang = [w for w in bee if len(set(w)) == 7 and "s" not in w and zipf_frequency(w, "en") >= 3.2]
beeset = [w for w in bee if "s" not in w]
puzzles = []
for p in pang:
    L = set(p)
    for c in sorted(L):
        ans = [w for w in beeset if c in w and set(w) <= L]
        if 18 <= len(ans) <= 55:
            puzzles.append((("".join(sorted(L - {c}))), c)); break
random.shuffle(puzzles)
v = set(w5) | set(ans5)
for w in top_n_list("en", 80000):
    if len(w) == 5 and w.isalpha() and w.isascii(): v.add(w)
json.dump({"bee": beeset, "w5": w5, "ans5": ans5, "bp": puzzles, "v5": sorted(v)}, open(f"{ROOT}/assets/data/enwords.json", "w"))
print(len(beeset), "bee words,", len(puzzles), "bee puzzles,", len(ans5), "wordle answers")
