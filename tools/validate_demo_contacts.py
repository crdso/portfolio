"""Check rendered contact links in every published demo and the portfolio CTA."""

from __future__ import annotations

import functools
import http.server
import re
import threading
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def invalid_contact(href: str) -> bool:
    lowered = href.lower()
    if "wa.me/" in lowered:
        return not re.search(r"wa\.me/xxxxxxxxxxx(?:[/?#]|$)", lowered)
    if "whatsapp.com/send?phone=" in lowered or lowered.startswith("whatsapp://send?phone="):
        return "phone=xxxxxxxxxxx" not in lowered
    if lowered.startswith("tel:"):
        return lowered != "tel:xxxxxxxxxxx"
    if lowered.startswith("mailto:"):
        return not lowered.startswith("mailto:ezequias.mc@gmail.com")
    if "instagram.com/" in lowered:
        path = urlsplit(href).path.strip("/")
        return bool(path and path != "xxxxxxxxxxx")
    return False


def main() -> None:
    server = http.server.ThreadingHTTPServer(
        ("127.0.0.1", 5543), functools.partial(QuietHandler, directory=str(ROOT))
    )
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    failures = []
    checked = 0
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch()
            page = browser.new_page()
            for site in sorted((ROOT / "sites").iterdir()):
                if not (site / "index.html").is_file():
                    continue
                response = page.goto(f"http://localhost:5543/sites/{site.name}/", wait_until="domcontentloaded")
                page.wait_for_timeout(300)
                if not response or response.status != 200:
                    failures.append((site.name, "root not 200"))
                links = page.locator("a[href]").evaluate_all("els => els.map(el => el.href)")
                for href in links:
                    if invalid_contact(href):
                        failures.append((site.name, href))
                checked += 1
            page.goto("http://localhost:5543/", wait_until="domcontentloaded")
            page.locator('.folder[data-cat="tecnologia"]').click()
            page.locator('.card[data-id="miphone"]').click()
            cta = page.locator('.portfolio-case a:has-text("Quero um projeto como este")').get_attribute("href")
            expected = f"https://wa.me/{page.evaluate('window.CONFIG.whatsapp')}?text="
            if not cta or not cta.startswith(expected):
                failures.append(("portfolio", f"CTA mismatch: {cta}"))
            browser.close()
    finally:
        server.shutdown()
    print(f"Sites checked: {checked}; invalid contacts: {failures}; own CTA: {cta}")
    if checked != 33 or failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
