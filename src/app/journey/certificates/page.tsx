import CertificatesGallery, {
  type CertificateItem,
} from '@/components/CertificatesGallery';
import Container from '@/components/common/Container';
import { certificates as configuredCertificates } from '@/config/Achievements';
import { generateMetadata as getMetadata } from '@/config/Meta';
import fs from 'fs';
import { Metadata } from 'next';
import path from 'path';
import React from 'react';

export const metadata: Metadata = getMetadata('/journey/certificates') as Metadata;

const publicDir = path.join(process.cwd(), 'public');
const certDir = path.join(publicDir, 'certificates');

function loadCertificates(): CertificateItem[] {
  // Entries from src/config/Achievements.tsx. An entry whose image file is
  // missing is still listed, just without the image.
  const items = new Map<string, CertificateItem>();
  for (const c of configuredCertificates) {
    items.set(c.file, {
      ...c,
      hasImage: fs.existsSync(path.join(publicDir, c.file)),
    });
  }

  // Any image dropped into public/certificates shows up automatically.
  if (fs.existsSync(certDir)) {
    for (const f of fs.readdirSync(certDir)) {
      if (!/\.(png|jpe?g|webp|avif)$/i.test(f)) continue;
      const file = `/certificates/${f}`;
      if (!items.has(file)) {
        items.set(file, {
          file,
          title: f.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
          hasImage: true,
        });
      }
    }
  }
  return [...items.values()];
}

export default function CertificatesPage() {
  const certificates = loadCertificates();

  return (
    <Container className="py-12">
      <header>
        <p className="font-mono text-xs text-brand">~/journey/certificates</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Certificates
        </h1>
        <p className="text-secondary mt-3 max-w-xl leading-7">
          Certificates from courses, events and hackathons.
        </p>
      </header>

      <div className="mt-10">
        <CertificatesGallery certificates={certificates} />
      </div>
    </Container>
  );
}
