import type { Metadata } from 'next';

import { AmbientBlobs } from '@/components/ui/AmbientBlobs';
import { AboutHeader } from '@/components/pages/about/AboutHeader';
import { ValuesGrid } from '@/components/pages/about/ValuesGrid';
import { HistorySection } from '@/components/pages/about/HistorySection';
import { FitoSection } from '@/components/pages/about/FitoSection';
import { CommissionSection } from '@/components/pages/about/CommissionSection';
import { siteConfig } from '@/config/site';
import { yearsSince } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'El Club — Nuestra historia',
  description:
    'Fundado en 1959, el Club Los Rosarinos Estudiantil es una institución deportiva y social con más de 900 socios. Conocé nuestra historia, valores y comisión directiva.',
  openGraph: {
    title: 'El Club — Club Los Rosarinos Estudiantil',
    description: `Más de ${yearsSince(siteConfig.foundedYear)} años formando comunidad en Rosario. Conocé nuestra historia, valores y comisión directiva.`,
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHeader />
      <ValuesGrid />
      <HistorySection />
      <FitoSection />
      <CommissionSection />
      <AmbientBlobs preset="about" />
    </>
  );
}
