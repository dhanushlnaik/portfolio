import { cn } from '@/lib/utils';
import { type Project } from '@/types/project';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import React from 'react';

import Github from '../svgs/Github';

const statusStyle: Record<Project['status'], { label: string; dot: string }> = {
  live: { label: 'Live', dot: 'bg-emerald-500' },
  building: { label: 'Building', dot: 'bg-amber-500' },
  archived: { label: 'Archived', dot: 'bg-neutral-400' },
};

function hostOf(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/** Fake browser chrome around the screenshot, or a typographic cover. */
function Preview({ project }: { project: Project }) {
  const host = hostOf(project.live) ?? 'localhost';
  return (
    <div className="overflow-hidden rounded-lg border bg-muted/40">
      <div className="flex items-center gap-1.5 border-b px-3 py-2">
        <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <span className="ml-2 truncate font-mono text-[10px] text-muted-foreground">
          {host}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 768px) 360px, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="bg-dots-solid flex h-full w-full flex-col justify-end bg-brand-soft/60 p-4">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">
              {project.category}
            </span>
            <span className="text-2xl font-bold tracking-tight">
              {project.title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const status = statusStyle[project.status];
  const primaryHref = project.details
    ? project.projectDetailsPageSlug
    : (project.live ?? project.github ?? '#');
  const external = !project.details;

  return (
    <article className="group flex h-full flex-col gap-4 rounded-xl border bg-card/40 p-3 transition-colors hover:border-brand/40">
      <Link
        href={primaryHref}
        target={external ? '_blank' : undefined}
        aria-label={project.title}
      >
        <Preview project={project} />
      </Link>

      <div className="flex flex-1 flex-col gap-3 px-1 pb-1">
        <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
          <span className="truncate">
            {project.year} · {project.category}
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <span className={cn('size-1.5 rounded-full', status.dot)} />
            {status.label}
          </span>
        </div>

        <div>
          <Link
            href={primaryHref}
            target={external ? '_blank' : undefined}
            className="inline-flex items-center gap-1 text-lg font-semibold tracking-tight hover:text-brand"
          >
            {project.title}
            <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          <p className="text-secondary mt-1 text-sm leading-6">
            {project.description}
          </p>
        </div>

        <ul className="mt-auto flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-md border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 border-t border-dashed pt-3 text-sm">
          {project.live && (
            <Link
              href={project.live}
              target="_blank"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              Visit <ArrowUpRight className="size-3.5" />
            </Link>
          )}
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <span className="size-3.5">
                <Github />
              </span>
              Code
            </Link>
          )}
          {project.details && (
            <Link
              href={project.projectDetailsPageSlug}
              className="ml-auto text-muted-foreground hover:text-brand"
            >
              Case study →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
