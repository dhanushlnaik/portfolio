'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import { Dialog, DialogContent, DialogTitle } from './ui/dialog';

export interface CertificateItem {
  file: string;
  title?: string;
  issuer?: string;
  date?: string;
  hasImage: boolean;
}

function formatDate(date?: string) {
  if (!date) return null;
  const d = new Date(date);
  return Number.isNaN(d.getTime())
    ? date
    : d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

export default function CertificatesGallery({
  certificates,
}: {
  certificates: CertificateItem[];
}) {
  const [active, setActive] = useState<CertificateItem | null>(null);
  const withImage = certificates.filter((c) => c.hasImage);
  const textOnly = certificates.filter((c) => !c.hasImage);

  if (certificates.length === 0) {
    return <p className="text-secondary text-sm">Nothing here yet.</p>;
  }

  return (
    <div className="space-y-10">
      {withImage.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {withImage.map((cert) => (
            <button
              key={cert.file}
              type="button"
              onClick={() => setActive(cert)}
              className="group rounded-xl border p-3 text-left transition-colors hover:border-brand/40"
            >
              <div className="relative h-52 w-full overflow-hidden rounded-lg bg-muted/40">
                <Image
                  src={cert.file}
                  alt={cert.title || 'Certificate'}
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="object-contain"
                />
              </div>
              <p className="mt-3 font-medium">{cert.title}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {[cert.issuer, formatDate(cert.date)].filter(Boolean).join(' · ')}
              </p>
            </button>
          ))}
        </div>
      )}

      {textOnly.length > 0 && (
        <ul className="divide-y divide-dashed rounded-xl border px-4">
          {textOnly.map((cert) => (
            <li
              key={cert.file}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className="font-medium">{cert.title}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {[cert.issuer, formatDate(cert.date)].filter(Boolean).join(' · ')}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="!max-h-[90vh] !max-w-[90vw] rounded-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            {active?.title ?? 'Certificate'}
          </DialogTitle>
          {active && (
            <div className="relative h-[80vh] w-full">
              <Image
                src={active.file}
                alt={active.title || 'Certificate'}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
