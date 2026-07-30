import { tv } from 'tailwind-variants';

/**
 * Heading variants — Club LRE
 *
 * Color variants reference the brand gradients defined in globals.css
 * (gradient-sky, gradient-amarillo) or Tailwind built-in palettes.
 */
export const title = tv({
  base: 'tracking-tight inline font-semibold',
  variants: {
    color: {
      violet: 'bg-gradient-to-r from-fuchsia-400 to-purple-500',
      // Cobalt — same family as the brand.amarillo token; now uses
      // a dedicated gradient utility for text-clip variants.
      cobalt: 'bg-gradient-to-r from-[#3A6BE0] to-[#1B4FCF]',
      sky: 'gradient-sky',
      cyan: 'bg-gradient-to-r from-cyan-400 to-cyan-500',
      green: 'bg-gradient-to-r from-green-400 to-green-500',
      pink: 'bg-gradient-to-r from-pink-400 to-rose-500',
      amarillo: 'gradient-amarillo',
    },
    size: {
      sm: 'text-3xl lg:text-4xl',
      // H2: 3xl on mobile so it's visibly smaller than H1 (4xl),
      // scaling up to 5xl on desktop. The leading-9 (2.25rem)
      // gives a confident, sub-heading rhythm.
      md: 'text-3xl lg:text-5xl leading-9',
      lg: 'text-4xl lg:text-6xl',
    },
    fullWidth: {
      true: 'w-full block',
    },
  },
  defaultVariants: {
    size: 'md',
  },
  compoundVariants: [
    {
      color: ['violet', 'cobalt', 'sky', 'cyan', 'green', 'pink', 'amarillo'],
      class: 'bg-clip-text text-transparent',
    },
  ],
});

export const subtitle = tv({
  base: 'w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full',
  variants: {
    fullWidth: {
      true: '!w-full',
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
