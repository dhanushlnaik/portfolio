'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { type FunctionComponent } from 'react';
import {
  AiOutlineGithub,
  AiOutlineLinkedin,
  AiOutlineMail,
  AiOutlineTwitter,
  AiOutlineYoutube,
  AiOutlineBehanceSquare,
} from 'react-icons/ai';

import { cn } from '~/lib/utils';

export const social = [
  {
    link: 'https://x.com/dhanushlnaik',
    icon: <AiOutlineTwitter className="h-7 w-7 hover:-translate-y-1" />,
    name: 'Twitter',
  },
  {
    link: 'https://github.com/dhanushlnaik',
    icon: <AiOutlineGithub className="h-7 w-7 hover:-translate-y-1" />,
    name: 'GitHub',
  },
  {
    link: 'https://www.youtube.com/@dhanushlnaik',
    icon: <AiOutlineYoutube className="h-7 w-7 hover:-translate-y-1" />,
    name: 'YouTube',
  },
  {
    link: 'https://www.linkedin.com/in/dhanushlnaik/',
    icon: <AiOutlineLinkedin className="h-7 w-7 hover:-translate-y-1" />,
    name: 'LinkedIn',
  },
  {
    link: 'mailto:dhanushlnaik03@gmail.com',
    icon: <AiOutlineMail className="h-7 w-7 hover:-translate-y-1" />,
    name: 'Email',
  },
  {
    link: 'https://www.behance.net/dhanushlnaik',
    icon: <AiOutlineBehanceSquare className="h-7 w-7 hover:-translate-y-1" />,
    name: 'Behance',
  },
];

export const links = [
  { name: 'About', link: '/dhanushlnaik#about' },
  { name: 'Projects', link: '/dhanushlnaik#projects' },
  { name: 'Skills', link: '/dhanushlnaik#skills' },
  { name: 'Contact', link: '/dhanushlnaik#contact' },
];

export const footLinks = [
  { name: 'Privacy Policy', link: '/dhanushlnaik/privacy' },
  { name: 'Terms of Use', link: '/dhanushlnaik/terms' },
  { name: 'Contact', link: '/dhanushlnaik#contact' },
];

const Footer: FunctionComponent<{ className?: string }> = ({ className }) => {
  return (
    <footer className={cn(className, 'relative')}>
      <div className="line-break "></div>
      <div className="absolute inset-0 z-0">
        <Image
          src="/grid_bg.png"
          alt="Footer Background"
          fill
          className="opacity-30"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative size-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image src="/medhanush.png" alt="dhanush" fill className="object-cover" />
            </div>
            <p className="events-heading mb-3 mt-3 flex items-center font-sub-heading text-lg md:text-xl">
              Dhanush Naik
            </p>
            <div className="mb-4">
              <p className="events-heading text-center md:text-left">
                Crafted with 💻 and ☕
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-end md:items-end ">
            <ul className="mb-6 flex flex-wrap justify-center gap-4 md:gap-6">
              {links.map((link, index) => (
                <li key={index}>
                  <Link href={link.link} className="events-heading">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mb-6 flex justify-center gap-4 md:gap-6">
              {social.map((link, index) => (
                <li key={index}>
                  <Link href={link.link} target="_blank" rel="noopener noreferrer">
                    {link.icon}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-gray-700" />
        <div className="flex flex-col items-center gap-4 pt-4">
          <ul className="flex flex-wrap justify-center gap-4 text-sm md:gap-6">
            {footLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.link}
                  className="events-heading transition hover:text-gray-200/75"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
