import * as Sentry from '@sentry/nuxt'

// Only run `init` when DSN is available
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  })
}
