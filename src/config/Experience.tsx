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
      'Founded **Tatsuik Tech Services**, a lean studio pairing fullstack and Web3 engineering with brand design, motion and video — the whole pipeline handled in-house rather than split across a developer and an agency.',
      'Registered MSME (Udyam UDYAM-KR-27-0058065), operating remote-first on IST with flexible overlap for EU and US clients.',
      'Delivering fullstack web apps and Ethereum tooling alongside brand systems, event identity and edited video, on retainer or fixed-scope project terms.',
      'Runs a weekly shipping cadence — clients get a working demo each week rather than a single reveal at the end.',
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
      'Built **EIPs Insights** from scratch — an interactive Ethereum dashboard for exploring Ethereum Improvement Proposals (EIPs).',
      'Developed both frontend and backend using Next.js, Node.js, MongoDB, Prisma, and Tailwind CSS, ensuring performance and scalability.',
      'Implemented a custom scheduler to fetch and parse EIP data from GitHub automatically, storing structured records in MongoDB.',
      'Rebuilt the platform with a modern glassmorphism UI using a purple color palette for improved UX and aesthetic appeal.',
      'Independently delivered full-featured portfolio projects under tight deadlines while collaborating across design, development, testing, and deployment phases.',
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
      'Developed and deployed a scheduler to extract Ethereum Improvement Proposals (EIPs) from GitHub, storing structured data in MongoDB for efficient querying.',
      'Set up and configured an Nginx server for optimized routing and performance.',
      'Built and optimized API routes to ensure low-latency access to EIP data, enhancing scalability and user experience.',
      'Played a key role in backend architecture and deployment strategies for a real-world blockchain insights platform.',
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
      'Developed and maintained **Not Amy**, a verified gaming Discord bot with thousands of active users.',
      'Managed a partnered Discord server with **40,000+ members**, ensuring moderation, security, and community engagement.',
      'Collaborated with other developers to integrate automation, gamification, and event management tools using Node.js and Discord.js.',
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
      'Designed 60+ high-quality monthly visuals (reels, stories, posters) for brands on Instagram, LinkedIn, and X.',
      'Collaborated closely with the Creative Head and co-founders via Discord for task tracking and feedback.',
      'Maintained productivity logs and ensured consistent visual storytelling aligned with brand tone and messaging.',
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
    position: 'Content Writer – Blockchain / Crypto',
    location: 'Remote',
    image: '/company/avarch.jpeg',
    description: [
      'Wrote research-driven blogs and simplified breakdowns of complex blockchain topics like EIPs, Ethereum upgrades, and consensus mechanisms.',
      'Created visually engaging explainers and animations to promote blockchain literacy.',
      'Monitored content analytics and optimized engagement through strategic writing and design alignment.',
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
