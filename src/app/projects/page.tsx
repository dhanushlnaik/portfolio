import Container from '@/components/common/Container';
import { ProjectList } from '@/components/projects/ProjectList';
import { generateMetadata as getMetadata } from '@/config/Meta';
import { projects } from '@/config/Projects';
import { Metadata } from 'next';

export const metadata: Metadata = getMetadata('/projects') as Metadata;

export default function ProjectsPage() {
  const live = projects.filter((p) => p.status !== 'archived');
  const archive = projects.filter((p) => p.status === 'archived');

  return (
    <Container className="py-12">
      <header>
        <p className="font-mono text-xs text-brand">~/projects</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Projects</h1>
        <p className="text-secondary mt-3 max-w-xl leading-7">
          Games, Ethereum tools, client sites and older experiments, newest
          first. Some have a case study on how I built them.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="font-mono text-xs text-muted-foreground">
          Shipped & live · {live.length}
        </h2>
        <ProjectList className="mt-4" projects={live} />
      </section>

      <section className="mt-16">
        <h2 className="font-mono text-xs text-muted-foreground">
          Archive · {archive.length}
        </h2>
        <ProjectList className="mt-4" projects={archive} />
      </section>
    </Container>
  );
}
