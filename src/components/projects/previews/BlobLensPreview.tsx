'use client';

import type { ChainSnapshot } from '@/app/api/chain/route';
import React, { useEffect, useState } from 'react';

import { useLoop } from './useLoop';

const MAX_BLOBS = 21; // current per-block blob limit
const FALLBACK = [6, 14, 0, 21, 9, 17, 3, 12];

function cellColor(i: number, filled: number) {
  if (i >= filled) return 'rgba(148,163,184,0.12)';
  const u = filled / MAX_BLOBS;
  if (u > 0.85) return '#f97316';
  if (u > 0.5) return '#6366f1';
  return '#38bdf8';
}

/** Real recent blocks as columns of blob cells, scrolling in one at a time. */
export default function BlobLensPreview() {
  const { ref, step, calm } = useLoop<HTMLDivElement>(1600);
  const [counts, setCounts] = useState<number[]>(FALLBACK);
  const [fee, setFee] = useState<number | null>(null);
  const [head, setHead] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/chain')
      .then((r) => r.json() as Promise<ChainSnapshot>)
      .then((d) => {
        if (!alive || d.source !== 'live') return;
        setCounts(d.blocks.map((b) => b.blobs).reverse());
        setFee(d.blobBaseFeeGwei);
        setHead(d.blocks[0]?.number ?? null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const cols = 8;
  const offset = calm ? 0 : step % counts.length;
  const visible = Array.from({ length: cols }, (_, c) => counts[(c + offset) % counts.length]);
  const latest = visible[visible.length - 1];

  return (
    <div
      ref={ref}
      className="relative flex h-full w-full flex-col bg-[#f8fafc] p-3 text-slate-700 dark:bg-[#0b0f1a] dark:text-slate-300"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between font-mono text-[9px] tracking-wider">
        <span className="font-bold text-indigo-500">BLOB MATRIX</span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
          {head ? `#${head.toLocaleString()}` : 'mainnet'}
        </span>
      </div>

      <div className="mt-2 flex flex-1 items-end gap-[5%] px-1">
        {visible.map((n, c) => (
          <div
            key={`${c}-${offset}`}
            className="flex h-full flex-1 flex-col-reverse gap-[2px] transition-opacity duration-500"
            style={{ opacity: c === cols - 1 && !calm ? 1 : 0.55 + (c / cols) * 0.45 }}
          >
            {Array.from({ length: MAX_BLOBS }, (_, i) => (
              <span
                key={i}
                className="w-full flex-1 rounded-[1px]"
                style={{ background: cellColor(i, n) }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between font-mono text-[9px]">
        <span>
          latest: <b className="text-indigo-500">{latest}</b>/{MAX_BLOBS} blobs
        </span>
        <span>{fee !== null ? `${fee.toFixed(4)} gwei` : 'EIP-4844'}</span>
      </div>
    </div>
  );
}
