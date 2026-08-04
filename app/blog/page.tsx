import type { Metadata } from 'next';

import { AmbientBlobs } from '@/components/ui/AmbientBlobs';
import { BlogHeader } from '@/components/pages/blog/BlogHeader';
import { PostList } from '@/components/pages/blog/PostList';

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

export default function BlogPage() {
  return (
    <>
      <BlogHeader />
      <PostList />
      <AmbientBlobs preset="blog" />
    </>
  );
}
