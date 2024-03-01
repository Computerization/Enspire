import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  let sessionCookie = ''
  const blob = await $fetch<Blob>(`${useRuntimeConfig().tsimsUrl}/php/login_key.php`, {
    responseType: 'blob',
    method: 'GET',
    credentials: 'include',
    headers: {
      'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'content-type': 'application/x-www-form-urlencoded',
    },
    onResponse(context) {
      sessionCookie = context.response.headers.get('set-cookie') ?? ''
    },
  }) as Blob
  // eslint-disable-next-line node/prefer-global/buffer
  const buffer = Buffer.from(await blob.arrayBuffer()).toString('base64') as string

  const token = uuidv4()

  await useStorage().setItem(token, {
    sessionCookie,
  })

  event.res.setHeader('Content-Type', 'application/json')
  return JSON.stringify({ token, img: buffer })
})
