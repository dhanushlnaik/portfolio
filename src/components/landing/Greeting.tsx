'use client';

import { heroConfig } from '@/config/Hero';
import React, { useEffect, useState } from 'react';

function greetingFor(hour: number) {
  if (hour < 5) return 'Up late?';
  if (hour < 12) return 'Good morning!';
  if (hour < 17) return 'Good afternoon!';
  if (hour < 22) return 'Good evening!';
  return 'Up late?';
}

/** Greets the visitor in their own time of day, then says what time it is in Bhatkal. */
export default function Greeting() {
  const [text, setText] = useState<{ hello: string; here: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    const here = new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: heroConfig.timezone,
    })
      .format(now)
      .toLowerCase();
    setText({ hello: greetingFor(now.getHours()), here });
  }, []);

  return (
    <p className="min-h-7 text-lg font-semibold tracking-tight text-foreground">
      {text ? (
        <>
          {text.hello}{' '}
          <span className="font-normal text-muted-foreground">
            It&apos;s {text.here} here in Bhatkal.
          </span>
        </>
      ) : (
        <span className="text-muted-foreground">Hello!</span>
      )}
    </p>
  );
}
