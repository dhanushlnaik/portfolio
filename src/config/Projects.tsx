import Appwrite from '@/components/technologies/Appwrite';
import Bun from '@/components/technologies/Bun';
import MongoDB from '@/components/technologies/MongoDB';
import NextJs from '@/components/technologies/NextJs';
import NodeJs from '@/components/technologies/NodeJs';
import PostgreSQL from '@/components/technologies/PostgreSQL';
import Prisma from '@/components/technologies/Prisma';
import ReactIcon from '@/components/technologies/ReactIcon';
import TailwindCss from '@/components/technologies/TailwindCss';
import TypeScript from '@/components/technologies/TypeScript';
import Vercel from '@/components/technologies/Vercel';
import { Project } from '@/types/project';

// `projectDetailsPageSlug` must match a file in src/data/projects/<slug>.mdx —
// the case-study route resolves the slug straight to that filename, so a slug
// without a matching .mdx renders a 404. Keep `details` false until one exists.
export const projects: Project[] = [
  {
    title: 'StrayMate',
    description:
      'Platform to find loving homes for stray animals — report sightings, coordinate rescues, and connect feeders with local volunteers.',
    image: '/project/straymate.png',
    link: '#',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'tRPC', icon: <ReactIcon key="react" /> },
      { name: 'Prisma', icon: <Prisma key="prisma" /> },
      { name: 'PostgreSQL', icon: <PostgreSQL key="postgresql" /> },
      { name: 'Tailwind CSS', icon: <TailwindCss key="tailwindcss" /> },
    ],
    github: '#',
    live: '#',
    details: true,
    projectDetailsPageSlug: '/projects/straymate',
    isWorking: true,
  },
  {
    title: 'EIPs Insight',
    description:
      'Interactive Ethereum dashboard for exploring EIPs and ERCs — sprint tracking, editor leaderboards and automated GitHub pipelines.',
    image: '/project/eips-insights.png',
    link: '#',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'MongoDB', icon: <MongoDB key="mongodb" /> },
      { name: 'Ethereum', icon: <ReactIcon key="react" /> },
    ],
    github: '#',
    live: '#',
    details: true,
    projectDetailsPageSlug: '/projects/eipsinsight',
    isWorking: true,
  },
  {
    title: 'CSI NMAMIT Website',
    description:
      'Official website for the CSI chapter at NMAM Institute of Technology, built as lead developer over three weeks.',
    image: '/project/csi-nmamit.png',
    link: '#',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'Tailwind CSS', icon: <TailwindCss key="tailwindcss" /> },
    ],
    github: 'https://github.com/dhanushlnaik/csi-nmamit',
    live: '#',
    details: true,
    projectDetailsPageSlug: '/projects/csinmamit',
    isWorking: false,
  },
  {
    title: 'DeliverZip',
    description:
      'Regional delivery platform routing parcels over existing bus and train networks. Built under hackathon time pressure.',
    image: '/project/deliverzip.png',
    link: '#',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'Node.js', icon: <NodeJs key="nodejs" /> },
    ],
    github: '#',
    live: '#',
    details: true,
    projectDetailsPageSlug: '/projects/deliverzip',
    isWorking: false,
  },
  {
    title: 'Not Amy',
    description:
      'A verified Discord gaming bot with community features, maintained for a 45,000-member server.',
    image: '/project/notamy.png',
    link: '#',
    technologies: [
      { name: 'Node.js', icon: <NodeJs key="nodejs" /> },
      { name: 'Discord.js', icon: <ReactIcon key="react" /> },
      { name: 'MongoDB', icon: <MongoDB key="mongodb" /> },
    ],
    github: '#',
    live: '#',
    details: true,
    projectDetailsPageSlug: '/projects/amysensei',
    isWorking: true,
  },
  {
    title: 'EasyFarm',
    description: 'Farm management system for tracking crops, inputs and yields.',
    image: '/project/easyfarm.png',
    link: '#',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'Prisma', icon: <Prisma key="prisma" /> },
      { name: 'PostgreSQL', icon: <PostgreSQL key="postgresql" /> },
    ],
    github: '#',
    live: '#',
    details: true,
    projectDetailsPageSlug: '/projects/easyfarm',
    isWorking: false,
  },
  {
    title: 'Appwrite MCP Server',
    description:
      'Model Context Protocol server exposing Appwrite database operations as tools an AI agent can call directly.',
    image: '/project/appwrite.png',
    link: 'https://mcp.dhanushlnaik.tech/',
    technologies: [
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'Bun', icon: <Bun key="bun" /> },
      { name: 'Vercel', icon: <Vercel key="vercel" /> },
      { name: 'Appwrite', icon: <Appwrite key="appwrite" /> },
    ],
    github: 'https://github.com/dhanushlnaik/mcp-server',
    live: 'https://mcp.dhanushlnaik.tech/',
    details: false,
    projectDetailsPageSlug: '/projects/appwrite-mcp-server',
    isWorking: true,
  },
];
