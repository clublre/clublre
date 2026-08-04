import { cn } from '@/lib/utils';

// Capa de iluminación ambiente por página: dos blobs radiales con
// blur-3xl y alpha bajo, renderizados con mix-blend-screen.
// `pointer-events-none` + `aria-hidden` para no bloquear clicks ni
// lectores de pantalla.

export type AmbientPreset = 'home' | 'blog' | 'about';

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
      color: 'bg-blue-700/10',
      size: 'h-[32rem] w-[32rem]',
    },
  ],
  blog: [
    {
      position: '-top-32 left-1/4',
      color: 'bg-sky-300/8',
      size: 'h-[26rem] w-[26rem]',
    },
    {
      position: 'bottom-1/3 -left-32',
      color: 'bg-blue-600/8',
      size: 'h-[30rem] w-[30rem]',
    },
  ],
  about: [
    {
      position: 'top-0 left-1/2',
      color: 'bg-sky-500/4',
      size: 'h-[40rem] w-[40rem]',
    },
    {
      position: 'bottom-0 right-1/2',
      color: 'bg-cyan-400/2',
      size: 'h-[40rem] w-[40rem]',
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
