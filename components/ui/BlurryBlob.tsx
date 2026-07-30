import { cn } from '@/lib/utils';

interface BlobProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Color del primer blob — suele ser sky de la marca. */
  firstBlobColor?: string;
  /** Color del segundo blob — suele ser blue (cobalto). */
  secondBlobColor?: string;
}

/** Blobs animados decorativos con colores de marca. Usar dentro de
 *  secciones hero. */
export default function BlurryBlob({
  className,
  firstBlobColor = 'bg-sky-300',
  secondBlobColor = 'bg-blue-400',
}: BlobProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="relative h-full w-full">
        <div
          className={cn(
            'animate-pop-blob absolute -top-28 -right-24 h-72 w-72 rounded-full p-8 opacity-45 mix-blend-multiply blur-3xl filter',
            className,
            firstBlobColor,
          )}
        />
        <div
          className={cn(
            'animate-pop-blob absolute -top-64 -left-40 h-72 w-72 rounded-full p-8 opacity-45 mix-blend-multiply blur-3xl filter',
            className,
            secondBlobColor,
          )}
        />
      </div>
    </div>
  );
}
