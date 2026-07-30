import { postsNewestFirst } from '@/data/posts';

import { AmbientBlobs } from '@/components/ui';
import { Hero } from '@/components/pages/home/Hero';
import { TrustStrip } from '@/components/pages/home/TrustStrip';
import { ActivitiesSection } from '@/components/pages/home/ActivitiesSection';
import { LatestPosts } from '@/components/pages/home/LatestPosts';
import { FinalCta } from '@/components/pages/home/FinalCta';

// Home — compone las secciones de la home + AmbientBlobs al final
// para que el screen-blend tenga todo el contenido como backdrop.

export default function HomePage() {
  const latestPosts = postsNewestFirst.slice(0, 3);

  return (
    <>
      <Hero />
      <TrustStrip />
      <ActivitiesSection />
      <LatestPosts posts={latestPosts} />
      <FinalCta />
      <AmbientBlobs preset="home" />
    </>
  );
}
