import { type GraphicsVideoWork } from '@/types/graphicsVideo';
import React from 'react';
import { WorkCard } from './WorkCard';

interface WorkListProps {
  works: GraphicsVideoWork[];
  className?: string;
}

export function WorkList({ works, className }: WorkListProps) {
  if (works.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No works found in this category.</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {works.map((work: GraphicsVideoWork) => (
        <WorkCard key={work.id} work={work} />
      ))}
    </div>
  );
}
