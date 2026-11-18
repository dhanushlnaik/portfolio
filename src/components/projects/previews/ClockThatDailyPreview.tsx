'use client';

import React from 'react';

import { useLoop } from './useLoop';

const PUZZLES = [
  { emojis: ['🦁', '👑', '🌅', '🐗', '🎵'], answer: 'THE LION KING' },
  { emojis: ['🚢', '🧊', '💔', '🎻', '🌊'], answer: 'TITANIC' },
  { emojis: ['🧙', '💍', '🌋', '🦶', '🧝'], answer: 'LORD OF THE RINGS' },
  { emojis: ['🦖', '🏝️', '🧬', '🚙', '😱'], answer: 'JURASSIC PARK' },
];

// Per puzzle: 5 emoji reveals, answer typing, stamp, pause.
const STEPS = 5 + 4 + 3;

/** Emojidle: clues drop in, the answer gets typed, then a "clocked" stamp. */
export default function ClockThatDailyPreview() {
  const { ref, step, calm } = useLoop<HTMLDivElement>(420);
  const p = calm ? 0 : Math.floor(step / STEPS) % PUZZLES.length;
  const s = calm ? STEPS - 1 : step % STEPS;
  const puzzle = PUZZLES[p];
  const shown = Math.min(5, s + 1);
  const typed = s < 5 ? 0 : Math.min(1, (s - 4) / 4);
  const answer = puzzle.answer.slice(0, Math.round(puzzle.answer.length * typed));
  const solved = s >= 9;

  return (
    <div
      ref={ref}
      className="relative flex h-full w-full flex-col items-center justify-center gap-2 bg-[#f3ecdc] p-3 text-[#2a2118]"
      aria-hidden="true"
    >
      <div className="absolute top-2 left-2 font-mono text-[8px] tracking-widest text-[#8a7a62]">
        CTD-{String(41 + p).padStart(3, '0')} · EMOJIDLE
      </div>
      <div className="absolute top-2 right-2 rounded-sm border border-[#2a2118] px-1 font-mono text-[8px]">
        04:00
      </div>

      <p className="font-serif text-[13px] italic sm:text-[15px]">
        Name the film.
      </p>

      <div className="flex gap-1.5">
        {puzzle.emojis.map((e, i) => (
          <span
            key={`${p}-${i}`}
            className="flex size-7 items-center justify-center rounded border border-[#2a2118]/20 bg-white text-base transition-all duration-300 sm:size-8 sm:text-lg"
            style={{
              opacity: i < shown ? 1 : 0.15,
              transform: i < shown ? 'none' : 'translateY(4px)',
            }}
          >
            {i < shown ? e : ''}
          </span>
        ))}
      </div>

      <div className="flex h-6 min-w-[60%] items-center justify-center rounded border border-[#2a2118] bg-white px-2 font-mono text-[10px] font-bold tracking-wider">
        {answer}
        {!solved && <span className="animate-caret">_</span>}
      </div>

      {solved && (
        <span className="absolute right-[10%] bottom-[12%] -rotate-12 rounded border-2 border-[#c2410c] px-1.5 font-mono text-[10px] font-bold text-[#c2410c]">
          CLOCKED ✓
        </span>
      )}
    </div>
  );
}
