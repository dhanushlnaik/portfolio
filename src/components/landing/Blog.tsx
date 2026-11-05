import { getPublishedBlogPosts } from '@/lib/blog';
import { Link } from 'next-view-transitions';
import React from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';

export default function Blog() {
  const posts = getPublishedBlogPosts().slice(0, 4);

  return (
    <Container className="mt-20">
      <SectionHeading index="06" heading="Writing" href="/blog" hrefLabel="All posts" />
      <ul className="mt-4 divide-y divide-dashed">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="font-medium transition-colors group-hover:text-brand">
                {post.frontmatter.title}
              </span>
              <time className="shrink-0 font-mono text-xs text-muted-foreground">
                {new Date(post.frontmatter.date).toLocaleDateString('en-IN', {
                  month: 'short',
                  year: 'numeric',
                })}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
