import json, sys, asyncio
from playwright.async_api import async_playwright
STATE=json.load(open('/tmp/state.json'))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
        errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.on('console',lambda m: errs.append('console:'+m.text) if m.type=='error' else None)
        await pg.goto('file:///mnt/user-data/outputs/artifacts/9c6951b5-15ad-4152-83f9-3870ccb27efd/index.html')
        await pg.evaluate("s=>{localStorage.setItem('ruta.state.v1',JSON.stringify(s));}",STATE)
        await pg.reload(); await pg.wait_for_timeout(1500)
        for step in sys.argv[1:]:
            name,act=step.split('=',1) if '=' in step else (step,'')
            if act: await pg.evaluate(act); await pg.wait_for_timeout(900)
            await pg.screenshot(path=f'/tmp/s_{name}.png',full_page=True)
        print(errs)
        await b.close()
asyncio.run(main())
