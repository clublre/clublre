import { Container } from '@/components/ui/Container';

/**
 * Route-segment loading UI for `/blog/[slug]`.
 *
 * Triggered automatically by Next.js while the route segment is
 * being prepared. We render an inert skeleton with the same
 * typographic rhythm as the final post so the perceived layout
 * stays stable between the spinner state and the hydrated content.
 */
export default function BlogSlugLoading() {
  return (
    <div className="py-16 md:py-24">
      <Container size="md">
        <div
          aria-hidden
          className="bg-default-200 mb-6 inline-block h-3 w-32 animate-pulse rounded"
        />
        <div
          aria-hidden
          className="bg-default-300 mb-3 inline-block h-3 w-24 animate-pulse rounded"
        />
        <div
          aria-hidden
          className="bg-default-200 mb-8 h-12 w-3/4 animate-pulse rounded"
        />
        <div
          aria-hidden
          className="bg-default-200 mb-3 h-4 w-full animate-pulse rounded"
        />
        <div
          aria-hidden
          className="bg-default-200 mb-3 h-4 w-11/12 animate-pulse rounded"
        />
        <div
          aria-hidden
          className="bg-default-200 mb-3 h-4 w-10/12 animate-pulse rounded"
        />
      </Container>
    </div>
  );
}
