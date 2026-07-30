import { Container } from '@/components/ui/Container';

/**
 * Root loading UI — Next.js renders this while any segment without
 * its own `loading.tsx` is being prepared (home, about, pricing).
 * Segment-specific overrides (e.g. `app/blog/loading.tsx` for the
 * post detail) take precedence inside their own subtree.
 *
 * Three skeleton blocks mirror the rhythm of a typical section
 * header so the perceived layout doesn't shift when content lands.
 */
export default function RootLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="py-24 md:py-32"
      role="status"
    >
      <Container className="text-center" size="md">
        <div
          aria-hidden
          className="bg-default-200 mx-auto mb-4 h-3 w-24 animate-pulse rounded"
        />
        <div
          aria-hidden
          className="bg-default-300 mx-auto mb-6 h-10 w-3/4 animate-pulse rounded"
        />
        <div
          aria-hidden
          className="bg-default-200 mx-auto h-4 w-1/2 animate-pulse rounded"
        />
        <span className="sr-only">Cargando contenido</span>
      </Container>
    </div>
  );
}
