import { cn } from '@/lib/utils';

// Capa de iluminación ambiente — blobs radiales blur-3xl con mix-blend-screen.
// pointer-events-none + aria-hidden para no interferir con UI/lectores.

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
      size: 'h-[60rem] w-[60rem]',
    },
    // Blobs intermedios — sin estos, la página tiene un "gap" de
    // ~4700px sin iluminación entre los blobs top/bottom y se nota
    // un corte cuando scrolleás y pasás el borde de un blob.
    {
      position: 'top-1/3 right-1/3',
      color: 'bg-sky-400/3',
      size: 'h-[55rem] w-[55rem]',
    },
    {
      position: 'bottom-1/3 left-1/3',
      color: 'bg-cyan-400/3',
      size: 'h-[55rem] w-[55rem]',
    },
    {
      position: 'bottom-0 right-1/2',
      color: 'bg-cyan-400/2',
      size: 'h-[60rem] w-[60rem]',
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
        // Sin `overflow-hidden` — los blobs pueden extenderse más allá
        // del contenedor padre para que la iluminación fluya entre
        // secciones sin borde duro. `mix-blend-screen` los integra con
        // cualquier fondo debajo.
        'pointer-events-none absolute inset-0 mix-blend-screen',
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
