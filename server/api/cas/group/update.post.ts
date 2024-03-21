import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  clubId: z.string(),
  wechatGroupUrl: z.string().url({ message: 'Invalid URL' }),
  wechatGroupExpiration: z.string().datetime(),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const tsimsStudentId = await prisma.user.findUnique({
    where: {
      id: auth.userId,
    },
  }).then(user => user?.tsimsStudentId)

  const result = await readValidatedBody(event, body => requestSchema.safeParse(body))

  if (!result.success) {
    setResponseStatus(event, 400)
    return
  }

  const requestBody = result.data

  // check if the user is in the presidentByTsimsStudentId or vicePresidentByTsimsStudentId of the club
  const isPresidentOrVicePresident = await prisma.club.findFirst({
    where: {
      id: Number(requestBody.clubId),
      OR: [
        {
          presidentByTsimsStudentId: tsimsStudentId,
        },
        {
          vicesByTsimsStudentId: {
            has: tsimsStudentId,
          },
        },
      ],
    },
  }).then(club => club !== null)

  if (!isPresidentOrVicePresident)
    setResponseStatus(event, 403)

  await prisma.joinGroup.update({
    where: {
      clubId: Number(requestBody.clubId),
    },
    data: {
      wechatGroupUrl: requestBody.wechatGroupUrl,
      wechatGroupExpiration: new Date(requestBody.wechatGroupExpiration),
    },
  })
})
