import type { Metadata } from 'next';

import { Section, Container, AmbientBlobs } from '@/components/ui';

import { PricingHeader } from '@/components/pages/pricing/PricingHeader';
import { PricingTiers } from '@/components/pages/pricing/PricingTiers';
import { PricingFaq } from '@/components/pages/pricing/PricingFaq';

export const metadata: Metadata = {
  title: 'Cuotas 2026 — Planes y precios',
  description:
    'Conocé los planes individuales, familiares y para menores del Club Los Rosarinos Estudiantil. Sin matrícula, sin sorpresas.',
  openGraph: {
    title: 'Cuotas 2026 — Club Los Rosarinos Estudiantil',
    description: 'Planes individuales, familiares y para menores. Sin matrícula, sin sorpresas.',
    url: '/pricing',
  },
};

export default function PricingPage() {
  return (
    <>
      <Section as="section" spacing="lg">
        <Container>
          <PricingHeader />
          <PricingTiers />
        </Container>
      </Section>

      <PricingFaq />
      <AmbientBlobs preset="pricing" />
    </>
  );
}
