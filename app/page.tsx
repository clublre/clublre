import NextLink from 'next/link';
import { Button, Link } from '@heroui/react';
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaRunning,
  FaUsers,
  FaShieldAlt,
  FaInstagram,
  FaQuoteLeft,
  FaBasketballBall,
  FaSwimmer,
  FaVolleyballBall,
  FaTableTennis,
  FaFistRaised,
} from 'react-icons/fa';

import {
  Section,
  Container,
  Eyebrow,
  SectionHeader,
  CardClub,
  CardClubHeader,
  CardClubTitle,
  CardClubBody,
  BlurryBlob,
} from '@/components/ui';
import { title, subtitle } from '@/components/primitives';
import { activities } from '@/data/club';
import { postsNewestFirst } from '@/data/posts';
import { cn } from '@/lib/utils';
import type { Route } from 'next';

/** Trust strip — quick social proof between hero and activities. */
const STATS = [
  {
    icon: FaUsers,
    value: '3.500+',
    label: 'Socios activos',
  },
  {
    icon: FaShieldAlt,
    value: '1959',
    label: 'Año de fundación',
  },
  {
    icon: FaMapMarkerAlt,
    value: 'Iriondo 375',
    label: 'Rosario, Santa Fe',
  },
] as const;

/** Per-activity icon + accent. Single source of truth so cards stay
 *  visually consistent (no emojis, proper FA6 weight). */
const ACTIVITY_ICONS: Record<
  string,
  { icon: typeof FaRunning; accent: 'sky' | 'amarillo' }
> = {
  basquet: { icon: FaBasketballBall, accent: 'sky' },
  natacion: { icon: FaSwimmer, accent: 'sky' },
  gimnasia: { icon: FaFistRaised, accent: 'sky' },
  voley: { icon: FaVolleyballBall, accent: 'amarillo' },
  'tenis-de-mesa': { icon: FaTableTennis, accent: 'amarillo' },
  karate: { icon: FaShieldAlt, accent: 'amarillo' },
};

