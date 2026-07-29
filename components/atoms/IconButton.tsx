"use client";

import { type FC, type ReactNode } from "react";
import { Button } from "@heroui/react";

import { cn } from "@/lib/utils";

type HeroUIVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost"
  | "danger";

export interface IconButtonProps {
  /** Accessible label — required for icon-only buttons. */
  "aria-label": string;
  /** Icon or any node rendered inside the button. */
  children: ReactNode;
  /** Visual variant (HeroUI). Defaults to `ghost` for nav bar usage. */
  variant?: HeroUIVariant;
  /** Size token. */
  size?: "sm" | "md" | "lg";
  /** Press handler. */
  onPress?: () => void;
  /** Disabled flag. */
  isDisabled?: boolean;
  /** Optional className for one-off overrides. */
  className?: string;
}

/**
 * IconButton — square button that renders a single icon.
 *
 * Atomic-level primitive built on top of HeroUI's `Button` with
 * `isIconOnly`. Use for nav toggles, theme switches, social links, etc.
 *
 * Always supply `aria-label` — icon-only buttons have no visible text.
 */
export const IconButton: FC<IconButtonProps> = ({
  "aria-label": ariaLabel,
  children,
  variant = "ghost",
  size = "md",
  onPress,
  isDisabled = false,
  className,
}) => {
  return (
    <Button
      isIconOnly
      aria-label={ariaLabel}
      className={cn(
        // Make the button truly square so the icon is visually centered.
        "min-w-0 p-0",
        // Use a hover background that contrasts both themes.
        "data-[hover=true]:bg-default-100",
        className,
      )}
      isDisabled={isDisabled}
      size={size}
      variant={variant}
      onPress={onPress}>
      {children}
    </Button>
  );
};