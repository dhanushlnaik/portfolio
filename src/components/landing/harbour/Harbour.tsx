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
    drawScene(ctx, W, t, boxes, hoverRef.current, sleepy);
  }, []);

  // Animation loop, paused when off-screen or when the tab is hidden.
  useEffect(() => {
    if (calm) {
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
  }, [calm, render]);

  // Redraw the still frame when data changes in reduced-motion mode.
  useEffect(() => {
    if (calm) render(0);
  }, [calm, snapshot, width, render]);

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
    const hit = hitTest(e.clientX, e.clientY);
    hoverRef.current = hit?.box.ship.number ?? null;
    setTip(hit);
    if (calm) render(0);
  };

  const onClick = (e: React.MouseEvent) => {
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
    <figure className="overflow-hidden rounded-xl border bg-[#060914]">
      <div ref={wrapRef} className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={SCENE_H}
          onPointerMove={onMove}
          onPointerLeave={() => {
            hoverRef.current = null;
            setTip(null);
          }}
          onClick={onClick}
          className="block w-full cursor-pointer select-none"
          style={{ imageRendering: 'pixelated', aspectRatio: `${width} / ${SCENE_H}` }}
          aria-hidden="true"
        />

        {bubble && (
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

        {tip && (
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

        <p className="pointer-events-none absolute top-2 left-2 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/70 sm:top-3 sm:left-3">
          bhatkal harbour · mainnet
        </p>
        <p className="pointer-events-none absolute top-2 right-2 hidden rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/50 sm:top-3 sm:right-3 sm:block">
          ships = blocks · containers = blobs
        </p>
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

