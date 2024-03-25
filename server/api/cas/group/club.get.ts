import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  club: z.string(),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  // get clubId from request body
  const requestBody = await readValidatedBody(event, body => requestSchema.parse(body))

  const joinGroup = await prisma.joinGroup.findUnique({
    where: {
      clubId: Number(requestBody.club),
    },
    // only use include if the value required is not a scalar
    // include: {
    //   wechatGroupUrl: true,
    // },
  })

  if (!joinGroup) {
    return {
      data: null,
      status: 'No joinGroup information found for the club',
    }
  }

  return {
    data: joinGroup,
    status: 'success',
  }
})
