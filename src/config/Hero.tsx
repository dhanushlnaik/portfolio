import Github from '@/components/svgs/Github';
import LinkedIn from '@/components/svgs/LinkedIn';
import Mail from '@/components/svgs/Mail';
import X from '@/components/svgs/X';
import Bun from '@/components/technologies/Bun';
import JavaScript from '@/components/technologies/JavaScript';
import MongoDB from '@/components/technologies/MongoDB';
import NextJs from '@/components/technologies/NextJs';
import NodeJs from '@/components/technologies/NodeJs';
import PostgreSQL from '@/components/technologies/PostgreSQL';
import Prisma from '@/components/technologies/Prisma';
import ReactIcon from '@/components/technologies/ReactIcon';
// Technology Components
import TypeScript from '@/components/technologies/TypeScript';

// Component mapping for skills
export const skillComponents = {
  TypeScript: TypeScript,
  ReactIcon: ReactIcon,
  NextJs: NextJs,
  Bun: Bun,
  PostgreSQL: PostgreSQL,
  NodeJs: NodeJs,
  MongoDB: MongoDB,
  Prisma: Prisma,
  JavaScript: JavaScript,
};

export const heroConfig = {
  name: 'Dhanush Naik',
  title: 'Fullstack & Web3 Developer · Designer',
  avatar: '/assets/logo.png',
  location: 'Bhatkal, Karnataka',
  timezone: 'Asia/Kolkata',

  // Small "currently" pill above the name. Keep it short and current.
  // `until` (optional) is when this status expires; after that the pill
  // switches to `next` on its own, so a dated status never goes stale.
  status: {
    text: "I'm at Devcon 8 in Mumbai right now. Come say hi at the EIPsInsight booth",
    href: '/projects/ethquest',
    until: '2026-11-06T23:59:59+05:30',
    next: {
      text: 'Building ETHQuest, BlobLens and ClockThatDaily',
      href: '/projects',
    },
  } as {
    text: string;
    href: string;
    until?: string;
    next?: { text: string; href: string };
  },

  skills: [
    { name: 'TypeScript', href: 'https://www.typescriptlang.org/', component: 'TypeScript' },
    { name: 'Next.js', href: 'https://nextjs.org/', component: 'NextJs' },
    { name: 'PostgreSQL', href: 'https://www.postgresql.org/', component: 'PostgreSQL' },
    { name: 'Prisma', href: 'https://www.prisma.io/', component: 'Prisma' },
  ],

  // {skills:N} renders an inline skill chip, <b>…</b> renders highlighted text.
  description: {
    template:
      'I build Ethereum tooling, games and fullstack products with {skills:0}, {skills:1} and {skills:3} on {skills:2}. I also do the <b>branding, motion and video</b> for them. Right now I run <b>Tatsuik</b>, my small studio in Bhatkal.',
  },

  buttons: [
    { variant: 'default', text: 'See my work', href: '/projects', icon: 'Code' },
    { variant: 'outline', text: 'Resume', href: '/resume', icon: 'CV' },
  ],
};

// Social Links Configuration
export const socialLinks = [
  {
    name: 'X',
    href: 'https://x.com/iamdhanushlnaik',
    icon: <X />,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/dhanushlnaik/',
    icon: <LinkedIn />,
  },
  {
    name: 'Github',
    href: 'https://github.com/dhanushlnaik',
    icon: <Github />,
  },
  {
    name: 'Email',
    href: 'mailto:dhanushlnaik@gmail.com',
    icon: <Mail />,
  },
];