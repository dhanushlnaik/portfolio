'use client';

import type { ChainSnapshot } from '@/app/api/chain/route';
import { ArrowUpRight } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  SCENE_H,
  type Ship,
  type ShipBox,
  drawScene,
  layoutShips,
} from './draw';
import {
  BLOB_KB,
  type Game,
  type GameInput,
  ROUND_SECONDS,
  drawGame,
  newGame,
  stepGame,
} from './game';

const BEST_KEY = 'harbour-blob-catch-best';

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(n: number) {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {
    /* private mode etc. */
  }
}

function formatData(blobs: number) {
  const kb = blobs * BLOB_KB;
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

const POLL_MS = 12_000;
const FPS = 30;

function timeAgo(sec: number) {
  if (sec < 60) return `${Math.max(1, Math.round(sec))}s ago`;
  return `${Math.round(sec / 60)}m ago`;
}

function formatFee(gwei: number | null) {
  if (gwei === null) return null;
  if (gwei < 0.001) return `${gwei.toExponential(1)} gwei`;
  return `${gwei.toFixed(gwei < 1 ? 4 : 2)} gwei`;
}

/**
 * Bhatkal harbour, live on Ethereum mainnet. Every ship is a real block and
 * every container on it is a blob (EIP-4844). Ships are placed by the block's
 * real age, so they sit about as far apart as the blocks actually were.
 */
export default function Harbour() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shipsRef = useRef<Map<number, Ship>>(new Map());
  const boxesRef = useRef<ShipBox[]>([]);
  const hoverRef = useRef<number | null>(null);
  const widthRef = useRef(320);
  const lastActivity = useRef(0);

  const [snapshot, setSnapshot] = useState<ChainSnapshot | null>(null);
  const [width, setWidth] = useState(320);
  const [tip, setTip] = useState<{ box: ShipBox; left: number; top: number } | null>(null);
  const [bubble, setBubble] = useState<string | null>(null);
  const [calm, setCalm] = useState(false);
  const [touch, setTouch] = useState(false);

  // Blob Catch mini-game.
  const gameRef = useRef<Game | null>(null);
  const inputRef = useRef<GameInput>({ dir: 0, targetX: null });
  const keysRef = useRef({ left: false, right: false });
  const lastFrameRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [result, setResult] = useState<{ score: number; best: number; newBest: boolean } | null>(null);
  const [best, setBest] = useState(0);
  useEffect(() => setBest(readBest()), []);

  // Logical width follows the container so ships stay readable on phones.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width < 520 ? 208 : 320;
      widthRef.current = w;
      setWidth(w);
    });
    ro.observe(el);
    setCalm(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setTouch(window.matchMedia('(pointer: coarse)').matches);
    return () => ro.disconnect();
  }, []);

  // Fetch blocks, then poll. Sample data gets a fake block every 12s instead.
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    let firstLoad = true;

    const load = async () => {
      try {
        const res = await fetch('/api/chain', { cache: 'no-store' });
        const data = (await res.json()) as ChainSnapshot;
        if (!alive) return;
        const ships = shipsRef.current;
        const newest = Math.max(0, ...ships.keys());
        for (const b of data.blocks) ships.set(b.number, b);
        const head = data.blocks[0];
        if (!firstLoad && head && head.number > newest) {
          setBubble(`block #${head.number.toLocaleString()} · ${head.blobs} blob${head.blobs === 1 ? '' : 's'}`);
          lastActivity.current = Date.now();
          setTimeout(() => alive && setBubble(null), 3500);
        }
        firstLoad = false;
        // Forget ships long gone off the left edge.
        const cutoff = Date.now() / 1000 - 200;
        for (const [n, s] of ships) if (s.timestamp < cutoff) ships.delete(n);
        setSnapshot(data);
      } catch {
        /* keep the current ships */
      }
      if (alive && !document.hidden) timer = setTimeout(load, POLL_MS);
    };

    const onVisible = () => {
      if (!document.hidden) {
        clearTimeout(timer);
        load();
      } else clearTimeout(timer);
    };
    load();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // Fake arrivals for sample mode so the harbour still moves.
  useEffect(() => {
    if (snapshot?.source !== 'sample') return;
    const id = setInterval(() => {
      const ships = shipsRef.current;
      const head = Math.max(...ships.keys());
      ships.set(head + 1, {
        number: head + 1,
        timestamp: Date.now() / 1000,
        blobs: Math.floor(Math.random() * 10),
        txs: 120 + Math.floor(Math.random() * 200),
      });
    }, POLL_MS);
    return () => clearInterval(id);
  }, [snapshot?.source]);

  const render = useCallback((t: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const W = widthRef.current;
    if (canvas.width !== W) canvas.width = W;
    const boxes = layoutShips([...shipsRef.current.values()], W, Date.now() / 1000);
    boxesRef.current = boxes;
    const sleepy = Date.now() - lastActivity.current > 45_000 && boxes.length === 0;
    const g = gameRef.current;
    drawScene(ctx, W, t, boxes, g?.active ? null : hoverRef.current, sleepy, !g?.active);

    if (g?.active) {
      const now = performance.now() / 1000;
      const dt = Math.min(0.1, now - (lastFrameRef.current ?? now));
      lastFrameRef.current = now;
      const k = keysRef.current;
      inputRef.current.dir = k.left === k.right ? 0 : k.left ? -1 : 1;
      if (stepGame(g, dt, now, W, boxes, inputRef.current) > 0) setScore(g.score);
      drawGame(ctx, g, now, t);
      if (now >= g.endsAt) {
        g.active = false;
        const prev = readBest();
        const newBest = g.score > prev;
        if (newBest) saveBest(g.score);
        setBest(Math.max(prev, g.score));
        setResult({ score: g.score, best: Math.max(prev, g.score), newBest });
        setPlaying(false);
      }
    }
  }, []);

  // Animation loop, paused when off-screen or when the tab is hidden.
  useEffect(() => {
    if (calm && !playing) {
      render(0);
      return;
    }
    let raf = 0;
    let last = 0;
    let visible = true;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 1000 / FPS) return;
      last = now;
      render((now - start) / 1000);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (canvasRef.current) io.observe(canvasRef.current);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [calm, playing, render]);

  // Redraw the still frame when data changes in reduced-motion mode.
  useEffect(() => {
    if (calm) render(0);
  }, [calm, snapshot, width, render]);

  const startGame = () => {
    gameRef.current = newGame(widthRef.current, performance.now() / 1000);
    lastFrameRef.current = null;
    inputRef.current = { dir: 0, targetX: null };
    hoverRef.current = null;
    setTip(null);
    setBubble(null);
    setResult(null);
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setPlaying(true);
    canvasRef.current?.focus({ preventScroll: true });
  };

  const stopGame = () => {
    if (gameRef.current) gameRef.current.active = false;
    gameRef.current = null;
    setPlaying(false);
  };

  // Countdown and keyboard while a round is on.
  useEffect(() => {
    if (!playing) return;
    const tick = setInterval(() => {
      const g = gameRef.current;
      if (g) setTimeLeft(Math.max(0, Math.ceil(g.endsAt - performance.now() / 1000)));
    }, 250);
    const key = (down: boolean) => (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') keysRef.current.left = down;
      else if (k === 'arrowright' || k === 'd') keysRef.current.right = down;
      else if (k === 'escape' && down) stopGame();
      else return;
      e.preventDefault();
    };
    const onDown = key(true);
    const onUp = key(false);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      clearInterval(tick);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      keysRef.current = { left: false, right: false };
    };
  }, [playing]);

  const toSceneX = (clientX: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * widthRef.current;
  };

  const hitTest = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const sx = ((clientX - rect.left) / rect.width) * widthRef.current;
    const sy = ((clientY - rect.top) / rect.height) * SCENE_H;
    const box = boxesRef.current.find(
      (b) => sx >= b.x0 - 2 && sx <= b.x1 + 2 && sy >= b.y0 - 3 && sy <= b.y1 + 3,
    );
    if (!box) return null;
    return {
      box,
      left: (((box.x0 + box.x1) / 2) / widthRef.current) * 100,
      top: (box.y0 / SCENE_H) * 100,
    };
  };

  const onMove = (e: React.PointerEvent) => {
    if (playing) {
      if (inputRef.current.targetX !== null) inputRef.current.targetX = toSceneX(e.clientX);
      return;
    }
    const hit = hitTest(e.clientX, e.clientY);
    hoverRef.current = hit?.box.ship.number ?? null;
    setTip(hit);
    if (calm) render(0);
  };

  const onClick = (e: React.MouseEvent) => {
    if (playing) return;
    const hit = hitTest(e.clientX, e.clientY);
    if (!hit) {
      setTip(null);
      return;
    }
    // Touch: first tap shows details, second tap on the same ship opens it.
    if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType === 'touch' && tip?.box.ship.number !== hit.box.ship.number) {
      hoverRef.current = hit.box.ship.number;
      setTip(hit);
      return;
    }
    window.open(`https://etherscan.io/block/${hit.box.ship.number}`, '_blank', 'noopener');
  };

  const head = snapshot?.blocks[0];
  const live = snapshot?.source === 'live';
  const fee = formatFee(snapshot?.blobBaseFeeGwei ?? null);
  const nowSec = Date.now() / 1000;

  return (
    <figure
      data-cursor={
        playing
          ? touch
            ? 'hold to steer'
            : '← → to steer'
          : tip
            ? `block #${tip.box.ship.number.toLocaleString()} ↗`
            : 'pick a ship'
      }
      className="overflow-hidden rounded-xl border bg-[#060914]"
    >
      <div ref={wrapRef} className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={SCENE_H}
          tabIndex={playing ? 0 : -1}
          onPointerDown={(e) => {
            if (!playing) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            inputRef.current.targetX = toSceneX(e.clientX);
          }}
          onPointerUp={() => {
            inputRef.current.targetX = null;
          }}
          onPointerCancel={() => {
            inputRef.current.targetX = null;
          }}
          onPointerMove={onMove}
          onPointerLeave={() => {
            hoverRef.current = null;
            setTip(null);
          }}
          onClick={onClick}
          className="block w-full cursor-pointer outline-none select-none"
          style={{
            imageRendering: 'pixelated',
            aspectRatio: `${width} / ${SCENE_H}`,
            touchAction: playing ? 'none' : 'auto',
          }}
          aria-hidden="true"
        />

        {bubble && !playing && (
          <div
            className="pointer-events-none absolute rounded-md bg-white px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-black shadow"
            style={{
              left: `${(30 / width) * 100}%`,
              top: `${(52 / SCENE_H) * 100}%`,
            }}
          >
            {bubble}
          </div>
        )}

        {tip && !playing && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-white/15 bg-black/85 px-2 py-1 font-mono text-[10px] leading-4 whitespace-nowrap text-white"
            style={{
              left: `${Math.min(85, Math.max(15, tip.left))}%`,
              top: `calc(${tip.top}% - 4px)`,
            }}
          >
            <div className="text-[#f2733a]">
              block #{tip.box.ship.number.toLocaleString()}
            </div>
            <div>
              {tip.box.ship.blobs} blob{tip.box.ship.blobs === 1 ? '' : 's'} ·{' '}
              {tip.box.ship.txs} txs · {timeAgo(nowSec - tip.box.ship.timestamp)}
            </div>
            <div className="text-white/50">
              {live
                ? `${touch ? 'tap again' : 'click'} to open on Etherscan`
                : 'sample data'}
            </div>
          </div>
        )}

        {!playing && !result && (
          <>
            <p className="pointer-events-none absolute top-2 left-2 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/70 sm:top-3 sm:left-3">
              bhatkal harbour · mainnet
            </p>
            <p className="pointer-events-none absolute top-2 right-2 hidden rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/50 sm:top-3 sm:right-3 sm:block">
              ships = blocks · containers = blobs
            </p>
            <button
              type="button"
              onClick={startGame}
              data-cursor="play"
              className="absolute right-2 bottom-2 rounded-md bg-[#f2733a] px-2 py-1 font-mono text-[10px] font-bold text-black shadow transition-transform hover:-translate-y-0.5 sm:right-3 sm:bottom-3 sm:text-[11px]"
            >
              ▶ play blob catch
            </button>
          </>
        )}

        {playing && (
          <>
            <div className="pointer-events-none absolute top-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] whitespace-nowrap text-white sm:top-3 sm:text-[11px]">
              <span className="inline-block size-2 rounded-[1px] bg-[#f2733a]" />
              <span>{score} caught</span>
              <span className="text-white/40">·</span>
              <span className={timeLeft <= 10 ? 'text-[#f2733a]' : ''}>
                0:{String(timeLeft).padStart(2, '0')}
              </span>
            </div>
            <p className="pointer-events-none absolute top-9 left-1/2 -translate-x-1/2 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[9px] whitespace-nowrap text-white/60 sm:top-10 sm:text-[10px]">
              {touch ? 'hold and drag to row' : '← → or A D to row · esc to quit'}
            </p>
            <button
              type="button"
              onClick={stopGame}
              aria-label="Quit game"
              className="absolute top-2 right-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white/70 hover:text-white sm:top-3 sm:right-3"
            >
              ✕
            </button>
          </>
        )}

        {result && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 p-3">
            <div className="rounded-lg border border-white/15 bg-[#0b1020] px-4 py-3 text-center font-mono text-white shadow-xl">
              <p className="text-[10px] tracking-widest text-[#f2733a]">
                {result.newBest ? 'NEW BEST!' : 'ROUND OVER'}
              </p>
              <p className="mt-1 text-sm font-bold sm:text-base">
                {result.score} blob{result.score === 1 ? '' : 's'} caught
              </p>
              <p className="mt-0.5 text-[10px] text-white/60">
                that&apos;s {formatData(result.score)} of rollup data · best {result.best}
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={startGame}
                  className="rounded bg-[#f2733a] px-2 py-1 text-[10px] font-bold text-black"
                >
                  play again
                </button>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="rounded border border-white/20 px-2 py-1 text-[10px] text-white/80"
                >
                  done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <figcaption className="flex flex-col gap-1 border-t border-white/10 px-3 py-2 font-mono text-[11px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="flex items-center gap-1.5">
            <span
              className={`size-1.5 rounded-full ${live ? 'animate-pulse bg-emerald-400' : 'bg-white/40'}`}
            />
            {live ? 'live' : snapshot ? 'sample data' : 'connecting'}
          </span>
          {head && (
            <>
              <span>· block #{head.number.toLocaleString()}</span>
              <span>· {head.blobs} blobs</span>
            </>
          )}
          {fee && <span>· blob fee {fee}</span>}
          {best > 0 && <span className="text-white/45">· best catch {best}</span>}
        </span>
        <span className="text-white/45">
          <span className="sm:hidden">ships = blocks · containers = blobs · </span>
          <a
            href="https://bloblens.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-white/70 underline-offset-2 hover:text-[#f2733a] hover:underline"
          >
            BlobLens
            <ArrowUpRight className="size-3" />
          </a>
        </span>
      </figcaption>
      <span className="sr-only" aria-live="polite">
        {head
          ? `Latest Ethereum block ${head.number} carried ${head.blobs} blobs.`
          : ''}
      </span>
    </figure>
  );
}

