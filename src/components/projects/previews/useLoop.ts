'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A step counter that only ticks while the element is on screen and the tab
 * is visible. With reduced motion it never ticks and reports `calm: true`,
 * so previews can render a single representative frame instead.
 */
export function useLoop<T extends HTMLElement>(intervalMs: number) {
  const ref = useRef<T>(null);
  const [step, setStep] = useState(0);
  const [calm, setCalm] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCalm(reduce);
    if (reduce || !ref.current) return;

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(ref.current);
    const id = setInterval(() => {
      if (visible && !document.hidden) setStep((s) => s + 1);
    }, intervalMs);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [intervalMs]);

  return { ref, step, calm };
}
