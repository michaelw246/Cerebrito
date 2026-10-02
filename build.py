"""Build the single-file app: src/* + assets/* -> index.html
Usage:  python tools/../build.py [output.html]      (needs: pip install pillow)
Images are re-encoded to WebP data URIs and embedded; all JS is concatenated into one <script>."""
import json, sys, os, io, base64
from PIL import Image
ROOT = os.path.dirname(os.path.abspath(__file__))
IMG = f"{ROOT}/assets/images/"; DATA = f"{ROOT}/assets/data/"; SRC = f"{ROOT}/src/"
def webp(im, q):
    b = io.BytesIO(); im.save(b, "WEBP", quality=q, method=6)
    return "data:image/webp;base64," + base64.b64encode(b.getvalue()).decode()
def rect(path, w, q=78):
    im = Image.open(path).convert("RGB"); return webp(im.resize((w, int(im.size[1] * w / im.size[0])), Image.LANCZOS), q)
def uri(path, size, crop=None, q=80):
    im = Image.open(path).convert("RGB")
    if crop: im = im.crop(crop)
    return webp(im.resize((size, size), Image.LANCZOS), q)
imgs = {
    "avatar": uri(IMG + "avatar-source.png", 220, (290, 170, 770, 650)),   # face crop
    "hero": rect(IMG + "hero-mountaineer.png", 640),
    "logo": webp(Image.open(f"{ROOT}/assets/brand/cerebrito-icon-rounded-1024.png").convert("RGBA").resize((160, 160), Image.LANCZOS), 90),
    "mark": webp(Image.open(f"{ROOT}/assets/brand/cerebrito-mark-1024.png").convert("RGBA").resize((360, 360), Image.LANCZOS), 88),
}
def png_uri(path, size):
    b = io.BytesIO(); Image.open(path).convert("RGBA").resize((size, size), Image.LANCZOS).save(b, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()
FAVICON = png_uri(f"{ROOT}/assets/brand/cerebrito-icon-rounded-1024.png", 64)
TOUCH = png_uri(f"{ROOT}/assets/brand/cerebrito-icon-1024.png", 180)
for k, f in [("t_memory", "memory"), ("t_speed", "speed"), ("t_flex", "flexibility"), ("t_numbers", "numbers"), ("t_focus", "focus"),
             ("t_logic", "logic"), ("t_spatial", "spatial"), ("t_spanish", "spanish"), ("t_travel", "travel")]:
    imgs[k] = uri(IMG + f"tree-{f}.png", 400, q=78)
css = open(SRC + "style.css").read()
data = open(SRC + "data.js").read().replace("__VALID__", open(DATA + "valid.txt").read())
BANK_TR = open(f"{ROOT}/content/travel.json").read()
_es = json.load(open(f"{ROOT}/backup/spanish-wordbank.json")); _es.setdefault("updatedAt", 1790899200000)
BANK_ES = json.dumps(_es, ensure_ascii=False, separators=(",", ":"))
_e = json.load(open(DATA + "enwords.json"))
data = (data.replace("__GEO__", open(DATA + "geo.json").read()).replace("__BEE__", " ".join(_e["bee"])).replace("__BP__", json.dumps(_e["bp"]))
            .replace("__ANS5__", "".join(_e["ans5"])).replace("__V5__", "".join(_e["v5"])))
for k, v in imgs.items(): data = data.replace(f"__IMG_{k}__", v)
eng = open(SRC + "engine.js").read().replace('"use strict";', "", 1).replace("__BANK_ES__", BANK_ES).replace("__BANK_TR__", BANK_TR)
geo = open(SRC + "geo.js").read().replace("__COUNTRIES__", open(DATA + "countries.json").read())
js = ('"use strict";\n' + data + "\n" + eng + "\n" + geo + "\n" + open(SRC + "app.js").read() + "\n" + open(SRC + "session.js").read() + "\n" + open(SRC + "puzzles.js").read() + "\n" + open(SRC + "awards.js").read() + "\n" + open(SRC + "onboard.js").read()
      + "\napplySkin(); processMissed(); render(); initCloud().finally(maybeOnboard);\n")
html=f'''<!doctype html>
<html lang="en" data-skin="andean">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Cerebrito</title>
<meta name="theme-color" content="#FBF8FF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#11122A" media="(prefers-color-scheme: dark)">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Cerebrito">
<meta name="description" content="Daily brain training: adaptive games, spaced-repetition recall and geography puzzles.">
<link rel="icon" type="image/png" href="{FAVICON}">
<link rel="apple-touch-icon" href="{TOUCH}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500..800&family=Plus+Jakarta+Sans:wght@400..800&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
<div class="app" id="app"></div>
<div class="tabs" id="tabs"><nav>
  <button data-tab="train" aria-label="Mind"><svg class="ic" viewBox="0 0 24 24"><path d="M6.6 11.4a2.8 2.8 0 01.4-5.2 3.4 3.4 0 015-2.4 3.4 3.4 0 015 2.4 2.8 2.8 0 01.4 5.2 2.6 2.6 0 01-2.3 1.3H8.9a2.6 2.6 0 01-2.3-1.3z"/><path d="M12 3.8v3.4M9.6 7.6c1 .3 1.8 1 2.1 2M14.4 7.6c-1 .3-1.8 1-2.1 2"/><path d="M12 12.7c.3 1.6-1 2.3-.9 3.8M12.4 14.3c.8.4 1.5.6 2.3.5"/><path d="M7.5 17.3h9l-1.1 3.7H8.6z"/></svg><span>Mind</span></button>
  <button data-tab="puzzles" aria-label="Puzzles"><svg class="ic" viewBox="0 0 24 24"><path d="M9 3h3a2 2 0 014 0h3v5a2 2 0 010 4v5h-5a2 2 0 00-4 0H4v-5a2 2 0 000-4V3z"/></svg><span>Puzzles</span></button>
  <button data-tab="map" aria-label="Home" class="home"><svg class="ic" viewBox="0 0 24 24"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/></svg><span>Home</span></button>
  <button data-tab="journey" aria-label="Journey"><svg class="ic" viewBox="0 0 24 24"><path d="M3 20l6-10 4 6 2.5-3.5L21 20z"/><path d="M9 10V4l4.5 1.6L9 7.2"/></svg><span>Journey</span></button>
  <button data-tab="pass" aria-label="You"><svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg><span>You</span></button>
</nav></div>
<script>
{js}
</script>
</body>
</html>'''
out = sys.argv[1] if len(sys.argv) > 1 else f"{ROOT}/index.html"
open(out, "w").write(html)
print(out, len(html) // 1024, "KB")
