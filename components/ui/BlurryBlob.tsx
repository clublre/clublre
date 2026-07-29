import { cn } from "@/lib/utils";

interface BlobProps extends React.HTMLAttributes<HTMLDivElement> {
  /** First blob colour — usually the brand sky. */
  firstBlobColor?: string;
  /** Second blob colour — usually amarillo. */
  secondBlobColor?: string;
}

/**
 * BlurryBlob — decorative animated background blobs using brand colours.
 * Used inside hero sections.
 */
export default function BlurryBlob({
  className,
  firstBlobColor = "bg-sky-300",
  secondBlobColor = "bg-amber-300",
}: BlobProps) {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 overflow-hidden'>
      <div className='relative h-full w-full'>
        <div
          className={cn(
            "absolute -right-24 -top-28 h-72 w-72 animate-pop-blob rounded-full p-8 opacity-45 mix-blend-multiply blur-3xl filter",
            className,
            firstBlobColor,
          )}
        />
        <div
          className={cn(
            "absolute -left-40 -top-64 h-72 w-72 animate-pop-blob rounded-full p-8 opacity-45 mix-blend-multiply blur-3xl filter",
            className,
            secondBlobColor,
          )}
        />
      </div>
    </div>
  );
}
