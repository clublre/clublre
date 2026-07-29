import { tv } from "tailwind-variants";

/**
 * Heading variants — Club LRE
 *
 * Color variants reference the brand gradients defined in globals.css
 * (gradient-sky, gradient-amarillo) or Tailwind built-in palettes.
 */
export const title = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      violet: "bg-gradient-to-r from-fuchsia-400 to-purple-500",
      yellow: "bg-gradient-to-r from-yellow-300 to-yellow-500",
      sky: "gradient-sky",
      cyan: "bg-gradient-to-r from-cyan-400 to-cyan-500",
      green: "bg-gradient-to-r from-green-400 to-green-500",
      pink: "bg-gradient-to-r from-pink-400 to-rose-500",
      amarillo: "gradient-amarillo",
      foreground: "dark:from-white dark:to-neutral-600",
    },
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-4xl lg:text-5xl leading-9",
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [
        "violet",
        "yellow",
        "sky",
        "cyan",
        "green",
        "pink",
        "amarillo",
        "foreground",
      ],
      class: "bg-clip-text text-transparent",
    },
  ],
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
