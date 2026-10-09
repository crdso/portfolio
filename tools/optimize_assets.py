"""Reduce oversized captured images in published copies, preserving their URLs."""

from pathlib import Path
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1] / "sites"
LIMIT = 3000


def main() -> None:
    saved = 0
    changed = 0
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".jpg", ".jpeg", ".png"} or path.stat().st_size < 1_000_000:
            continue
        before = path.stat().st_size
        with Image.open(path) as opened:
            if getattr(opened, "n_frames", 1) != 1:
                continue
            image = ImageOps.exif_transpose(opened)
            if max(image.size) <= LIMIT and path.suffix.lower() == ".png":
                continue
            image.thumbnail((LIMIT, LIMIT), Image.Resampling.LANCZOS)
            temporary = path.with_name(path.name + ".optimized")
            if path.suffix.lower() == ".png":
                image.save(temporary, "PNG", optimize=True)
            else:
                image.convert("RGB").save(temporary, "JPEG", quality=87, optimize=True, progressive=True, subsampling=0)
        after = temporary.stat().st_size
        if after < before * 0.9:
            temporary.replace(path)
            saved += before - after
            changed += 1
        else:
            temporary.unlink()
    print(f"Optimized {changed} oversized images; saved {saved / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()
