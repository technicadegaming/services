#!/usr/bin/env python3
"""Build Labs social PNGs; safe to rerun after HTML already points at PNGs."""
from pathlib import Path

import cairosvg
from PIL import Image

root = Path(__file__).resolve().parent.parent
names = {
    "labs.html": "labs",
    "would-you-rather.html": "would-you-rather",
    "fake-achievement.html": "fake-achievement",
    "challenge-wheel.html": "challenge-wheel",
    "one-more-second.html": "one-more-second",
    "rate-my-duck.html": "rate-my-duck",
    "useless-job-simulator.html": "useless-job-simulator",
}
for page, slug in names.items():
    svg = root / "assets" / f"labs-{slug}-share.svg"
    png = root / "assets" / f"labs-{slug}-share.png"
    if not svg.is_file():
        raise FileNotFoundError(svg)

    html = root / page
    content = html.read_text(encoding="utf-8")
    old = f"/assets/labs-{slug}-share.svg"
    new = f"/assets/labs-{slug}-share.png"
    if old not in content and new not in content:
        raise RuntimeError(f"Missing social preview metadata for {page}")

    # Initial conversion changes SVG references; subsequent builds are idempotent.
    if old in content:
        html.write_text(content.replace(old, new), encoding="utf-8")

    cairosvg.svg2png(
        url=str(svg), write_to=str(png), output_width=1200, output_height=630
    )
    with Image.open(png) as image:
        if image.format != "PNG" or image.size != (1200, 630):
            raise RuntimeError(f"Invalid preview dimensions or format: {png}")
        image.verify()
    if png.stat().st_size < 1000:
        raise RuntimeError(f"Suspiciously small preview: {png}")
    print(f"{page}: {png.name} ({png.stat().st_size:,} bytes)")
