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
        async def chk(label, js):
            try:
                if not await pg.evaluate(js): errs.append(f"check failed: {label}")
            except Exception as e: errs.append(f"{label}: {e}")
        # hints are per game: using both in Palabra leaves Wordle's untouched
        await ev("palabra hints", "openPractice({t:'puzzle',kind:'palabra',free:true},'t');beginStep();$('#hint').click();$('#hint').click()", 200)
        await chk("palabra hints used up", "$('#hint').disabled"); await ev("exit", "exitSession()")
        await ev("wordle", "openPractice({t:'puzzle',kind:'wordle',free:true},'t');beginStep()", 200)
        await chk("wordle still has 2 hints", "!$('#hint').disabled && $('#hn').textContent === '2'"); await ev("exit", "exitSession()")
        await ev("bee", "openPractice({t:'puzzle',kind:'bee',free:true},'t');beginStep()", 200)
        await chk("bee shows its daily goal", "/\\d+\\/\\d+/.test($('#bgoal').textContent)"); await ev("exit", "exitSession()")
        # a knowledge round never repeats a card: miss every card and the round still ends after its length
        await ev("know misses", "openPractice({t:'know',kind:'tr',ids:queueFor('tr',4,0)},'t');beginStep()", 200)
        for _ in range(8):
            await ev("miss", """(()=>{const o=[...document.querySelectorAll('.opt')];if(o.length){const bad=o.find(b=>!b.classList.contains('ok'))||o[0];bad.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));return}
              const r=$('#krv');if(r){r.click();document.querySelector('[data-q="1"]').click();return}const c=$('#kcont');if(c)c.click()})()""", 250)
            await ev("cont", "const c=$('#kcont');if(c)c.click()", 250)
        await chk("round ended without repeats", "!!$('.scorebig') && !!$('.misses')")
        await ev("more sheet", "document.querySelector('.missrow').click()", 300)
        await chk("More sheet opens", "!!$('.moresheet') && !$('#mask').offsetParent"); await ev("close", "$('.moresheet [data-close]').click();exitSession()", 300)
        await chk("queue has no give-away pairs", "(()=>{const q=queueFor('tr',8,40).map(id=>content.tr.find(x=>x.id===id));return q.every((a,i)=>q.every((b,j)=>i===j||!clash('tr',a,b)))})()")
        await ev("pace", "view='recall';render();document.querySelector('[data-a=pace][data-m=\"6\"]').click()", 200)
        await chk("pace set to 6 months", "state.pace.months === 6 && paceInfo().perDay >= 3")
        await b.close()
        print("OK" if not errs else "FAIL\n" + "\n".join(errs)); sys.exit(1 if errs else 0)
asyncio.run(main())
