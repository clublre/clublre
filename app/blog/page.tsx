import NextLink from "next/link";

import {
  Section,
  Container,
  Eyebrow,
  CardClub,
  CardClubTitle,
  CardClubBody,
} from "@/components/ui";
import { title } from "@/components/primitives";
import { postsNewestFirst } from "@/config/posts";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));

export default function BlogPage() {
  return (
    <>
      <Section as='section' spacing='md'>
        <Container>
          <Eyebrow className='mb-3 block' tone='sky'>
            Novedades
          </Eyebrow>
          <h1
            className={title({
              size: "lg",
              class: "block max-w-3xl leading-[1.1]",
            })}>
            Blog del
            <span className={title({ color: "sky" })}>club</span>
          </h1>
          <p className='mt-4 max-w-2xl text-default-600'>
            Novedades institucionales, resultados deportivos y todo lo que pasa
            en el club.
          </p>
        </Container>
      </Section>

      <Section as='section' spacing='lg' variant='muted'>
        <Container>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {postsNewestFirst.map((post) => (
              <CardClub
                key={post.slug}
                accent={post.accent}
                className='flex flex-col'>
                <div className='mb-3 flex items-center justify-between text-xs'>
                  <span className='rounded-full bg-sky-soft px-2.5 py-1 font-medium uppercase tracking-wider text-sky-soft-fg'>
                    {post.category}
                  </span>
                  <time className='text-default-500' dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                </div>
                <CardClubTitle className='hover:text-primary'>
                  <NextLink href={`/blog/${post.slug}` as never}>
                    {post.title}
                  </NextLink>
                </CardClubTitle>
                <CardClubBody className='mt-3 grow'>
                  {post.excerpt}
                </CardClubBody>
                <NextLink
                  className='mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline'
                  href={`/blog/${post.slug}` as never}>
                  Leer más →
                </NextLink>
              </CardClub>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
