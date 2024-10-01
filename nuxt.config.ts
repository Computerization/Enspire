export default defineNuxtConfig({
  routeRules: {
    '/**': {
      headers: {
        'Netlify-CDN-Cache-Control': 'no-store',
      },
    },
  },

  nitro: {
    experimental: {
      openAPI: true,
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
    '@nuxtjs/tailwindcss',
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
        environment: 'development',
      },
      clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      payloadCmsUrl: process.env.PAYLOAD_CMS_URL,
    },
    clubDataSecretKey: process.env.CLUB_DATA_SECRET_KEY,
    tsimsUrl: process.env.TSIMS_URL,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },

  dayjs: {
    locales: ['en', 'zh-cn'],
    plugins: ['relativeTime', 'utc', 'timezone', 'localizedFormat'],
    defaultLocale: 'zh-cn',
    defaultTimezone: 'Asia/Shanghai',
  },

  sentry: {
    debug: true,
    sourceMapsUploadOptions: {
      org: 'computerization',
      project: 'enspire',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
  },

  compatibilityDate: '2024-08-31',
})
