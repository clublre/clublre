import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { faqItems } from '@/data/faq';

/** Sección de preguntas frecuentes. Server component. Los items
 *  llevan `id` estable (índice + texto) para que React no churn DOM
 *  si el orden cambia. `id="faq"` ancla CTAs externos.
 *
 *  Vive como sección `id="faq"` en la landing (`app/page.tsx`). */
export function PricingFaq() {
  return (
    <Section as="section" id="faq" spacing="lg">
      <Container size="md">
        <SectionHeader
          description="Si te queda alguna duda, escribinos por Instagram o al mail de atención al socio y te respondemos a la brevedad."
          eyebrow="Preguntas frecuentes"
          heading="Todo lo que necesitás saber"
          spacing="md"
        />

        <FaqAccordion
          items={faqItems.map((item, index) => ({
            id: `${index}-${item.q}`,
            question: item.q,
            answer: item.a,
          }))}
        />
      </Container>
    </Section>
  );
}
