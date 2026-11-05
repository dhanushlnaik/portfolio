export interface Project {
  title: string;
  description: string;
  image: string;
  video?: string;
  /** Omit when there is no public URL — a placeholder renders a dead link. */
  link?: string;
  technologies: { name: string; icon: React.ReactNode }[];
  github?: string;
  /** Omit when the project isn't publicly deployed. */
  live?: string;
  details: boolean;
  projectDetailsPageSlug: string;
  isWorking: boolean;
}

export interface ProjectCaseStudyFrontmatter {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  live: string;
  timeline: string;
  role: string;
  team?: string;
  status: 'completed' | 'in-progress' | 'archived';
  featured: boolean;
  challenges?: string[];
  learnings?: string[];
  isPublished: boolean;
}

export interface ProjectCaseStudy {
  slug: string;
  frontmatter: ProjectCaseStudyFrontmatter;
  content: string;
}

export interface ProjectCaseStudyPreview {
  slug: string;
  frontmatter: ProjectCaseStudyFrontmatter;
}
