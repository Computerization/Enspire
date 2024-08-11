import { clerkPlugin } from 'vue-clerk'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(clerkPlugin, {
    publishableKey: useRuntimeConfig().public.clerkPublishableKey,
  })
})
