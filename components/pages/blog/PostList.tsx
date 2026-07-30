import NextLink from 'next/link';
import { Chip } from '@heroui/react';
import { FaArrowRight } from 'react-icons/fa';

import {
  Section,
  Container,
  CardClub,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui';
import { postsNewestFirst } from '@/data/posts';
import { routes } from '@/lib/routes';

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));

/**
 * PostList — index page grid of all blog posts.
 *
 * Server component. Reads `postsNewestFirst` from `data/posts.ts`
 * directly (sorted desc at module load) and renders each as a
 * CardClub with category chip, full date, title and excerpt.
 *
 * Title is wrapped in a NextLink via CardClubTitle so the whole
 * card is clickable from the title region, with a separate
 * "Leer artículo" CTA at the bottom anchored to /blog/[slug].
 */
export function PostList() {
  return (
    <Section as="section" spacing="lg">
      <Container>
        <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {postsNewestFirst.map((post) => (
            <CardClub key={post.slug} className="flex flex-col">
              <div className="mb-3 flex items-center justify-between text-xs">
                <Chip
                  className="tracking-wider uppercase"
                  color="accent"
                  size="sm"
                  variant="soft"
                >
                  {post.category}
                </Chip>
                <time className="text-default-500" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              <CardClubTitle className="hover:text-primary">
                <NextLink href={routes.blogPost(post.slug)}>
                  {post.title}
                </NextLink>
              </CardClubTitle>
              <CardClubBody className="mt-3 grow">{post.excerpt}</CardClubBody>
              <NextLink
                className="text-primary hover:text-primary/80 mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium transition-colors"
                href={routes.blogPost(post.slug)}
              >
                Leer artículo
                <FaArrowRight aria-hidden="true" className="size-3" />
              </NextLink>
            </CardClub>
          ))}
        </div>
      </Container>
    </Section>
  );
}
