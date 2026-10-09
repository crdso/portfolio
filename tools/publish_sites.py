"""Publish the existing sites beneath /sites/<slug>/ without recreating them.

The manifest uses paths relative to the Ezequias workspace. Source projects are
read-only. Build copies are temporary and never enter Git.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import quote

from sanitize_demo_contacts import sanitize_site


PORTFOLIO = Path(__file__).resolve().parents[1]
WORKSPACE = PORTFOLIO.parent
SITES = PORTFOLIO / "sites"

# slug, source, category, publication method, already in the portfolio
MANIFEST = [
    ("tavares", "Sites/-- Sites CLONE/Maquiagem__Maquiagem__2026-09-23", "moda", "static", True),
    ("miphone", "Sites/Celulares/Miphone", "tecnologia", "vite", True),
    ("nexa", "Sites/-- Sites CLONE/Agencias__NexaAgency__2026-09-23", "tecnologia", "static", True),
    ("blackburguer", "Sites/Hamburgueria/BlackBurguer", "alimentacao", "vite", True),
    ("brasa77", "Sites/-- Sites CLONE/Hamburgueria__Brasa77__2026-09-22", "alimentacao", "static", True),
    ("bucco", "Sites/-- Sites CLONE/Hamburgueria__BuccoBurger__2026-09-22", "alimentacao", "static", True),
    ("olimpo", "Sites/-- Sites CLONE/Restaurante__RestauranteOlimpo__2026-09-23", "alimentacao", "static", True),
    ("bodega", "Sites/-- Sites CLONE/Restaurante__BodegaPocos__2026-09-23", "alimentacao", "static", True),
    ("minero", "Sites/-- Sites CLONE/Restaurante__RestauranteDoMinero__2026-09-23", "alimentacao", "static", True),
    ("umami", "Sites/-- Sites CLONE/Pizzaria__Umami__2026-09-22", "alimentacao", "static", True),
    ("goutu", "Sites/-- Sites CLONE/Hamburgueria__Goutu__2026-09-22", "alimentacao", "static", True),
    ("foodee", "Sites/-- Sites CLONE/Restaurante__Foodee__2026-09-23", "alimentacao", "static", True),
    ("odonto", "Sites/-- Sites CLONE/Odontologia__Odontologia__2026-09-22", "saude", "static", True),
    ("hospitalvet", "Sites/-- Sites CLONE/Veterinaria__HospitalVet__2026-09-23", "saude", "static", True),
    ("helios", "Sites/-- Sites CLONE/PainelSolar__HeliosSolar__2026-09-22", "energia", "static", True),
    ("nowtech", "Sites/-- Sites CLONE/PainelSolar__EnergiaSolarPulsoDigital__2026-09-22", "energia", "static", True),
    ("solare", "Sites/-- Sites CLONE/PainelSolar__Solare__2026-09-23", "energia", "static", True),
    ("advocacia", "Sites/-- Sites CLONE/Advocacia__GuilhermePodgaietsky__2026-09-22", "institucional", "static", True),
    ("portoglass", "Sites/-- Sites CLONE/Extra__PortoGlass__2026-09-23", "institucional", "static", True),
    ("entec", "Sites/IFTO/Entec/entec", "ifto", "entec", True),
    ("correio", "Sites/IFTO/correiotrc-main", "ifto", "vite", True),
    ("marcela", "Sites/-- Sites CLONE/Beleza_Marcela", "moda", "vite", False),
    ("donuts", "Sites/-- Sites CLONE/DONUTS", "alimentacao", "vite", False),
    ("chapavoadora", "Sites/-- Sites CLONE/Hamburgueria_ChapaVoadora", "alimentacao", "vite", False),
    ("gostoburger", "Sites/-- Sites CLONE/Hamburgueria_GOSTOBurger", "alimentacao", "vite", False),
    ("sabordapraca", "Sites/-- Sites CLONE/Hamburgueria_SabordaPraça", "alimentacao", "vite", False),
    ("tmlanches", "Sites/-- Sites CLONE/Hamburgueria_TMLanches", "alimentacao", "vite", False),
    ("oficinaautomotivo", "Sites/-- Sites CLONE/Oficina_Automotivo", "institucional", "vite", False),
    ("solaris", "Sites/-- Sites CLONE/PainelSolar_Solaris", "energia", "vite", False),
    ("pastelaria", "Sites/-- Sites CLONE/Pastelaria_Demo", "alimentacao", "vite", False),
    ("pegadaspet", "Sites/-- Sites CLONE/Petshop_PegadasPet", "saude", "vite", False),
    ("recantodoguerreiro", "Sites/-- Sites CLONE/Restaurante_RecantodoGuerreiro", "alimentacao", "vite", False),
    ("sanches", "Sites/-- Sites CLONE/Studio_Sanches", "moda", "vite", False),
]

EXCLUDED_DIRS = {
    "_capture", "site", "node_modules", "dist", ".git", ".cache", ".next",
    "build", "netlify", "supabase", "worker", ".venv", ".agents", ".claude",
    "scripts", "tools", "ref", "staging",
}
WEB_EXTS = {
    ".html", ".css", ".js", ".mjs", ".json", ".svg", ".png", ".jpg",
    ".jpeg", ".jfif", ".webp", ".avif", ".gif", ".ico", ".woff",
    ".woff2", ".ttf", ".mp4", ".webm", ".webmanifest", ".xml", ".txt",
    ".wasm", ".bin", ".pdf", ".glb", ".otf", ".eot",
}
ROOT_ASSET_PREFIXES = ("assets", "_next", "next", "img", "images", "video", "media", "fonts", "css", "js", "brand", "public", "external")
BUILD_ROOT = PORTFOLIO / "tools" / "build-sites-temp"


def verify_manifest() -> None:
    slugs = [row[0] for row in MANIFEST]
    if len(slugs) != len(set(slugs)):
        raise RuntimeError("Duplicate slugs in manifest")
    for slug, source, _, _, _ in MANIFEST:
        if not re.fullmatch(r"[a-z0-9-]+", slug):
            raise RuntimeError(f"Invalid slug: {slug}")
        source_path = WORKSPACE / source
        if not source_path.is_dir():
            raise FileNotFoundError(source_path)
        if "portfolio__" in source_path.name.lower():
            raise RuntimeError(f"Portfolio reference in manifest: {source_path}")


def reset_destination(slug: str) -> Path:
    SITES.mkdir(exist_ok=True)
    dest = SITES / slug
    if not dest.resolve().is_relative_to(SITES.resolve()) or dest == SITES:
        raise RuntimeError(f"Unsafe destination: {dest}")
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir()
    return dest


def allowed_file(path: Path) -> bool:
    name = path.name.lower()
    if name.startswith(".env") or name.endswith((".map", ".log", ".tsbuildinfo")):
        return False
    if name in {"package.json", "package-lock.json", "readme.md", "vite.config.js", "vite.config.ts", "config.toml"}:
        return False
    return path.suffix.lower() in WEB_EXTS or name in {"_headers", "_redirects"}


def copy_public_files(source: Path, dest: Path) -> int:
    count = 0
    for base, dirs, files in os.walk(source, followlinks=False):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS and not (Path(base) / d).is_symlink()]
        base_path = Path(base)
        for filename in files:
            origin = base_path / filename
            if origin.is_symlink() or not allowed_file(origin):
                continue
            relative = origin.relative_to(source)
            target = dest / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(origin, target)
            count += 1
    return count


def adapt_public_paths(dest: Path, slug: str) -> None:
    """Adjust only deployment paths; leave markup, styling and behavior intact."""
    base = f"/sites/{slug}/"
    for path in dest.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".html", ".css", ".js", ".mjs", ".json"}:
            continue
        content = path.read_text(encoding="utf-8", errors="replace")
        original = content
        # Absolute asset references in static exports and their runtime bundles.
        for prefix in ROOT_ASSET_PREFIXES:
            for quote in ('"', "'", "`"):
                content = content.replace(f"{quote}/{prefix}/", f"{quote}{base}{prefix}/")
            content = content.replace(f"url(/{prefix}/", f"url({base}{prefix}/")
            content = content.replace(f"url('/{prefix}/", f"url('{base}{prefix}/")
            content = content.replace(f'url("/{prefix}/', f'url("{base}{prefix}/')
            # srcset and imagesrcset contain several comma-separated root
            # URLs; replacing only the first attribute value misses the rest.
            content = re.sub(rf"(?<![\w:/.])/{re.escape(prefix)}/", f"{base}{prefix}/", content)
        for root_file in dest.iterdir():
            if root_file.is_file() and root_file.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".woff2", ".mp4", ".js", ".css"}:
                content = re.sub(rf"(?<![\w:/.])/{re.escape(root_file.name)}(?=['\"`?\s)])", f"{base}{root_file.name}", content)
        if path.suffix.lower() == ".html":
            # A source page may be nested, but captured relative assets live at
            # the source root. An explicit base keeps them under this site.
            if not re.search(r"<base\b", content, re.I):
                content = re.sub(r"<head(\s[^>]*)?>", lambda m: m.group(0) + f'<base href="{base}">', content, count=1, flags=re.I)
            content = re.sub(r"<script\b[^>]*src=['\"]/?\.netlify/scripts/hud[^>]*></script>", "", content, flags=re.I)
            content = re.sub(r"<script\b[^>]*src=['\"][^'\"]*vercel\.live/[^>]*></script>", "", content, flags=re.I)
            content = re.sub(
                r"(?P<name>\b(?:href|src|poster|action)=)(?P<quote>['\"])(?P<path>/(?!/|sites/|\.netlify/)[^'\"]*)(?P=quote)",
                lambda m: f"{m.group('name')}{m.group('quote')}{base}{m.group('path').lstrip('/')}{m.group('quote')}",
                content,
                flags=re.I,
            )
            content = re.sub(
                r"(?P<name>\b(?:srcset|imagesrcset)=)(?P<quote>['\"])(?P<value>.*?)(?P=quote)",
                lambda m: f"{m.group('name')}{m.group('quote')}" + re.sub(
                    r"(?<!\S)/(?!/|sites/)", base, m.group("value")
                ) + m.group("quote"),
                content,
                flags=re.I | re.S,
            )
        if content != original:
            path.write_text(content, encoding="utf-8")


def publish_static(slug: str, source: Path) -> None:
    dest = reset_destination(slug)
    count = copy_public_files(source, dest)
    adapt_public_paths(dest, slug)
    if slug in {"umami", "goutu", "foodee", "solare"}:
        # Framer's captured HTML uses local images, while hydrated components
        # still point to the original CDN. Redirect only URLs whose captured
        # image exists, preserving the exact responsive variant where possible.
        image_dir = dest / "external/framerusercontent.com/file/images"
        if image_dir.is_dir():
            available = {p.name: p for p in image_dir.iterdir() if p.is_file()}
            pattern = re.compile(r"https://framerusercontent\.com/images/([A-Za-z0-9_-]+)\.(jpe?g|png|webp|svg|avif)(\?[^`\"'\s,<>) ]*)?")
            def local_framer_image(match):
                identifier, extension, query = match.groups()
                name = f"{identifier}__q_{query[1:]}.{extension}" if query else f"{identifier}.{extension}"
                image = available.get(name)
                if image is None:
                    candidates = [p for key, p in available.items() if key.startswith(identifier + "__q_") and key.endswith("." + extension)]
                    image = max(candidates, key=lambda p: p.stat().st_size) if candidates else None
                return f"/sites/{slug}/external/framerusercontent.com/file/images/{quote(image.name)}" if image else match.group(0)
            for asset in dest.rglob("*"):
                if not asset.is_file() or asset.suffix.lower() not in {".html", ".js", ".mjs", ".css"}:
                    continue
                original = asset.read_text(encoding="utf-8", errors="replace")
                rewritten = pattern.sub(local_framer_image, original)
                if rewritten != original:
                    asset.write_text(rewritten, encoding="utf-8")
    if slug == "tavares":
        # The captured source points at an absent local Google Fonts proxy.
        index = dest / "index.html"
        html = index.read_text(encoding="utf-8")
        html = html.replace('href="assets/css/css2?', 'href="https://fonts.googleapis.com/css2?')
        index.write_text(html, encoding="utf-8")
    if slug == "portoglass":
        # Two captured font URLs have a leading underscore absent from the
        # supplied filenames. Preserve the font bytes under their CSS names.
        fonts = dest / "assets" / "fonts"
        for name in ("Xms-HUzqDCFdgfMm4S9DQ.woff2", "Xmu-HUzqDCFdgfMm4GND65o.woff2"):
            if (fonts / name).exists():
                shutil.copy2(fonts / name, fonts / ("_" + name))
    if slug == "helios":
        # Captured Next image responses are available as files, but a plain
        # static server cannot run the /_next/image optimizer endpoint.
        images = list((dest / "next").glob("image__q_*"))
        by_photo = {}
        for image in images:
            match = re.search(r"photo-[0-9a-z-]+", image.name)
            if match and (match.group() not in by_photo or image.stat().st_size > by_photo[match.group()].stat().st_size):
                by_photo[match.group()] = image
        for page in dest.rglob("*.html"):
            html = page.read_text(encoding="utf-8")
            def image_path(match):
                photo = match.group(1)
                image = by_photo.get(photo)
                return f"/sites/helios/next/{quote(image.name)}" if image else match.group()
            html = re.sub(r"(?:/sites/helios)?/_next/image\?url=https%3A%2F%2Fimages\.unsplash\.com%2F(photo-[0-9a-z-]+)[^\s\"'<>]*", image_path, html)
            page.write_text(html, encoding="utf-8")
        for asset in dest.rglob("*"):
            if not asset.is_file() or asset.suffix.lower() not in {".html", ".js", ".css"}:
                continue
            source_text = asset.read_text(encoding="utf-8", errors="replace")
            rewritten = re.sub(
                r"https://images\.unsplash\.com/(photo-[0-9a-z-]+)",
                lambda m: f"/sites/helios/next/{quote(by_photo[m.group(1)].name)}" if m.group(1) in by_photo else m.group(0),
                source_text,
            )
            if asset.suffix.lower() == ".js" and "_next" in asset.parts:
                rewritten = rewritten.replace("unoptimized:!1", "unoptimized:!0")
            if asset.suffix.lower() == ".js":
                image_lookup = json.dumps({photo: f"/sites/helios/next/{quote(image.name)}" for photo, image in by_photo.items()}, separators=(",", ":"))
                rewritten = rewritten.replace(
                    '=>`https://images.unsplash.com/${e}?auto=format&fit=crop&w=${t}&q=${a}`',
                    f'=>({image_lookup})[e]||`https://images.unsplash.com/${{e}}?auto=format&fit=crop&w=${{t}}&q=${{a}}`',
                )
            if rewritten != source_text:
                asset.write_text(rewritten, encoding="utf-8")
    if not (dest / "index.html").is_file():
        raise RuntimeError(f"No index.html in {slug}")
    print(f"{slug}: copied {count} public files")


def prepare_build_copy(slug: str, source: Path) -> Path:
    BUILD_ROOT.mkdir(exist_ok=True)
    target = BUILD_ROOT / slug
    if not target.resolve().is_relative_to(BUILD_ROOT.resolve()):
        raise RuntimeError(f"Unsafe build path: {target}")
    if target.exists():
        shutil.rmtree(target)
    ignored = shutil.ignore_patterns("node_modules", ".git", ".env*", ".r2.env", "dist", "build", ".cache", ".vite", "*.log", "*.map", "*.tsbuildinfo", "ref", ".agents", ".claude")
    shutil.copytree(source, target, ignore=ignored)
    return target


def replace_in(path: Path, old: str, new: str) -> None:
    if not path.is_file():
        raise FileNotFoundError(path)
    content = path.read_text(encoding="utf-8")
    if old not in content:
        raise RuntimeError(f"Expected deployment path absent in {path}: {old[:60]}")
    path.write_text(content.replace(old, new), encoding="utf-8")


def link_node_modules(target: Path, source: Path) -> None:
    junction = target / "node_modules"
    if junction.exists():
        return
    if not source.is_dir():
        if not (target / "package-lock.json").is_file():
            raise FileNotFoundError(f"Missing dependencies and lockfile: {target}")
        print(f"{target.name}: installing locked build dependencies", flush=True)
        subprocess.run(["npm.cmd", "ci", "--ignore-scripts", "--no-audit", "--no-fund"], cwd=target, check=True)
        return
    # A junction lives only in the ignored temporary build copy.
    command = f"New-Item -ItemType Junction -Path '{junction}' -Target '{source}' | Out-Null"
    subprocess.run(["powershell", "-NoProfile", "-Command", command], check=True)


def adapt_vite_source(target: Path, slug: str) -> None:
    base = f"/sites/{slug}"
    if slug == "miphone":
        replace_in(target / "src/App.jsx", "<BrowserRouter>", f'<BrowserRouter basename="{base}">')
        # The original component already uses this JSON as its fallback. A
        # static subsite has no Netlify function, so serve the same data here.
        shutil.copy2(target / "src/data/instagramFallback.json", target / "public/instagram-fallback.json")
        replace_in(target / "src/components/InstagramSection.jsx", "/.netlify/functions/instagram", f"{base}/instagram-fallback.json")
        for file in (target / "src").rglob("*"):
            if file.suffix not in {".jsx", ".js", ".tsx", ".ts", ".css"}:
                continue
            content = file.read_text(encoding="utf-8")
            content = content.replace('href="/"', f'href="{base}/"').replace('href="/#', f'href="{base}/#')
            file.write_text(content, encoding="utf-8")
    if slug == "correio":
        app = target / "src/App.jsx"
        replace_in(app, "import Admin from './pages/Admin.jsx';", "")
        replace_in(app, '<Route path="/admin" element={<Admin />} />', "")
        replace_in(app, "<Router>", f'<Router basename="{base}">')
        # The public showcase has no administrative panel or its source.
        admin = target / "src/pages/Admin.jsx"
        if admin.exists():
            admin.unlink()
    # Vite's base handles built JS/CSS. Public assets referred to directly by
    # root URLs need their own subpath. Only known files under public/ qualify.
    public = target / "public"
    if public.exists():
        roots = {p.name for p in public.iterdir()}
        for file in (target / "src").rglob("*"):
            if file.suffix not in {".jsx", ".js", ".tsx", ".ts", ".css", ".html", ".json"}:
                continue
            content = file.read_text(encoding="utf-8")
            original = content
            for root in roots:
                escaped = re.escape(root)
                if (public / root).is_dir():
                    content = re.sub(rf"(?<![\w:/])/{escaped}/", f"{base}/{root}/", content)
                else:
                    content = re.sub(rf"(?<![\w:/])/{escaped}(?=['\"`?\s)])", f"{base}/{root}", content)
            if content != original:
                file.write_text(content, encoding="utf-8")


def publish_vite(slug: str, source: Path) -> None:
    target = prepare_build_copy(slug, source)
    adapt_vite_source(target, slug)
    if slug == "miphone":
        dependencies = source / "node_modules"
    elif slug == "blackburguer":
        dependencies = source / "node_modules"
    elif slug == "correio":
        dependencies = source / "node_modules"
    else:
        dependencies = WORKSPACE / "Sites/-- Sites CLONE/Beleza_Marcela/node_modules"
    link_node_modules(target, dependencies)
    build_env = os.environ.copy()
    if slug == "correio":
        legacy_env = WORKSPACE / "Sites/IFTO/Correio Elegante (old)/.env"
        public_names = {"VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"}
        for line in legacy_env.read_text(encoding="utf-8").splitlines():
            match = re.match(r"\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$", line)
            if match and match.group(1) in public_names:
                build_env[match.group(1)] = match.group(2).strip('"\' ')
        if not public_names.issubset(build_env):
            raise RuntimeError("Correio is missing public Supabase configuration")
        if not (build_env["VITE_SUPABASE_PUBLISHABLE_KEY"].startswith("sb_publishable_") or
                build_env["VITE_SUPABASE_PUBLISHABLE_KEY"].startswith("eyJ")):
            raise RuntimeError("Correio key does not look publishable")
    print(f"{slug}: building original source", flush=True)
    subprocess.run(["npm.cmd", "run", "build", "--", f"--base=/sites/{slug}/"], cwd=target, env=build_env, check=True)
    dist = target / "dist"
    if not (dist / "index.html").exists():
        raise RuntimeError(f"Build did not produce index.html: {slug}")
    dest = reset_destination(slug)
    shutil.copytree(dist, dest, dirs_exist_ok=True)
    if slug in {"miphone", "correio"}:
        routes = ("loja", "assistencia", "moto-eletrica", "moto-electra", "contato", "politica-de-privacidade") if slug == "miphone" else ("envio", "sucesso")
        for route in routes:
            route_dest = dest / route
            route_dest.mkdir(exist_ok=True)
            shutil.copy2(dest / "index.html", route_dest / "index.html")
    print(f"{slug}: published {sum(1 for p in dest.rglob('*') if p.is_file())} files", flush=True)


def publish_entec(source: Path) -> None:
    slug = "entec"
    target = prepare_build_copy(slug, source)
    # The original build validates the full site, including the private admin
    # tree. Keep it in the temporary build only, then exclude it from publish.
    env_file = source / ".env.local"
    values = {}
    for line in env_file.read_text(encoding="utf-8").splitlines():
        match = re.match(r"\s*(VITE_[A-Z_]+)\s*=\s*(.*)\s*$", line)
        if match:
            values[match.group(1)] = match.group(2).strip('"\' ')
    env = os.environ.copy()
    env.update({key: values[key] for key in ("VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY", "VITE_ADMIN_EMAIL")})
    subprocess.run(["node", "scripts/build.mjs"], cwd=target, env=env, check=True)
    dist = target / "dist"
    dest = reset_destination(slug)
    shutil.copytree(dist, dest, dirs_exist_ok=True, ignore=shutil.ignore_patterns("admin", ".env*"))
    adapt_public_paths(dest, slug)
    # The build includes only a public anon key. Admin email is unnecessary in
    # this public-only copy and must not be included.
    public_env = dest / "env.js"
    content = public_env.read_text(encoding="utf-8")
    content = re.sub(r"export const ADMIN_EMAIL = .*?;", 'export const ADMIN_EMAIL = "";', content)
    public_env.write_text(content, encoding="utf-8")
    print(f"{slug}: published {sum(1 for p in dest.rglob('*') if p.is_file())} public files", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--static-only", action="store_true")
    parser.add_argument("--inventory", action="store_true")
    parser.add_argument("--vite-only", action="store_true")
    parser.add_argument("--entec-only", action="store_true")
    parser.add_argument("--slug", action="append")
    args = parser.parse_args()
    verify_manifest()
    inventory = [
        {"project": slug, "source": source, "slug": slug, "category": cat,
         "existing": existing, "action": method, "siteUrl": f"/sites/{slug}/"}
        for slug, source, cat, method, existing in MANIFEST
    ]
    if args.inventory:
        print(json.dumps(inventory, ensure_ascii=False, indent=2))
        return
    for slug, source, _, method, _ in MANIFEST:
        if args.slug and slug not in args.slug:
            continue
        if args.static_only and method != "static":
            continue
        if args.vite_only and method != "vite":
            continue
        if args.entec_only and method != "entec":
            continue
        if method == "static":
            publish_static(slug, WORKSPACE / source)
        elif method == "vite":
            publish_vite(slug, WORKSPACE / source)
        elif method == "entec":
            publish_entec(WORKSPACE / source)
        counts = sanitize_site(SITES / slug)
        if counts:
            print(f"{slug}: anonymized demo contacts {dict(counts)}", flush=True)


if __name__ == "__main__":
    main()
