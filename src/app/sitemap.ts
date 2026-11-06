import { siteConfig } from '@/config/Meta';
import { projects } from '@/config/Projects';
import { getPublishedBlogPosts } from '@/lib/blog';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, '');
  const pages = [
    '',
    '/projects',
    '/work-experience',
    '/graphics-videos',
    '/blog',
    '/journey',
    '/journey/certificates',
    '/gears',
    '/resume',
    '/contact',
  ].map((path) => ({ url: `${base}${path}` }));

  const caseStudies = projects
    .filter((p) => p.details)
    .map((p) => ({ url: `${base}${p.projectDetailsPageSlug}` }));

  const posts = getPublishedBlogPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.frontmatter.date,
  }));

  return [...pages, ...caseStudies, ...posts];
}
