'use client';

import { navbarConfig } from '@/config/Navbar';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { ThemeToggleButton } from './ThemeSwitch';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div className="sticky top-0 z-40 mx-auto w-full max-w-3xl px-4 py-3">
      <nav className="flex items-center justify-between rounded-xl border bg-background/80 px-3 py-2 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <Image
            className="size-9 rounded-lg bg-brand-soft transition-transform duration-300 hover:-rotate-6"
            src={navbarConfig.logo.src}
            alt={navbarConfig.logo.alt}
            width={72}
            height={72}
            priority
          />
          <span className="font-mono text-sm font-semibold tracking-tight">
            dhanush<span className="text-brand">.</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navbarConfig.navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted',
                isActive(item.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggleButton variant="circle" start="top-right" blur />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-md hover:bg-muted md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="mt-2 rounded-xl border bg-background/95 p-2 backdrop-blur-md md:hidden">
          {navbarConfig.navItems.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-3 text-base hover:bg-muted',
                isActive(item.href) && 'bg-muted',
              )}
            >
              <span>{item.label}</span>
              <span className="font-mono text-xs text-muted-foreground">
                0{i + 1}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
