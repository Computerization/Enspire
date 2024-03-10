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
})
