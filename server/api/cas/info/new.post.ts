import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  clubId: z.number(),
  wechatGroupUrl: z.string().startsWith('https://weixin.qq.com/g/', { message: 'WeChat Group URL required' }),
  wechatGroupExpiration: z.string().datetime(),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const tsimsStudentId = (await prisma.user.findUnique({
    where: {
      id: auth.userId,
    },
  }))!.tsimsStudentId

  const requestBody = await readValidatedBody(event, body => requestSchema.parse(body))

  // check if the user is in the presidentByTsimsStudentId or vicePresidentByTsimsStudentId of the club
  const club = await prisma.club.findFirst({
    where: {
      id: requestBody.clubId,
      presidentByTsimsStudentId: tsimsStudentId,
    },
  })

  if (!club) {
    setResponseStatus(event, 404)
    return
  }

  await prisma.groupInfo.create({
    data: {
      clubId: Number(requestBody.clubId),
      wechatGroupUrl: requestBody.wechatGroupUrl,
      wechatGroupExpiration: new Date(requestBody.wechatGroupExpiration),
    },
  })
})
