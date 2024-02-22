import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  id: z.number(),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const requestBody = await readValidatedBody(event, body => requestSchema.parse(body))

  await prisma.leaveRequest.delete({
    where: {
      id: requestBody.id,
      clerkUserId: auth.userId,
    },
  }).catch(() => {
    setResponseStatus(event, 404)
  })
})
