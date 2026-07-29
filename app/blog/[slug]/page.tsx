import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NextLink from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

import { Section, Container, Eyebrow } from '@/components/ui';
import { title } from '@/components/primitives';
import { posts, postsBySlug } from '@/data/posts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = postsBySlug[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = postsBySlug[slug];
  if (!post) notFound();

  return (
    <Section spacing="lg">
      <Container size="md">
        <NextLink
          className="text-default-600 hover:text-primary mb-6 inline-flex items-center gap-2 text-sm"
          href="/blog"
        >
          <FaArrowLeft size={12} /> Volver al blog
        </NextLink>
        <Eyebrow className="mb-3 block" tone="sky">
          {post.category} ·{' '}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </Eyebrow>
        <h1
          className={title({ size: 'lg', class: 'block leading-[1.1]' })}
          style={{ viewTransitionName: 'page-title' }}
        >
          {post.title}
        </h1>
        <p className="text-default-700 mt-6 text-lg leading-relaxed">
          {post.body}
        </p>
        <p className="text-default-500 mt-6 text-sm">
          Artículo placeholder. En producción este contenido provendría del CMS
          del club.
        </p>
      </Container>
    </Section>
  );
}
