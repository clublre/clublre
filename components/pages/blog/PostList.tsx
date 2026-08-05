import NextLink from 'next/link';
import { Chip } from '@heroui/react';
import { ArrowRight, Newspaper } from '@/components/ui/Icons';

import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import {
  CardClub,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui/CardClub';
import { postsNewestFirst } from '@/data/posts';
import { routes } from '@/lib/routes';

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));

/** Grid con todos los posts del blog. Server component que lee
 *  `postsNewestFirst` directo de `data/posts.ts`. El título va
 *  wrappeado en NextLink dentro de CardClubTitle para que toda
 *  la zona del título sea clickeable, más el CTA "Leer artículo"
 *  abajo anclado a `/blog/[slug]`. */
export function PostList() {
  if (postsNewestFirst.length === 0) {
    return (
      <Section as="section" spacing="lg">
        <Container size="md">
          <div className="bg-surface shadow-club flex flex-col items-center rounded-2xl p-10 text-center">
            <Newspaper
              aria-hidden="true"
              className="text-default-300 mb-4 size-10"
            />
            <p className="text-default-700 text-base font-medium">
              Todavía no hay notas publicadas.
            </p>
            <p className="text-default-500 mt-2 text-sm">
              Volvé en unos días — estamos preparando contenido nuevo.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section as="section" spacing="lg">
      <Container>
        <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {postsNewestFirst.map((post, i) => (
            <Reveal key={post.slug} className="h-full" delay={i * 80}>
              <CardClub className="group flex h-full flex-col">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <Chip
                    className="capitalize"
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
                <CardClubBody className="mt-3 grow">
                  {post.excerpt}
                </CardClubBody>
                <NextLink
                  className="text-primary hover:text-primary/80 mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium transition-colors"
                  href={routes.blogPost(post.slug)}
                >
                  Leer artículo
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3 transition-transform group-hover:translate-x-0.5"
                  />
                </NextLink>
              </CardClub>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
