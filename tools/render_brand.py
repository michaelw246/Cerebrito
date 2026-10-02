"""Render assets/brand/*.svg to PNGs with Playwright's Chromium (pip install playwright).
    python tools/render_brand.py [chromium-executable]"""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); B = f"{ROOT}/assets/brand"
JOBS = [("cerebrito-icon.svg", "cerebrito-icon-1024.png", 1024), ("cerebrito-icon.svg", "apple-touch-icon.png", 180),
        ("cerebrito-icon-rounded.svg", "cerebrito-icon-rounded-1024.png", 1024), ("cerebrito-icon-rounded.svg", "cerebrito-icon-512.png", 512),
        ("cerebrito-icon-rounded.svg", "cerebrito-icon-192.png", 192), ("cerebrito-icon-rounded.svg", "favicon-64.png", 64),
        ("cerebrito-mark.svg", "cerebrito-mark-1024.png", 1024)]
async def main():
    async with async_playwright() as p:
        kw = {"executable_path": sys.argv[1]} if len(sys.argv) > 1 else {}
        b = await p.chromium.launch(**kw)
        for src, out, size in JOBS:
            pg = await b.new_page(viewport={"width": size, "height": size})
            svg = open(f"{B}/{src}").read().replace("<svg ", f'<svg width="{size}" height="{size}" ', 1)
            await pg.set_content(f'<html><body style="margin:0;background:transparent">{svg}</body></html>')
            await pg.screenshot(path=f"{B}/{out}", omit_background=True); await pg.close(); print(out)
        await b.close()
asyncio.run(main())
