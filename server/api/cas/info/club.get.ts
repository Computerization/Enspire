import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  club: z.number(),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  // get clubId from request body
  const requestBody = await readValidatedBody(event, body => requestSchema.parse(body))

  const clubInfo = await prisma.groupInfo.findUnique({
    where: {
      clubId: Number(requestBody.club),
    },
    // only use include if the value required is not a scalar
    // include: {
    //   wechatGroupUrl: true,
    // },
  })

  return clubInfo
})
