import NextLink from "next/link";
import { Button } from "@heroui/react";
import { FaCheck } from "react-icons/fa";

import {
  Section,
  Container,
  Eyebrow,
  CardClub,
  CardClubTitle,
  CardClubBody,
} from "@/components/ui";
import { title } from "@/components/primitives";
import { pricingTiers } from "@/config/design-tokens";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <Section as='section' spacing='md'>
        <Container className='text-center'>
          <Eyebrow className='mb-3 block' tone='sky'>
            Cuotas 2026
          </Eyebrow>
          <h1
            className={title({
              size: "lg",
              class: "block leading-[1.1]",
            })}>
            Elegí tu
            <span className={title({ color: "sky" })}>cuota</span>
          </h1>
          <p className='mx-auto mt-4 max-w-xl text-default-600'>
            Planes para individuales, familias y menores. Sin matrícula, sin
            sorpresas.
          </p>
        </Container>
      </Section>

      {/* Pricing */}
      <Section as='section' spacing='lg' variant='muted'>
        <Container>
          <div className='grid gap-6 md:grid-cols-3'>
            {pricingTiers.map((tier) => (
              <CardClub
                key={tier.id}
                accent={tier.highlighted ? "gradient" : "sky"}
                className='flex flex-col'
                highlighted={tier.highlighted}>
                <div className='mb-4 flex items-baseline justify-between'>
                  <CardClubTitle>{tier.name}</CardClubTitle>
                  {tier.highlighted ? (
                    <span className='rounded-full bg-amarillo px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900'>
                      Popular
                    </span>
                  ) : null}
                </div>
                <div className='mb-2 flex items-baseline gap-1'>
                  <span className='text-4xl font-bold text-foreground'>
                    {formatPrice(tier.price)}
                  </span>
                  <span className='text-sm text-default-500'>/mes</span>
                </div>
                <CardClubBody className='mb-6'>{tier.description}</CardClubBody>
                <ul className='mb-6 space-y-2'>
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className='flex items-start gap-2 text-sm text-default-700'>
                      <FaCheck className='mt-0.5 size-4 shrink-0 text-primary' />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <NextLink className='mt-auto block' href='/about#contacto'>
                  <Button
                    className='w-full font-semibold'
                    size='md'
                    variant={tier.highlighted ? "primary" : "outline"}>
                    Quiero este plan
                  </Button>
                </NextLink>
              </CardClub>
            ))}
          </div>

          <p className='mt-10 text-center text-sm text-default-500'>
            * Los precios no incluyen el carnet de socio (pago único anual).
            Consultá por descuentos para grupos y empresas.
          </p>
        </Container>
      </Section>
    </>
  );
}
