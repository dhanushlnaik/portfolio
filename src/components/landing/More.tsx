import { ArrowRight } from 'lucide-react';
import { Link } from 'next-view-transitions';
import React from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';

const links = [
  { name: 'Design & video', note: 'Posters, brand work and edits', href: '/graphics-videos' },
  { name: 'Journey', note: 'How I got here, year by year', href: '/journey' },
  { name: 'Certificates', note: 'Courses, events and wins', href: '/journey/certificates' },
  { name: 'Uses', note: 'Hardware and apps I use every day', href: '/gears' },
];

export default function More() {
  return (
    <Container className="mt-20">
      <SectionHeading index="07" heading="Elsewhere" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors hover:border-brand/40 hover:bg-muted/40"
          >
            <span>
              <span className="block font-medium">{l.name}</span>
              <span className="text-secondary block text-sm">{l.note}</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
          </Link>
        ))}
      </div>
    </Container>
  );
}
