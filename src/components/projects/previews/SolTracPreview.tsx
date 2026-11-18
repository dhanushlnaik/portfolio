'use client';

import React from 'react';

import { useLoop } from './useLoop';

const SCENARIOS = [
  { sig: '5Kx9…pQ2v', risk: 12, verdict: 'SEND', cause: 'all checks passed', fix: 'good to go' },
  { sig: '3mRt…a8Lc', risk: 58, verdict: 'REVIEW', cause: 'stale blockhash (148 slots)', fix: 'refresh blockhash' },
  { sig: '2wQz…Hn7e', risk: 91, verdict: 'DO_NOT_SEND', cause: 'slippage > 1% on Jupiter', fix: 'raise slippage to 1.5%' },
];

const VERDICT_COLOR: Record<string, string> = {
  SEND: '#22c55e',
  REVIEW: '#f59e0b',
  DO_NOT_SEND: '#ef4444',
};

// Per scenario: type signature (3), scan (4), verdict (4).
const STEPS = 11;

/** Pre-flight check: paste a tx, the risk meter fills, a verdict lands. */
export default function SolTracPreview() {
  const { ref, step, calm } = useLoop<HTMLDivElement>(380);
  const k = calm ? 2 : Math.floor(step / STEPS) % SCENARIOS.length;
  const s = calm ? STEPS - 1 : step % STEPS;
  const sc = SCENARIOS[k];
  const sig = sc.sig.slice(0, Math.ceil(sc.sig.length * Math.min(1, (s + 1) / 3)));
  const scan = s < 3 ? 0 : Math.min(1, (s - 2) / 4);
  const done = s >= 7;
  const color = VERDICT_COLOR[sc.verdict];

  return (
    <div
      ref={ref}
      className="relative flex h-full w-full flex-col justify-center gap-2 bg-[#05070d] px-4 text-slate-300"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 20% 0%, rgba(34,197,94,0.18), transparent 55%), radial-gradient(ellipse at 90% 100%, rgba(139,92,246,0.18), transparent 55%)',
      }}
      aria-hidden="true"
    >
      <div className="font-mono text-[9px] tracking-wider text-emerald-400">
        SOLTRAC · PRE-FLIGHT
      </div>

      <div className="flex items-center gap-2 rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px]">
        <span className="text-white/40">tx</span>
        <span className="text-white">{sig}</span>
        {s < 3 && <span className="animate-caret text-white">_</span>}
      </div>

      <div>
        <div className="mb-1 flex justify-between font-mono text-[9px] text-white/50">
          <span>risk score</span>
          <span style={{ color: done ? color : undefined }}>
            {Math.round(sc.risk * scan)}/100
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${sc.risk * scan}%`,
              background: `linear-gradient(90deg,#22c55e,#f59e0b ${Math.max(60, 120 - sc.risk)}%,#ef4444)`,
            }}
          />
        </div>
      </div>

      <div className="flex min-h-[34px] items-center gap-2">
        {done ? (
          <>
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold text-black"
              style={{ background: color }}
            >
              {sc.verdict}
            </span>
            <span className="font-mono text-[9px] leading-tight text-white/70">
              {sc.cause}
              <br />
              <span className="text-white/45">fix: {sc.fix}</span>
            </span>
          </>
        ) : (
          <span className="font-mono text-[9px] text-white/40">
            {s < 3 ? 'paste a signature…' : 'simulating · scoring 8 signals…'}
          </span>
        )}
      </div>
    </div>
  );
}
