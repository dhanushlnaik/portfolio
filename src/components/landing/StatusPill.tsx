'use client';

import { heroConfig } from '@/config/Hero';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'next-view-transitions';
import React, { useEffect, useState } from 'react';

function pick(now: number) {
  const { status } = heroConfig;
  const expired = status.until && now > new Date(status.until).getTime();
  return expired && status.next ? status.next : status;
}

/** The "currently" pill in the hero. Swaps to the next status once `until` passes. */
export default function StatusPill() {
  // First render uses the build time; the effect corrects it in the browser
  // in case the page was built before the status expired.
  const [current, setCurrent] = useState(() => pick(Date.now()));
  useEffect(() => setCurrent(pick(Date.now())), []);

  return (
    <Link
      href={current.href}
      className="group mt-8 inline-flex max-w-full items-center gap-2 rounded-2xl border sm:rounded-full bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
    >
      <span className="relative flex size-2 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-brand" />
      </span>
      <span className="sm:truncate">{current.text}</span>
      <ArrowUpRight className="size-3 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
