import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  club: z.string(),
  date: z.string().datetime(),
  text: z.string().min(10).max(200),
  members: z.array(z.string().uuid()),
  cTime: z.number().min(0).max(5),
  aTime: z.number().min(0).max(5),
  sTime: z.number().min(0).max(5),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const requestBody = await readValidatedBody(event, body => requestSchema.parse(body))

  await prisma.activityRecord.create({
    data: {
      clubId: Number(requestBody.club),
      date: requestBody.date,
      text: requestBody.text,
      cTime: requestBody.cTime,
      aTime: requestBody.aTime,
      sTime: requestBody.sTime,
      attendees: {
        connect: requestBody.members.map(id => ({ id })),
      },
    },
  })
})
