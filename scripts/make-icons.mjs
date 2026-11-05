// Generates the favicon set from Bit, the pixel mascot.
// Run: node scripts/make-icons.mjs
// Output: src/app/favicon.ico, src/app/icon.svg, src/app/apple-icon.png,
//         public/icon-192.png, public/icon-512.png, public/icon-maskable-512.png
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const PALETTE = {
  K: '#18181b', H: '#3f3f46', S: '#f5d0b5', B: '#f19c9c', G: '#27272a',
  P: '#f6b5cf', D: '#d987ad', W: '#fafafa', Z: '#52525b',
};
const BG = '#fde4ee'; // matches --brand-soft (light)

// Keep in sync with src/components/common/PixelBuddy.tsx
const HEAD = [
  '.....KKKKKK.....',
  '...KKHKKKKHKK...',
  '..KKKKKKHKKKKK..',
  '.KKHKKKKKKKKHKK.',
  '.KKKKKKKKKKKKKK.',
  '.KKKSKKSKKSKKKK.',
  '.KKSSSSSSSSSSKK.',
  '.KGGGGSSSSGGGGK.',
  '.SGSSGGGGGGSSGS.',
  '.SGKSGSSSSGKSGS.',
  '.SGGGGSSSSGGGGS.',
  '..SBSSSSSSSSBS..',
  '...SSSSKKSSSS...',
  '....SSSSSSSS....',
];
const BODY = [
  '...PPPPWWPPPP...',
  '..PPPPDPPDPPPP..',
  '..PPPPDPPDPPPP..',
  '..SPPPPPPPPPPS..',
  '...PPPPPPPPPP...',
  '...ZZZ....ZZZ...',
];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/** Rasterise rows onto a size×size RGBA canvas at integer `scale`, centred. */
function raster(rows, size, scale, { bg = BG, radius = 0 } = {}) {
  const px = new Uint8Array(size * size * 4);
  const [br, bgG, bb] = hex(bg);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // rounded-corner mask
      const r = radius;
      let inside = true;
      if (r > 0) {
        const cx = x < r ? r - 0.5 : x >= size - r ? size - r - 0.5 : x + 0.5;
        const cy = y < r ? r - 0.5 : y >= size - r ? size - r - 0.5 : y + 0.5;
        inside = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= r;
      }
      if (inside && bg) {
        const i = (y * size + x) * 4;
        px.set([br, bgG, bb, 255], i);
      }
    }
  }
  const w = rows[0].length * scale;
  const h = rows.length * scale;
  const ox = Math.floor((size - w) / 2);
  const oy = Math.floor((size - h) / 2);
  rows.forEach((row, ry) =>
    [...row].forEach((c, rx) => {
      if (c === '.') return;
      const [r, g, b] = hex(PALETTE[c]);
      for (let dy = 0; dy < scale; dy++)
        for (let dx = 0; dx < scale; dx++) {
          const x = ox + rx * scale + dx;
          const y = oy + ry * scale + dy;
          px.set([r, g, b, 255], (y * size + x) * 4);
        }
    }),
  );
  return px;
}

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function png(px, size) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.set([8, 6, 0, 0, 0], 8); // 8-bit RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    Buffer.from(px.buffer, y * size * 4, size * 4).copy(raw, y * (size * 4 + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const dir = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size;
    e[1] = size >= 256 ? 0 : size;
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...dir, ...images.map((i) => i.data)]);
}

// Favicon: head only, padded to 16×16 (head is 16×14), rounded tile.
const head16 = ['.'.repeat(16), ...HEAD, '.'.repeat(16)];
const fav = [16, 32, 48].map((size) => ({
  size,
  data: png(raster(head16, size, size / 16, { radius: size / 8 }), size),
}));
writeFileSync('src/app/favicon.ico', ico(fav));

// SVG icon (crisp at any size, used by modern browsers).
const rects = head16
  .flatMap((row, y) =>
    [...row].map((c, x) =>
      c === '.' ? '' : `<rect x="${x}" y="${y}" width="1" height="1" fill="${PALETTE[c]}"/>`,
    ),
  )
  .join('');
writeFileSync(
  'src/app/icon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" rx="2" fill="${BG}"/>${rects}</svg>\n`,
);

// Full-body Bit for larger icons.
const full = [...HEAD, ...BODY]; // 16×20
writeFileSync('src/app/apple-icon.png', png(raster(full, 180, 7), 180));
writeFileSync('public/icon-192.png', png(raster(full, 192, 8), 192));
writeFileSync('public/icon-512.png', png(raster(full, 512, 22), 512));
// Maskable: keep Bit inside the ~80% safe zone.
writeFileSync('public/icon-maskable-512.png', png(raster(full, 512, 16), 512));

console.log('icons written');
