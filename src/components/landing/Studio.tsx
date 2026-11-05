import { studio } from '@/config/Studio';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'next-view-transitions';
import React from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';

export default function Studio() {
  return (
    <Container className="mt-20">
      <SectionHeading
        index="04"
        heading="Studio"
        href={studio.href}
        hrefLabel="tatsuik.com"
      />
      <p className="text-secondary mt-4 max-w-xl leading-7">
        I run <b className="font-semibold text-foreground">{studio.name}</b>, a
        one-person studio. {studio.pitch}
      </p>
      <div className="mt-6 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
        {studio.services.map((s) => (
          <div key={s.title} className="bg-background p-4">
            <p className="flex items-center gap-2 font-semibold">
              <span className="flex size-6 items-center justify-center rounded-md bg-brand-soft text-xs">
                {s.tag}
              </span>
              {s.title}
            </p>
            <p className="text-secondary mt-2 text-sm leading-6">{s.body}</p>
          </div>
        ))}
      </div>
      <Link
        href={studio.href}
        target="_blank"
        className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
      >
        See pricing & process <ArrowUpRight className="size-3.5" />
      </Link>
    </Container>
  );
}
