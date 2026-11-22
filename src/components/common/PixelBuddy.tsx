import { BIT_PALETTE, type BitPose, bitGrid } from '@/lib/bit';
import React from 'react';

/*
 * "Bit": a pixel-art mini Dhanush (curly hair, round glasses, pink hoodie),
 * drawn from the grid in src/lib/bit.ts as crisp SVG rects. Used next to the
 * hero avatar and in the footer; the live version lives on the harbour dock.
 */

type Pose = BitPose;
const PALETTE = BIT_PALETTE;
const grid = bitGrid;

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
