import { BIT_PALETTE, bitGrid } from '@/lib/bit';

// Pure drawing code for the harbour scene. Everything is drawn in "logical"
// pixels on a small canvas that CSS scales up with `image-rendering: pixelated`.

export const SCENE_H = 128;
export const HORIZON = 70;
export const WATERLINE = 110; // where ship hulls meet the water
export const SHIP_SPEED = 5; // logical px per second of block age
export const DOCK_W = 64;

export interface Ship {
  number: number;
  timestamp: number; // seconds
  blobs: number;
  txs: number;
}

export interface ShipBox {
  ship: Ship;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

const C = {
  sky: ['#060914', '#0a1022', '#10163a', '#1a1840', '#2a1d45'],
  star: '#e8e6ff',
  moon: '#f4ead0',
  moonShade: '#ddd0ad',
  ridgeFar: '#141b33',
  ridgeNear: '#0c1226',
  palm: '#070b18',
  window: '#f5c451',
  sea: '#0a1730',
  seaDeep: '#071022',
  shimmer: '#1d3a63',
  moonPath: '#c9b98f',
  hull: '#2b2230',
  hullStripe: '#f2733a',
  cabin: '#d4d4d8',
  funnel: '#f2733a',
  wood: '#5b3b26',
  woodDark: '#3a2618',
  lamp: '#ffd27a',
  highlight: '#ffffff',
};

const CONTAINERS = ['#f2733a', '#f6b5cf', '#38bdf8', '#facc15', '#a3e635', '#e4e4e7'];

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

/** Static background pieces are cached per width. */
const bgCache = new Map<number, HTMLCanvasElement>();

function background(W: number): HTMLCanvasElement {
  const hit = bgCache.get(W);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = SCENE_H;
  const ctx = c.getContext('2d')!;
  const r = rng(4844);

  // Sky in dithered bands.
  const bandH = HORIZON / C.sky.length;
  C.sky.forEach((color, i) => px(ctx, 0, i * bandH, W, Math.ceil(bandH), color));
  for (let i = 1; i < C.sky.length; i++) {
    const y = Math.round(i * bandH);
    for (let x = 0; x < W; x += 2) {
      px(ctx, x + (i % 2), y - 1, 1, 1, C.sky[i]);
      px(ctx, x + ((i + 1) % 2), y, 1, 1, C.sky[i - 1]);
    }
  }

  // Moon.
  const mx = W - 70;
  const my = 20;
  for (let y = -8; y <= 8; y++)
    for (let x = -8; x <= 8; x++)
      if (x * x + y * y <= 64) px(ctx, mx + x, my + y, 1, 1, C.moon);
  [[-3, -2], [2, 3], [3, -3], [-1, 4]].forEach(([x, y]) => px(ctx, mx + x, my + y, 2, 1, C.moonShade));

  // Far ridge (the Western Ghats behind the coast).
  let h = 10;
  for (let x = 0; x < W; x++) {
    h += (r() - 0.5) * 1.6;
    h = Math.max(4, Math.min(16, h));
    const fade = x > W * 0.6 ? Math.max(0, 1 - (x - W * 0.6) / (W * 0.35)) : 1;
    const hh = Math.round(h * fade);
    if (hh > 0) px(ctx, x, HORIZON - hh, 1, hh, C.ridgeFar);
  }

  // Near coastline on the left: palms first so the ridge hides their roots.
  const coastEnd = Math.round(W * 0.55);
  for (let i = 0; i < 7; i++) {
    const tx = 4 + Math.round(r() * (coastEnd - 20));
    const th = 10 + Math.round(r() * 6);
    const lean = r() > 0.5 ? 1 : -1;
    for (let y = 0; y < th; y++) px(ctx, tx + Math.round((y / th) * lean * 2), HORIZON - 1 - y, 1, 1, C.palm);
    const top = HORIZON - 1 - th;
    const cx = tx + lean * 2;
    [[-4, 1], [-3, 0], [-2, -1], [2, -1], [3, 0], [4, 1], [-1, -2], [1, -2], [-5, 2], [5, 2]].forEach(
      ([dx, dy]) => px(ctx, cx + dx, top + dy, 1, 1, C.palm),
    );
  }

  let n = 5;
  for (let x = 0; x < coastEnd; x++) {
    n += (r() - 0.5) * 1.2;
    n = Math.max(3, Math.min(8, n));
    const taper = x > coastEnd - 30 ? (coastEnd - x) / 30 : 1;
    const nh = Math.round(n * taper);
    if (nh > 0) px(ctx, x, HORIZON - nh, 1, nh, C.ridgeNear);
  }
  for (let i = 0; i < 9; i++) {
    const hx = 8 + Math.round(r() * (coastEnd - 50));
    const hw = 5 + Math.round(r() * 4);
    const hh = 4 + Math.round(r() * 3);
    px(ctx, hx, HORIZON - 4 - hh, hw, hh + 4, C.ridgeNear);
    if (r() > 0.35) px(ctx, hx + 1 + Math.round(r() * (hw - 3)), HORIZON - 3 - hh + 1, 1, 1, C.window);
  }
  // Sea.
  px(ctx, 0, HORIZON, W, SCENE_H - HORIZON, C.sea);
  for (let y = HORIZON + 30; y < SCENE_H; y += 2) px(ctx, 0, y, W, 1, C.seaDeep);

  // Stars (twinkle is drawn per frame; these are the dim base).
  bgCache.set(W, c);
  return c;
}

function stars(W: number) {
  const r = rng(7691);
  return Array.from({ length: Math.round(W / 9) }, () => ({
    x: Math.round(r() * W),
    y: Math.round(r() * (HORIZON - 26)),
    phase: r() * Math.PI * 2,
  }));
}
const starCache = new Map<number, ReturnType<typeof stars>>();

function drawWater(ctx: CanvasRenderingContext2D, W: number, t: number) {
  const r = rng(1559);
  for (let i = 0; i < W / 6; i++) {
    const y = HORIZON + 3 + Math.round(r() * (SCENE_H - HORIZON - 6));
    const len = 2 + Math.round(r() * 5);
    const speed = 2 + r() * 4;
    const x = (((r() * W - t * speed) % (W + 20)) + W + 20) % (W + 20) - 10;
    px(ctx, x, y, len, 1, C.shimmer);
  }
  // Moonlight on the water.
  const mx = W - 70;
  for (let y = HORIZON + 2; y < SCENE_H; y += 3) {
    const wobble = Math.round(Math.sin(t * 2 + y) * 2);
    const w = 3 + Math.round(((y - HORIZON) / (SCENE_H - HORIZON)) * 6);
    ctx.globalAlpha = 0.5;
    px(ctx, mx - w / 2 + wobble, y, w, 1, C.moonPath);
    ctx.globalAlpha = 1;
  }
}

export function shipWidth(blobs: number) {
  const cols = Math.ceil(blobs / 3);
  return Math.max(22, cols * 4 + 16);
}

function drawShip(ctx: CanvasRenderingContext2D, box: ShipBox, t: number, hovered: boolean) {
  const { ship, x0, x1 } = box;
  const bob = Math.round(Math.sin(t * 1.4 + ship.number) * 0.6);
  const wl = WATERLINE + bob;

  // Hull, bow on the left (ships sail left).
  px(ctx, x0 + 3, wl - 5, x1 - x0 - 3, 4, C.hull);
  px(ctx, x0 + 2, wl - 4, 1, 3, C.hull);
  px(ctx, x0 + 1, wl - 5, 1, 2, C.hull);
  px(ctx, x0 + 3, wl - 2, x1 - x0 - 4, 1, C.hullStripe);
  px(ctx, x0 + 4, wl - 1, x1 - x0 - 6, 2, C.hull);

  // Bridge at the stern, with a lit window and a funnel.
  px(ctx, x1 - 8, wl - 11, 6, 6, C.cabin);
  px(ctx, x1 - 7, wl - 10, 4, 1, C.window);
  px(ctx, x1 - 5, wl - 14, 2, 3, C.funnel);

  // Containers: one per blob, stacked up to three high.
  for (let i = 0; i < ship.blobs; i++) {
    const col = Math.floor(i / 3);
    const row = i % 3;
    const cx = x0 + 5 + col * 4;
    const cy = wl - 8 - row * 3;
    px(ctx, cx, cy, 3, 2, CONTAINERS[(ship.number + i) % CONTAINERS.length]);
  }

  // Mast light blinks.
  if (Math.floor(t * 1.5 + ship.number) % 2 === 0) px(ctx, x1 - 4, wl - 15, 1, 1, '#ff5a5a');

  if (hovered) {
    ctx.strokeStyle = C.highlight;
    ctx.globalAlpha = 0.8;
    ctx.strokeRect(box.x0 - 1.5, box.y0 - 1.5, box.x1 - box.x0 + 3, box.y1 - box.y0 + 3);
    ctx.globalAlpha = 1;
  }
}

function drawDock(ctx: CanvasRenderingContext2D, t: number, sleepy: boolean) {
  const deck = 97;
  // Lamp glow.
  ctx.globalAlpha = 0.12 + Math.sin(t * 3) * 0.02;
  ctx.fillStyle = C.lamp;
  ctx.beginPath();
  ctx.arc(52, deck - 15, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  // Posts and planks.
  for (let x = 2; x < DOCK_W; x += 10) px(ctx, x, deck, 2, SCENE_H - deck, C.woodDark);
  px(ctx, 0, deck, DOCK_W, 3, C.wood);
  for (let x = 0; x < DOCK_W; x += 6) px(ctx, x, deck, 1, 3, C.woodDark);
  // Lamp post.
  px(ctx, 52, deck - 14, 1, 14, C.woodDark);
  px(ctx, 50, deck - 16, 5, 2, C.lamp);

  // Bit on the dock.
  const rows = bitGrid(sleepy ? 'sleep' : Math.floor(t * 0.5) % 9 === 0 ? 'blink' : 'stand');
  const bx = 22;
  const by = deck - rows.length;
  rows.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (c !== '.') px(ctx, bx + x, by + y, 1, 1, BIT_PALETTE[c]);
    }),
  );
}

export function layoutShips(ships: Ship[], W: number, nowSec: number): ShipBox[] {
  return ships
    .map((ship) => {
      const age = Math.max(0, nowSec - ship.timestamp);
      const w = shipWidth(ship.blobs);
      const x0 = Math.round(W + 4 - age * SHIP_SPEED);
      return { ship, x0, x1: x0 + w, y0: WATERLINE - 15, y1: WATERLINE + 2 };
    })
    .filter((b) => b.x1 > -4 && b.x0 < W + 40);
}

export function drawScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  t: number,
  boxes: ShipBox[],
  hovered: number | null,
  sleepy: boolean,
) {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(background(W), 0, 0);

  if (!starCache.has(W)) starCache.set(W, stars(W));
  for (const s of starCache.get(W)!) {
    ctx.globalAlpha = 0.35 + 0.65 * Math.max(0, Math.sin(t * 1.3 + s.phase));
    px(ctx, s.x, s.y, 1, 1, C.star);
  }
  ctx.globalAlpha = 1;

  drawWater(ctx, W, t);
  for (const b of boxes) drawShip(ctx, b, t, hovered === b.ship.number);
  drawDock(ctx, t, sleepy);
}
