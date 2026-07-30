import { tv } from 'tailwind-variants';

/**
 * Heading variants — Club LRE
 *
 * Color variants use Tailwind built-in palettes only (sky, blue, etc.)
 * so the heading text matches the rest of the site without custom
 * brand tokens. Compound variant adds `bg-clip-text text-transparent`
 * so the gradient actually shows through the text.
 */
export const title = tv({
  base: 'tracking-tight inline font-semibold',
  variants: {
    color: {
      sky: 'bg-gradient-to-r from-sky-500 to-blue-700',
      blue: 'bg-gradient-to-r from-blue-500 to-blue-700',
      violet: 'bg-gradient-to-r from-fuchsia-400 to-purple-500',
      cyan: 'bg-gradient-to-r from-cyan-400 to-cyan-500',
      green: 'bg-gradient-to-r from-green-400 to-green-500',
      pink: 'bg-gradient-to-r from-pink-400 to-rose-500',
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
      color: ['sky', 'blue', 'violet', 'cyan', 'green', 'pink'],
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
