'use client';

/**
 * FaqAccordion — collapsible FAQ group built on HeroUI's `Accordion`.
 *
 * `Accordion` is the semantically correct primitive for a list of
 * related items (faq, settings panels, etc.) and ships a built-in
 * chevron + dividers between items, which would otherwise need to
 * be hand-rolled with <details>/<summary>. Server components
 * can't render it directly because Accordion uses client hooks.
 *
 * The surface container, background, and spacing live in the
 * page so this component stays focused on the items themselves.
 *
 * Pass an array of `{ question, answer }` to render. Defaults to
 * `variant="default"` + the keyboard / focus behaviour that the
 * user expects from a real FAQ.
 */

import { Accordion } from '@heroui/react';

export interface FaqItem {
  /** Unique key — used by React and by the Accordion's expansion state. */
  id: string;
  /** Question text shown in the trigger. */
  question: string;
  /** Answer body revealed when the item is expanded. */
  answer: string;
}

export interface FaqAccordionProps {
  items: ReadonlyArray<FaqItem>;
  /** Allow expanding several items at once. Default: only one open at a time. */
  allowMultiple?: boolean;
  /** Tailwind classes merged into the root `<Accordion>`. */
  className?: string;
  /** Tailwind classes merged into each item's trigger. */
  triggerClassName?: string;
  /** Tailwind classes merged into each item's panel body. */
  bodyClassName?: string;
}

export function FaqAccordion({
  items,
  allowMultiple = false,
  className,
  triggerClassName,
  bodyClassName,
}: FaqAccordionProps) {
  return (
    <Accordion
      allowsMultipleExpanded={allowMultiple}
      className={
        className ?? 'bg-surface shadow-club overflow-hidden rounded-2xl'
      }
    >
      {items.map((item) => (
        <Accordion.Item key={item.id} id={item.id}>
          <Accordion.Heading>
            <Accordion.Trigger
              className={
                triggerClassName ??
                'text-foreground hover:bg-foreground/5 flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium transition-colors'
              }
            >
              <span className="grow">{item.question}</span>
              {/* Indicator rendered last so flexbox pins the chevron
                  to the right edge of the trigger. The internal
                  ChevronDown rotates 180deg when the item is
                  expanded (HeroUI handles the state via React-Aria). */}
              <Accordion.Indicator className="text-default-600 shrink-0 transition-transform" />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body
              className={
                bodyClassName ??
                'text-default-700 px-5 pb-5 text-sm leading-relaxed'
              }
            >
              {item.answer}
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
