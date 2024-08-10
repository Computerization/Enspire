import * as Sentry from '@sentry/nuxt'

Sentry.init({
  // There isn't any way to get the dsn from env var here
  dsn: 'https://fa9f1c768005ae729e6fb560d2b02713@o4506819268444160.ingest.us.sentry.io/4506822264029184',
})
