import type { Metadata } from 'next';
import NextLink from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

import {
  Section,
  Container,
  Eyebrow,
  CardClub,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui';
import { title } from '@/components/primitives';
import { postsNewestFirst } from '@/data/posts';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Blog — Novedades del club',
  description:
    'Novedades institucionales, resultados deportivos y todo lo que pasa en el Club Los Rosarinos Estudiantil.',
  openGraph: {
    title: 'Blog — Club Los Rosarinos Estudiantil',
    description:
      'Novedades institucionales, resultados deportivos y todo lo que pasa en el club.',
    url: '/blog',
  },
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));

export default function BlogPage() {
  return (
    <>
      <Section as="section" spacing="md">
        <Container className="text-center">
          <Eyebrow className="mb-3 block" tone="sky">
            Novedades
          </Eyebrow>
          <h1
            className={title({
              size: 'lg',
              class: 'mx-auto block max-w-3xl leading-[1.1]',
            })}
            style={{ viewTransitionName: 'page-title' }}
          >
            Blog del <span className={title({ color: 'sky' })}>club</span>
          </h1>
          <p className="text-default-600 mx-auto mt-4 max-w-2xl">
            Novedades institucionales, resultados deportivos y todo lo que pasa
            en el club.
          </p>
        </Container>
      </Section>

      <Section as="section" spacing="lg">
        <Container>
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {postsNewestFirst.map((post) => (
              <CardClub key={post.slug} className="flex flex-col">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="bg-sky-soft text-sky-soft-fg rounded-full px-2.5 py-1 font-medium tracking-wider uppercase">
                    {post.category}
                  </span>
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
                  <FaArrowRight aria-hidden="true" className="size-3" />
                </NextLink>
              </CardClub>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
