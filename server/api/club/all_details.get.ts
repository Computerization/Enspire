import * as Iron from 'iron-webcrypto'
import crypto from 'uncrypto'

export default defineCachedEventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  return (await Iron.unseal(crypto, (await useStorage('github').getItem('clubs:encrypted'))!, useRuntimeConfig().clubDataSecretKey!, Iron.defaults))
}, { maxAge: 60 * 60 * 4 /* 4 hours */ })
