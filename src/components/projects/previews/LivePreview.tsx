'use client';

import React from 'react';

import BlobLensPreview from './BlobLensPreview';
import ClockThatDailyPreview from './ClockThatDailyPreview';
import EthQuestPreview from './EthQuestPreview';
import SolTracPreview from './SolTracPreview';

export type PreviewKind = 'ethquest' | 'bloblens' | 'clockthatdaily' | 'soltrac';

const PREVIEWS: Record<PreviewKind, React.ComponentType> = {
  ethquest: EthQuestPreview,
  bloblens: BlobLensPreview,
  clockthatdaily: ClockThatDailyPreview,
  soltrac: SolTracPreview,
};

/** Small looping animation of a product doing its thing, used in place of a screenshot. */
export default function LivePreview({ kind }: { kind: PreviewKind }) {
  const Preview = PREVIEWS[kind];
  return <Preview />;
}
