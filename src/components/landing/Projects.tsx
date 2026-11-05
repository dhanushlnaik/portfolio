import { projects } from '@/config/Projects';
import React from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { ProjectList } from '../projects/ProjectList';

export default function Projects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <Container className="mt-20">
      <SectionHeading
        index="01"
        heading="Projects"
        note="Things I've shipped recently — games, dev tools and client sites."
        href="/projects"
        hrefLabel={`All ${projects.length}`}
      />
      <ProjectList className="mt-6" projects={featured} />
    </Container>
  );
}
