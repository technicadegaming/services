#!/usr/bin/env python3
"""Convert Technicade Labs social-preview SVG artwork to PNG and update metadata."""
from pathlib import Path
import re
import cairosvg

root = Path(__file__).resolve().parent.parent
names = {
    "labs.html": "labs",
    "would-you-rather.html": "would-you-rather",
    "fake-achievement.html": "fake-achievement",
    "challenge-wheel.html": "challenge-wheel",
    "one-more-second.html": "one-more-second",
}
for page, slug in names.items():
    svg = root / "assets" / f"labs-{slug}-share.svg"
    png = root / "assets" / f"labs-{slug}-share.png"
    if not svg.is_file():
        raise FileNotFoundError(svg)
    cairosvg.svg2png(url=str(svg),write_to=str(png),output_width=1200,output_height=630)
    data = png.read_bytes()
    if len(data)<1000 or data[:8] != b"\x89PNG\r\n\x1a\n":
        raise RuntimeError(f"Invalid PNG generated: {png}")
    html = root / page
    content = html.read_text(encoding="utf-8")
    old = f"/assets/labs-{slug}-share.svg"
    new = f"/assets/labs-{slug}-share.png"
    if old not in content:
        raise RuntimeError(f"Missing preview reference in {page}")
    html.write_text(content.replace(old, new),encoding="utf-8")
    print(f"{page}: {png.name} ({len(data):,} bytes)")
