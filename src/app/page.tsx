import About from '@/components/landing/About';
import Blog from '@/components/landing/Blog';
import CTA from '@/components/landing/CTA';
import Experience from '@/components/landing/Experience';
import Github from '@/components/landing/Github';
import Hero from '@/components/landing/Hero';
import More from '@/components/landing/More';
import Projects from '@/components/landing/Projects';
import Studio from '@/components/landing/Studio';
import SectionRuler from '@/components/common/SectionRuler';
import React from 'react';

export default function page() {
  return (
    <div className="min-h-screen py-6">
      <SectionRuler />
      <Hero />
      <Projects />
      <Experience />
      <About />
      <Studio />
      <Github />
      <Blog />
      <More />
      <CTA />
    </div>
  );
}
