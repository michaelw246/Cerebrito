"""Smoke test: load the built index.html in Chromium and walk every screen and game, failing on any JS error.
    pip install playwright && python tools/tests/smoke.py [chromium-executable]"""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GAMES = {"speed": ["position", "odd", "count"], "memory": ["all", "order", "reverse"], "attention": ["ink", "inkes", "flanker"], "flex": ["numbers", "letters", "shapes"],
         "numeracy": ["arith", "percent", "fx", "estimate"], "reasoning": ["numbers", "letters", "oddnum"], "spatial": ["match", "mirror", "rotate"]}
async def main():
    async with async_playwright() as p:
        kw = {"executable_path": sys.argv[1]} if len(sys.argv) > 1 else {}
        b = await p.chromium.launch(**kw); pg = await b.new_page(viewport={"width": 390, "height": 844}); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.route("**/fonts.g*/**", lambda r: r.abort())
        await pg.goto(f"file://{ROOT}/index.html"); await pg.wait_for_timeout(300)
        async def ev(label, js, wait=150):
            try: await pg.evaluate(js)
            except Exception as e: errs.append(f"{label}: {e}")
            await pg.wait_for_timeout(wait)
        await ev("fresh", "localStorage.clear()"); await pg.reload(); await pg.wait_for_timeout(300)
        for t in ["map", "train", "recall", "journey", "puzzles", "pass", "shop", "stats", "awards"]:
            await ev(f"tab {t}", f"view='{t}';render()")
        await ev("walkthrough", "showOnboarding();for(let i=0;i<4;i++)document.querySelector('[data-ob=next]').click();document.querySelector('[data-ob=skip]').click()", 500)
        await ev("part", "partKey='memory';view='part';render()")
        await ev("country", "countryIdx=3;view='country';render()")
        await ev("session", "openSession('auto');beginStep()", 400); await ev("exit", "exitSession()")
        for eng, vs in GAMES.items():
            for v in vs:
                await ev(f"{eng}/{v}", f"openPractice({{t:'game',eng:'{eng}',variant:'{v}',mode:'train'}},'t');beginStep()", 2400)
                await ev(f"{eng}/{v} exit", "exitSession()")
        for k in ["palabra", "wordle", "pais", "worldle", "travle", "maptap", "bee", "rush", "hunt", "pairs"]:
            await ev(f"pz {k}", f"openPractice({{t:'puzzle',kind:'{k}',free:true}},'t');beginStep()", 400)
            await ev(f"pz {k} exit", "exitSession()")
        for kind in ["es", "tr"]:
            await ev(f"know {kind}", f"openPractice({{t:'know',kind:'{kind}',ids:content.{kind}.slice(0,3).map(x=>x.id)}},'t');beginStep()", 300)
            await ev(f"know {kind} exit", "exitSession()")
        await b.close()
        print("OK" if not errs else "FAIL\n" + "\n".join(errs)); sys.exit(1 if errs else 0)
asyncio.run(main())
