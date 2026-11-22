'use client';

import { socialLinks } from '@/config/Hero';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import React, { useState } from 'react';

/** Social links with handles; the email row has a one-click copy. */
export default function Socials() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard blocked: the link still works */
    }
  };

  return (
    <ul className="grid overflow-hidden rounded-xl border bg-background/70 sm:grid-cols-2">
      {socialLinks.map((s, i) => {
        const external = s.href.startsWith('http');
        return (
          <li
            key={s.name}
            className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t' : ''} ${i === 1 ? 'sm:border-t-0' : ''} ${i % 2 === 1 ? 'sm:border-l' : ''}`}
          >
            <span className="size-5 shrink-0 text-muted-foreground">{s.icon}</span>
            <a
              href={s.href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              data-cursor={s.copy ? 'say hi' : undefined}
              className="group min-w-0 flex-1"
            >
              <span className="block text-sm font-medium group-hover:text-brand">
                {s.name}
              </span>
              <span className="block truncate font-mono text-[11px] text-muted-foreground">
                {s.handle}
              </span>
            </a>
            {s.copy ? (
              <button
                type="button"
                onClick={() => copy(s.copy!)}
                data-cursor={copied === s.copy ? 'copied!' : 'copy'}
                aria-label={`Copy ${s.name.toLowerCase()}`}
                className="flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
              >
                {copied === s.copy ? (
                  <>
                    <Check className="size-3 text-emerald-500" /> copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3" /> copy
                  </>
                )}
              </button>
            ) : (
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
