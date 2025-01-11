import { until } from '@vueuse/core'
import { useClerk, useClerkProvider } from 'vue-clerk'
import { getRole } from '~~/utils/user-roles'

export default defineNuxtRouteMiddleware(async () => {
  // Modified from auth.ts

  const nuxtApp = useNuxtApp()
  const clerk = useClerk()
  const { isClerkLoaded } = useClerkProvider()

  if (import.meta.client) {
    if (nuxtApp.isHydrating && nuxtApp.payload.serverRendered)
      return

    await until(isClerkLoaded).toBe(true)
    if (clerk.loaded && clerk.user?.id == null)
      return navigateTo('/sign-in')
    const response = await $fetch('/api/user/check-role')
    if (!(response?.success === true && response.role === 'ADMIN'))
      return abortNavigation()
  }

  if (import.meta.server) {
    const id = nuxtApp.ssrContext?.event.context.auth?.userId
    if (id == null)
      return navigateTo('/sign-in')
    const response = await getRole(id)
    if (!(response?.success === true && response.role === 'ADMIN'))
      return abortNavigation()
  }
})
