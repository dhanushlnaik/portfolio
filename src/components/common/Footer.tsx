import { footerConfig } from '@/config/Footer';
import { Link } from 'next-view-transitions';
import React from 'react';

import Container from './Container';
import { PixelBuddySprite } from './PixelBuddy';

export default function Footer() {
  return (
    <Container className="mt-24 pb-28 sm:pb-16">
      <footer className="border-t border-dashed pt-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 sm:col-span-1">
            <PixelBuddySprite pose="sleep" scale={3} />
            <p className="mt-3 font-semibold">{footerConfig.name}</p>
            <p className="text-secondary mt-1 text-sm">{footerConfig.tagline}</p>
          </div>
          {footerConfig.columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs text-muted-foreground">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      target={l.href.startsWith('http') ? '_blank' : undefined}
                      className="text-secondary hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} {footerConfig.name}
        </p>
      </footer>
    </Container>
  );
}
