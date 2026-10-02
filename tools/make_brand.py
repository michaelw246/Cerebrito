"""Build the Cerebrito logo set from the Memory bonsai-brain painting (assets/images/tree-memory.png).
The pot's engraved 'Memory' label is painted out, then the scene is cropped tighter for an app icon.
    pip install pillow numpy && python tools/make_brand.py   -> assets/brand/*.png"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT = f"{ROOT}/assets/brand"

def smooth(row, n=9):
    k = np.ones(n) / n
    return np.stack([np.convolve(np.pad(row[:, c], n // 2, mode="edge"), k, "valid") for c in range(3)], 1)

def clean_pot(im):
    """Rebuild the pot face under the lettering: each column is interpolated between the clean ceramic
    just above and just below the text, which keeps the cylinder's shading; light grain hides the blend."""
    a = np.asarray(im.convert("RGB")).astype(float); x0, x1, y0, y1 = 380, 646, 750, 832
    top, bot = smooth(a[y0 - 6:y0, x0:x1].mean(0)), smooth(a[y1:y1 + 6, x0:x1].mean(0))
    out = a.copy()
    for y in range(y0, y1):
        t = (y - y0) / (y1 - y0); out[y, x0:x1] = top * (1 - t) + bot * t
    out[y0:y1, x0:x1] += np.random.default_rng(3).normal(0, 1.1, (y1 - y0, x1 - x0, 1))
    m = np.zeros(a.shape[:2]); m[y0:y1, x0:x1] = 1
    m = np.asarray(Image.fromarray((m * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(4))) / 255.0
    m[y0 + 8:y1 - 8, x0 + 8:x1 - 8] = 1
    return Image.fromarray(np.clip(a * (1 - m[..., None]) + out * m[..., None], 0, 255).astype("uint8"))

def rounded(im, r=0.225):
    """iOS-style rounded square with transparent corners (supersampled for smooth edges)."""
    s = im.size[0]; big = Image.new("L", (s * 4, s * 4), 0)
    ImageDraw.Draw(big).rounded_rectangle((0, 0, s * 4 - 1, s * 4 - 1), radius=int(s * 4 * r), fill=255)
    out = im.convert("RGBA"); out.putalpha(big.resize((s, s), Image.LANCZOS)); return out

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    art = clean_pot(Image.open(f"{ROOT}/assets/images/tree-memory.png"))
    art.save(f"{OUT}/cerebrito-art-clean.png")                       # full painting, label removed
    icon = art.crop((84, 64, 944, 924)).resize((1024, 1024), Image.LANCZOS)   # tighter: brain and pot fill the tile
    icon.save(f"{OUT}/cerebrito-icon-1024.png")                       # square: App Store / Play (platform masks corners)
    icon.resize((180, 180), Image.LANCZOS).save(f"{OUT}/apple-touch-icon.png")
    r = rounded(icon); r.save(f"{OUT}/cerebrito-icon-rounded-1024.png")
    for n in (512, 192): r.resize((n, n), Image.LANCZOS).save(f"{OUT}/cerebrito-icon-{n}.png")
    r.resize((64, 64), Image.LANCZOS).save(f"{OUT}/favicon-64.png")
    print("wrote", sorted(os.listdir(OUT)))
