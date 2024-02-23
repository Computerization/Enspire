import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

interface StoredData {
  userId: string
  name: string
  studentId: string
}

const requestSchema = z.object({
  token: z.string().uuid(),
})

export default defineEventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  // const requestBody = await readValidatedBody(event, body => requestSchema.parse(body))
  let sessionCookie = ''

  // if (!await useStorage().hasItem(requestBody.data.token)) {
  //   throw createError({
  //     statusCode: 403,
  //     statusMessage: 'Token Incorrect',
  //   })
  // }
  //
  // const storedData = await useStorage().getItem<StoredData>(requestBody.data.token)
  //
  // if (!storedData) {
  //   throw createError({
  //     statusCode: 403,
  //     statusMessage: 'Token Incorrect',
  //   })
  // }

  // if (await prisma.user.findFirst({
  //   where: {
  //     tsimsStudentId: Number(storedData.studentId),
  //   },
  // }) !== null) {
  //   throw createError({
  //     statusCode: 403,
  //     statusMessage: 'TSIMS Account already binded',
  //   })
  // }
  //
  // await prisma.user.create({
  //   data: {
  //     clerkUserId: storedData.userId,
  //     name: storedData.name,
  //     tsimsStudentId: Number(storedData.studentId),
  //   },
  // })

  // await clerkClient.users.updateUser(storedData.userId, { firstName: storedData.name })
  // await clerkClient.users.updateUser(storedData.userId, { publicMetadata: { binded: true } })
  //
  // useStorage().removeItem(requestBody.data.token, true)
  // fetch("http://101.230.1.173:6300/php/login_key.php", {
  //   "headers": {
  //     "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  //     "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,de-DE;q=0.6,de;q=0.5,ja-JP;q=0.4,ja;q=0.3",
  //     "cookie": "PHPSESSID=s3e6olttudm515usqdarsrp047",
  //     "Referer": "http://101.230.1.173:6300/",
  //     "Referrer-Policy": "strict-origin-when-cross-origin"
  //   },
  //   "body": null,
  //   "method": "GET"
  // });
  const blob = await $fetch<Blob>('http://101.230.1.173:6300/php/login_key.php', {
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
  const buffer = Buffer.from(await blob.arrayBuffer()).toString('base64') as string

  console.log(buffer)

  const token = uuidv4()

  await useStorage().setItem(token, {
    sessionCookie,
  })

  event.res.setHeader('Content-Type', 'application/json')
  return JSON.stringify({ token, img: buffer })
})
