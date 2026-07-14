#!/usr/bin/env node
// Generate PWA icons from michi.png using sharp
// Usage: node scripts/generate-pwa-icons.js

import sharp from 'sharp';
import { mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'public', 'michi.png');
const OUTPUT_DIR = join(ROOT, 'public', 'icons');

// Required PWA icon sizes
const SIZES = [48, 72, 96, 128, 192, 256, 512];

async function ensureDir(dir) {
  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

async function generateIcons() {
  console.log('Generating PWA icons from michi.png...\n');
  
  await ensureDir(OUTPUT_DIR);
  
  for (const size of SIZES) {
    const filename = `icon-${size}.webp`;
    const outputPath = join(OUTPUT_DIR, filename);
    
    try {
      await sharp(SOURCE)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 250, g: 250, b: 248, alpha: 1 } // #FAFAF8 warm white
        })
        .webp({ quality: 90 })
        .toFile(outputPath);
      
      console.log(`✓ ${filename} (${size}x${size})`);
    } catch (err) {
      console.error(`✗ ${filename}: ${err.message}`);
    }
  }
  
  // Also generate PNG versions for maximum compatibility
  console.log('\nGenerating PNG versions...\n');
  
  for (const size of SIZES) {
    const filename = `icon-${size}.png`;
    const outputPath = join(OUTPUT_DIR, filename);
    
    try {
      await sharp(SOURCE)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 250, g: 250, b: 248, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ ${filename} (${size}x${size})`);
    } catch (err) {
      console.error(`✗ ${filename}: ${err.message}`);
    }
  }
  
  // Generate apple-touch-icon (180x180 PNG)
  console.log('\nGenerating Apple touch icon...\n');
  
  try {
    await sharp(SOURCE)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 250, g: 250, b: 248, alpha: 1 }
      })
      .png()
      .toFile(join(OUTPUT_DIR, 'apple-touch-icon.png'));
    
    console.log('✓ apple-touch-icon.png (180x180)');
  } catch (err) {
    console.error(`✗ apple-touch-icon.png: ${err.message}`);
  }
  
  console.log('\nDone! Icons saved to public/icons/');
}

generateIcons().catch(console.error);
