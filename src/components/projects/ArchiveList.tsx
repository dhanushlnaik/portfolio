import { type Project } from '@/types/project';
import { ArrowUpRight, FolderClosed } from 'lucide-react';
import { Link } from 'next-view-transitions';
import React from 'react';

/** Older projects as a compact list, grouped by year, newest year first. */
export function ArchiveList({ projects }: { projects: Project[] }) {
  const groups = new Map<string, Project[]>();
  for (const p of projects) {
    const year = p.year.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), p]);
  }
  const years = [...groups.keys()].sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-8">
      {years.map((year) => (
        <div key={year}>
          <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <FolderClosed className="size-4 text-brand" />
            {year}
          </p>
          <ul className="mt-2 divide-y divide-dashed rounded-xl border">
            {groups.get(year)!.map((p) => {
              const href = p.details ? p.projectDetailsPageSlug : (p.github ?? p.live);
              const external = !p.details;
              return (
                <li key={p.title}>
                  <Link
                    href={href ?? '#'}
                    target={external ? '_blank' : undefined}
                    data-cursor={p.details ? 'read case study' : undefined}
                    className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                  >
                    <span className="shrink-0 font-medium group-hover:text-brand">
                      {p.title}
                    </span>
                    <span className="text-secondary hidden min-w-0 flex-1 truncate text-sm sm:block">
                      {p.description}
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground">
                      {p.category}
                    </span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
