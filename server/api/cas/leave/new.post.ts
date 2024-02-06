import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  club: z.string(),
  date: z.string().datetime(),
  reason: z.string(),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const requestBody = await readValidatedBody(event, body => requestSchema.safeParse(body))
  await prisma.leaveRequest.create({
    data: {
      clerkUserId: auth.userId,
      clubId: Number(requestBody.data.club),
      startDate: requestBody.data.date,
      endDate: requestBody.data.date,
      reason: requestBody.data.reason,
    },
  })
})
