import { BIT_PALETTE, bitGrid } from '@/lib/bit';
import { ImageResponse } from 'next/og';

// Link-preview image (Open Graph / Twitter card) for any page:
//   /og?title=Projects&subtitle=Games, Ethereum tools and client sites
// With no params it renders the default card for the home page.

const SIZE = { width: 1200, height: 630 };
const BRAND = '#f2733a';
const PINK = '#fde4ee';

const clamp = (value: string | null, max: number) => {
  if (!value) return null;
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max - 1).trimEnd()}…` : v;
};

function Bit({ scale }: { scale: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {bitGrid().map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.split('').map((c, x) => (
            <div
              key={x}
              style={{
                width: scale,
                height: scale,
                backgroundColor: c === '.' ? 'transparent' : BIT_PALETTE[c],
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = clamp(searchParams.get('title'), 60) ?? 'Dhanush Naik';
  const subtitle =
    clamp(searchParams.get('subtitle'), 120) ??
    'Fullstack & Web3 developer and designer. Running Tatsuik from Bhatkal, India.';
  const kicker = clamp(searchParams.get('kicker'), 40) ?? 'dhanush.tatsuik.com';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#0b0b0c',
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          color: '#fafafa',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            maxWidth: 720,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: BRAND,
              }}
            />
            <div style={{ fontSize: 28, color: BRAND, letterSpacing: 1 }}>
              {kicker}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                fontSize: title.length > 30 ? 64 : 80,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -2,
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: 32, lineHeight: 1.35, color: '#a1a1aa' }}>
              {subtitle}
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: 26, color: '#71717a' }}>
            Dhanush Naik · Fullstack & Web3 · Design
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 300,
            height: 340,
            borderRadius: 36,
            backgroundColor: PINK,
          }}
        >
          <Bit scale={13} />
        </div>
      </div>
    ),
    {
      ...SIZE,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    },
  );
}
