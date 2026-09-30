"""Capture portfolio images from read-only local project builds.

Requires: pip install playwright pillow; python -m playwright install chromium
Usage: python tools/capture-projects/capture.py blackburguer miphone
       python tools/capture-projects/capture.py --all

The source directories are only served over HTTP. Output goes to a staging
directory by default for visual review. Unsupported source builds are reported,
never modified.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright


PORTFOLIO = Path(__file__).resolve().parents[2]
SITES = PORTFOLIO.parent / "Sites"
CLONES = "-- Sites CLONE"

# Paths are relative to Sites. Prefer production builds for interactive apps.
# These builds are served as-is: no changes are made to the original projects.
SOURCES = {
    "doctorsmall": "Academia",
    "miphone": "Celulares/Miphone",
    "blackburguer": "Hamburgueria/BlackBurguer/dist",
    "entec": "IFTO/Entec/entec/dist",
    "advocacia": f"{CLONES}/Advocacia__GuilhermePodgaietsky__2026-09-22",
    "nexa": f"{CLONES}/Agencias__NexaAgency__2026-09-23",
    "letsfly": f"{CLONES}/Extra__LetsFly__2026-09-23",
    "portoglass": f"{CLONES}/Extra__PortoGlass__2026-09-23",
    "brasa77": f"{CLONES}/Hamburgueria__Brasa77__2026-09-22",
    "bucco": f"{CLONES}/Hamburgueria__BuccoBurger__2026-09-22",
    "goutu": f"{CLONES}/Hamburgueria__Goutu__2026-09-22",
    "odonto": f"{CLONES}/Odontologia__Odontologia__2026-09-22",
    "nowtech": f"{CLONES}/PainelSolar__EnergiaSolarPulsoDigital__2026-09-22",
    "helios": f"{CLONES}/PainelSolar__HeliosSolar__2026-09-22",
    "solaix": f"{CLONES}/PainelSolar__Solaix__2026-09-24",
    "solare": f"{CLONES}/PainelSolar__Solare__2026-09-23",
    "solvex": f"{CLONES}/PainelSolar__Solvex__2026-09-24",
    "umami": f"{CLONES}/Pizzaria__Umami__2026-09-22",
    "bodega": f"{CLONES}/Restaurante__BodegaPocos__2026-09-23",
    "foodee": f"{CLONES}/Restaurante__Foodee__2026-09-23",
    "minero": f"{CLONES}/Restaurante__RestauranteDoMinero__2026-09-23",
    "olimpo": f"{CLONES}/Restaurante__RestauranteOlimpo__2026-09-23",
    "hospitalvet": f"{CLONES}/Veterinaria__HospitalVet__2026-09-23",
}


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def save_webp(raw: bytes, output: Path, size: tuple[int, int] | None = None):
    from io import BytesIO

    with Image.open(BytesIO(raw)) as original:
        image = original.convert("RGB")
        if size:
            image = image.resize(size, Image.Resampling.LANCZOS)
        output.parent.mkdir(parents=True, exist_ok=True)
        temporary = output.with_suffix(".webp.tmp")
        image.save(temporary, format="WEBP", quality=88, method=6)
        temporary.replace(output)


def prepare_source(project_id: str, source: Path):
    if project_id != "miphone":
        return source
    output = PORTFOLIO / "tools" / "capture-projects" / "build" / project_id
    npm = shutil.which("npm.cmd") or shutil.which("npm")
    if not npm or not (source / "node_modules").is_dir():
        raise RuntimeError("MiPhone dependencies are unavailable")
    subprocess.run([npm, "run", "build", "--", "--configLoader", "runner",
                    "--outDir", str(output), "--emptyOutDir"], cwd=source,
                   check=True, capture_output=True, text=True)
    return output


def settle(page):
    page.evaluate("""async () => {
      if (document.fonts) await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]);
      await Promise.all([...document.images].filter(i => i.loading !== 'lazy').map(i =>
        i.complete ? Promise.resolve() : new Promise(r => { i.onload = r; i.onerror = r; setTimeout(r, 2000); })));
    }""")
    page.wait_for_timeout(450)


def section_positions(page):
    return page.evaluate("""() => {
      const h = innerHeight, max = document.documentElement.scrollHeight - h;
      const nodes = [...document.querySelectorAll('main section, body > section, main article, [data-framer-name]')];
      const candidates = nodes.map(el => {
        const r = el.getBoundingClientRect(), y = r.top + scrollY;
        const heading = el.querySelector('h2, h3');
        return {y, height: r.height, title: (heading?.textContent || '').trim().slice(0, 80),
          media: el.querySelectorAll('img, video, canvas').length};
      }).filter(x => x.y > h * .75 && x.y < max && x.height >= 260 && x.height < 2300);
      const scored = candidates.sort((a,b) => (b.media > 0) - (a.media > 0) ||
        (b.title.length > 0) - (a.title.length > 0) || a.y - b.y);
      const selected = [];
      for (const c of scored) if (selected.every(s => Math.abs(s.y - c.y) > h * .65)) selected.push(c);
      selected.sort((a,b) => a.y - b.y);
      return selected.slice(0, 8);
    }""")


def capture(browser, project_id: str, root: Path, full: bool, output_root: Path,
            manual_positions: list[int] | None, hero_y: int):
    if not (root / "index.html").is_file():
        return {"id": project_id, "status": "source build missing", "source": str(root)}
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(root)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    page = browser.new_page(viewport={"width": 1600, "height": 1000}, device_scale_factor=1)
    output = output_root / project_id
    result = {"id": project_id, "status": "ok", "source": str(root), "sections": [], "full": "not requested"}
    try:
        page.goto(f"http://127.0.0.1:{server.server_port}/", wait_until="domcontentloaded", timeout=30000)
        settle(page)
        height = page.evaluate("document.documentElement.scrollHeight")
        for y in range(0, min(height, 18000), 750):
            page.evaluate("y => scrollTo(0, y)", y)
            page.wait_for_timeout(90)
        page.wait_for_timeout(600)
        page.evaluate("y => scrollTo(0, y)", hero_y)
        settle(page)
        raw = page.screenshot(animations="disabled")
        save_webp(raw, output / "hero.webp")
        save_webp(raw, output / "hero-sm.webp", (800, 500))
        positions = ([{"y": y, "title": "manual"} for y in manual_positions] if manual_positions else section_positions(page))
        if not positions and height > 1400:
            fallback = [min(int(height * f), max(0, height - 1000)) for f in (.3, .55, .8)]
            positions = [{"y": y, "title": ""} for y in fallback if y > 250]
        positions = [section for i, section in enumerate(positions)
                     if all(abs(section["y"] - earlier["y"]) > 350 for earlier in positions[:i])]
        for i, section in enumerate(positions[:3], 1):
            page.evaluate("y => scrollTo(0, y)", max(0, int(section["y"])))
            page.wait_for_timeout(400)
            save_webp(page.screenshot(animations="disabled"), output / f"section-{i:02}.webp", (1200, 750))
            result["sections"].append({"file": f"section-{i:02}.webp", "title": section.get("title", ""), "y": round(section["y"])})
        if full:
            sticky = page.evaluate("""() => [...document.querySelectorAll('*')].filter(e =>
              ['sticky','fixed'].includes(getComputedStyle(e).position) && e.getBoundingClientRect().height > 150).length""")
            if height > 9000 or sticky:
                result["full"] = f"skipped: height {height}px, large sticky/fixed elements {sticky}"
            else:
                page.evaluate("scrollTo(0, 0)")
                page.wait_for_timeout(250)
                save_webp(page.screenshot(full_page=True, animations="disabled"), output / "full.webp")
                result["full"] = "captured; review visually before displaying"
        result["height"] = height
    except Exception as error:
        result["status"] = f"error: {error}"
    finally:
        page.close()
        server.shutdown()
        server.server_close()
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ids", nargs="*", help="project IDs to capture")
    parser.add_argument("--all", action="store_true", help="capture every mapped source")
    parser.add_argument("--full", action="store_true", help="attempt full-page capture on suitable pages")
    parser.add_argument("--sites-root", type=Path, default=SITES)
    parser.add_argument("--output-root", type=Path, default=PORTFOLIO / "tools" / "capture-projects" / "staging")
    parser.add_argument("--source-dir", type=Path, help="source build for one project ID")
    parser.add_argument("--positions", help="three comma-separated scroll positions for one project")
    parser.add_argument("--hero-y", type=int, default=0, help="hero scroll position if the first fold is unsuitable")
    args = parser.parse_args()
    ids = list(SOURCES) if args.all else args.ids
    if not ids:
        parser.error("provide IDs or --all")
    if (args.source_dir or args.positions or args.hero_y) and len(ids) != 1:
        parser.error("--source-dir, --positions and --hero-y require exactly one ID")
    manual_positions = [int(y) for y in args.positions.split(",")] if args.positions else None
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        try:
            results = []
            for project_id in ids:
                source = SOURCES.get(project_id)
                root = args.source_dir if args.source_dir else args.sites_root / source if source else None
                try:
                    if root and not args.source_dir:
                        root = prepare_source(project_id, root)
                    result = capture(browser, project_id, root, args.full, args.output_root, manual_positions, args.hero_y) if root else {"id": project_id, "status": "source not mapped"}
                except Exception as error:
                    result = {"id": project_id, "status": f"error preparing source: {error}"}
                results.append(result)
                print(json.dumps(result, ensure_ascii=False), flush=True)
        finally:
            browser.close()
    report = PORTFOLIO / "tools" / "capture-projects" / "last-run.json"
    report.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
