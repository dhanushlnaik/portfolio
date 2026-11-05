import AWS from '@/components/technologies/AWS';
import CSS from '@/components/technologies/CSS';
import ExpressJs from '@/components/technologies/ExpressJs';
import Html from '@/components/technologies/Html';
import JavaScript from '@/components/technologies/JavaScript';
import MongoDB from '@/components/technologies/MongoDB';
import NextJs from '@/components/technologies/NextJs';
import NodeJs from '@/components/technologies/NodeJs';
import PostgreSQL from '@/components/technologies/PostgreSQL';
import Prisma from '@/components/technologies/Prisma';
import ReactIcon from '@/components/technologies/ReactIcon';
import TailwindCss from '@/components/technologies/TailwindCss';
import TypeScript from '@/components/technologies/TypeScript';
import Vercel from '@/components/technologies/Vercel';
import Figma from '@/components/technologies/Figma';

export interface Technology {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  image: string;
  description: string[];
  startDate: string;
  endDate: string;
  website?: string;
  x?: string;
  linkedin?: string;
  github?: string;
  technologies: Technology[];
  isCurrent: boolean;
  isBlur?: boolean;
}

export const experiences: Experience[] = [
  {
    isCurrent: true,
    company: 'Tatsuik Tech Services',
    position: 'Founder',
    location: 'Bhatkal, Karnataka (Remote)',
    image: '/company/tatsuik.png',
    description: [
      'Started **Tatsuik Tech Services**, a small studio doing fullstack and Web3 development plus branding, motion and video.',
      'Registered MSME (Udyam UDYAM-KR-27-0058065). Remote, on IST, with overlap for EU and US clients.',
      'Builds web apps, Ethereum tools, brand identities and videos, on retainer or fixed-price.',
      'Clients get a working demo every week.',
    ],
    startDate: 'Jul 2026',
    endDate: 'Present',
    technologies: [
      { name: 'Next.js', href: 'https://nextjs.org/', icon: <NextJs /> },
      { name: 'TypeScript', href: 'https://typescriptlang.org/', icon: <TypeScript /> },
      { name: 'PostgreSQL', href: 'https://www.postgresql.org/', icon: <PostgreSQL /> },
      { name: 'Prisma', href: 'https://www.prisma.io/', icon: <Prisma /> },
      { name: 'Node.js', href: 'https://nodejs.org/', icon: <NodeJs /> },
      { name: 'Tailwind CSS', href: 'https://tailwindcss.com/', icon: <TailwindCss /> },
      { name: 'Figma', href: 'https://figma.com/', icon: <Figma /> },
    ],
  },
  {
    isCurrent: true,
    company: 'Avarch LLC',
    position: 'Full-stack Developer',
    location: 'Remote',
    image: '/company/avarch.jpeg',
    description: [
      'Built **EIPsInsight** from scratch: a dashboard for browsing and tracking Ethereum Improvement Proposals.',
      'Worked on both frontend and backend with Next.js, Node.js, MongoDB, Prisma and Tailwind CSS.',
      'Wrote a scheduler that pulls EIP data from GitHub, parses it and stores it in MongoDB.',
      'Redesigned the whole UI (glassmorphism, purple palette).',
      'Shipped other projects for the company on tight deadlines, from design through deployment.',
    ],
    startDate: 'Nov 2023',
    endDate: 'Present',
    technologies: [
      { name: 'Next.js', href: 'https://nextjs.org/', icon: <NextJs /> },
      { name: 'Node.js', href: 'https://nodejs.org/', icon: <NodeJs /> },
      { name: 'MongoDB', href: 'https://mongodb.com/', icon: <MongoDB /> },
      { name: 'Prisma', href: 'https://www.prisma.io/', icon: <Prisma /> },
      { name: 'Tailwind CSS', href: 'https://tailwindcss.com/', icon: <TailwindCss /> },
      { name: 'TypeScript', href: 'https://typescriptlang.org/', icon: <TypeScript /> },
      { name: 'Vercel', href: 'https://vercel.com/', icon: <Vercel /> },
    ],
    website: 'https://eipsinsights.vercel.app',
    linkedin: 'https://www.linkedin.com/company/avarch-llc/',
  },
  {
    isCurrent: false,
    company: 'Avarch LLC',
    position: 'Backend Developer Intern',
    location: 'Remote',
    image: '/company/avarch.jpeg',
    description: [
      'Built and deployed the scheduler that pulls EIPs from GitHub into MongoDB.',
      'Set up the Nginx server.',
      'Built the API routes that serve EIP data, and made them fast.',
      'Helped decide how the backend was structured and deployed.',
    ],
    startDate: 'Nov 2022',
    endDate: 'Nov 2023',
    technologies: [
      { name: 'Node.js', href: 'https://nodejs.org/', icon: <NodeJs /> },
      { name: 'MongoDB', href: 'https://mongodb.com/', icon: <MongoDB /> },
      { name: 'Express.js', href: 'https://expressjs.com/', icon: <ExpressJs /> },
      { name: 'AWS', href: 'https://aws.amazon.com/', icon: <AWS /> },
    ],
    github: 'https://github.com/dhanushlnaik',
  },
  {
    isCurrent: true,
    company: 'Discord Bot Developer / Server Administrator',
    position: 'Bot Developer & Admin',
    location: 'Remote',
    image: '/company/discord.jpeg',
    description: [
      'Co-developed and maintain **Not Amy**, a verified Discord gaming bot with thousands of users.',
      'Help run a partnered Discord server with **40,000+ members**: moderation, security and events.',
      'Built automation, game features and event tools with other developers using Node.js and Discord.js.',
    ],
    startDate: 'Jan 2021',
    endDate: 'Present',
    technologies: [
      { name: 'Node.js', href: 'https://nodejs.org/', icon: <NodeJs /> },
      { name: 'JavaScript', href: 'https://javascript.com/', icon: <JavaScript /> },
      { name: 'MongoDB', href: 'https://mongodb.com/', icon: <MongoDB /> },
    ],
    github: 'https://github.com/dhanushlnaik',
  },
  {
    isCurrent: false,
    company: 'CogniMuse',
    position: 'Visual Content Creator Intern',
    location: 'Udupi, Karnataka, India (On-site)',
    image: '/company/cognimuse.jpeg',
    description: [
      'Made 60+ visuals a month (reels, stories, posters) for brands on Instagram, LinkedIn and X.',
      'Worked with the Creative Head and co-founders over Discord for tasks and feedback.',
      'Kept the visuals consistent with each brand.',
    ],
    startDate: 'Jul 2024',
    endDate: 'Sep 2024',
    technologies: [
      { name: 'Figma', href: 'https://figma.com/', icon: <Figma /> },
      { name: 'HTML', href: 'https://html.com/', icon: <Html /> },
      { name: 'CSS', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS', icon: <CSS /> },
    ],
    linkedin: 'https://www.linkedin.com/company/cognimuse',
  },
  {
    isCurrent: false,
    company: 'EtherWorld',
    position: 'Content Writer, Blockchain & Crypto',
    location: 'Remote',
    image: '/company/avarch.jpeg',
    description: [
      'Wrote articles explaining EIPs, Ethereum upgrades and consensus in plain language.',
      'Made explainer graphics and animations.',
      'Watched the analytics and adjusted what we wrote based on what people read.',
    ],
    startDate: 'Aug 2022',
    endDate: 'Nov 2023',
    technologies: [
      { name: 'Next.js', href: 'https://nextjs.org/', icon: <NextJs /> },
      { name: 'React', href: 'https://react.dev/', icon: <ReactIcon /> },
      { name: 'TypeScript', href: 'https://typescriptlang.org/', icon: <TypeScript /> },
    ],
    website: 'https://etherworld.co/',
    linkedin: 'https://www.linkedin.com/company/etherworld/',
  },
];
