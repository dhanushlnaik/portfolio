import { type Experience, experiences } from '@/config/Experience';
import React from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { ExperienceCard } from '../experience/ExperienceCard';

export default function Experience() {
  return (
    <Container className="mt-20">
      <SectionHeading
        index="02"
        heading="Work"
        href="/work-experience"
        hrefLabel="Full history"
      />
      <div className="mt-6 flex flex-col gap-10">
        {experiences.slice(0, 2).map((experience: Experience) => (
          <ExperienceCard
            key={`${experience.company}-${experience.position}`}
            experience={experience}
          />
        ))}
      </div>
    </Container>
  );
}
