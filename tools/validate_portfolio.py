"""Exercise every category and project detail on desktop and mobile."""

import functools
import http.server
import json
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "tools" / ".site-validation"


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def main() -> None:
    server = http.server.ThreadingHTTPServer(
        ("127.0.0.1", 5541), functools.partial(QuietHandler, directory=str(ROOT))
    )
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    rows = []
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch()
            for width, height in ((1440, 900), (390, 844)):
                page = browser.new_page(viewport={"width": width, "height": height})
                errors = []
                missing = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.on("response", lambda response: missing.append(response.url) if response.status == 404 and "localhost:5541" in response.url else None)
                page.goto("http://localhost:5541/", wait_until="domcontentloaded")
                page.wait_for_timeout(750)
                page.screenshot(path=str(OUTPUT / f"portfolio-{width}.png"))
                projects = page.evaluate("window.PROJECTS.map(({id, cat, name, siteUrl}) => ({id, cat, name, siteUrl}))")
                categories = page.evaluate("window.CATEGORIES.map(({id, name}) => ({id, name}))")
                failures = []
                for category in categories:
                    page.locator(f'.folder[data-cat="{category["id"]}"]').click()
                    expected = [p for p in projects if p["cat"] == category["id"]]
                    actual = page.locator(".modal-category__grid .card").count()
                    if actual != len(expected):
                        failures.append(f"{category['id']}: {actual} cards, expected {len(expected)}")
                    for project in expected:
                        page.locator(f'.card[data-id="{project["id"]}"]').click()
                        link = page.locator('.portfolio-case a:has-text("Ver site")')
                        if link.count() != 1 or link.get_attribute("href") != project["siteUrl"]:
                            failures.append(f"{project['id']}: incorrect site link")
                        if link.count() == 1 and link.get_attribute("target") != "_blank":
                            failures.append(f"{project['id']}: site does not open new tab")
                        if page.locator('.portfolio-case a:has-text("Quero um projeto como este")').count() != 1:
                            failures.append(f"{project['id']}: missing WhatsApp CTA")
                        if project["id"] == "miphone":
                            page.wait_for_timeout(500)
                            page.screenshot(path=str(OUTPUT / f"portfolio-detail-{width}.png"))
                        page.locator("[data-modal-back]").click()
                    page.locator("[data-modal-close]").click()
                for route in ("miphone/loja/", "miphone/assistencia/", "miphone/contato/", "correio/envio/", "correio/sucesso/"):
                    response = page.goto(f"http://localhost:5541/sites/{route}", wait_until="domcontentloaded")
                    page.wait_for_timeout(400)
                    if not response or response.status != 200:
                        failures.append(f"{route}: direct route did not load")
                    if not page.locator("#root").count() or not page.locator("#root").inner_text().strip():
                        failures.append(f"{route}: empty app root")
                row = {"width": width, "categories": len(categories), "projects": len(projects),
                       "failures": failures, "errors": sorted(set(errors)), "missing": sorted(set(missing))}
                rows.append(row)
                print(json.dumps(row, ensure_ascii=False), flush=True)
                page.close()
            browser.close()
    finally:
        server.shutdown()
    (OUTPUT / "portfolio-results.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
