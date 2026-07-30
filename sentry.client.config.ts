// Inicialización de Sentry en el browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env['NEXT_PUBLIC_SENTRY_DSN'];

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Replay de sesiones: 1% normales, 100% cuando hay error.
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 1.0,
    debug: false,
  });
}
