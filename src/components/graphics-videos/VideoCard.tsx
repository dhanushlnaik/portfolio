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

interface VideoCardProps {
  work: GraphicsVideoWork;
  isFeatured?: boolean;
}

export function VideoCard({ work, isFeatured = false }: VideoCardProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  if (isFeatured) {
    return (
      <Card className="group h-full w-full overflow-hidden transition-all p-0 border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl dark:hover:shadow-2xl col-span-full md:col-span-2">
        <CardHeader className="p-0">
          <div className="group relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={work.image}
              alt={work.title}
              width={1920}
              height={1080}
              priority
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="flex size-20 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-all duration-200 hover:bg-white/50 hover:scale-110"
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

        <CardContent className="px-6 py-5">
          <div className="space-y-3">
            {/* Featured Badge */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm text-secondary mt-1">{work.description}</p>
              </div>
              {work.featured && (
                <span className="inline-flex items-center rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                  ⭐ Featured
                </span>
              )}
            </div>

            {/* Tags and Tools */}
            <div className="flex flex-wrap gap-2">
              {work.tags && work.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Tools */}
            {work.tools && work.tools.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                {work.tools.map((tool, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors cursor-help">
                        {tool}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Used {tool}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Regular video card
  return (
    <Card className="group h-full w-full overflow-hidden transition-all p-0 border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg dark:hover:shadow-lg flex flex-col">
      <CardHeader className="p-0">
        <div className="group relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={work.image}
            alt={work.title}
            width={800}
            height={450}
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex size-16 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-all duration-200 hover:bg-white/50 hover:scale-110"
                  aria-label={`Preview ${work.title}`}
                >
                  <PlayCircle />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl w-full p-0 border-0">
                <div className="aspect-video w-full">
                  {work.link?.includes('youtube.com') ? (
                    <iframe
                      className="w-full h-full rounded-lg"
                      src={work.link.replace('watch?v=', 'embed/')}
                      title={work.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <Image
                      className="h-full w-full object-cover rounded-lg"
                      src={work.image}
                      alt={work.title}
                      width={1280}
                      height={720}
                    />
                  )}
                </div>
                <DialogTitle className="sr-only">{work.title}</DialogTitle>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-3 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <h3 className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {work.title}
          </h3>
          <p className="text-xs text-secondary line-clamp-2">{work.description}</p>
        </div>

        {/* Tags */}
        {work.tags && work.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 mt-auto border-t border-gray-100 dark:border-gray-800">
            {work.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary"
              >
                {tag}
              </span>
            ))}
            {work.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">+{work.tags.length - 2}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
