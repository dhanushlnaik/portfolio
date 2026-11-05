export type ProjectStatus = 'live' | 'building' | 'archived';

export interface Project {
  title: string;
  /** One-line pitch shown on the card. */
  description: string;
  year: string;
  /** Short label such as "Web3 · Game" or "Client". */
  category: string;
  /** Screenshot in /public/project. Omit and the card draws a typographic cover. */
  image?: string;
  video?: string;
  /** Tech shown as text tags on the card. */
  stack: string[];
  github?: string;
  /** Omit when the project isn't publicly deployed. */
  live?: string;
  status: ProjectStatus;
  /** Shown on the landing page. */
  featured?: boolean;
  /** True only when src/data/projects/<slug>.mdx exists. */
  details: boolean;
  projectDetailsPageSlug: string;
}

export interface ProjectCaseStudyFrontmatter {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  github?: string;
  live?: string;
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
