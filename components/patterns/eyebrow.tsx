import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> {
  /** Brand color accent. */
  tone?: "sky" | "amarillo" | "default";
}

const toneMap = {
  default: "text-default-500",
  sky: "text-primary",
  amarillo: "text-amber-600",
};

/**
 * Eyebrow — small uppercase label that sits above a heading.
 * Uses the design system typography scale.
 */
export function Eyebrow({
  tone = "default",
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <span
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.2em]",
        toneMap[tone],
        className,
      )}
      {...props}>
      {children}
    </span>
  );
}
