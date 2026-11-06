/*
 * Bit's pixel data, shared by the on-page mascot (PixelBuddy) and the
 * generated link-preview images (app/og). Plain module so both server and
 * client code can import it.
 */

export const BIT_PALETTE: Record<string, string> = {
  K: '#18181b', // hair / outline
  H: '#3f3f46', // hair highlight
  S: '#f5d0b5', // skin
  B: '#f19c9c', // blush
  G: '#27272a', // glasses frame
  P: '#f6b5cf', // hoodie
  D: '#d987ad', // hoodie shade / strings
  W: '#fafafa', // collar
  Z: '#52525b', // shoes
};

export const BIT_HEAD = [
  '.....KKKKKK.....',
  '...KKHKKKKHKK...',
  '..KKKKKKHKKKKK..',
  '.KKHKKKKKKKKHKK.',
  '.KKKKKKKKKKKKKK.',
  '.KKKSKKSKKSKKKK.',
  '.KKSSSSSSSSSSKK.',
  '.KGGGGSSSSGGGGK.',
  '.SGSSGGGGGGSSGS.',
];

export const BIT_EYES_OPEN = '.SGKSGSSSSGKSGS.';
export const BIT_EYES_SHUT = '.SGSSGSSSSGSSGS.';
export const BIT_EYES_BLINK = '.SGGGGSSSSGGGGS.';

export const BIT_FACE = [
  '.SGGGGSSSSGGGGS.',
  '..SBSSSSSSSSBS..',
  '...SSSSKKSSSS...',
  '....SSSSSSSS....',
  '...PPPPWWPPPP...',
  '..PPPPDPPDPPPP..',
  '..PPPPDPPDPPPP..',
  '..SPPPPPPPPPPS..',
  '...PPPPPPPPPP...',
];

export const BIT_FEET = {
  stand: '...ZZZ....ZZZ...',
  stepA: '..ZZZ......ZZZ..',
  stepB: '....ZZZ..ZZZ....',
};

export type BitPose = 'stand' | 'stepA' | 'stepB' | 'sleep' | 'blink';

export function bitGrid(pose: BitPose = 'stand'): string[] {
  const eyes =
    pose === 'sleep' ? BIT_EYES_SHUT : pose === 'blink' ? BIT_EYES_BLINK : BIT_EYES_OPEN;
  const feet =
    pose === 'stepA' ? BIT_FEET.stepA : pose === 'stepB' ? BIT_FEET.stepB : BIT_FEET.stand;
  return [...BIT_HEAD, eyes, ...BIT_FACE, feet];
}

