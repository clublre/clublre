import type { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

/**
 * Section — semantic page section wrapper.
 * Centralises vertical spacing and background variants so pages stay
 * consistent. Built on tailwind-variants so the public API can be
 * extended with `VariantProps<typeof section>`.
 */
const section = tv({
  base: "",
  variants: {
    variant: {
      default: "bg-background",
      muted: "bg-surface-muted",
      gradient: "gradient-radial-sky bg-background",
      transparent: "bg-transparent",
    },
    spacing: {
      sm: "py-10 md:py-14",
      md: "py-16 md:py-20",
      lg: "py-20 md:py-28",
    },
  },
  defaultVariants: {
    variant: "default",
    spacing: "md",
  },
});

export interface SectionProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof section> {
  /** Render as `<section>` (default) or another element. */
  as?: "section" | "div" | "article" | "main";
}

export function Section({
  variant,
  spacing,
  as: Tag = "section",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(section({ variant, spacing }), className)}
      {...props}>
      {children}
    </Tag>
  );
}
