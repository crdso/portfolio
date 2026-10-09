"""Check deployed subpath URLs with a plain static server and Chromium."""

from __future__ import annotations

import argparse
import functools
import http.server
import json
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
CAPTURES = ROOT / "tools" / ".site-validation"


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("slugs", nargs="*")
    parser.add_argument("--mobile", action="store_true")
    parser.add_argument("--wait-ms", type=int, default=1900)
    parser.add_argument("--scroll", action="store_true")
    parser.add_argument("--exclude", action="append", default=[])
    args = parser.parse_args()
    slugs = args.slugs or [p.name for p in (ROOT / "sites").iterdir() if (p / "index.html").exists()]
    slugs = [slug for slug in slugs if slug not in args.exclude]
    CAPTURES.mkdir(parents=True, exist_ok=True)
    handler = functools.partial(QuietHandler, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 5540), handler)
    server.daemon_threads = True
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    rows = []
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch()
            sizes = [(1440, 900)] + ([(390, 844)] if args.mobile else [])
            for slug in slugs:
                for width, height in sizes:
                    page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=1)
                    errors: list[str] = []
                    missing: list[str] = []
                    page.on("pageerror", lambda error: errors.append(str(error)[:240]))
                    page.on("response", lambda response: missing.append(response.url) if response.status == 404 and "localhost:5540" in response.url else None)
                    try:
                        response = page.goto(f"http://localhost:5540/sites/{slug}/", wait_until="domcontentloaded", timeout=30000)
                        page.wait_for_timeout(args.wait_ms)
                        title = page.title()
                        broken_images = page.evaluate("""() => [...document.images]
                          .filter(img => img.complete && img.naturalWidth === 0)
                          .slice(0, 8).map(img => img.currentSrc || img.src)""")
                        image = CAPTURES / f"{slug}-{width}.png"
                        page.screenshot(path=str(image))
                        if args.scroll:
                            for fraction in (0.25, 0.5, 0.75, 1):
                                page.evaluate("fraction => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * fraction)", fraction)
                                page.wait_for_timeout(400)
                        row = {"slug": slug, "width": width, "status": response.status if response else None,
                               "title": title, "errors": sorted(set(errors)), "missing": sorted(set(missing)),
                               "brokenImages": broken_images,
                               "screenshot": str(image.relative_to(ROOT))}
                    except Exception as exc:
                        row = {"slug": slug, "width": width, "exception": str(exc)[:400]}
                    rows.append(row)
                    print(json.dumps(row, ensure_ascii=False), flush=True)
                    page.close()
            browser.close()
    finally:
        server.shutdown()
    (CAPTURES / "results.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
