"""Build the app: src/* + assets/* -> index.html, plus the site icons beside it
Usage:  python build.py [output.html]      (needs: pip install pillow)
Images are re-encoded to WebP data URIs and embedded; all JS is concatenated into one <script>.
Next to the page it writes what browsers and other apps look for by URL: favicon.ico, apple-touch-icon.png,
site.webmanifest and icons/ (home-screen icons and the link-preview card). Deploy them together."""
import json, sys, os, io, base64
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
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
    # whole-map satellite image (tools/make_earth.py: NASA Blue Marble + Natural Earth relief), 84°N–58°S equirectangular
    "earth": webp(Image.open(f"{ROOT}/assets/images/earth/base.jpg").convert("RGB"), 72),
    "logo": webp(Image.open(f"{ROOT}/assets/brand/cerebrito-icon-rounded-1024.png").convert("RGBA").resize((160, 160), Image.LANCZOS), 90),
    "mark": webp(Image.open(f"{ROOT}/assets/brand/cerebrito-icon-rounded-1024.png").convert("RGBA").resize((560, 560), Image.LANCZOS), 86),
}
def png_uri(path, size):
    b = io.BytesIO(); Image.open(path).convert("RGBA").resize((size, size), Image.LANCZOS).save(b, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()
SITE_URL = "https://cerebritotraining.netlify.app"   # absolute links for link previews (og:image must be absolute)
NAME, TAGLINE = "Cerebrito", "Daily brain training: adaptive games, spaced-repetition recall and geography puzzles."
BRAND = f"{ROOT}/assets/brand"

def site_icons(outdir):
    """The logo everywhere a browser, phone or chat app looks for one."""
    sq = Image.open(f"{BRAND}/cerebrito-icon-1024.png").convert("RGB")             # full-bleed square (iOS rounds it)
    rd = Image.open(f"{BRAND}/cerebrito-icon-rounded-1024.png").convert("RGBA")     # rounded corners, transparent
    art = Image.open(f"{BRAND}/cerebrito-art-clean.png").convert("RGB")             # whole painting, more margin
    os.makedirs(f"{outdir}/icons", exist_ok=True)
    rd.save(f"{outdir}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])          # /favicon.ico: what most apps fetch
    sq.resize((180, 180), Image.LANCZOS).save(f"{outdir}/apple-touch-icon.png", optimize=True)
    for n in (192, 512): rd.resize((n, n), Image.LANCZOS).save(f"{outdir}/icons/icon-{n}.png", optimize=True)
    # maskable (Android adaptive icons crop to a circle or squircle): the whole painting keeps brain and pot inside the safe zone
    art.resize((512, 512), Image.LANCZOS).save(f"{outdir}/icons/icon-maskable-512.png", optimize=True)
    json.dump({"name": NAME, "short_name": NAME, "description": TAGLINE, "start_url": "./", "scope": "./", "display": "standalone",
               "background_color": "#FBF8FF", "theme_color": "#6D4AF0",
               "icons": [{"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
                         {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
                         {"src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]},
              open(f"{outdir}/site.webmanifest", "w"), indent=1)
    # link-preview card (Messages, WhatsApp, Slack...): 1200x630, the app's soft aurora with the logo and name
    W, H = 1200, 630
    yy, xx = np.mgrid[0:H, 0:W].astype("float32"); c = np.zeros((H, W, 3), "float32") + np.array([251, 248, 255], "float32")
    for (cx, cy, r, col, k) in [(160, 120, 520, (230, 222, 255), .9), (1120, 80, 460, (255, 227, 218), .8), (1000, 640, 520, (210, 245, 238), .7)]:
        w = np.clip(1 - np.hypot(xx - cx, yy - cy) / r, 0, 1)[..., None] ** 2 * k; c = c * (1 - w) + np.array(col, "float32") * w
    card = Image.fromarray(c.clip(0, 255).astype("uint8")).convert("RGBA")
    ic = rd.resize((400, 400), Image.LANCZOS)
    sh = Image.new("RGBA", (W, H), 0); sh.paste((60, 40, 140, 90), (100, 135, 500, 535), ic.split()[3])
    card = Image.alpha_composite(card, sh.filter(ImageFilter.GaussianBlur(28))); card.alpha_composite(ic, (90, 115))
    d = ImageDraw.Draw(card); f8 = ImageFont.truetype(f"{ROOT}/assets/fonts/outfit-latin-800-normal.woff", 112)
    f5 = ImageFont.truetype(f"{ROOT}/assets/fonts/outfit-latin-500-normal.woff", 44); f4 = ImageFont.truetype(f"{ROOT}/assets/fonts/outfit-latin-500-normal.woff", 30)
    d.text((560, 190), NAME, font=f8, fill=(24, 26, 47)); d.text((564, 330), "Daily brain training", font=f5, fill=(109, 74, 240))
    d.text((564, 400), "Adaptive games · Spaced recall", font=f4, fill=(92, 88, 120)); d.text((564, 442), "Geography & word puzzles", font=f4, fill=(92, 88, 120))
    card.convert("RGB").save(f"{outdir}/icons/og-image.jpg", quality=88, optimize=True, progressive=True)   # small: some apps skip big previews
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
# 10,800 px detail tiles for zooming in (already WebP; land tiles only)
_td = f"{ROOT}/assets/images/earth/tiles"; _ti = json.load(open(f"{_td}/index.json"))
_ti["t"] = {f[:-5]: "data:image/webp;base64," + base64.b64encode(open(f"{_td}/{f}", "rb").read()).decode() for f in sorted(os.listdir(_td)) if f.endswith(".webp")}
data = data.replace("__BORDERS50__", open(DATA + "borders50.txt").read())   # tools/make_borders.py
data = data.replace("__EARTH_TILES__", json.dumps(_ti, separators=(",", ":")))
eng = open(SRC + "engine.js").read().replace('"use strict";', "", 1).replace("__BANK_ES__", BANK_ES).replace("__BANK_TR__", BANK_TR)
geo = open(SRC + "geo.js").read().replace("__COUNTRIES__", open(DATA + "countries.json").read())
js = ('"use strict";\n' + data + "\n" + eng + "\n" + geo + "\n" + open(SRC + "app.js").read() + "\n" + open(SRC + "session.js").read() + "\n" + open(SRC + "puzzles.js").read() + "\n" + open(SRC + "awards.js").read() + "\n" + open(SRC + "onboard.js").read()
      + "\napplySkin(); processMissed(); render(); initCloud().finally(maybeOnboard);\n")
html=f'''<!doctype html>
<html lang="en" data-skin="andean">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1">
<title>Cerebrito</title>
<meta name="theme-color" content="#FBF8FF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#11122A" media="(prefers-color-scheme: dark)">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Cerebrito">
<meta name="description" content="{TAGLINE}">
<link rel="icon" href="favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<meta name="application-name" content="{NAME}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{NAME}">
<meta property="og:title" content="{NAME} · Daily brain training">
<meta property="og:description" content="{TAGLINE}">
<meta property="og:url" content="{SITE_URL}/">
<meta property="og:image" content="{SITE_URL}/icons/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="The Cerebrito bonsai-brain logo">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{SITE_URL}/icons/og-image.jpg">
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
site_icons(os.path.dirname(os.path.abspath(out)))
print(out, len(html) // 1024, "KB")
