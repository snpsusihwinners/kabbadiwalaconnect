const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function createPng(width, height, drawFn) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }
  const compressed = zlib.deflateSync(rawData);

  function crc32(buf) {
    let c;
    const table = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c;
    }
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    return (crc ^ (-1)) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// Draw EcoSetu Icon
function drawEcoSetuIcon(x, y, w, h, isMaskable = false) {
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5;
  const cy = isMaskable ? 0.5 : 0.46;

  // Background corner radius
  const cornerRadius = isMaskable ? 0 : 0.22;
  const dx = Math.max(0, Math.abs(nx - 0.5) - (0.5 - cornerRadius));
  const dy = Math.max(0, Math.abs(ny - 0.5) - (0.5 - cornerRadius));
  const distFromCorner = Math.sqrt(dx * dx + dy * dy);

  if (!isMaskable && distFromCorner > cornerRadius) {
    return [0, 0, 0, 0]; // Transparent outside rounded rect
  }

  // Emerald gradient background (#059669 to #064e3b)
  const gradT = (nx + ny) * 0.5;
  let bgR = Math.round(5 * (1 - gradT) + 6 * gradT);
  let bgG = Math.round(150 * (1 - gradT) + 78 * gradT);
  let bgB = Math.round(105 * (1 - gradT) + 59 * gradT);

  // Central white circle emblem
  const distToCenter = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2);
  const emblemRadius = isMaskable ? 0.22 : 0.24;

  // Outer glow around emblem
  if (distToCenter <= emblemRadius + 0.05 && distToCenter > emblemRadius) {
    const glowIntensity = 1 - (distToCenter - emblemRadius) / 0.05;
    bgR = Math.round(bgR + (110 - bgR) * glowIntensity * 0.5);
    bgG = Math.round(bgG + (231 - bgG) * glowIntensity * 0.5);
    bgB = Math.round(bgB + (183 - bgB) * glowIntensity * 0.5);
    return [bgR, bgG, bgB, 255];
  }

  if (distToCenter <= emblemRadius) {
    // Inside white emblem circle
    const innerDist = distToCenter / emblemRadius;

    // Center Chip (Emerald green square in the middle)
    const chipX = Math.abs(nx - cx);
    const chipY = Math.abs(ny - cy);
    if (chipX < 0.045 && chipY < 0.045) {
      // Inner bright green core
      if (chipX < 0.025 && chipY < 0.025) {
        if (distToCenter < 0.01) {
          return [255, 255, 255, 255]; // center white dot
        }
        return [52, 211, 153, 255]; // #34d399 bright emerald
      }
      return [5, 150, 105, 255]; // #059669 emerald
    }

    // Recycling / circulation ring (ring between 0.45 and 0.85 of emblemRadius)
    if (innerDist > 0.38 && innerDist < 0.82) {
      const angle = Math.atan2(ny - cy, nx - cx); // -PI to PI
      // 3 segments with gaps
      const normAngle = (angle + Math.PI * 2) % (Math.PI * 2);
      const segment = normAngle / ((Math.PI * 2) / 3);
      const segmentFrac = segment - Math.floor(segment);

      if (segmentFrac > 0.12 && segmentFrac < 0.88) {
        // Emerald green circulation blade
        return [5, 150, 105, 255];
      }
    }

    // White disc background
    return [255, 255, 255, 255];
  }

  // Border ring
  if (!isMaskable) {
    const borderDist = Math.max(Math.abs(nx - 0.5), Math.abs(ny - 0.5));
    if (borderDist > 0.47 && borderDist < 0.49) {
      return [52, 211, 153, 160];
    }
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.join(__dirname, '..', 'public');

// Generate 192x192
const p192 = createPng(192, 192, (x, y, w, h) => drawEcoSetuIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), p192);
console.log('Saved pwa-192x192.png:', p192.length, 'bytes');

// Generate 512x512
const p512 = createPng(512, 512, (x, y, w, h) => drawEcoSetuIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), p512);
console.log('Saved pwa-512x512.png:', p512.length, 'bytes');

// Generate Apple Touch Icon 180x180
const pApple = createPng(180, 180, (x, y, w, h) => drawEcoSetuIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pApple);
console.log('Saved apple-touch-icon.png:', pApple.length, 'bytes');

// Generate Maskable 512x512
const pMask = createPng(512, 512, (x, y, w, h) => drawEcoSetuIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pMask);
console.log('Saved pwa-maskable-512x512.png:', pMask.length, 'bytes');
