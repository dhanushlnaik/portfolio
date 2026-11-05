import { Link } from 'next-view-transitions';
import React from 'react';

interface SectionHeadingProps {
  /** Two-digit section number shown in the mono label, e.g. "02". */
  index: string;
  heading: string;
  /** Optional one-line note under the heading. */
  note?: string;
  /** Optional "see all" link rendered on the right. */
  href?: string;
  hrefLabel?: string;
}

export default function SectionHeading({
  index,
  heading,
  note,
  href,
  hrefLabel = 'See all',
}: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-dashed pb-3">
      <div>
        <p className="font-mono text-xs tracking-wide text-brand">
          {index} <span className="text-muted-foreground">/</span>{' '}
          <span className="text-muted-foreground lowercase">{heading}</span>
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">{heading}</h2>
        {note && <p className="text-secondary mt-1 text-sm">{note}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="text-secondary shrink-0 font-mono text-xs underline-offset-4 transition-colors hover:text-brand hover:underline"
        >
          {hrefLabel} →
        </Link>
      )}
    </div>
  );
}
