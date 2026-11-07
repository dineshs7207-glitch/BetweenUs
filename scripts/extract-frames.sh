#!/usr/bin/env bash
# Turn the hero video into WebP frames for the scroll-scrubbed hero.
# Usage: npm run frames -- hero.mp4 [fps=30] [width=1600]
# Then set site.hero.frameCount in src/lib/site.ts to the printed count.
set -euo pipefail

SRC="${1:-hero.mp4}"
FPS="${2:-30}"
WIDTH="${3:-1600}"
OUT="public/hero/frames"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is not installed (brew install ffmpeg / apt install ffmpeg)" >&2
  exit 1
fi
if [ ! -f "$SRC" ]; then
  echo "Video not found: $SRC" >&2
  exit 1
fi

mkdir -p "$OUT"
rm -f "$OUT"/*.webp

ffmpeg -loglevel error -i "$SRC" \
  -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos" \
  -c:v libwebp -quality 72 -compression_level 6 \
  "$OUT/%04d.webp"

COUNT=$(ls "$OUT"/*.webp | wc -l | tr -d ' ')
SIZE=$(du -sh "$OUT" | cut -f1)
echo "Wrote $COUNT frames ($SIZE) to $OUT"
echo "Set hero.frameCount = $COUNT in src/lib/site.ts"
if [ "$COUNT" -gt 150 ]; then
  echo "Warning: more than 150 frames. Re-run with fps 20 or width 1280 for phones." >&2
fi
