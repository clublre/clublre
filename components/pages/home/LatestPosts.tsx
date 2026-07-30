import NextLink from 'next/link';
import { Chip } from '@heroui/react';
import { FaArrowRight } from 'react-icons/fa';

import { Section, Container, SectionHeader } from '@/components/ui';
import type { BlogPost } from '@/data/posts';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';

interface LatestPostsProps {
  posts: ReadonlyArray<BlogPost>;
}

/**
 * LatestPosts — pulls the most recent blog posts onto the home
 * page to surface editorial content. Drives SEO (internal links
 * + fresh content signals) and keeps the site feeling alive
 * between posts. `posts` is passed in as a prop so the home
 * page can decide which slice to render (newest 3) without
 * this component reaching into the data layer.
 */
export function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <Section as="section" spacing="lg">
      <Container>
        <SectionHeader
          eyebrow="Últimas novedades"
          heading="Lo último del club"
          trailing={
            <NextLink
              className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium transition-colors"
              href={routes.blog}
            >
              Ver todos los posts
              <FaArrowRight aria-hidden="true" className="size-3" />
            </NextLink>
          }
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <NextLink
                aria-label={`Leer ${post.title}`}
                className={cn(
                  'group bg-surface shadow-club relative flex h-full flex-col overflow-hidden rounded-xl p-6',
                  'hover:shadow-club-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5',
                )}
                href={routes.blogPost(post.slug)}
              >
                <div className="text-default-500 mb-2 flex items-center gap-3 text-xs">
                  <Chip
                    className="tracking-wider uppercase"
                    color="accent"
                    size="sm"
                    variant="soft"
                  >
                    {post.category}
                  </Chip>
                  <time dateTime={post.date}>
                    {new Intl.DateTimeFormat('es-AR', {
                      day: 'numeric',
                      month: 'short',
                    }).format(new Date(post.date))}
                  </time>
                </div>
                <h3 className="text-foreground group-hover:text-primary mb-2 text-lg font-semibold transition-colors">
                  {post.title}
                </h3>
                <p className="text-default-600 line-clamp-3 grow text-sm">
                  {post.excerpt}
                </p>
                <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
                  Leer artículo
                  <FaArrowRight
                    aria-hidden="true"
                    className="size-3 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </NextLink>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
