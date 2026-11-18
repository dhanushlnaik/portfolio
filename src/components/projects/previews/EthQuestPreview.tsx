'use client';

import React from 'react';

import { useLoop } from './useLoop';

const CARDS = [
  { id: 'EIP-1559', name: 'Fee Market', tier: 'legendary', color: '#f2733a' },
  { id: 'EIP-4844', name: 'Blob Txs', tier: 'epic', color: '#a78bfa' },
  { id: 'ERC-20', name: 'Token Std', tier: 'common', color: '#94a3b8' },
  { id: 'EIP-7702', name: 'Smart EOAs', tier: 'rare', color: '#38bdf8' },
  { id: 'ERC-721', name: 'NFTs', tier: 'rare', color: '#38bdf8' },
  { id: 'EIP-3675', name: 'The Merge', tier: 'legendary', color: '#f2733a' },
];

/** A pack opening: cards flip face-up one after another. */
export default function EthQuestPreview() {
  // Each card: face-down (even step) then face-up (odd step).
  const { ref, step, calm } = useLoop<HTMLDivElement>(1300);
  // Change card only while it's face-down, so the reveal is always a new card.
  const i = calm ? 1 : Math.floor((step + 1) / 2) % CARDS.length;
  const faceUp = calm || step % 2 === 1;
  const card = CARDS[i];
  const collected = 3 + (calm ? 1 : Math.floor(step / 2) % 40);

  return (
    <div
      ref={ref}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg,#1b2a2e 0%,#22383a 55%,#3b2f22 100%)',
        imageRendering: 'pixelated',
      }}
      aria-hidden="true"
    >
      {/* pixel stars */}
      {[12, 30, 47, 66, 81, 92].map((x, k) => (
        <span
          key={x}
          className="absolute size-[3px] bg-amber-100/70"
          style={{ left: `${x}%`, top: `${8 + ((k * 13) % 30)}%` }}
        />
      ))}

      <div className="absolute top-2 left-2 font-mono text-[9px] tracking-wider text-amber-200/80">
        ETHQUEST · PACK OPEN
      </div>
      <div className="absolute top-2 right-2 font-mono text-[9px] text-amber-200/80">
        {collected}/392
      </div>

      {/* side cards */}
      <div className="absolute left-[16%] h-[52%] w-[22%] -rotate-6 rounded-sm border-2 border-[#5a4026] bg-[#3a2a1a] opacity-70" />
      <div className="absolute right-[16%] h-[52%] w-[22%] rotate-6 rounded-sm border-2 border-[#5a4026] bg-[#3a2a1a] opacity-70" />

      <div className="relative h-[66%] w-[30%] [perspective:600px]">
        <div
          className="absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: faceUp ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
        >
          {/* front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-between rounded-sm border-[3px] bg-[#f6ecd2] p-1.5 [backface-visibility:hidden]"
            style={{ borderColor: card.color, boxShadow: `0 0 18px ${card.color}55` }}
          >
            <span
              className="w-full text-center font-mono text-[8px] font-bold uppercase"
              style={{ color: card.color }}
            >
              {card.tier}
            </span>
            <span className="font-mono text-[13px] leading-none font-bold text-[#2b1d10] sm:text-[15px]">
              {card.id}
            </span>
            <span className="text-center font-mono text-[8px] leading-tight text-[#5a4026]">
              {card.name}
            </span>
          </div>
          {/* back */}
          <div className="absolute inset-0 flex items-center justify-center rounded-sm border-[3px] border-[#5a4026] bg-[#7a4f2a] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="font-mono text-lg font-bold text-amber-200/90">Ξ</span>
          </div>
        </div>
      </div>

      {faceUp && !calm && (
        <span className="absolute bottom-2 font-mono text-[9px] text-amber-200">
          + new card!
        </span>
      )}
    </div>
  );
}
