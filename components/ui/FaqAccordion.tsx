'use client';

// FAQ colapsable sobre el `Accordion` de HeroUI. Necesita `'use client'`
// porque Accordion usa hooks internos.

import { Accordion } from '@heroui/react';

export interface FaqItem {
  /** Key único — lo usa React y el estado de expansión del Accordion. */
  id: string;
  /** Pregunta visible en el trigger. */
  question: string;
  /** Respuesta que se revela al expandir. */
  answer: string;
}

export interface FaqAccordionProps {
  items: ReadonlyArray<FaqItem>;
  /** Permite expandir varios items a la vez. Default: uno solo. */
  allowMultiple?: boolean;
  /** Clases mergeadas al `<Accordion>` raíz. */
  className?: string;
  /** Clases mergeadas al trigger de cada item. */
  triggerClassName?: string;
  /** Clases mergeadas al body del panel de cada item. */
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
              {/* Indicator al final para que flex lo clave al borde
                  derecho del trigger. ChevronDown rota 180° al
                  expandirlo (lo maneja HeroUI via React-Aria). */}
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
