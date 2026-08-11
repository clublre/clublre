import NextLink from 'next/link';
import { Badge, Button } from '@heroui/react';

import {
  CardClub,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui/CardClub';
import { Reveal } from '@/components/ui/Reveal';
import { Check } from '@/components/ui/Icons';
import { AnimatedNumber } from '@/components/molecules/AnimatedNumber';
import { pricingTiers } from '@/data/club';
import { routes } from '@/lib/routes';

// Grid de 3 columnas con los planes de cuota. Server component que
//  lee `pricingTiers` directo de `data/club.ts`. El `items-stretch` +
//  `md:mt-auto` alinea los CTAs al fondo del card más alto.
//
//  Vive como sección `id="cuotas"` en la landing (`app/page.tsx`). */
export function PricingTiers() {
  return (
    <>
      <div className="grid items-stretch gap-6 md:grid-cols-3">
        {pricingTiers.map((tier, i) => (
          <Reveal key={tier.id} className="h-full" delay={i * 100}>
            <CardClub
              className="group flex h-full flex-col"
              highlighted={tier.highlighted}
            >
              <div className="mb-4 flex items-baseline justify-between">
                <CardClubTitle>{tier.name}</CardClubTitle>
                {tier.highlighted ? (
                  <Badge
                    className="p-1! capitalize"
                    color="accent"
                    size="sm"
                    variant="primary"
                  >
                    Popular
                  </Badge>
                ) : null}
              </div>
              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-foreground text-4xl font-bold">
                  <AnimatedNumber currency duration={1.4} value={tier.price} />
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
                    <Check className="text-primary mt-0.5 size-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <NextLink className="mt-6 block md:mt-auto" href={routes.login}>
                <Button
                  className="w-full font-semibold"
                  size="md"
                  variant={tier.highlighted ? 'primary' : 'outline'}
                >
                  Quiero este plan
                </Button>
              </NextLink>
            </CardClub>
          </Reveal>
        ))}
      </div>

      <p className="text-default-500 mt-10 text-center text-sm">
        * Los precios no incluyen el carnet de socio (pago único anual).
        Consultá por descuentos para grupos y empresas.
      </p>
    </>
  );
}
