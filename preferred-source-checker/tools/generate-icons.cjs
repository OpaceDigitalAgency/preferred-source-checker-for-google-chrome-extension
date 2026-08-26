#!/usr/bin/env node
/*
 * Dev-only icon generator (NOT shipped in the store zip).
 * Rasterises the icon motif from assets/icon.svg (rounded-square Opace blue
 * field, white star, small magnifier at lower-right; star-only at 16 px)
 * into icons/icon-{16,32,48,128}.png using nothing but Node's zlib.
 * These are functional placeholder renders; a designer export from the SVG
 * can replace them file-for-file at any time.
 *
 * Usage: node tools/generate-icons.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BLUE = [11, 87, 208];   // #0b57d0
const WHITE = [255, 255, 255];

/* ---------- geometry in a 128-unit design space ---------- */

function starPoints(cx, cy, rOuter, rInner) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return pts;
}

function pointInPolygon(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function inRoundedRect(x, y, w, h, r) {
  if (x < 0 || y < 0 || x > w || y > h) return false;
  const cx = Math.min(Math.max(x, r), w - r);
  const cy = Math.min(Math.max(y, r), h - r);
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const ex = x1 + t * dx;
  const ey = y1 + t * dy;
  return Math.hypot(px - ex, py - ey);
}

/**
 * Colour of design-space point (x, y) for a given icon size class.
 * Returns [r, g, b, a].
 */
function sample(x, y, withMagnifier) {
  // Rounded-square field (1 px safety margin scaled into design space)
  if (!inRoundedRect(x, y, 128, 128, 24)) return [0, 0, 0, 0];

  let color = BLUE;

  // Star — centred when magnifier hidden (16 px), offset otherwise
  const star = withMagnifier
    ? starPoints(60, 58, 38, 15.5)
    : starPoints(64, 66, 44, 18);
  if (pointInPolygon(x, y, star)) color = WHITE;

  if (withMagnifier) {
    const d = Math.hypot(x - 86, y - 86);
    if (d <= 20.5) color = BLUE;          // lens interior punches out the star
    if (d >= 13.5 && d <= 20.5) color = WHITE; // ring
    if (distToSegment(x, y, 98, 98, 112, 112) <= 4.5) color = WHITE; // handle
  }
  return [color[0], color[1], color[2], 255];
}

/* ---------- rasterise with 4x4 supersampling ---------- */

function renderIcon(size) {
  const withMagnifier = size > 16;
  const px = Buffer.alloc(size * size * 4);
  const ss = 4;
  const scale = 128 / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const dx = (x + (sx + 0.5) / ss) * scale;
          const dy = (y + (sy + 0.5) / ss) * scale;
          const c = sample(dx, dy, withMagnifier);
          r += c[0] * (c[3] / 255);
          g += c[1] * (c[3] / 255);
          b += c[2] * (c[3] / 255);
          a += c[3];
        }
      }
      const n = ss * ss;
      const alpha = a / n;
      const idx = (y * size + x) * 4;
      const un = alpha > 0 ? 255 / alpha : 0;
      px[idx] = Math.round(Math.min(255, (r / n) * un));
      px[idx + 1] = Math.round(Math.min(255, (g / n) * un));
      px[idx + 2] = Math.round(Math.min(255, (b / n) * un));
      px[idx + 3] = Math.round(alpha);
    }
  }
  return px;
}

/* ---------- minimal PNG encoder ---------- */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(pixels, size) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // colour type RGBA
  // compression 0, filter 0, interlace 0
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

/* ---------- main ---------- */

const outDir = path.join(__dirname, '..', 'icons');
fs.mkdirSync(outDir, { recursive: true });
for (const size of [16, 32, 48, 128]) {
  const png = encodePng(renderIcon(size), size);
  const file = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(file, png);
  console.log(`Wrote ${file} (${png.length} bytes)`);
}
