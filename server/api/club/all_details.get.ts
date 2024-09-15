import { getStore } from '@netlify/blobs'

export default defineCachedEventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  return await getStore('enspire').get('clubs', { type: 'json' })
}, { maxAge: 60 * 60 * 4 /* 4 hours */ })
