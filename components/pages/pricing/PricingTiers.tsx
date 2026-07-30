import NextLink from 'next/link';
import { Badge, Button } from '@heroui/react';
import { FaCheck } from 'react-icons/fa';

import { CardClub, CardClubTitle, CardClubBody } from '@/components/ui';
import { pricingTiers } from '@/data/club';
import { routes } from '@/lib/routes';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);

/**
 * PricingTiers — 3-column grid of pricing cards.
 *
 * Server component. Reads `pricingTiers` from `data/club.ts` directly
 * so the page stays a pure composition root. `formatPrice` lives here
 * (private to this file) since it's only used in the pricing card.
 *
 * Layout note: on mobile cards stack and the CTA sits right under
 * the feature list; from md up, `items-stretch` + `md:mt-auto` pins
 * every CTA to the bottom of the tallest sibling so all three CTAs
 * line up horizontally.
 */
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
                  <FaCheck className="text-primary mt-0.5 size-4 shrink-0" />
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
