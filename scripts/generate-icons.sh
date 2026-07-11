#!/bin/bash
# Generate Android launcher icons from SVG
# Requires: ImageMagick (sudo apt install imagemagick)

set -e

SVG="public/logo-foreground.svg"
ANDROID_RES="android/app/src/main/res"

if ! command -v convert &> /dev/null; then
  echo "Error: ImageMagick not found. Install with: sudo apt install imagemagick"
  exit 1
fi

SIZES=("mdpi:48" "hdpi:72" "xhdpi:96" "xxhdpi:144" "xxxhdpi:192")

for entry in "${SIZES[@]}"; do
  density="${entry%%:*}"
  size="${entry##*:}"
  dir="$ANDROID_RES/mipmap-$density"
  mkdir -p "$dir"

  # Standard icon
  convert -background none "$SVG" -resize "${size}x${size}" "$dir/ic_launcher.png"
  # Round icon
  convert -background none "$SVG" -resize "${size}x${size}" "$dir/ic_launcher_round.png"
  # Foreground only (for adaptive icon)
  convert -background none "$SVG" -resize "$((size * 3))x$((size * 3))" "$dir/ic_launcher_foreground.png"

  echo "Generated $density icons (${size}x${size})"
done

# Also generate splash screens
for entry in "${SIZES[@]}"; do
  density="${entry%%:*}"
  size="${entry##*:}"

  # Portrait splash
  dir="$ANDROID_RES/drawable-port-$density"
  mkdir -p "$dir"
  convert -background "#FAFAF8" "$SVG" -gravity center -resize "50%x50%" "${size}x$((size * 2))" "$dir/splash.png" 2>/dev/null || true

  # Landscape splash
  dir="$ANDROID_RES/drawable-land-$density"
  mkdir -p "$dir"
  convert -background "#FAFAF8" "$SVG" -gravity center -resize "50%x50%" "$((size * 2))x${size}" "$dir/splash.png" 2>/dev/null || true
done

echo "Done! All icons generated."
