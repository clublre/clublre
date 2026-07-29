import { tv } from "tailwind-variants";

/**
 * Heading variants — Club LRE
 *
 * Color variants reference the brand gradients defined in globals.css
 * (gradient-estu-1, gradient-estu-2). Tailwind v4 doesn't ship
 * arbitrary `from-[#xxx]` utilities by default the same way v3 did;
 * we map colors to utility classes that resolve to our @theme tokens.
 */
export const title = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      violet: "bg-gradient-to-r from-fuchsia-400 to-purple-500",
      yellow: "bg-gradient-to-r from-yellow-300 to-yellow-500",
      blue: "bg-gradient-to-r from-sky-400 to-blue-600",
      cyan: "bg-gradient-to-r from-cyan-400 to-cyan-500",
      green: "bg-gradient-to-r from-green-400 to-green-500",
      pink: "bg-gradient-to-r from-pink-400 to-rose-500",
      estu1: "gradient-estu-1",
      estu2: "gradient-estu-2",
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
        "blue",
        "cyan",
        "green",
        "pink",
        "estu1",
        "estu2",
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
