import { cn } from '@/lib/utils';

/**
 * AmbientBlobs — per-page ambient lighting layer.
 *
 * Two radial blobs (heavy blur-3xl, low alpha) rendered AFTER
 * the page content with mix-blend-screen. The blend screen-
 * multiplies the backdrop: where a blob overlaps the dark bg
 * it lightens to a soft sky tint, where it overlaps white
 * text the screen result stays white (text stays readable).
 *
 * Implementation notes:
 * - absolute inset-0 (not fixed, not z-indexed) keeps the
 *   wrapper in the body stacking context so mix-blend can
 *   reach the content behind it.
 * - Rendered after sections in each page so it paints on
 *   top and has sections as part of the blend backdrop.
 * - pointer-events-none + aria-hidden so it never blocks
 *   clicks or screen reader output.
 */

export type AmbientPreset = 'home' | 'pricing' | 'blog' | 'about';

interface BlobConfig {
  position: string;
  color: string;
  size: string;
}

const PRESETS: Record<AmbientPreset, ReadonlyArray<BlobConfig>> = {
  home: [
    {
      position: '-top-32 left-1/4',
      color: 'bg-sky-400/15',
      size: 'h-[28rem] w-[28rem]',
    },
    {
      position: 'bottom-0 -right-32',
      color: 'bg-blue-700/15',
      size: 'h-[32rem] w-[32rem]',
    },
  ],
  pricing: [
    {
      position: 'top-1/4 -right-32',
      color: 'bg-cyan-400/12',
      size: 'h-[30rem] w-[30rem]',
    },
    {
      position: '-bottom-32 left-1/4',
      color: 'bg-sky-500/12',
      size: 'h-[28rem] w-[28rem]',
    },
  ],
  blog: [
    {
      position: '-top-32 left-1/3',
      color: 'bg-sky-300/12',
      size: 'h-[26rem] w-[26rem]',
    },
    {
      position: 'bottom-1/3 -left-32',
      color: 'bg-blue-600/12',
      size: 'h-[30rem] w-[30rem]',
    },
  ],
  about: [
    {
      position: 'top-1/4 -left-32',
      color: 'bg-sky-500/15',
      size: 'h-[30rem] w-[30rem]',
    },
    {
      position: '-bottom-24 right-1/4',
      color: 'bg-cyan-400/12',
      size: 'h-[28rem] w-[28rem]',
    },
  ],
};

export interface AmbientBlobsProps {
  preset: AmbientPreset;
  className?: string;
}

export function AmbientBlobs(props: AmbientBlobsProps) {
  const blobs = PRESETS[props.preset];
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen',
        props.className,
      )}
    >
      {blobs.map(function (blob, i) {
        return (
          <div
            key={i}
            className={cn(
              'absolute rounded-full blur-3xl',
              blob.position,
              blob.color,
              blob.size,
            )}
          />
        );
      })}
    </div>
  );
}
