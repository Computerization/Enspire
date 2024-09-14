export default defineCachedEventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  return await useStorage('netlify').getItem('clubs')
}, { maxAge: 60 * 60 * 4 /* 4 hours */ })
