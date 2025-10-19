import { type GraphicsVideoWork } from '@/types/graphicsVideo';
import React from 'react';
import { GraphicsCard } from './GraphicsCard';

interface GraphicsGridProps {
  works: GraphicsVideoWork[];
  className?: string;
}

export function GraphicsGrid({ works, className }: GraphicsGridProps) {
  if (works.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No graphics works found.</p>
      </div>
    );
  }

  return (
    <div
      className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 ${className}`}
    >
      {works.map((work: GraphicsVideoWork) => (
        <div key={work.id} className="break-inside-avoid mb-4">
          <GraphicsCard work={work} />
        </div>
      ))}
    </div>
  );
}
