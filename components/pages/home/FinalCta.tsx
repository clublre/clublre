import NextLink from 'next/link';
import Image from 'next/image';
import { Button, Card, Link } from '@heroui/react';
import { FaArrowRight, FaInstagram, FaQuoteLeft } from 'react-icons/fa';

import { Section, Container, Eyebrow } from '@/components/ui';
import { routes } from '@/lib/routes';

/**
 * FinalCta — primary call-to-action at the bottom of the home
 * page. Plain div with the `.gradient-border-sky` utility (the
 * sky→blue 1.5px frame) plus two decorative layers behind the
 * content:
 *
 *   1. A soft primary gradient (`from-primary/15` → transparent)
 *      that tints the `bg-surface` without flooding the card.
 *   2. The club logo (`/logo2.jpeg`) at ~7% opacity, blurred and
 *      desaturated, as a centred watermark that nods to the brand.
 *
 * Both layers are `aria-hidden` + `pointer-events-none` so they
 * never interfere with screen readers or clicks. `overflow-hidden`
 * on the card clips the watermark so it never bleeds past the
 * rounded corners of the gradient border.
 */
export function FinalCta() {
  return (
    <Section as="section" spacing="md">
      <Container>
        <Card className="bg-sky-soft relative overflow-hidden p-10 text-center shadow-none! md:p-16">
          {/* Soft primary gradient — sits on top of the surface,
              underneath the content. */}
          <div
            aria-hidden="true"
            // className="from-primary/15 via-primary/8 absolute inset-0 bg-linear-to-br to-transparent"
          />

          {/* Watermark logo — centred, circular crop matching the
              navbar logo (`rounded-full`), heavily desaturated so it
              reads as a brand texture instead of a competing image. */}
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[40%] max-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-[1px] grayscale select-none"
            height={500}
            src="/logo2.jpeg"
            width={500}
          />

          {/* Content sits in its own stacking layer so it always
              paints above the decorative bg + watermark. */}
          <div className="relative">
            <FaQuoteLeft
              aria-hidden="true"
              className="text-primary/40 mx-auto mb-4 size-10"
            />

            <Eyebrow className="mb-4 block" tone="sky">
              Sumate al club
            </Eyebrow>
            <h2 className="text-foreground mx-auto mb-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
              Tres generaciones ya pasaron por acá.
            </h2>
            <p className="text-default-600 mx-auto mb-8 max-w-xl text-base md:text-lg">
              Te invitamos a ser parte. Conocé nuestras cuotas y empezá a
              disfrutar del club hoy mismo.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <NextLink href={routes.pricing}>
                <Button className="font-semibold" size="lg" variant="primary">
                  Quiero asociarme
                  <FaArrowRight aria-hidden="true" className="ml-2 size-4" />
                </Button>
              </NextLink>
              <Link
                aria-label="Instagram (se abre en una pestaña nueva)"
                className="text-default-600 hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                href="https://www.instagram.com/clubestudiantilrosario/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaInstagram aria-hidden="true" className="size-4" />
                @clubestudiantilrosario
              </Link>
            </div>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
