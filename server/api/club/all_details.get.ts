import * as Iron from 'iron-webcrypto'
import crypto from 'uncrypto'

import { createStorage } from 'unstorage'
import fsLiteDriver from 'unstorage/drivers/fs-lite'

const storage = createStorage({
  driver: fsLiteDriver({ base: './data' }),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  return (await Iron.unseal(crypto, (await storage.getItem('clubs:encrypted'))!, useRuntimeConfig().clubDataSecretKey!, Iron.defaults))
})
