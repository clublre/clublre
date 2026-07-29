import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Visual variant — controls background, padding and divider. */
  variant?: "default" | "muted" | "gradient" | "transparent";
  /** Vertical padding size. */
  spacing?: "sm" | "md" | "lg";
  /** Render as `<section>` (default) or another element. */
  as?: "section" | "div" | "article" | "main";
}

const spacingMap = {
  sm: "py-10 md:py-14",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-28",
};

const variantMap = {
  default: "bg-background",
  muted: "bg-surface-muted",
  gradient: "gradient-radial-sky bg-background",
  transparent: "bg-transparent",
};

/**
 * Section — semantic page section wrapper.
 * Centralises vertical spacing and background variants so pages stay
 * consistent.
 */
export function Section({
  variant = "default",
  spacing = "md",
  as: Tag = "section",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(spacingMap[spacing], variantMap[variant], className)}
      {...props}>
      {children}
    </Tag>
  );
}
