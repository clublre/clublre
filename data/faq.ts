// FAQ — preguntas frecuentes. Separado del componente de página para
// que editores (o un futuro CMS) puedan actualizar copy sin tocar JSX.

export interface FaqItem {
  /** Pregunta visible en el summary colapsable. */
  q: string;
  /** Respuesta revelada al abrir. */
  a: string;
}

export const faqItems: ReadonlyArray<FaqItem> = [
  {
    q: '¿Cómo me asocio al club?',
    a: 'Podés acercarte a nuestra sede de Iriondo 375, Rosario, de Lunes a Viernes con tu DNI y una foto carnet. También podés escribirnos por Instagram para coordinar el trámite.',
  },
  {
    q: '¿Los menores de edad pueden asociarse?',
    a: 'Sí. La cuota infantil es para menores de 12 años e incluye la escuela deportiva. Para asociar a un menor se requiere la presencia de un adulto responsable con DNI.',
  },
  {
    q: '¿Qué incluye la cuota familiar?',
    a: 'La cuota familiar cubre a cuatro integrantes del grupo familiar e incluye pileta, todas las disciplinas y los eventos sociales del club.',
  },
  {
    q: '¿Hay matrícula de ingreso?',
    a: 'No hay matrícula. Solo se abona el carnet de socio, que es un pago único anual, y la cuota mensual correspondiente al plan elegido.',
  },
  {
    q: '¿Puedo probar una actividad antes de asociarme?',
    a: 'Sí, ofrecemos clases de prueba gratuitas en la mayoría de las disciplinas. Coordiná día y horario escribiéndonos por Instagram a @clubestudiantilrosario.',
  },
];
