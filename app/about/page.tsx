import type { Metadata } from 'next';

import { AmbientBlobs } from '@/components/ui';
import { AboutHeader } from '@/components/pages/about/AboutHeader';
import { ValuesGrid } from '@/components/pages/about/ValuesGrid';
import { CommissionSection } from '@/components/pages/about/CommissionSection';

export const metadata: Metadata = {
  title: 'El Club — Nuestra historia',
  description:
    'Fundado en 1943, el Club Los Rosarinos Estudiantil es una institución deportiva y social con más de 3.500 socios. Conocé nuestra historia, valores y comisión directiva.',
  openGraph: {
    title: 'El Club — Club Los Rosarinos Estudiantil',
    description:
      'Más de 80 años formando comunidad en Rosario. Conocé nuestra historia, valores y comisión directiva.',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHeader />
      <ValuesGrid />
      <CommissionSection />
      <AmbientBlobs preset="about" />
    </>
  );
}
