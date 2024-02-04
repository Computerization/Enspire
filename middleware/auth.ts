import {useClerk, useClerkProvide} from 'vue-clerk';
import {until} from "@vueuse/core";

export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp();
  const clerk = useClerk();
  const {isClerkLoaded} = useClerkProvide();

  // On server, check if the user isn't authenticated
  // and redirect to /sign-in.
  if (process.server && !nuxtApp.ssrContext?.event.context.auth?.userId) return navigateTo('/sign-in');

  // On client, check if clerk is loaded and if user isn't authenticated and if user is binded to a TSIMS account
  // and redirect to /sign-in.
  if (process.client) {
    await until(isClerkLoaded).toBe(true);
    if (clerk.loaded && !clerk.user?.id) return navigateTo('/sign-in');
    if (!clerk.user?.publicMetadata['binded']) return navigateTo('/account/bind')
    console.log(clerk.user?.publicMetadata)
  }
});
