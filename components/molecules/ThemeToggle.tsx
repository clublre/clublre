"use client";

import { type FC } from "react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";

import { IconButton } from "@/components/atoms/IconButton";
import { MoonFilledIcon, SunFilledIcon } from "@/components/ui/Icons";

export interface ThemeToggleProps {
  className?: string;
  /** Visual size of the icon. */
  size?: "sm" | "md" | "lg";
}

/**
 * ThemeToggle — light/dark toggle rendered as an icon-only button.
 *
 * Molecule: composes `IconButton` (atom) with `next-themes`.
 * Shows the sun icon when in light mode (click → dark) and the moon
 * icon when in dark mode (click → light).
 *
 * The icon colour follows `text-default-700` so it stays visible on
 * both light and dark surfaces without any bg-transparent hack.
 */
export const ThemeToggle: FC<ThemeToggleProps> = ({
  className,
  size = "md",
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const isLight = theme === "light" || isSSR;

  const onPress = () => {
    setTheme(isLight ? "dark" : "light");
  };

  return (
    <IconButton
      aria-label={`Cambiar a tema ${isLight ? "oscuro" : "claro"}`}
      className={className}
      size={size}
      variant='ghost'
      onPress={onPress}>
      <span
        aria-hidden='true'
        className='inline-flex text-default-700 transition-colors group-data-[hover=true]:text-foreground'>
        {isLight ? <SunFilledIcon size={20} /> : <MoonFilledIcon size={20} />}
      </span>
    </IconButton>
  );
};
