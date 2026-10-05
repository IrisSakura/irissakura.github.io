"""Export the approved source without changing its illustration or alpha channel.

Run with a Python runtime providing Pillow. Paths are relative to this file.
"""
from hashlib import sha256
import json
from pathlib import Path
from PIL import Image

here = Path(__file__).resolve().parent
root = here.parents[2]
source = here / "source.png"
output = root / "assets/brand/site-icon-v2"
output.mkdir(parents=True, exist_ok=True)
exports = [("favicon-16.png", 16), ("favicon-32.png", 32), ("mark-128.png", 128),
           ("apple-touch-180.png", 180), ("app-192.png", 192), ("app-512.png", 512)]
image = Image.open(source).convert("RGBA")
records = []
for name, size in exports:
    path = output / name
    image.resize((size, size), Image.Resampling.LANCZOS).save(path, optimize=True)
    content = path.read_bytes()
    records.append({"file": str(path.relative_to(root)), "width": size, "height": size,
                    "bytes": len(content), "sha256": sha256(content).hexdigest(), "alpha": True})
manifest = {"version": 2, "generator": "built-in image_gen",
            "reference": "docs/brand/creator-vignettes-v1/playing.png",
            "prompt": "docs/brand/site-icon-v2/README.md",
            "source": str(source.relative_to(root)), "sourceSize": list(image.size),
            "sourceSha256": sha256(source.read_bytes()).hexdigest(),
            "conversion": "Pillow RGBA resize with LANCZOS, PNG optimize; alpha preserved",
            "outputs": records}
(here / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
print(f"Exported {len(records)} site icons from {image.width}x{image.height} RGBA source.")
