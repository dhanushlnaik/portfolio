import { about, now, stats } from '@/config/About';
import React from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';

export default function About() {
  return (
    <Container className="mt-20">
      <SectionHeading index="03" heading="About" />

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_15rem]">
        <div className="text-secondary space-y-4 leading-7">
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <aside className="h-fit rounded-xl border border-dashed p-4">
          <p className="flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span className="text-brand">/now</span>
            <span>{now.updated}</span>
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {now.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <dl className="mt-8 grid grid-cols-2 overflow-hidden rounded-xl border sm:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`p-4 ${i % 2 === 1 ? 'border-l' : ''} ${i > 1 ? 'border-t sm:border-t-0' : ''} ${i === 2 ? 'sm:border-l' : ''}`}
          >
            <dt className="sr-only">{s.label}</dt>
            <dd className="text-2xl font-bold tracking-tight">{s.value}</dd>
            <dd className="font-mono text-[11px] text-muted-foreground">
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}
