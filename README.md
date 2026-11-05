# dhanush.

Personal site of **Dhanush Naik**: fullstack & Web3 developer, designer, and founder of [Tatsuik](https://www.tatsuik.com/).

Built with Next.js 15, React 19, Tailwind CSS v4 and MDX.

## Develop

```bash
pnpm install
pnpm dev
```

## Where things live

| What | File |
| --- | --- |
| Hero, status pill, socials | `src/config/Hero.tsx` |
| Projects (cards, order, status) | `src/config/Projects.tsx` |
| Project case studies | `src/data/projects/<slug>.mdx` |
| Screenshots | `public/project/*.jpg` |
| About, `/now`, stats | `src/config/About.tsx` |
| Studio services | `src/config/Studio.ts` |
| Work history | `src/config/Experience.tsx` |
| Blog posts | `src/data/blog/*.mdx` |
| Footer links | `src/config/Footer.tsx` |
| Pixel mascot "Bit" | `src/components/common/PixelBuddy.tsx` (toggle in `src/config/Buddy.ts`) |
| Brand colours | `--brand` / `--brand-soft` in `src/app/globals.css` |

### Refreshing project screenshots

Screenshots are 1440×900 captures of each live site, saved as JPEGs in `public/project/`. With Chrome installed:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --window-size=1440,900 --virtual-time-budget=12000 \
  --screenshot=shot.png https://example.com
```

## Env

- `GEMINI_API_KEY`: portfolio chat assistant (`/api/chat`)
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`: contact form delivery (`/api/contact`)
- `NEXT_PUBLIC_UMAMI_ID`, `NEXT_PUBLIC_UMAMI_SRC`: analytics (optional)
- `NEXT_PUBLIC_URL`: canonical site URL
