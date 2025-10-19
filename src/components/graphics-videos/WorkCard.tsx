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
import Link from 'next/link';

interface WorkCardProps {
  work: GraphicsVideoWork;
}

export function WorkCard({ work }: WorkCardProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <Card className="group h-full w-full overflow-hidden transition-all p-0 border-gray-100 dark:border-gray-800 shadow-none hover:shadow-md dark:hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="group relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={work.image}
            alt={work.title}
            width={1920}
            height={1080}
          />
          
          {/* Featured Badge */}
          {work.featured && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 backdrop-blur-sm">
                ⭐ Featured
              </span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${
              work.category === 'graphics'
                ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
                : 'bg-purple-500/20 text-purple-700 dark:text-purple-400'
            }`}>
              {work.category === 'graphics' ? '🎨 Graphics' : '🎬 Video'}
            </span>
          </div>

          {/* Hover Overlay with Play Button (for videos or full preview) */}
          <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:backdrop-blur-xs">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors duration-200 group-hover:cursor-pointer hover:bg-white/30"
                  aria-label={`Preview ${work.title}`}
                >
                  <PlayCircle />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full p-0 border-0">
                <div className="aspect-video w-full">
                  <Image
                    className="h-full w-full object-cover rounded-lg"
                    src={work.image}
                    alt={work.title}
                    width={1920}
                    height={1080}
                  />
                </div>
                <DialogTitle className="sr-only">{work.title}</DialogTitle>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-4">
        <div className="space-y-3">
          {/* Title */}
          <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
            {work.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-secondary line-clamp-2">{work.description}</p>

          {/* Tags */}
          {work.tags && work.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {work.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary hover:bg-secondary/20 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Tools */}
          {work.tools && work.tools.length > 0 && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-medium text-secondary mb-1.5">Tools</p>
              <div className="flex flex-wrap gap-1.5">
                {work.tools.map((tool, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors cursor-help">
                        {tool}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Used {tool}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}

          {/* Date */}
          {work.createdAt && (
            <p className="text-xs text-muted-foreground pt-1">
              {new Date(work.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
