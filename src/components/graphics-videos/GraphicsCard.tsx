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
        <div className="group relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
            src={work.image}
            alt={work.title}
            width={1200}
            height={1200}
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex size-14 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-all duration-200 hover:bg-white/50 hover:scale-110"
                  aria-label={`Preview ${work.title}`}
                >
                  <PlayCircle />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] max-h-[90vh] w-auto p-0 border-0">
                <div className="relative w-auto h-auto">
                  <Image
                    className="w-auto h-auto max-w-full max-h-[90vh] rounded-lg"
                    src={work.image}
                    alt={work.title}
                    width={2000}
                    height={2000}
                  />
                </div>
                <DialogTitle className="sr-only">{work.title}</DialogTitle>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
