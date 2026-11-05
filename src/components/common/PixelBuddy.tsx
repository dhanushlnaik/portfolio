'use client';

import { buddyConfig } from '@/config/Buddy';
import React, { useEffect, useRef, useState } from 'react';

/*
 * "Bit": a pixel-art mini Dhanush (curly hair, round glasses, pink hoodie).
 * Hand-drawn on a 16×20 grid and rendered as crisp SVG rects, so there are no
 * image assets to load. On fine-pointer devices Bit trots after the cursor and
 * dozes off when you stop moving; on touch devices it stays put.
 */

const PALETTE: Record<string, string> = {
  K: '#18181b', // hair / outline
  H: '#3f3f46', // hair highlight
  S: '#f5d0b5', // skin
  B: '#f19c9c', // blush
  G: '#27272a', // glasses frame
  P: '#f6b5cf', // hoodie
  D: '#d987ad', // hoodie shade / strings
  W: '#fafafa', // collar
  Z: '#52525b', // shoes
};

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
];

const EYES_OPEN = '.SGKSGSSSSGKSGS.';
const EYES_SHUT = '.SGSSGSSSSGSSGS.';
const EYES_BLINK = '.SGGGGSSSSGGGGS.';

const FACE = [
  '.SGGGGSSSSGGGGS.',
  '..SBSSSSSSSSBS..',
  '...SSSSKKSSSS...',
  '....SSSSSSSS....',
  '...PPPPWWPPPP...',
  '..PPPPDPPDPPPP..',
  '..PPPPDPPDPPPP..',
  '..SPPPPPPPPPPS..',
  '...PPPPPPPPPP...',
];

const FEET = {
  stand: '...ZZZ....ZZZ...',
  stepA: '..ZZZ......ZZZ..',
  stepB: '....ZZZ..ZZZ....',
};

type Pose = 'stand' | 'stepA' | 'stepB' | 'sleep' | 'blink';

function grid(pose: Pose): string[] {
  const eyes =
    pose === 'sleep' ? EYES_SHUT : pose === 'blink' ? EYES_BLINK : EYES_OPEN;
  const feet =
    pose === 'stepA' ? FEET.stepA : pose === 'stepB' ? FEET.stepB : FEET.stand;
  return [...HEAD, eyes, ...FACE, feet];
}

export function PixelBuddySprite({
  pose = 'stand',
  scale = 3,
  flip = false,
  className,
}: {
  pose?: Pose;
  scale?: number;
  flip?: boolean;
  className?: string;
}) {
  const rows = grid(pose);
  return (
    <svg
      width={16 * scale}
      height={rows.length * scale}
      viewBox={`0 0 16 ${rows.length}`}
      shapeRendering="crispEdges"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      {rows.flatMap((row, y) =>
        row.split('').map((c, x) =>
          c === '.' ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={PALETTE[c]}
            />
          ),
        ),
      )}
    </svg>
  );
}

const SPEED = 3.2; // px per frame
const STOP_DISTANCE = 36;
const SLEEP_AFTER_MS = 6000;
const SCALE = 3;

export default function PixelBuddy() {
  const [enabled, setEnabled] = useState(false);
  const [pose, setPose] = useState<Pose>('stand');
  const [flip, setFlip] = useState(false);
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buddyConfig.enabled) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(fine && !calm);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const pos = { x: window.innerWidth - 80, y: window.innerHeight - 140 };
    const target = { ...pos };
    let lastMove = performance.now();
    let frame = 0;
    let raf = 0;
    let current: Pose = 'stand';

    const set = (p: Pose) => {
      if (p !== current) {
        current = p;
        setPose(p);
      }
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      lastMove = performance.now();
    };

    const tick = (now: number) => {
      frame++;
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.hypot(dx, dy);

      if (dist > STOP_DISTANCE) {
        pos.x += (dx / dist) * SPEED;
        pos.y += (dy / dist) * SPEED;
        if (Math.abs(dx) > 2) setFlip(dx < 0);
        set(Math.floor(frame / 8) % 2 === 0 ? 'stepA' : 'stepB');
      } else if (now - lastMove > SLEEP_AFTER_MS) {
        set('sleep');
      } else {
        // occasional blink while idle
        set(frame % 180 < 6 ? 'blink' : 'stand');
      }

      if (el.current) {
        const bob = current === 'stepA' ? -2 : 0;
        el.current.style.transform = `translate3d(${pos.x - 8 * SCALE}px, ${
          pos.y - 30 * SCALE + bob
        }px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={el}
      className="pointer-events-none fixed top-0 left-0 z-[60] will-change-transform"
      aria-hidden="true"
    >
      {pose === 'sleep' && (
        <span className="animate-buddy-z absolute -top-3 right-0 font-mono text-xs font-bold text-brand">
          z
        </span>
      )}
      <PixelBuddySprite pose={pose} flip={flip} scale={SCALE} />
    </div>
  );
}
