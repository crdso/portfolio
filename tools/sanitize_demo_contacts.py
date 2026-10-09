"""Anonymize customer contact destinations in published demo copies only.

Run after publishing/rebuilding sites. Never run against source projects.
"""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

SITES = Path(__file__).resolve().parents[1] / "sites"
TEXT_EXTENSIONS = {".html", ".css", ".js", ".mjs", ".json", ".ts", ".tsx", ".jsx", ".xml", ".svg", ".txt", ".webmanifest"}
PHONE_RE = re.compile(r"(?<![\w/])\+?\d[\d ()-]{8,22}\d(?!\d)")
WA_RE = re.compile(r"(?i)(?:wa\.me/|(?:api|web)\.whatsapp\.com/send\?phone=|whatsapp://send\?phone=)(\+?\d{10,15})")
TEL_RE = re.compile(r"(?i)tel:(\+?\d{10,15})")
IG_RE = re.compile(r"(?i)https?://(?:www\.)?instagram\.com/([A-Za-z0-9._-]+(?:/[A-Za-z0-9._-]+)*/?)")
EMAIL_RE = re.compile(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b")
IGNORE_EMAIL = {"ezequias.mc@gmail.com", "hello@replicache.dev"}
EXTRA_HANDLES = {
    "donuts": {"hellodonuts"},
    "recantodoguerreiro": {"recantodoguerreiro_parrilla"},
}


def digits(value: str) -> str:
    return re.sub(r"\D", "", value)


def text_files(site: Path) -> list[Path]:
    return [p for p in site.rglob("*") if p.is_file() and p.suffix.lower() in TEXT_EXTENSIONS]


def sanitize_site(site: Path) -> Counter:
    files: dict[Path, str] = {}
    for path in text_files(site):
        try:
            files[path] = path.read_text(encoding="utf-8")
        except UnicodeError:
            continue

    # Seeds come only from contact URLs and explicitly named contact fields.
    # Matching their formatted display versions then removes the visible number too.
    phone_seeds: set[str] = set()
    instagram_handles: set[str] = set()
    dynamic_phone_vars: set[str] = set()
    for source in files.values():
        phone_seeds.update(digits(m.group(1)) for m in WA_RE.finditer(source))
        phone_seeds.update(digits(m.group(1)) for m in TEL_RE.finditer(source))
        for m in re.finditer(r'(?i)(?:whatsapp(?:number)?|telefonefmt|phonedisplay|phone|tel)\s*["\']?\s*[:=]\s*["\'`]?\s*(\+?\d[\d ()-]{8,22}\d)', source):
            value = digits(m.group(1))
            if 10 <= len(value) <= 13:
                phone_seeds.add(value)
        instagram_handles.update(m.group(1).strip("/").lower() for m in IG_RE.finditer(source) if m.group(1).strip("/") not in {"p", "reel"})
        dynamic_phone_vars.update(re.findall(r"(?:wa\.me/|whatsapp\.com/send\?phone=)\$\{([A-Za-z_$][\w$]*)\}", source, re.I))
    instagram_handles.update(EXTRA_HANDLES.get(site.name, set()))
    for source in files.values():
        for name in dynamic_phone_vars:
            for match in re.finditer(r"\b" + re.escape(name) + r"\s*=\s*[\"'`]?(\+?\d{10,15})(?!\d)", source):
                phone_seeds.add(digits(match.group(1)))
    # Some old local telephone URLs start with zero but show the same number with +55.
    normalized_seeds = set(phone_seeds)
    for number in list(phone_seeds):
        if len(number) == 13 and number.startswith("55"):
            normalized_seeds.add(number[2:])
        if number.startswith("0") and len(number) in (11, 12):
            normalized_seeds.add(number[1:])

    counts = Counter()
    for path, source in files.items():
        result = source

        def replace_phone(match: re.Match[str]) -> str:
            value = digits(match.group())
            if value in normalized_seeds and value != digits("xxxxxxxxxxx"):
                counts["phone_instances"] += 1
                return "xxxxxxxxxxx"
            return match.group()

        result = PHONE_RE.sub(replace_phone, result)
        # Explicit link destinations cover cases where the number is embedded
        # in a protocol URL and the generic contact display regex skips it.
        result, count = re.subn(r"(?i)((?:wa\.me/|(?:api|web)\.whatsapp\.com/send\?phone=|whatsapp://send\?phone=))\+?\d{10,15}", r"\g<1>xxxxxxxxxxx", result)
        if count:
            counts["whatsapp_urls"] += count
        result, count = re.subn(r"(?i)tel:\+?\d{10,15}", "tel:xxxxxxxxxxx", result)
        if count:
            counts["telephone_urls"] += count

        def replace_instagram(match: re.Match[str]) -> str:
            if match.group(1).strip("/").lower() == "xxxxxxxxxxx":
                return match.group()
            counts["instagram_urls"] += 1
            return "https://instagram.com/xxxxxxxxxxx"

        result = IG_RE.sub(replace_instagram, result)
        for handle in instagram_handles:
            # Only a literal visible @handle; leave CSS at-rules, package names,
            # and email domains alone.
            if "/" in handle or handle == "xxxxxxxxxxx":
                continue
            result, count = re.subn(r"(?i)@" + re.escape(handle) + r"(?![\w.])", "@demonstração", result)
            if count:
                counts["instagram_handles"] += count

        def replace_email(match: re.Match[str]) -> str:
            if match.group().lower() in IGNORE_EMAIL:
                return match.group()
            counts["emails"] += 1
            return "ezequias.mc@gmail.com"

        result = EMAIL_RE.sub(replace_email, result)
        # Formatted numbers such as "(35) 99989-3555" have an opening
        # parenthesis outside PHONE_RE's match; remove that orphan.
        result = result.replace("(xxxxxxxxxxx", "xxxxxxxxxxx")
        # This demo normalizes the configured WhatsApp number at render time.
        # Keep the anonymized destination intact while preserving the old
        # numeric behavior if the script is rebuilt from its source.
        result = result.replace('CONFIG.whatsapp.replace(/\\D/g, "")', 'CONFIG.whatsapp.replace(/[^\\dx]/g, "")')
        if result != source:
            path.write_text(result, encoding="utf-8", newline="")
            counts["files"] += 1
    return counts


def main() -> None:
    totals = Counter()
    for site in sorted(SITES.iterdir()):
        if site.is_dir():
            current = sanitize_site(site)
            if current:
                print(site.name, json.dumps(current, ensure_ascii=False, sort_keys=True), flush=True)
            totals.update(current)
    print("TOTAL", json.dumps(totals, ensure_ascii=False, sort_keys=True), flush=True)


if __name__ == "__main__":
    main()
