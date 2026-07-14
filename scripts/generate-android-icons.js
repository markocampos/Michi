#!/usr/bin/env node
/**
 * generate-android-icons.js
 * Generates Android mipmap launcher icons from public/michi.png using sharp.
 * No ImageMagick required — sharp is already in devDependencies.
 *
 * Usage: node scripts/generate-android-icons.js
 * Or:    npm run icons:android
 */

import sharp from 'sharp';
import { mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'public', 'michi.png');
const ANDROID_RES = join(ROOT, 'android', 'app', 'src', 'main', 'res');

// Warm-white background (matches app theme #FAFAF8)
const BG = { r: 250, g: 250, b: 248, alpha: 1 };

// Android mipmap densities and their icon sizes (dp)
const DENSITIES = [
  { density: 'mdpi',    size: 48  },
  { density: 'hdpi',   size: 72  },
  { density: 'xhdpi',  size: 96  },
  { density: 'xxhdpi', size: 144 },
  { density: 'xxxhdpi',size: 192 },
];

async function ensureDir(dir) {
  try { await access(dir); } catch { await mkdir(dir, { recursive: true }); }
}

function circleMask(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg width="${size}" height="${size}">` +
    `<circle cx="${r}" cy="${r}" r="${r}" fill="white"/>` +
    `</svg>`
  );
}

async function generate() {
  // Verify source exists
  try {
    await access(SOURCE);
  } catch {
    console.error(`❌  Source not found: ${SOURCE}`);
    console.error('    Make sure you run this from the project root.');
    process.exit(1);
  }

  // Verify android folder exists
  try {
    await access(ANDROID_RES);
  } catch {
    console.error(`❌  Android res folder not found: ${ANDROID_RES}`);
    console.error('    Run these commands first:');
    console.error('      npm run build');
    console.error('      npx cap add android');
    process.exit(1);
  }

  console.log('🎨  Generating Android launcher icons from public/michi.png...\n');

  for (const { density, size } of DENSITIES) {
    const dir = join(ANDROID_RES, `mipmap-${density}`);
    await ensureDir(dir);

    // ── Standard icon (square with warm-white background) ──────────────────
    await sharp(SOURCE)
      .resize(size, size, { fit: 'contain', background: BG })
      .flatten({ background: BG })
      .png()
      .toFile(join(dir, 'ic_launcher.png'));

    // ── Round icon (circular crop) ──────────────────────────────────────────
    await sharp(SOURCE)
      .resize(size, size, { fit: 'contain', background: BG })
      .flatten({ background: BG })
      .composite([{ input: circleMask(size), blend: 'dest-in' }])
      .png()
      .toFile(join(dir, 'ic_launcher_round.png'));

    // ── Foreground layer for adaptive icons ────────────────────────────────
    // Android adaptive icon foreground canvas is 108dp; content safe zone is 72dp.
    // Scale: foreground size = size * (108/48)
    const fgSize = Math.round(size * 108 / 48);
    const innerSize = Math.round(size * 72 / 48);

    await sharp(SOURCE)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: Math.floor((fgSize - innerSize) / 2),
        bottom: Math.ceil((fgSize - innerSize) / 2),
        left: Math.floor((fgSize - innerSize) / 2),
        right: Math.ceil((fgSize - innerSize) / 2),
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(join(dir, 'ic_launcher_foreground.png'));

    console.log(`  ✓  mipmap-${density.padEnd(10)} ${size}×${size}  (standard + round + foreground)`);
  }

  // ── Adaptive icon background (solid forest green #5B7B5E) ───────────────
  console.log('\n🌲  Generating adaptive icon backgrounds...\n');
  for (const { density, size } of DENSITIES) {
    const dir = join(ANDROID_RES, `mipmap-${density}`);
    await sharp({
      create: {
        width: size, height: size, channels: 3,
        background: { r: 91, g: 123, b: 94 }, // #5B7B5E (forest green)
      }
    })
      .png()
      .toFile(join(dir, 'ic_launcher_background.png'));

    console.log(`  ✓  mipmap-${density.padEnd(10)} background`);
  }

  // ── Splash screen drawables ─────────────────────────────────────────────
  console.log('\n🖼️   Generating splash screens...\n');
  const splashDensities = [
    { density: 'mdpi',    w: 480,  h: 800  },
    { density: 'hdpi',   w: 720,  h: 1280 },
    { density: 'xhdpi',  w: 960,  h: 1600 },
    { density: 'xxhdpi', w: 1440, h: 2560 },
  ];

  for (const { density, w, h } of splashDensities) {
    const logoSize = Math.round(Math.min(w, h) * 0.4);

    // Portrait
    const portDir = join(ANDROID_RES, `drawable-port-${density}`);
    await ensureDir(portDir);

    const logoPort = await sharp(SOURCE)
      .resize(logoSize, logoSize, { fit: 'contain', background: BG })
      .flatten({ background: BG })
      .png()
      .toBuffer();

    await sharp({
      create: { width: w, height: h, channels: 3, background: BG }
    })
      .composite([{
        input: logoPort,
        gravity: 'centre',
      }])
      .png()
      .toFile(join(portDir, 'splash.png'));

    // Landscape
    const landDir = join(ANDROID_RES, `drawable-land-${density}`);
    await ensureDir(landDir);

    const logoLand = await sharp(SOURCE)
      .resize(logoSize, logoSize, { fit: 'contain', background: BG })
      .flatten({ background: BG })
      .png()
      .toBuffer();

    await sharp({
      create: { width: h, height: w, channels: 3, background: BG }
    })
      .composite([{
        input: logoLand,
        gravity: 'centre',
      }])
      .png()
      .toFile(join(landDir, 'splash.png'));

    console.log(`  ✓  drawable-port/land-${density.padEnd(10)} ${w}×${h} / ${h}×${w}`);
  }

  console.log('\n✅  All done! Icons written to android/app/src/main/res/');
  console.log('\nNext steps:');
  console.log('  npx cap sync android');
  console.log('  cd android && ./gradlew assembleDebug');
}

generate().catch((err) => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
