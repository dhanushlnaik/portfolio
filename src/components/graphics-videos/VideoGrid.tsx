import { type GraphicsVideoWork } from '@/types/graphicsVideo';
import React from 'react';
import { VideoCard } from './VideoCard';

interface VideoGridProps {
  works: GraphicsVideoWork[];
  className?: string;
}

export function VideoGrid({ works, className }: VideoGridProps) {
  if (works.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No videos found.</p>
      </div>
    );
  }

  // Separate featured from regular videos
  const featuredWorks = works.filter(w => w.featured);
  const regularWorks = works.filter(w => !w.featured);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Featured Videos Section */}
      {featuredWorks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Featured Videos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredWorks.map((work) => (
              <VideoCard key={work.id} work={work} isFeatured={true} />
            ))}
          </div>
        </div>
      )}

      {/* Regular Videos Grid */}
      {regularWorks.length > 0 && (
        <div className="space-y-3">
          {featuredWorks.length > 0 && (
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              All Videos
            </h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularWorks.map((work) => (
              <VideoCard key={work.id} work={work} isFeatured={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
