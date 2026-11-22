'use client';

import { cn } from '@/lib/utils';
import { useLenis } from 'lenis/react';
import React, { useEffect, useState } from 'react';

interface Mark {
  id: string;
  index: string;
  label: string;
}

/*
 * A "you are here" ruler on the left edge (desktop only). It finds every
 * element with `data-section` on the page, draws one tick each, grows the tick
 * for the section you're reading and scrolls to a section on click.
 */
export default function SectionRuler() {
  const lenis = useLenis();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [active, setActive] = useState<string>('top');

  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-section]')];
    setMarks([
      { id: 'top', index: '00', label: 'top' },
      ...els.map((el) => ({
        id: el.id,
        index: el.dataset.section ?? '',
        label: el.dataset.sectionLabel ?? el.id,
      })),
    ]);

    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let current = 'top';
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom && els.length) current = els[els.length - 1].id;
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const go = (id: string) => {
    const target = id === 'top' ? 0 : document.getElementById(id);
    if (target === null) return;
    if (lenis) lenis.scrollTo(target, { offset: id === 'top' ? 0 : -96 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  if (marks.length < 3) return null;

  return (
    <nav
      aria-label="Sections"
      className="fixed top-1/2 left-0 z-30 hidden -translate-y-1/2 flex-col gap-1 lg:flex"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 border-l border-dashed border-border"
      />
      {marks.map((m) => {
        const on = m.id === active;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => go(m.id)}
            aria-label={`${m.index} ${m.label}`}
            aria-current={on ? 'location' : undefined}
            data-cursor={m.label}
            className="group flex h-4 w-24 cursor-pointer items-center gap-2"
          >
            <span
              className={cn(
                'h-px transition-all duration-300',
                on
                  ? 'w-8 bg-brand'
                  : 'w-3 bg-muted-foreground/50 group-hover:w-5 group-hover:bg-foreground',
              )}
            />
            <span
              className={cn(
                'font-mono text-[10px] whitespace-nowrap transition-opacity',
                on
                  ? 'text-brand opacity-100'
                  : 'text-muted-foreground opacity-0 group-hover:opacity-100',
              )}
            >
              {m.index} {m.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
