import { Link } from 'next-view-transitions';
import React from 'react';

interface SkillProps {
  name: string;
  href: string;
  children: React.ReactNode;
}

export default function Skill({ name, href, children }: SkillProps) {
  return (
    <Link
      href={href ?? ''}
      target="_blank"
      className="mx-0.5 inline-flex translate-y-[3px] items-center gap-1 rounded-full border bg-muted/60 px-2 py-0.5 text-sm font-medium text-foreground transition-colors hover:border-brand/60"
    >
      <span className="size-3.5 shrink-0">{children}</span>
      {name}
    </Link>
  );
}
