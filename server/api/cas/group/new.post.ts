import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  club: z.string(),
  wechatGroupUrl: z.string().url({ message: 'Invalid URL' }),
  wechatGroupExpiration: z.string().datetime(),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const requestBody = await readValidatedBody(event, body => requestSchema.safeParse(body))
  if (requestBody.success) {
    await prisma.joinGroup.create({
      data: {
        clubId: Number(requestBody.data.club),
        wechatGroupUrl: requestBody.data.wechatGroupUrl,
        wechatGroupExpiration: requestBody.data.wechatGroupExpiration,
      },
    })
  }
})
