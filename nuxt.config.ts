export default defineNuxtConfig({
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', 'nuxt-icon', '@nuxtjs/google-fonts'],
  build: {
    transpile: ['vue-clerk', '@clerk/clerk-js'],
  },
  // @ts-expect-error This is a valid configuration. Just a type bug from the module.
  googleFonts: {
    families: {
      'Inter': true,
      'Noto Sans SC': true,
      'IBM+Plex+Mono': true,
    },
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
