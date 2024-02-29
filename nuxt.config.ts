export default defineNuxtConfig({
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', 'nuxt-icon'],
  build: {
    transpile: ['vue-clerk', '@clerk/clerk-js', '@nuxtjs/google-fonts'],
  },
  runtimeConfig: {
    public: {
      sentry: {
        dsn: process.env.SENTRY_DSM,
        environment: 'development',
      },

      clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    },
    tsimsUrl: process.env.TSIMS_URL,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
  },
  googleFonts: {
    families: {
      'Inter': true,
      'Noto Sans SC': true,
      'IBM+Plex+Mono': true,
    },
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
})
