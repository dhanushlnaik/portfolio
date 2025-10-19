'use client';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type GraphicsVideoWork } from '@/types/graphicsVideo';
import Image from 'next/image';
import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import PlayCircle from '../svgs/PlayCircle';

interface GraphicsCardProps {
  work: GraphicsVideoWork;
}

export function GraphicsCard({ work }: GraphicsCardProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <Card className="group h-full w-full overflow-hidden transition-all p-0 border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg dark:hover:shadow-xl cursor-pointer">
      <CardHeader className="p-0 relative h-full">
        <div className="group relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            src={work.image}
            alt={work.title}
            width={500}
            height={500}
            priority={work.featured}
          />
          
          {/* Featured Badge */}
          {work.featured && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-flex items-center rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                ⭐
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="mb-3 flex size-14 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-all duration-200 hover:bg-white/50 hover:scale-110"
                  aria-label={`Preview ${work.title}`}
                >
                  <PlayCircle />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-full p-0 border-0">
                <div className="aspect-square w-full">
                  <Image
                    className="h-full w-full object-cover rounded-lg"
                    src={work.image}
                    alt={work.title}
                    width={1000}
                    height={1000}
                  />
                </div>
                <DialogTitle className="sr-only">{work.title}</DialogTitle>
              </DialogContent>
            </Dialog>

            {/* Info Section */}
            <div className="w-full text-white text-center space-y-2">
              <h3 className="text-sm font-bold line-clamp-2">{work.title}</h3>
              <p className="text-xs opacity-90 line-clamp-1">{work.description}</p>
              {work.tools && work.tools.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center pt-1">
                  {work.tools.slice(0, 2).map((tool, index) => (
                    <span
                      key={index}
                      className="text-xs bg-white/20 px-2 py-0.5 rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
