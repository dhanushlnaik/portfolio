'use client';

import { ctaConfig } from '@/config/CTA';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import Cal, { getCalApi } from '@calcom/embed-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import Container from '../common/Container';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface CallToActionProps {
  profileImage?: string;
  profileAlt?: string;
  linkText?: string;
  calLink?: string;
  preText?: string;
}

export default function CTA({
  profileImage = ctaConfig.profileImage,
  profileAlt = ctaConfig.profileAlt,
  linkText = ctaConfig.linkText,
  calLink = ctaConfig.calLink,
  preText = ctaConfig.preText,
}: CallToActionProps) {
  const { triggerHaptic, isMobile } = useHapticFeedback();
  const [showCalPopup, setShowCalPopup] = useState(false);

  useEffect(() => {
    const cal = async () => {
      try {
        const calApi = await getCalApi();
        if (calApi) {
          calApi('on', {
            action: 'bookingSuccessful',
            callback: () => {
              setShowCalPopup(false);
            },
          });
        }
      } catch (error) {
        console.error('Failed to initialize Cal API:', error);
      }
    };
    cal();
  }, []);

  const handleButtonClick = () => {
    if (isMobile()) {
      triggerHaptic('medium');
    }
    setShowCalPopup(true);
  };

  return (
    <>
      <Container className="mt-20">
        <div className="relative overflow-hidden rounded-2xl border bg-brand-soft/50 p-6 sm:p-10">
          <div className="bg-dots-solid absolute inset-0 -z-10 opacity-60" />
          <p className="font-mono text-xs text-brand">08 / say hi</p>
          <h2 className="mt-2 max-w-md text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            {preText}
          </h2>
          <p className="text-secondary mt-3 max-w-md text-sm leading-6">
            {ctaConfig.subText}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleButtonClick}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              <Image
                alt={profileAlt}
                width={20}
                height={20}
                className="size-5 rounded-full bg-brand-soft"
                src={profileImage}
              />
              {linkText}
            </button>
            <a
              href={`mailto:${ctaConfig.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2.5 font-mono text-sm transition-colors hover:border-brand/50"
            >
              {ctaConfig.email}
            </a>
          </div>
        </div>
      </Container>

      {/* Cal.com Dialog */}
      <Dialog open={showCalPopup} onOpenChange={setShowCalPopup}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] md:max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Book a Meeting</DialogTitle>
            <DialogDescription>
              Schedule a time to connect and discuss opportunities
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(90vh-220px)] rounded-lg">
            <Cal
              calLink={calLink}
              config={{
                name: 'Portfolio Visitor',
                email: '',
                notes: 'Booked from portfolio website',
              }}
              className="w-full h-[500px] rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
