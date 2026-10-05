"""Build the map's satellite imagery: assets/images/earth/base.jpg (whole map) + tiles/ (sharp detail for zooming in).

Sources, both public domain, from the PyPI package basemap-data (downloaded and cached on first run):
  bmng.jpg           NASA Blue Marble Next Generation, 5400 x 2700: true colour, but soft at the coast
  shadedrelief.jpg   Natural Earth shaded relief, 10800 x 5400: crisp coastlines, islands and terrain, but not photographic
They're fused at 10800 px (30 px per degree): Blue Marble's colours are laid over the relief's coastline, so the sea/land
edge is sharp, and the relief's hill shading adds terrain detail. Only the map's latitude band (84N to 58S) is kept.
The 10800 px image is cut into 540 px tiles; tiles with no land are dropped (the base image covers open sea).

    pip install numpy pillow && python tools/make_earth.py
"""
import io, os, json, zipfile, urllib.request
import numpy as np
from PIL import Image, ImageFilter

Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = f"{ROOT}/assets/images/earth"
CACHE = os.path.expanduser("~/.cache/cerebrito/basemap_data.whl")
LAT0, LAT1 = 84, -58                     # the map's band (WORLD.LAT0 and the southern crop)
W = 10800                                # detail resolution, px for 360 degrees
TILE = 540                               # tile edge, px (20 columns)
BASE_W = 4096                            # whole-map image width
DETAIL = 0.85                            # strength of relief shading on land
QUALITY = 75                             # tile WebP quality (lower shows blocks at full zoom)


def sources():
    if not os.path.exists(CACHE):
        os.makedirs(os.path.dirname(CACHE), exist_ok=True)
        meta = json.load(urllib.request.urlopen("https://pypi.org/pypi/basemap-data/2.0.0/json"))
        url = next(u["url"] for u in meta["urls"] if u["filename"].endswith(".whl"))
        urllib.request.urlretrieve(url, CACHE)
    z = zipfile.ZipFile(CACHE)
    bm = Image.open(io.BytesIO(z.read("mpl_toolkits/basemap_data/bmng.jpg"))).convert("RGB")
    sr = Image.open(io.BytesIO(z.read("mpl_toolkits/basemap_data/shadedrelief.jpg"))).convert("RGB")
    return bm, sr


def band(im):
    w, h = im.size
    return im.crop((0, round((90 - LAT0) / 180 * h), w, round((90 - LAT1) / 180 * h)))


def box(a, r, passes=3):
    """Separable box blur repeated (close to a Gaussian), edges clamped; a is 2-D or 3-D float32."""
    for _ in range(passes):
        for ax in (0, 1):
            p = [(0, 0)] * a.ndim; p[ax] = (r + 1, r)
            c = np.cumsum(np.pad(a, p, mode="edge"), axis=ax, dtype=np.float64)
            hi = np.take(c, np.arange(2 * r + 1, c.shape[ax]), axis=ax); lo = np.take(c, np.arange(0, c.shape[ax] - 2 * r - 1), axis=ax)
            a = ((hi - lo) / (2 * r + 1)).astype(np.float32)
    return a


def fill(img, m):
    """Spread img's colours from where mask m is true into the rest (normalised convolution at growing radii)."""
    out = np.where(m[..., None], img, 0).astype(np.float32); done = m.copy()
    for r in (2, 4, 8, 16, 32, 64, 128):
        num = box(np.where(m[..., None], img, 0).astype(np.float32), r, 2); den = box(m.astype(np.float32), r, 2)
        ok = (den > 1e-4) & ~done
        out[ok] = num[ok] / den[ok][:, None]; done |= ok
        if done.all(): break
    return out


def main():
    bm, sr = sources()
    bm, sr = band(bm), band(sr)
    H = sr.size[1]
    srA = np.asarray(sr).astype(np.int16)
    # sea in the relief is a pale-to-mid blue: clearly bluer than both red and green (ice and snow are near-white)
    water = ((srA[..., 2] - srA[..., 0]) >= 22) & ((srA[..., 2] - srA[..., 1]) >= 8)
    land = ~np.asarray(Image.fromarray((water * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(3))).astype(bool)
    del water
    # Blue Marble colour fields, sampled only well inside land and well inside sea so coastal blur doesn't leak across
    bw, bh = bm.size
    frac = np.asarray(Image.fromarray((land * 255).astype(np.uint8)).resize((bw, bh), Image.BOX)).astype(np.float32) / 255
    core = lambda m: np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5))).astype(bool)
    bmA = np.asarray(bm).astype(np.float32)
    landcol, seacol = fill(bmA, core(frac > .99)), fill(bmA, core(frac < .01))
    del frac, bmA
    up = lambda a: Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    landcol, seacol = np.asarray(up(landcol)), np.asarray(up(seacol))
    lum = (srA[..., 0] * .3 + srA[..., 1] * .59 + srA[..., 2] * .11).astype(np.float32)
    del srA
    full = np.zeros((H, W, 3), np.uint8)
    M = 24   # strip margin for the blurs
    for y0 in range(0, H, TILE):
        y1 = min(H, y0 + TILE); a, b = max(0, y0 - M), min(H, y1 + M)
        L = lum[a:b]; detail = (L - box(L, 5)) / 255                      # hill shading: the relief's local light and shade
        soft = box(land[a:b].astype(np.float32), 1, 1)[..., None]           # 1 px anti-aliased coastline
        lc = landcol[a:b].astype(np.float32) * (1 + DETAIL * detail[..., None])
        px = soft * lc + (1 - soft) * seacol[a:b].astype(np.float32)
        full[y0:y1] = np.clip(px[y0 - a:y0 - a + (y1 - y0)], 0, 255).astype(np.uint8)
    img = Image.fromarray(full)
    img.resize((BASE_W, round(H * BASE_W / W)), Image.LANCZOS).save(f"{OUT}/base.jpg", quality=92)
    tdir = f"{OUT}/tiles"; os.makedirs(tdir, exist_ok=True)
    for f in os.listdir(tdir): os.remove(f"{tdir}/{f}")
    kept, size = 0, 0
    for r in range((H + TILE - 1) // TILE):
        for c in range(W // TILE):
            box_ = (c * TILE, r * TILE, (c + 1) * TILE, min(H, (r + 1) * TILE))
            if not land[box_[1]:box_[3], box_[0]:box_[2]].any(): continue
            p = f"{tdir}/r{r}c{c}.webp"; img.crop(box_).save(p, quality=QUALITY, method=6); kept += 1; size += os.path.getsize(p)
    json.dump({"w": W, "h": H, "tile": TILE}, open(f"{tdir}/index.json", "w"))
    print(f"base {BASE_W}px, {kept} tiles ({size // 1000} KB) at {W}px")


if __name__ == "__main__":
    main()
