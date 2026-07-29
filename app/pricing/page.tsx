import NextLink from 'next/link';
import { Button } from '@heroui/react';
import { FaCheck } from 'react-icons/fa';

import {
  Section,
  Container,
  Eyebrow,
  CardClub,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui';
import { title } from '@/components/primitives';
import { pricingTiers } from '@/data/club';
import { cn } from '@/lib/utils';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);

/**
 * FAQ — the most common questions we get from prospective members.
 * Uses native <details>/<summary> so it works without JS, is fully
 * accessible (keyboard + screen-reader friendly), and the only
 * client-side cost is the small CSS rotation on the +/- indicator.
 */
const FAQ_ITEMS = [
  {
    q: '¿Cómo me asocio al club?',
    a: 'Podés acercarte a nuestra sede de Iriondo 375, Rosario, de lunes a viernes con tu DNI y una foto carnet. También podés escribirnos por Instagram para coordinar el trámite.',
  },
  {
    q: '¿Los menores de edad pueden asociarse?',
    a: 'Sí. La cuota infantil es para menores de 12 años e incluye la escuela deportiva. Para asociar a un menor se requiere la presencia de un adulto responsable con DNI.',
  },
  {
    q: '¿Qué incluye la cuota familiar?',
    a: 'La cuota familiar cubre a cuatro integrantes del grupo familiar e incluye pileta, todas las disciplinas y los eventos sociales del club.',
  },
  {
    q: '¿Hay matrícula de ingreso?',
    a: 'No hay matrícula. Solo se abona el carnet de socio, que es un pago único anual, y la cuota mensual correspondiente al plan elegido.',
  },
  {
    q: '¿Puedo probar una actividad antes de asociarme?',
    a: 'Sí, ofrecemos clases de prueba gratuitas en la mayoría de las disciplinas. Coordiná día y horario escribiéndonos por Instagram a @clubestudiantilrosario.',
  },
] as const;

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
            Elegí tu
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
                accent={tier.highlighted ? 'gradient' : 'sky'}
                className="flex flex-col"
                highlighted={tier.highlighted}
              >
                <div className="mb-4 flex items-baseline justify-between">
                  <CardClubTitle>{tier.name}</CardClubTitle>
                  {tier.highlighted ? (
                    <span className="bg-amarillo text-primary-foreground rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider uppercase">
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
                <NextLink className="mt-auto block" href="/about#contacto">
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
          <div className="mb-10 text-center">
            <Eyebrow className="mb-3 block" tone="sky">
              Preguntas frecuentes
            </Eyebrow>
            <h2 className={title({ size: 'md', class: 'block' })}>
              Todo lo que necesitás saber
            </h2>
            <p className="text-default-600 mx-auto mt-3 max-w-xl">
              Si te queda alguna duda, escribinos por Instagram o al mail de
              atención al socio y te respondemos a la brevedad.
            </p>
          </div>

          <ul className="border-default-200 bg-surface divide-default-200 shadow-club divide-y overflow-hidden rounded-2xl border">
            {FAQ_ITEMS.map((item) => (
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
