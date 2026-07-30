import {
  Section,
  Container,
  SectionHeader,
  FaqAccordion,
} from '@/components/ui';
import { faqItems } from '@/data/faq';

/**
 * PricingFaq — frequently-asked questions section.
 *
 * Server component. The accordion items take stable `id`s (index +
 * question text) so React doesn't churn DOM nodes if the list order
 * ever changes.
 *
 * `id="faq"` on the section anchors any "scroll to FAQ" CTA coming
 * from another part of the site.
 */
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
