import type { Metadata } from 'next';

import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { AmbientBlobs } from '@/components/ui/AmbientBlobs';

import { postsNewestFirst } from '@/data/posts';

import { Hero } from '@/components/pages/home/Hero';
import { TrustStrip } from '@/components/pages/home/TrustStrip';
import { ActivitiesSection } from '@/components/pages/home/ActivitiesSection';
import { PricingTiers } from '@/components/pages/home/PricingTiers';
import { PricingFaq } from '@/components/pages/home/PricingFaq';
import { LatestPosts } from '@/components/pages/home/LatestPosts';
import { FinalCta } from '@/components/pages/home/FinalCta';
import { siteConfig } from '@/config/site';
import { yearsSince } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'CLUB L.R.E | Club deportivo en Rosario, Santa Fe',
  description: `Más de ${yearsSince(siteConfig.foundedYear)} años formando comunidad en Rosario. Deportes, recreación y vida social para toda la familia. Conocé nuestras cuotas.`,
};

export default function HomePage() {
  const latestPosts = postsNewestFirst.slice(0, 3);

  return (
    <>
      <Hero />
      <TrustStrip />
      <ActivitiesSection />
      <LatestPosts posts={latestPosts} />
      <FinalCta />

      <Section as="section" id="cuotas" spacing="lg">
        <Container>
          <div className="mb-10 text-center md:mb-12">
            <Eyebrow className="mb-3 block" tone="sky">
              Planes y cuotas
            </Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Elegí tu{' '}
              <span className="bg-linear-to-r from-sky-500 to-blue-700 bg-clip-text text-transparent">
                cuota
              </span>
            </h2>
            <p className="text-default-600 mx-auto mt-3 max-w-xl">
              Planes para individuales, familias y menores. Sin matrícula, sin
              sorpresas.
            </p>
          </div>
          <PricingTiers />
        </Container>
      </Section>

      <PricingFaq />
      <AmbientBlobs preset="home" />
    </>
  );
}
