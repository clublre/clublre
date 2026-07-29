// Sentry's Next.js SDK runs on the server via this file. It's the
// official hook-in point: https://docs.sentry.io/platforms/javascript/guides/nextjs/

export async function register() {
  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env['NEXT_RUNTIME'] === 'edge') {
    await import('./sentry.edge.config');
  }
}
