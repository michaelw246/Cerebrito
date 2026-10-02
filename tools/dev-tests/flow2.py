import json, sys, asyncio
from playwright.async_api import async_playwright
STATE=json.load(open('/tmp/state.json'))
FF="window.__off=(window.__off||0)+90000"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.add_init_script("const __o=performance.now.bind(performance);performance.now=()=>__o()+(window.__off||0);")
        await pg.goto('file:///mnt/user-data/outputs/artifacts/9c6951b5-15ad-4152-83f9-3870ccb27efd/index.html')
        await pg.evaluate("s=>{localStorage.setItem('ruta.state.v1',JSON.stringify(s));}",STATE)
        await pg.reload(); await pg.wait_for_timeout(1200)
        await pg.add_script_tag(path='/tmp/tr_items.js')
        steps=json.load(open(sys.argv[1]))
        for name,act,wait in steps:
            if act: 
                try: await pg.evaluate(act)
                except Exception as e: errs.append(name+':'+str(e))
            await pg.wait_for_timeout(wait)
            if name: await pg.screenshot(path=f'/tmp/f_{name}.png',full_page=False)
        print(errs)
        await b.close()
asyncio.run(main())
