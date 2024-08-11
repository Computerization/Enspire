export default defineNuxtConfig({
  nitro: {
    experimental: {
      openAPI: true,
    },
    storage: {
      github: {
        driver: 'github',
        branch: 'next',
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
    'nuxt-icon',
    '@nuxt/fonts',
    'nuxt-svgo',
    'dayjs-nuxt',
  ],
  build: {
    transpile: ['vue-clerk', '@clerk/clerk-js'],
  },
  runtimeConfig: {
    public: {
      sentry: {
        dsn: process.env.SENTRY_DSM,
        environment: 'development',
      },
      clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      payloadCmsUrl: process.env.PAYLOAD_CMS_URL,
    },
    clubDataSecretKey: process.env.CLUB_DATA_SECRET_KEY,
    tsimsUrl: process.env.TSIMS_URL,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
  },
  features: {
    // Solves the weird issue where netlify's Functions bundling process fails.
    // ref: https://answers.netlify.com/t/typeerror-pattern-is-too-long/98172/5
    inlineStyles: false,
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
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'zh-cn',
    defaultTimezone: 'Asia/Shanghai',
  },
})
