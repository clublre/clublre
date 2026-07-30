// Variantes de heading (`title` + `subtitle`) reutilizables.
// Los colores usan solo paletas Tailwind built-in (sky, blue, etc.)
// para no introducir tokens de marca custom.

import { tv } from 'tailwind-variants';

export const title = tv({
  base: 'tracking-tight inline-block font-semibold text-balance',
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
      sm: 'text-3xl lg:text-4xl leading-tight',
      // H2: 3xl en mobile para ser visiblemente más chico que H1,
      // escalando a 5xl en desktop. leading-[1.15] da aire al
      // envolver a dos líneas.
      md: 'text-3xl lg:text-5xl leading-[1.15]',
      lg: 'text-4xl lg:text-6xl leading-tight',
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
      // leading-[inherit] mantiene el span del gradiente en la
      // misma línea base que el heading padre; sin esto el span
      // inline-block desarrolla su propio line-height.
      class: 'bg-clip-text text-transparent leading-[inherit]',
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
