import { BIT_PALETTE, bitGrid } from '@/lib/bit';

import { type ShipBox, WATERLINE } from './draw';

// "Blob Catch": passing ships (real blocks) drop blob crates, more often the
// more blobs the block carried. Row Bit's boat under them before they sink.

export const ROUND_SECONDS = 45;
const LANE = 122; // waterline for the boat and floating crates
const BOAT_SPEED = 75; // logical px per second
const GRAVITY = 140;
const DRIFT = 1.5;
const FLOAT_LIFE = 4; // seconds a crate floats before sinking
const MAX_CRATES = 9;
const CATCH_HALF_W = 10;

const CRATE_COLORS = ['#f2733a', '#f6b5cf', '#38bdf8', '#facc15', '#a3e635', '#e4e4e7'];

export interface Crate {
  id: number;
  x: number;
  y: number;
  vy: number;
  color: string;
  landedAt: number | null;
}

export interface Pop {
  x: number;
  y: number;
  born: number;
}

export interface Game {
  active: boolean;
  startedAt: number;
  endsAt: number;
  boatX: number;
  score: number;
  crates: Crate[];
  pops: Pop[];
  nextId: number;
}

export interface GameInput {
  dir: -1 | 0 | 1;
  targetX: number | null;
}

export function newGame(W: number, now: number): Game {
  return {
    active: true,
    startedAt: now,
    endsAt: now + ROUND_SECONDS,
    boatX: Math.round(W * 0.35),
    score: 0,
    crates: [],
    pops: [],
    nextId: 1,
  };
}

/** Advance the game by dt seconds. Returns how many crates were caught this step. */
export function stepGame(
  g: Game,
  dt: number,
  now: number,
  W: number,
  boxes: ShipBox[],
  input: GameInput,
): number {
  // Boat.
  if (input.targetX !== null) {
    const d = input.targetX - g.boatX;
    g.boatX += Math.sign(d) * Math.min(Math.abs(d), BOAT_SPEED * dt);
  } else {
    g.boatX += input.dir * BOAT_SPEED * dt;
  }
  g.boatX = Math.max(10, Math.min(W - 10, g.boatX));

  // Ships on screen drop crates, more often when the block had more blobs.
  for (const b of boxes) {
    if (b.ship.blobs === 0 || b.x0 < 4 || b.x1 > W - 4) continue;
    if (g.crates.length >= MAX_CRATES) break;
    const ratePerSec = 0.12 + b.ship.blobs * 0.035;
    if (Math.random() < ratePerSec * dt) {
      const cols = Math.ceil(b.ship.blobs / 3);
      g.crates.push({
        id: g.nextId++,
        x: b.x0 + 5 + Math.random() * Math.max(3, cols * 4 - 3),
        y: WATERLINE - 9,
        vy: -25,
        color: CRATE_COLORS[Math.floor(Math.random() * CRATE_COLORS.length)],
        landedAt: null,
      });
    }
  }

  // Crates fall, splash, drift, sink.
  let caught = 0;
  g.crates = g.crates.filter((c) => {
    if (c.landedAt === null) {
      c.vy += GRAVITY * dt;
      c.y += c.vy * dt;
      if (c.y >= LANE - 2) {
        c.y = LANE - 2;
        c.landedAt = now;
      }
    } else {
      c.x -= DRIFT * dt;
      if (now - c.landedAt > FLOAT_LIFE) return false;
    }
    const nearBoat = Math.abs(c.x - g.boatX) <= CATCH_HALF_W && c.y >= LANE - 12;
    if (nearBoat) {
      caught++;
      g.pops.push({ x: c.x, y: LANE - 18, born: now });
      return false;
    }
    return c.x > -4;
  });
  g.score += caught;
  g.pops = g.pops.filter((p) => now - p.born < 0.7);
  return caught;
}

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

export function drawGame(ctx: CanvasRenderingContext2D, g: Game, now: number, t: number) {
  // Crates.
  for (const c of g.crates) {
    const sinking = c.landedAt !== null ? Math.max(0, now - c.landedAt - (FLOAT_LIFE - 1)) / 1 : 0;
    const bob = c.landedAt !== null ? Math.round(Math.sin(t * 3 + c.id) * 0.6) : 0;
    ctx.globalAlpha = 1 - sinking;
    px(ctx, c.x - 1, c.y + bob + sinking * 2, 3, 2, c.color);
    if (c.landedAt !== null && now - c.landedAt < 0.35) {
      // splash
      px(ctx, c.x - 3, c.y + 1, 1, 1, '#9fd3ff');
      px(ctx, c.x + 3, c.y + 1, 1, 1, '#9fd3ff');
    }
  }
  ctx.globalAlpha = 1;

  // Boat with Bit (head and shoulders) on board.
  const bob = Math.round(Math.sin(t * 2.4) * 0.6);
  const bx = Math.round(g.boatX);
  const rows = bitGrid('stand').slice(0, 16);
  rows.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (c !== '.') px(ctx, bx - 8 + x, LANE - 18 + y + bob, 1, 1, BIT_PALETTE[c]);
    }),
  );
  px(ctx, bx - 10, LANE - 3 + bob, 20, 2, '#8a5a36');
  px(ctx, bx - 9, LANE - 1 + bob, 18, 2, '#5b3b26');
  px(ctx, bx - 7, LANE + 1 + bob, 14, 1, '#3a2618');
  // oar
  const stroke = Math.round(Math.sin(t * 6) * 2);
  px(ctx, bx + 8, LANE - 6 + bob, 1, 6, '#c08a5a');
  px(ctx, bx + 9 + stroke, LANE + bob, 2, 2, '#c08a5a');

  // +1 pops.
  for (const p of g.pops) {
    const k = (now - p.born) / 0.7;
    ctx.globalAlpha = 1 - k;
    ctx.fillStyle = '#ffd27a';
    ctx.font = '7px monospace';
    ctx.fillText('+1', Math.round(p.x - 4), Math.round(p.y - k * 6));
  }
  ctx.globalAlpha = 1;
}

export const BLOB_KB = 128;
