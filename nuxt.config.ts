import packageJson from './package.json'

export default defineNuxtConfig({
  nitro: {
    experimental: {
      // TODO: Track nuxt/content#2839. Waiting for a new release.
      openAPI: false,
    },
    storage: {
      github: {
        driver: 'github',
        branch: 'prod',
        dir: '/data',
        repo: 'computerization/enspire',
      },
    },
  },

  modules: [
    '@vite-pwa/nuxt',
    '@unocss/nuxt',
    '@nuxt/content',
    'shadcn-nuxt',
    '@nuxt/icon',
    '@nuxt/fonts',
    'nuxt-svgo',
    '@sentry/nuxt/module',
    '@nuxt/image',
    'dayjs-nuxt',
  ],

  build: {
    transpile: ['vue-clerk', '@clerk/clerk-js'],
  },

  runtimeConfig: {
    public: {
      sentry: {
        dsn: process.env.SENTRY_DSN,
        environment: process.env.SENTRY_ENV,
      },
      clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      payloadCmsUrl: process.env.PAYLOAD_CMS_URL,
      appVersion: packageJson.version,
    },
    clubDataSecretKey: process.env.CLUB_DATA_SECRET_KEY,
    tsimsUrl: process.env.TSIMS_URL,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  dayjs: {
    locales: ['en', 'zh-cn'],
    plugins: ['relativeTime', 'utc', 'timezone', 'localizedFormat'],
    defaultLocale: 'zh-cn',
    defaultTimezone: 'Asia/Shanghai',
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: 'computerization',
      project: 'enspire',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
  },

  sourcemap: {
    client: true,
  },

  imports: {
    presets: [
      {
        from: '@tanstack/vue-query',
        imports: ['useQuery'],
      },
    ],
  },

  vite: {
    optimizeDeps: {
      exclude: ['vee-validate'],
    },
  },

  // Time flies...
  compatibilityDate: '2024-12-30',

  future: {
    compatibilityVersion: 4,
  },
})
