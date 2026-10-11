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
        # the end screen lists every question to look back over, misses marked with what you said
        await chk("review lists every question", "document.querySelectorAll('.review .missrow').length === state.rounds[0].log.length && state.rounds[0].log.length === 4")
        await chk("misses show what you said", "[...document.querySelectorAll('.review .missrow.no')].every(r => r.querySelector('em'))")
        # the end screen lists every question to look back over, misses marked with what you said
        await chk("review lists every question", "document.querySelectorAll('.review .missrow').length === state.rounds[0].log.length && state.rounds[0].log.length === 4")
        await chk("misses show what you said", "[...document.querySelectorAll('.review .missrow.no')].every(r => r.querySelector('em'))")
        await ev("more sheet", "document.querySelector('.missrow').click()", 300)
        await chk("More sheet opens", "!!$('.moresheet') && !$('#mask').offsetParent"); await ev("close", "$('.moresheet [data-close]').click();exitSession()", 300)
        await chk("queue has no give-away pairs", "(()=>{const q=queueFor('tr',8,40).map(id=>content.tr.find(x=>x.id===id));return q.every((a,i)=>q.every((b,j)=>i===j||!clash('tr',a,b)))})()")
        # every puzzle with a hidden answer can be given up (two taps), landing on the answer
        for k in ["palabra", "wordle", "pais", "worldle", "travle"]:
            await ev(f"give up {k}", f"openPractice({{t:'puzzle',kind:'{k}',free:true}},'t');beginStep();$('#giveup').click();$('#giveup').click()", 300)
            await chk(f"{k} gave up to the answer", "!!$('.pzres')"); await ev("exit", "exitSession()")
        await ev("maptap show me", "openPractice({t:'puzzle',kind:'maptap',free:true},'t');beginStep();$('#giveup').click();$('#giveup').click()", 300)
        await chk("maptap revealed the place", "!!$('#mnext')")
        await chk("maptap answer pin carries the place's name", "$('.pinm.truth .pinlab') && $('#mq').textContent.includes($('.pinm.truth .pinlab').textContent)"); await ev("exit", "exitSession()")
        # every MapTap place sits in (or, on a coast, within 60 km of) its own country's outline on the map
        await chk("maptap places are where they say", """(()=>{
          const fix={England:'United Kingdom',Scotland:'United Kingdom','Vatican City':'Italy'}, ISLANDS=['Santorini'];
          const find=n=>{const f=fold(fix[n]||n);return CTRY.find(c=>c.f===f||c.fa.includes(f))}, cv=document.createElement('canvas').getContext('2d'), bad=[];
          for(const pl of PLACES){
            const c=find(pl.c); if(!c){bad.push(pl.n+': no country '+pl.c);continue}
            const [x,y]=proj(pl.lat,pl.lon); if(cv.isPointInPath(new Path2D(WORLD.c[c.key]),x,y)||ISLANDS.includes(pl.n))continue;
            const k=Math.cos(pl.lat*Math.PI/180), km=360/1000*111.2; let best=Infinity;
            for(const sub of WORLD.c[c.key].split('M')){const n=(sub.match(/-?[\d.]+/g)||[]).map(Number);
              for(let i=0;i+3<n.length;i+=2){const ax=(n[i]-x)*k,ay=n[i+1]-y,bx=(n[i+2]-x)*k,by=n[i+3]-y,dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy,t=L?Math.max(0,Math.min(1,-(ax*dx+ay*dy)/L)):0;
                best=Math.min(best,Math.hypot(ax+t*dx,ay+t*dy)*km)}}
            if(best>60)bad.push(pl.n+' '+Math.round(best)+'km off '+pl.c)}
          if(bad.length)console.error(bad.join('; '));return !bad.length})()""")
        await chk("place and word lists have no duplicates", "new Set(PLACES.map(p=>p.n)).size===PLACES.length && new Set(PALABRAS.map(p=>p[0])).size===PALABRAS.length && PALABRAS.every(p=>VALID.has(p[0]))")
        # no repeats: a whole pool's worth of games never gives the same answer twice
        await chk("palabra never repeats until every word is used", "(()=>{state.seen={};const a=PALABRAS.map((_,i)=>newPz('palabra','s'+i).a);return new Set(a).size===PALABRAS.length})()")
        await chk("maptap never repeats a place until all are used", "(()=>{state.seen={};const a=[];for(let i=0;i<Math.floor(PLACES.length/5);i++)a.push(...newPz('maptap','m'+i).places);return new Set(a).size===a.length})()")
        await chk("pais never repeats until the pool is used", "(()=>{state.seen={};const n=CTRY.filter(c=>c.pool).length,a=[];for(let i=0;i<n;i++)a.push(newPz('pais','p'+i).a);return new Set(a).size===n})()")
        await chk("after a full pool, the last third is held back", "(()=>{state.seen={};const a=PALABRAS.map((_,i)=>newPz('palabra','s'+i).a),last=new Set(a.slice(-Math.floor(a.length/3)));const b=Array.from({length:20},(_,i)=>newPz('palabra','t'+i).a);state.seen={};return b.every(x=>!last.has(x))})()")
        await ev("recall rounds", "view='recall';render();document.querySelector('[data-a=round]').click()", 300)
        await chk("a past round opens for review", "document.querySelectorAll('.sheet .review .missrow').length === state.rounds[0].log.length"); await ev("close", "document.querySelector('.sheet [data-close]').click()", 300)
        await ev("recall rounds", "view='recall';render();document.querySelector('[data-a=round]').click()", 300)
        await chk("a past round opens for review", "document.querySelectorAll('.sheet .review .missrow').length === state.rounds[0].log.length"); await ev("close", "document.querySelector('.sheet [data-close]').click()", 300)
        await ev("pace", "view='recall';render();document.querySelector('[data-a=pace][data-m=\"6\"]').click()", 200)
        await chk("pace set to 6 months", "state.pace.months === 6 && paceInfo().perDay >= 3")
        await b.close()
        print("OK" if not errs else "FAIL\n" + "\n".join(errs)); sys.exit(1 if errs else 0)
asyncio.run(main())
