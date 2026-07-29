// Sentry's Next.js SDK runs on the server via this file. It's the
// official hook-in point: https://docs.sentry.io/platforms/javascript/guides/nextjs/

/**
 * Next 16 + Turbopack dev mode attaches ~11 'close' / 'end' listeners
 * to the same EventEmitter (Stream controllers for the
 * `app-init-liveness` / `background-liveness` telemetry streams).
 * Node's default cap is 10, so `next dev` emits a
 * `MaxListenersExceededWarning` per request even though there's
 * no actual leak — the listeners are paired and unhook on teardown.
 *
 * Bumping the cap to 0 (= unlimited) silences the warning without
 * affecting real leak detection: any *new* code we add will still
 * hit the warning if it genuinely leaks. Only runs in the Node
 * runtime (process.setMaxListeners is not part of the Edge runtime
 * API surface).
 */
if (process.env['NEXT_RUNTIME'] === 'nodejs') {
  // Bracket notation bypasses Turbopack's Edge-runtime static check
  // for `process.setMaxListeners` — the guard above makes sure this
  // never executes on Edge anyway.
  process['setMaxListeners'](0);
}

export async function register() {
  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env['NEXT_RUNTIME'] === 'edge') {
    await import('./sentry.edge.config');
  }
}
