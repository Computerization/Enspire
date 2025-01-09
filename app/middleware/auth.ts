import { until } from '@vueuse/core'
import { useClerk, useClerkProvider } from 'vue-clerk'
import { clerkClient } from 'h3-clerk'

export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp()
  const clerk = useClerk()
  const { isClerkLoaded } = useClerkProvider()

  // On server, check if the user isn't authenticated and if the user is binded
  // and redirect to /sign-in.
  if (import.meta.server) {
    const userId = nuxtApp.ssrContext?.event.context.auth?.userId
    if (!userId) {
      return navigateTo('/sign-in')
    }
    if (!(await clerkClient.users.getUser(userId)).publicMetadata.binded) {
      return navigateTo('/account/bind')
    }
  }

  // On client, check if clerk is loaded and if user isn't authenticated and if user is binded to a TSIMS account
  // and redirect to /sign-in.
  if (import.meta.client) {
    // Skip on initial client load because server must have loaded in this situation
    if (nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return

    await until(isClerkLoaded).toBe(true)
    if (clerk.loaded && !clerk.user?.id)
      return navigateTo('/sign-in')
    if (!clerk.user?.publicMetadata.binded)
      return navigateTo('/account/bind')
  }
})
