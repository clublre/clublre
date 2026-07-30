// JSX type declarations for the `<phantom-ui>` Web Component.
// Lives at the project root so TypeScript picks it up automatically
// (Next 16 / `tsc --noEmit` walks the entire project).
//
// phantom-ui exports the typed props under `PhantomUiAttributes` from
// `@aejkatappaja/phantom-ui`. We augment React's `JSX.IntrinsicElements`
// so every JSX call site gets autocompletion and type-safety without
// needing the strict Lit types installed.

import type { PhantomUiAttributes } from '@aejkatappaja/phantom-ui';

declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface IntrinsicElements {
      'phantom-ui': PhantomUiAttributes;
    }
  }
}
