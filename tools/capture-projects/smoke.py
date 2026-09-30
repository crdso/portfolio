"""Exercise category and project content inside one modal over the home."""

from __future__ import annotations

import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[2]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def state(page, title: str | None = None):
    assert page.locator("#home").is_visible()
    assert page.locator("#category, #page").count() == 0
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), "horizontal overflow"
    if title:
        dialog = page.get_by_role("dialog")
        assert dialog.is_visible()
        assert dialog.get_attribute("aria-modal") == "true"
        assert page.locator("#portfolio-modal-title").inner_text() == title
        assert page.evaluate("document.documentElement.classList.contains('modal-open')")
        assert page.evaluate("document.activeElement.closest('[data-modal-panel]') !== null")
        page.wait_for_function("""() => [...document.querySelectorAll('[data-modal-content] img')]
          .filter(i => { const r = i.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })
          .every(i => i.complete && i.naturalWidth > 0)""", timeout=10000)
        assert page.evaluate("document.querySelector('[data-modal-panel]').scrollWidth <= document.querySelector('[data-modal-panel]').clientWidth + 1"), "modal horizontal overflow"
    else:
        assert page.locator("[data-modal]").is_hidden()
        assert not page.evaluate("document.documentElement.classList.contains('modal-open')")


def close_check(page, before, folder):
    state(page)
    assert abs(page.evaluate("scrollY") - before) <= 1, "home scroll moved"
    assert page.evaluate("document.activeElement.dataset.cat") == folder, "focus did not return to folder"


def main():
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            try:
                for width, height in [(1440, 900), (1366, 768), (390, 844)]:
                    page = browser.new_page(viewport={"width": width, "height": height}, reduced_motion="reduce")
                    errors = []
                    page.on("pageerror", lambda error: errors.append(str(error)))
                    page.goto(f"http://127.0.0.1:{server.server_port}/", wait_until="load")
                    state(page)
                    base_url = page.url
                    base_height = page.evaluate("document.documentElement.scrollHeight")

                    food = page.locator('.folder[data-cat="alimentacao"]')
                    food.click()
                    before = page.evaluate("scrollY")
                    state(page, "Alimentação")
                    assert page.locator(".modal-category__grid .card").count() == 9
                    assert page.url == base_url, "category changed URL"
                    assert page.evaluate("document.documentElement.scrollHeight") == base_height, "home height changed"
                    page.mouse.wheel(0, 600)
                    assert page.evaluate("scrollY") == before, "home scrolled behind modal"
                    page.locator('.card[data-id="blackburguer"]').click()
                    state(page, "Black Burguer")
                    assert page.url == base_url, "project changed URL"
                    assert page.locator("[data-modal-panel]").count() == 1
                    assert page.locator(".proj__gallery img").count() <= 2
                    for image in page.locator(".proj__gallery img, .variants img").all():
                        image.scroll_into_view_if_needed()
                        image.evaluate("i => i.decode()")
                        assert image.evaluate("i => i.naturalWidth > 0")
                    assert page.locator("[data-modal-close]").is_visible()
                    assert page.locator("[data-modal-close]").bounding_box()["y"] < height * .2, "close button did not stay sticky"
                    page.locator("[data-modal-back]").click()
                    state(page, "Alimentação")
                    page.locator('.card[data-id="brasa77"]').click()
                    state(page, "Brasa 77")
                    page.locator("[data-modal-close]").click()
                    close_check(page, before, "alimentacao")

                    systems = page.locator('.folder[data-cat="sistemas"]')
                    systems.click()
                    before = page.evaluate("scrollY")
                    state(page, "Sistemas")
                    page.locator('.card[data-id="entec"]').click()
                    state(page, "ENTEC 2026")
                    page.locator("[data-modal-back]").click()
                    state(page, "Sistemas")
                    page.locator("[data-modal-close]").click()
                    close_check(page, before, "sistemas")

                    food.click()
                    before = page.evaluate("scrollY")
                    page.keyboard.press("Escape")
                    close_check(page, before, "alimentacao")
                    food.click()
                    before = page.evaluate("scrollY")
                    page.mouse.click(2, 2)
                    close_check(page, before, "alimentacao")
                    assert not errors, errors
                    print(f"OK {width}x{height}: modal flow, images, scroll, focus, ESC, backdrop, overflow", flush=True)
                    page.close()

                page = browser.new_page(viewport={"width": 1440, "height": 900}, reduced_motion="no-preference")
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.goto(f"http://127.0.0.1:{server.server_port}/", wait_until="load")
                page.locator('.folder[data-cat="alimentacao"]').click()
                state(page, "Alimentação")
                page.locator('.card[data-id="blackburguer"]').click()
                state(page, "Black Burguer")
                page.locator("[data-modal-back]").click()
                state(page, "Alimentação")
                assert not errors, errors
                print("OK motion: internal modal transition", flush=True)
                page.close()
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    main()
