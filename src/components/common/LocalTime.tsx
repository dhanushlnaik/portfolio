'use client';

import { heroConfig } from '@/config/Hero';
import { useEffect, useState } from 'react';

function format(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: heroConfig.timezone,
  }).format(date);
}

/** Live clock in my timezone, so visitors know if I'm likely awake. */
export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(format(new Date()));
    update();
    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-right font-mono text-xs leading-5 text-muted-foreground">
      <p>{heroConfig.location}</p>
      <p>
        <span className="text-foreground tabular-nums">{time ?? '--:--'}</span>{' '}
        IST
      </p>
    </div>
  );
}
