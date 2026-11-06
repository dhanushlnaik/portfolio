import { about } from './About';
import { heroConfig } from './Hero';

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

// Base site configuration
export const siteConfig = {
  name: heroConfig.name,
  title: 'Dhanush Naik | Fullstack & Web3 Developer',
  description: 'Fullstack & Web3 developer and designer. I build Ethereum tooling and games like ETHQuest and ClockThatDaily, and run Tatsuik.',
  url: process.env.NEXT_PUBLIC_URL || 'https://dhanush.tatsuik.com',
  ogImage: '/og',
  author: {
    name: about.name,
    twitter: '@iamdhanushlnaik',
    github: 'dhanushlnaik',
    linkedin: 'dhanushlnaik',
    email: 'dhanushlnaik@gmail.com',
  },
  keywords: [
    'portfolio',
    'developer',
    'full-stack',
    'react',
    'nextjs',
    'typescript',
    'web development',
    'web3',
    'ethereum',
    'solana',
    'tatsuik',
    heroConfig.name.toLowerCase(),
  ],
};


/** Generated link-preview image (see src/app/og/route.tsx). */
function og(title: string, subtitle: string, path: string) {
  const q = new URLSearchParams({
    title,
    subtitle,
    kicker: `dhanush.tatsuik.com${path}`,
  });
  return `/og?${q.toString()}`;
}

export const pageMetadata: Record<string, PageMeta> = {
  // Home page
  '/': {
    title: `${heroConfig.name} - ${heroConfig.title}`,
    description: siteConfig.description,
    keywords: [
      'portfolio',
      'developer',
      'full-stack',
      'web development',
      'projects',
    ],
    ogImage: '/og',
    twitterCard: 'summary_large_image',
  },

  // Contact page
  '/contact': {
    title: 'Contact - Get in Touch',
    description:
      'Freelance, Web3, design or video work. Send me a message or book a call.',
    keywords: ['contact', 'hire', 'collaboration', 'freelance', 'developer'],
    ogImage: og('Contact', 'Freelance, Web3, design or video work. Send a message or book a call.', '/contact'),
    twitterCard: 'summary_large_image',
  },

  // Work Experience page
  '/work-experience': {
    title: 'Work Experience - Professional Journey',
    description:
      'Where I have worked: Tatsuik, Avarch, EtherWorld, CogniMuse and a few Discord communities.',
    keywords: [
      'work experience',
      'career',
      'professional',
      'software developer',
      'employment history',
    ],
    ogImage: og('Work', 'Tatsuik, Avarch, EtherWorld, CogniMuse and a few Discord communities.', '/work-experience'),
    twitterCard: 'summary_large_image',
  },

  // Projects page
  '/projects': {
    title: 'Projects - My Work & Projects Portfolio',
    description:
      'Games, Ethereum tools, client sites and older experiments, newest first.',
    keywords: [
      'projects',
      'portfolio',
      'web development',
      'applications',
      'software',
    ],
    ogImage: og('Projects', 'Games, Ethereum tools, client sites and older experiments.', '/projects'),
    twitterCard: 'summary_large_image',
  },

  // Blog page
  '/blog': {
    title: 'Blog - Thoughts & Tutorials',
    description:
      'Posts about building things, hackathons, blockchain and making a short film.',
    keywords: [
      'blog',
      'tutorials',
      'programming',
      'web development',
      'technical writing',
    ],
    ogImage: og('Writing', 'Notes on things I have built and learned.', '/blog'),
    twitterCard: 'summary_large_image',
  },

  // Resume page
  '/resume': {
    title: 'Resume - Professional CV',
    description: `${heroConfig.name}'s resume.`,
    keywords: [
      'resume',
      'cv',
      'professional',
      'skills',
      'qualifications',
      'download',
    ],
    ogImage: og('Resume', 'Fullstack & Web3 developer and designer.', '/resume'),
    twitterCard: 'summary_large_image',
  },

  '/graphics-videos': {
    title: 'Design & Video',
    description: "Posters, photo edits and videos I've made.",
    keywords: ['graphic design', 'posters', 'video editing', 'portfolio'],
    ogImage: og('Design & Video', "Posters, photo edits and videos I've made.", '/graphics-videos'),
    twitterCard: 'summary_large_image',
  },

  '/journey': {
    title: 'Journey',
    description: "What I've done each year, from learning Python in school to running my own studio.",
    keywords: ['journey', 'timeline', 'career'],
    ogImage: og('Journey', "What I've done each year, from school to running my own studio.", '/journey'),
    twitterCard: 'summary_large_image',
  },

  '/journey/certificates': {
    title: 'Certificates',
    description: 'Certificates from courses, events and hackathons.',
    keywords: ['certificates', 'achievements', 'hackathons'],
    ogImage: og('Certificates', 'Certificates from courses, events and hackathons.', '/journey/certificates'),
    twitterCard: 'summary_large_image',
  },

  // Gears page
  '/gears': {
    title: 'Uses - Hardware & Apps',
    description:
      'The hardware, apps and browser extensions I use every day.',
    keywords: [
      'setup',
      'tools',
      'devices',
      'software',
      'productivity',
      'development environment',
    ],
    ogImage: og('Uses', 'The hardware, apps and browser extensions I use every day.', '/gears'),
    twitterCard: 'summary_large_image',
  },

};

// Helper function to get metadata for a specific page
export function getPageMetadata(pathname: string): PageMeta {
  return pageMetadata[pathname] || pageMetadata['/'];
}

// Helper function to generate complete metadata object for Next.js
export function generateMetadata(pathname: string) {
  const pageMeta = getPageMetadata(pathname);

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageMeta.title,
    description: pageMeta.description,
    keywords: pageMeta.keywords?.join(', '),
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    openGraph: {
      type: 'website',
      url: `${siteConfig.url}${pathname}`,
      title: pageMeta.title,
      description: pageMeta.description,
      siteName: siteConfig.title,
      images: [
        {
          url: pageMeta.ogImage || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: pageMeta.title,
        },
      ],
    },
    twitter: {
      card: pageMeta.twitterCard || 'summary_large_image',
      title: pageMeta.title,
      description: pageMeta.description,
      creator: siteConfig.author.twitter,
      images: [pageMeta.ogImage || siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${siteConfig.url}${pathname}`,
    },
  };
}
