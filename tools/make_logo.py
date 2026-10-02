"""Generate the Cerebrito bonsai-brain logo.
    python tools/make_logo.py            -> assets/brand/*.svg
Then render PNGs with:  python tools/render_brand.py   (uses Playwright's Chromium)
The brain is drawn in lateral view; its brainstem continues down as the bonsai trunk."""
import math, os, random
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = f"{ROOT}/assets/brand"

BRAIN = ("M300 420 C246 384 240 290 302 240 C346 194 428 170 508 176 C596 160 700 182 756 244 "
         "C808 300 806 384 760 420 C746 434 728 442 708 446 C724 470 712 506 680 512 C650 518 626 506 614 490 "
         "C588 500 542 504 500 494 C456 484 428 472 408 458 C372 464 324 452 300 420 Z")

def gyri(seed=7):
    """Meandering sulci clipped to the brain: sinuous rows + a few hooks, like real cortex folds."""
    rnd = random.Random(seed); paths = []
    for k, y0 in enumerate(range(222, 480, 44)):
        pts, x = [], 230
        ph, amp, f = rnd.uniform(0, 6.28), rnd.uniform(11, 17), rnd.uniform(.024, .03)
        while x <= 820:
            y = y0 + amp * math.sin(x * f + ph) + 6 * math.sin(x * f * 2.3 + ph * 1.7)
            pts.append((x, y)); x += 14
        # break each row into 2-3 segments so it reads as folds, not stripes
        cuts = sorted(rnd.sample(range(6, len(pts) - 6), 2))
        segs = [pts[:cuts[0]], pts[cuts[0] + 2:cuts[1]], pts[cuts[1] + 2:]]
        for s in segs:
            if len(s) < 3: continue
            d = f"M{s[0][0]:.0f} {s[0][1]:.0f}" + "".join(f" L{x:.0f} {y:.0f}" for x, y in s[1:])
            paths.append(d)
            # hook: a short fold dropping off some segment ends
            ex, ey = s[-1]
            if rnd.random() < .5: paths.append(f"M{ex:.0f} {ey:.0f} Q{ex + 10:.0f} {ey + 16:.0f} {ex - 2:.0f} {ey + 24:.0f}")
    return paths

def icon(rounded=False, bg=True):
    g = gyri()
    sulci = "".join(f'<path d="{d}"/>' for d in g)
    shell = f'<rect width="1024" height="1024" rx="{230 if rounded else 0}" fill="url(#sky)"/><rect width="1024" height="1024" rx="{230 if rounded else 0}" fill="url(#halo)"/>' if bg else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
<title>Cerebrito</title>
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1C1452"/><stop offset=".52" stop-color="#4E33C4"/><stop offset=".84" stop-color="#B66FD4"/><stop offset="1" stop-color="#FF9E7A"/>
  </linearGradient>
  <radialGradient id="halo" cx="512" cy="372" r="400" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#FFE6F4" stop-opacity=".5"/><stop offset=".5" stop-color="#B99BFF" stop-opacity=".18"/><stop offset="1" stop-color="#8B6CFF" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="brain" x1=".1" y1="0" x2=".9" y2="1">
    <stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#EEE6FF"/><stop offset="1" stop-color="#B9A0FF"/>
  </linearGradient>
  <radialGradient id="sheen" cx="420" cy="270" r="320" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#3E2320"/><stop offset=".5" stop-color="#9C603F"/><stop offset="1" stop-color="#4C2B23"/>
  </linearGradient>
  <linearGradient id="pot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2D2276"/><stop offset="1" stop-color="#120D3A"/></linearGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F2BE68"/><stop offset=".5" stop-color="#FFEBC2"/><stop offset="1" stop-color="#E3A04A"/></linearGradient>
  <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="bl" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4"/></filter>
  <clipPath id="clip"><path d="{BRAIN}"/></clipPath>
