'use client';

import React, { useEffect, useRef, useState } from 'react';

/*
 * A Figma-style multiplayer tag pinned to your cursor: "you", in brand orange.
 * Any element can change the label with `data-cursor="..."` (for example the
 * harbour says "pick a ship"); external links default to "open ↗".
 * Desktop only (fine pointers); hidden until the mouse moves.
 */

const DEFAULT = 'you';

function labelFor(target: EventTarget | null): string {
  if (!(target instanceof Element)) return DEFAULT;
  const tagged = target.closest<HTMLElement>('[data-cursor]');
  const link = target.closest('a');
  // The nearest one wins: an external link inside a tagged card says "open ↗".
  const linkIsCloser = link && (!tagged || tagged.contains(link));
  if (linkIsCloser && link.getAttribute('target') === '_blank') return 'open ↗';
  if (tagged?.dataset.cursor) return tagged.dataset.cursor;
  return DEFAULT;
}

export default function YouAreHere() {
  const el = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState(DEFAULT);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia('(pointer: fine)').matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let x = 0;
    let y = 0;

    const place = () => {
      raf = 0;
      if (el.current) el.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(place);
      setVisible(true);
      setLabel(labelFor(e.target));
    };
    const hide = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.documentElement.addEventListener('mouseleave', hide);
    window.addEventListener('blur', hide);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('mouseleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={el}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[70]"
      style={{ transform: 'translate3d(-100px, -100px, 0)' }}
    >
      <div
        className="motion-safe:transition-[opacity,transform] motion-safe:duration-150"
        style={{
          opacity: visible ? 1 : 0,
          transform: `translate(14px, 18px) scale(${pressed ? 0.9 : 1})`,
          transformOrigin: 'top left',
        }}
      >
        <span className="block rounded-[2px_9px_9px_9px] bg-brand px-2 py-1 font-mono text-[11px] leading-none font-semibold whitespace-nowrap text-brand-foreground shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
          {label}
        </span>
      </div>
    </div>
  );
}
