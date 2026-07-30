import type { Metadata } from 'next';
import NextLink from 'next/link';
import { Button } from '@heroui/react';
import { FaCheck } from 'react-icons/fa';

import {
  Section,
  Container,
  Eyebrow,
  SectionHeader,
  CardClub,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui';
import { title } from '@/components/primitives';
import { pricingTiers } from '@/data/club';
import { faqItems } from '@/data/faq';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Cuotas 2026 — Planes y precios',
  description:
    'Conocé los planes individuales, familiares y para menores del Club Los Rosarinos Estudiantil. Sin matrícula, sin sorpresas.',
  openGraph: {
    title: 'Cuotas 2026 — Club Los Rosarinos Estudiantil',
    description:
      'Planes individuales, familiares y para menores. Sin matrícula, sin sorpresas.',
    url: '/pricing',
  },
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <Section as="section" spacing="md">
        <Container className="text-center">
          <Eyebrow className="mb-3 block" tone="sky">
            Cuotas 2026
          </Eyebrow>
          <h1
            className={title({
              size: 'lg',
              class: 'block leading-[1.1]',
            })}
            style={{ viewTransitionName: 'page-title' }}
          >
            Elegí tu{' '}
            <span className={title({ color: 'sky' })}>cuota</span>
          </h1>
          <p className="text-default-600 mx-auto mt-4 max-w-xl">
            Planes para individuales, familias y menores. Sin matrícula, sin
            sorpresas.
          </p>
        </Container>
      </Section>

      {/* Pricing */}
      <Section as="section" spacing="lg">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <CardClub
                key={tier.id}
                className="flex flex-col"
                highlighted={tier.highlighted}
              >
                <div className="mb-4 flex items-baseline justify-between">
                  <CardClubTitle>{tier.name}</CardClubTitle>
                  {tier.highlighted ? (
                    <span className="rounded-full bg-blue-700 px-2.5 py-1 text-xs font-semibold tracking-wider text-white uppercase">
                      Popular
                    </span>
                  ) : null}
                </div>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-foreground text-4xl font-bold">
                    {formatPrice(tier.price)}
                  </span>
                  <span className="text-default-500 text-sm">/mes</span>
                </div>
                <CardClubBody className="mb-6">{tier.description}</CardClubBody>
                <ul className="mb-6 space-y-2">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-default-700 flex items-start gap-2 text-sm"
                    >
                      <FaCheck className="text-primary mt-0.5 size-4 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <NextLink
                  className="mt-auto block"
                  href={`${routes.about}#comision`}
                >
                  <Button
                    className="w-full font-semibold"
                    size="md"
                    variant={tier.highlighted ? 'primary' : 'outline'}
                  >
                    Quiero este plan
                  </Button>
                </NextLink>
              </CardClub>
            ))}
          </div>

          <p className="text-default-500 mt-10 text-center text-sm">
            * Los precios no incluyen el carnet de socio (pago único anual).
            Consultá por descuentos para grupos y empresas.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section as="section" id="faq" spacing="lg">
        <Container size="md">
          <SectionHeader
            description="Si te queda alguna duda, escribinos por Instagram o al mail de atención al socio y te respondemos a la brevedad."
            eyebrow="Preguntas frecuentes"
            heading="Todo lo que necesitás saber"
            spacing="md"
          />

          <ul className="bg-surface shadow-club divide-default-200 divide-y overflow-hidden rounded-2xl">
            {faqItems.map((item) => (
              <li key={item.q}>
                <details className="group">
                  <summary
                    className={cn(
                      'text-foreground hover:bg-foreground/5 flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium transition-colors',
                      'list-none marker:hidden [&::-webkit-details-marker]:hidden',
                    )}
                  >
                    <span>{item.q}</span>
                    <span
                      aria-hidden="true"
                      className="bg-foreground/10 text-default-600 group-open:bg-primary group-open:text-primary-foreground inline-flex size-7 shrink-0 items-center justify-center rounded-full transition-colors"
                    >
                      <svg
                        className="size-3.5 transition-transform duration-200 group-open:rotate-45"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth={2.5}
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="text-default-700 px-5 pb-5 text-sm leading-relaxed">
                    {item.a}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
