# Emails transaccionales

Templates escritos con [React Email](https://react.email/) — componentes React que se renderizan a HTML + texto plano. Se envían vía [Resend](https://resend.com) (free tier, 3.000 emails/mes).

## Estructura esperada

```
emails/
├── README.md
├── components/                # building blocks compartidos
│   ├── EmailLayout.tsx
│   ├── EmailButton.tsx
│   └── EmailFooter.tsx
├── welcome.tsx                # "Fuiste aprobado, bienvenido"
├── application-received.tsx   # "Recibimos tu solicitud" (al aplicante)
├── application-rejected.tsx   # "Tu solicitud no fue aprobada"
├── account-suspended.tsx      # "Tu cuenta fue suspendida"
├── listing-reported.tsx       # "Nueva publicación reportada" (a admins)
└── listing-hidden.tsx         # "Tu publicación fue ocultada"
```

## Cómo se usa

```tsx
import { resend } from '@/lib/resend';
import { WelcomeEmail } from '@/emails/welcome';

await resend.emails.send({
  from: process.env['RESEND_FROM_EMAIL']!,
  to: member.email,
  subject: '¡Fuiste aprobado!',
  react: WelcomeEmail({ name: member.full_name }),
});
```

## Diseño

- Mobile-first (la mayoría abre desde el celu).
- Un solo CTA principal por email.
- Link de "ver en el navegador" (Resend lo agrega automáticamente).
- Plain text fallback (lo genera React Email desde el JSX).
- Footer con unsubscribe a comunicaciones (transaccional no requiere, pero informativo).

## Estado

⏸ Vacía — se pobla en Semana 5 del roadmap (STACK.md §8) cuando se wiree Resend.
