import { useClerk } from 'vue-clerk'

export default defineNuxtRouteMiddleware(() => {
  const nuxtApp = useNuxtApp()
  const clerk = useClerk()

  // On server, check if the user is authenticated
  // and redirect to /profile.
  if (
    import.meta.server
    && nuxtApp.ssrContext?.event.context.auth?.userId
  ) {
    return navigateTo('/profile')
  }

  // On client, check if clerk is loaded and if user is authenticated
  // and redirect to /profile.
  if (import.meta.client && clerk.loaded && clerk.user?.id)
    return navigateTo('/profile')
})
