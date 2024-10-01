import * as Sentry from '@sentry/nuxt'

Sentry.init({
  // There isn't any way to get the dsn from env var here
  environment: useRuntimeConfig().public.sentry.environment,
  dsn: useRuntimeConfig().public.sentry.dsn,
})
