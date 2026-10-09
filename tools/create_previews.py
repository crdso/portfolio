"""Create portfolio previews from the browser captures of the actual sites."""

from pathlib import Path
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
CAPTURES = ROOT / "tools" / ".site-validation"
NEW_SLUGS = (
    "marcela", "donuts", "chapavoadora", "gostoburger", "sabordapraca",
    "tmlanches", "eksdigital", "oficinaautomotivo", "solaris", "pastelaria",
    "pegadaspet", "recantodoguerreiro", "sanches",
)


def main() -> None:
    sheet = Image.new("RGB", (1200, 4 * 225), "#201c1d")
    draw = ImageDraw.Draw(sheet)
    for i, slug in enumerate(NEW_SLUGS):
        screenshot = CAPTURES / f"{slug}-1440.png"
        if not screenshot.is_file():
            raise FileNotFoundError(screenshot)
        with Image.open(screenshot) as source:
            hero = source.convert("RGB")
        destination = ROOT / "assets" / "work" / slug
        destination.mkdir(parents=True, exist_ok=True)
        hero.save(destination / "hero.webp", "WEBP", quality=83, method=6)
        hero.resize((800, 500), Image.Resampling.LANCZOS).save(
            destination / "hero-sm.webp", "WEBP", quality=80, method=6
        )
        tile = hero.resize((285, 178), Image.Resampling.LANCZOS)
        x, y = (i % 4) * 300, (i // 4) * 225
        sheet.paste(tile, (x, y + 25))
        draw.text((x + 6, y + 6), slug, fill="white")
    sheet.save(CAPTURES / "new-projects-contact.jpg", quality=85)
    print(f"Created {len(NEW_SLUGS)} real-site previews")


if __name__ == "__main__":
    main()
