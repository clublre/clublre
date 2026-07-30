'use client';

/**
 * FaqDisclosure — collapsible FAQ item built on HeroUI's `Disclosure`.
 *
 * Server components can't consume the Disclosure primitive because
 * it uses React-Aria's client hooks (useDisclosure, focus
 * management). This thin wrapper keeps the page server-rendered
 * while the interactive bit is a tiny 'use client' island.
 *
 * The surface container, dividers, and spacing live in the page so
 * this component stays focused on a single item.
 */

import { Disclosure } from '@heroui/react';

export interface FaqDisclosureProps {
  question: string;
  answer: string;
  /** Tailwind classes merged into the trigger button. */
  triggerClassName?: string;
  /** Tailwind classes merged into the body content. */
  contentClassName?: string;
}

export function FaqDisclosure({
  question,
  answer,
  triggerClassName,
  contentClassName,
}: FaqDisclosureProps) {
  return (
    <Disclosure
      className="group border-default-200 border-b last:border-b-0"
    >
      <Disclosure.Heading>
        <Disclosure.Trigger
          className={
            triggerClassName ??
            'text-foreground hover:bg-foreground/5 flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium transition-colors'
          }
        >
          <span>{question}</span>
        </Disclosure.Trigger>
      </Disclosure.Heading>
      <Disclosure.Content
        className={
          contentClassName ??
          'text-default-700 px-5 pb-5 text-sm leading-relaxed'
        }
      >
        {answer}
      </Disclosure.Content>
    </Disclosure>
  );
}
