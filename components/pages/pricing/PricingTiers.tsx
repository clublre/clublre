import NextLink from 'next/link';
import { Badge, Button } from '@heroui/react';
import { Check } from '@/components/ui';

import { CardClub, CardClubTitle, CardClubBody } from '@/components/ui';
import { pricingTiers } from '@/data/club';
import { routes } from '@/lib/routes';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);

/** Grid de 3 columnas con los planes de cuota. Server component que
 *  lee `pricingTiers` directo de `data/club.ts`. El `items-stretch` +
 *  `md:mt-auto` alinea los CTAs al fondo del card más alto. */
export function PricingTiers() {
  return (
    <>
      <div className="grid items-stretch gap-6 md:grid-cols-3">
        {pricingTiers.map((tier) => (
          <CardClub
            key={tier.id}
            className="flex flex-col"
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
                  <Check className="text-primary mt-0.5 size-4 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <NextLink
              className="mt-6 block md:mt-auto"
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
    </>
  );
}
