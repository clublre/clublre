// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env['NEXT_PUBLIC_SENTRY_DSN'];

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    // We recommend adjusting this value in production, or using
    // tracesSampler for fine-grained control.
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Replay session capture — 1% of sessions, 100% on errors.
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 1.0,
    debug: false,
  });
}