export default function HomePage() {
  const latestPosts = postsNewestFirst.slice(0, 3);

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <Section
        as="section"
        className="relative isolate overflow-hidden"
        spacing="lg"
        variant="gradient"
      >
        <BlurryBlob />

        <Container className="animate-fade-in relative z-10 text-center">
          {/* Eyebrow with shield icon — establishes brand from the first pixel */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <FaShieldAlt aria-hidden="true" className="text-primary size-3.5" />
            <Eyebrow className="text-default-100 m-0" tone="default">
              Club Los Rosarinos Estudiantil
            </Eyebrow>
          </div>

          <h1
            className={title({
              size: 'lg',
              class: 'mx-auto block max-w-4xl leading-[1.05]',
            })}
            style={{ viewTransitionName: 'page-title' }}
          >
            Más de 80 años{' '}
            <span className={title({ color: 'sky' })}>formando comunidad</span>
          </h1>

          <p
            className={subtitle({
              class: 'text-default-100 mx-auto mt-6 max-w-xl text-center',
            })}
          >
            Deportes, recreación y vida social para toda la familia en el
            corazón de Rosario.
          </p>

          {/* Primary CTA + secondary text-link (no competing buttons) */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <NextLink href="/pricing">
              <Button
                className="shadow-club-lg font-semibold"
                size="lg"
                variant="primary"
              >
                Conocé las cuotas
                <FaArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Button>
            </NextLink>
            <NextLink
              className="text-default-100 hover:text-foreground text-sm font-medium transition-colors sm:ml-2"
              href={'/about' as Route}
            >
              o leé nuestra historia →
            </NextLink>
          </div>
        </Container>
      </Section>

      {/* ───────────── Trust strip ─────────────
       * Overlaps the hero from the top (negative margin) but now
       * has proper `pb-` so it doesn't touch the gray Actividades
       * section below. The cards also lost the hard `border-default-200`
       * for a softer translucent style that pops on the dark hero. */}
      <Section
        as="section"
        className="relative z-10 -mt-12 pb-16 sm:-mt-16 sm:pb-20"
        spacing="none"
      >
        <Container size="xl">
          <div
            className={cn(
              'bg-surface/95 supports-backdrop-filter:bg-surface/80 shadow-club-lg grid gap-px overflow-hidden rounded-2xl backdrop-blur-md sm:grid-cols-3',
            )}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 px-6 py-6 text-center sm:py-8"
              >
                <span className="bg-primary/10 text-primary inline-flex size-12 shrink-0 items-center justify-center rounded-xl">
                  <stat.icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="text-default-600 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ───────────── Actividades ───────────── */}
      <Section as="section" id="actividades" spacing="lg">
        <Container>
          {/* Section header — centred (matches the hero + final CTA). */}
          <SectionHeader
            description="Desde básquet federado y natación hasta karate, vóley y escuelas de iniciación deportiva."
            eyebrow="Nuestras disciplinas"
            heading="Actividades para todas las edades"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => {
              const meta = ACTIVITY_ICONS[activity.id] ?? {
                icon: FaRunning,
                accent: 'sky' as const,
              };
              const Icon = meta.icon;
              return (
                <CardClub
                  key={activity.id}
                  className="flex flex-col"
                >
                  <CardClubHeader>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'inline-flex size-10 items-center justify-center rounded-lg',
                        meta.accent === 'sky'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-amarillo/10 text-amarillo',
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <CardClubTitle>{activity.name}</CardClubTitle>
                  </CardClubHeader>
                  <CardClubBody className="grow">
                    {activity.description}
                  </CardClubBody>
                </CardClub>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ───────────── Últimas novedades ─────────────
       * NEW: pulls the 3 most recent posts from the blog so the
       * home page actually surfaces the editorial content. Drives
       * SEO (internal links + fresh content signals) and keeps the
       * site feeling alive between posts. */}
      <Section as="section" spacing="lg">
        <Container>
          <SectionHeader
            eyebrow="Últimas novedades"
            heading="Lo último del club"
            trailing={
              <NextLink
                className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                href={'/blog' as Route}
              >
                Ver todos los posts
                <FaArrowRight aria-hidden="true" className="size-3" />
              </NextLink>
            }
          />

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <li key={post.slug}>
                <NextLink
                  aria-label={`Leer ${post.title}`}
                  className={cn(
                    'group bg-surface shadow-club relative flex h-full flex-col overflow-hidden rounded-xl p-6',
                    'hover:shadow-club-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5',
                  )}
                  href={`/blog/${post.slug}` as Route}
                >
                  <div className="text-default-500 mb-2 flex items-center gap-3 text-xs">
                    <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 font-medium tracking-wider uppercase">
                      {post.category}
                    </span>
                    <time dateTime={post.date}>
                      {new Intl.DateTimeFormat('es-AR', {
                        day: 'numeric',
                        month: 'short',
                      }).format(new Date(post.date))}
                    </time>
                  </div>
                  <h3 className="text-foreground group-hover:text-primary mb-2 text-lg font-semibold transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-default-600 line-clamp-3 grow text-sm">
                    {post.excerpt}
                  </p>
                  <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
                    Leer artículo
                    <FaArrowRight
                      aria-hidden="true"
                      className="size-3 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </NextLink>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ───────────── CTA final ─────────────
       * Cleaned up: dropped the dead text-foreground/hover
       * override, single primary action + an Instagram link as
       * the secondary route for users who'd rather DM. */}
      <Section as="section" spacing="md">
        <Container>
          <div className="from-primary via-primary/50 to-primary/40 text-primary-foreground shadow-club-lg relative overflow-hidden rounded-3xl bg-linear-to-br p-10 text-center md:p-16">
            {/* Decorative blurred shapes */}
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 size-64 rounded-full bg-white/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl"
            />

            {/* Decorative quote */}
            <FaQuoteLeft
              aria-hidden="true"
              className="text-primary-foreground/15 mx-auto mb-4 size-10"
            />

            <div className="relative">
              <Eyebrow className="mb-4 block" tone="default">
                Sumate al club
              </Eyebrow>
              <h2 className="mx-auto mb-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
                Tres generaciones ya pasaron por acá.
              </h2>
              <p className="text-primary-foreground/90 mx-auto mb-8 max-w-xl text-base opacity-90 md:text-lg">
                Te invitamos a ser parte. Conocé nuestras cuotas y empezá a
                disfrutar del club hoy mismo.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <NextLink href="/pricing">
                  <Button className="font-semibold" size="lg" variant="primary">
                    Quiero asociarme
                    <FaArrowRight aria-hidden="true" className="ml-2 size-4" />
                  </Button>
                </NextLink>
                <Link
                  aria-label="Instagram (se abre en una pestaña nueva)"
                  className="text-primary-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                  href="https://www.instagram.com/clubestudiantilrosario/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FaInstagram aria-hidden="true" className="size-4" />
                  @clubestudiantilrosario
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