</defs>
{shell}
<g transform="translate(512 532) scale(.95) translate(-512 -520)">
  <ellipse cx="512" cy="896" rx="220" ry="16" fill="#140E3E" opacity=".22"/>
  <!-- trunk: the brainstem grows down into a bonsai -->
  <path d="M592 468 C600 528 546 552 550 606 C554 656 626 664 610 726 C602 756 572 772 548 784 C590 786 640 790 668 796 L380 796 C420 790 470 784 492 776 C530 760 552 744 556 718 C562 676 490 662 492 604 C494 546 552 520 550 468 Z" fill="url(#trunk)"/>
  <path d="M572 484 C574 532 522 556 526 606 C530 650 590 668 584 716" fill="none" stroke="#D29A6C" stroke-width="6" stroke-linecap="round" opacity=".5"/>
  <!-- a lower branch carrying a single new thought -->
  <path d="M522 628 C486 618 456 596 436 566" fill="none" stroke="#6E3F2C" stroke-width="15" stroke-linecap="round"/>
  <circle cx="430" cy="556" r="34" fill="#FFB89E" opacity=".45" filter="url(#bl)"/>
  <circle cx="430" cy="556" r="20" fill="#FFE3D6"/>
  <!-- canopy -->
  <path d="{BRAIN}" fill="#E4D6FF" opacity=".6" filter="url(#glow)"/>
  <path d="{BRAIN}" fill="url(#brain)"/>
  <g clip-path="url(#clip)">
    <rect x="200" y="140" width="660" height="400" fill="url(#sheen)"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <g stroke="#FFFFFF" stroke-width="12" opacity=".8" transform="translate(-3 -4)">{sulci}</g>
      <g stroke="#8A6CF0" stroke-width="10" opacity=".58">{sulci}</g>
      <path d="M520 178 C504 236 540 268 514 322 C496 358 520 392 504 440" stroke="#7456E6" stroke-width="11" opacity=".55"/>
      <path d="M332 410 C392 398 446 414 502 400 C560 386 614 404 700 386" stroke="#7456E6" stroke-width="11" opacity=".5"/>
    </g>
    <path d="M708 446 C724 470 712 506 680 512 C650 518 626 506 614 490 C630 470 668 452 708 446 Z" fill="#CDB9FF" opacity=".55"/>
    <g fill="none" stroke="#7E62EA" stroke-width="6" stroke-linecap="round" opacity=".55">
      <path d="M632 474 C656 466 684 466 702 474"/><path d="M628 492 C652 486 680 488 698 496"/>
    </g>
  </g>
  <!-- pot -->
  <path d="M330 790 L694 790 C704 790 710 798 706 808 L674 870 C670 878 662 882 653 882 L371 882 C362 882 354 878 350 870 L318 808 C314 798 320 790 330 790 Z" fill="url(#pot)"/>
  <path d="M352 806 L672 806" stroke="#FFFFFF" stroke-width="3" opacity=".08"/>
  <rect x="306" y="774" width="412" height="26" rx="13" fill="url(#rim)"/>
  <path d="M352 776 C392 756 444 760 480 768 C520 754 572 756 610 766 C640 758 670 764 690 776 Z" fill="#62C891"/>
  <path d="M384 774 C412 764 440 766 468 772" fill="none" stroke="#BFF2D4" stroke-width="5" stroke-linecap="round" opacity=".8"/>
  <rect x="384" y="880" width="42" height="12" rx="6" fill="#0E0A2E"/><rect x="598" y="880" width="42" height="12" rx="6" fill="#0E0A2E"/>
  <!-- thoughts drifting up like pollen -->
  <g fill="#FFFFFF">
    <circle cx="318" cy="168" r="7" opacity=".9"/><circle cx="276" cy="226" r="4" opacity=".65"/><circle cx="388" cy="124" r="5" opacity=".8"/>
    <circle cx="482" cy="104" r="8" opacity=".95"/><circle cx="570" cy="90" r="4" opacity=".7"/><circle cx="652" cy="116" r="6" opacity=".85"/>
    <circle cx="738" cy="156" r="8" opacity=".9"/><circle cx="792" cy="214" r="4" opacity=".65"/>
  </g>
  <g fill="#FFFFFF" filter="url(#bl)" opacity=".7"><circle cx="482" cy="104" r="15"/><circle cx="738" cy="156" r="15"/><circle cx="318" cy="168" r="12"/></g>
  <path d="M610 34 L616 58 L640 64 L616 70 L610 94 L604 70 L580 64 L604 58 Z" fill="#FFF1D2"/>
</g>
</svg>'''

def mark():
    """Monochrome glyph for small sizes / UI chrome (currentColor)."""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor">
<g transform="translate(512 540) scale(1.02) translate(-512 -520)">
  <path d="{BRAIN}"/>
  <path d="M592 468 C600 528 546 552 550 606 C554 656 626 664 610 726 C602 756 572 772 548 784 L492 776 C530 760 552 744 556 718 C562 676 490 662 492 604 C494 546 552 520 550 468 Z"/>
  <rect x="306" y="774" width="412" height="30" rx="15"/>
  <path d="M338 818 L686 818 L660 878 C656 886 648 890 640 890 L384 890 C376 890 368 886 364 878 Z"/>
</g></svg>'''

def mark_light():
    """Transparent variant tuned for light backgrounds: tinted sparks and a defined brain edge."""
    s = icon(bg=False)
    s = s.replace('<g fill="#FFFFFF">', '<g fill="#A98BFF">').replace('fill="#FFF1D2"', 'fill="#F5B83D"')
    s = s.replace('<g fill="#FFFFFF" filter="url(#bl)" opacity=".7">', '<g fill="#C9B6FF" filter="url(#bl)" opacity=".5">')
    s = s.replace('<path d="M352 806 L672 806" stroke="#FFFFFF"', '<path d="M352 806 L672 806" stroke="#FFFFFF"')
    edge = f'<path d="{BRAIN}" fill="none" stroke="#9C82F5" stroke-width="5" opacity=".55"/>'
    return s.replace("<!-- pot -->", edge + "\n  <!-- pot -->")

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    open(f"{OUT}/cerebrito-icon.svg", "w").write(icon())
    open(f"{OUT}/cerebrito-icon-rounded.svg", "w").write(icon(rounded=True))
    open(f"{OUT}/cerebrito-mark.svg", "w").write(mark_light())
    open(f"{OUT}/cerebrito-glyph.svg", "w").write(mark())
    print("wrote", OUT)
