import * as Sentry from '@sentry/nuxt'

Sentry.init({
  // There isn't any way to get the dsn from env var here
  environment: useRuntimeConfig().public.sentry.environment,
  dsn: useRuntimeConfig().public.sentry.dsn,
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      // Additional SDK configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],
})
