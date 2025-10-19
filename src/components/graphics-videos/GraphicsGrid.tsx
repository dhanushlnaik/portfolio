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
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 auto-rows-[250px] sm:auto-rows-[280px] ${className}`}
    >
      {works.map((work: GraphicsVideoWork, index: number) => (
        <div
          key={work.id}
          className={`
            ${index % 5 === 0 ? 'col-span-2 row-span-2 sm:auto-rows-auto' : ''}
            ${index % 7 === 3 ? 'col-span-1 row-span-2 sm:auto-rows-auto' : ''}
          `}
        >
          <GraphicsCard work={work} />
        </div>
      ))}
    </div>
  );
}
