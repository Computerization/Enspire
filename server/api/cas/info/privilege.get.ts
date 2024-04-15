import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  clubId: z.number(),
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

  const club = (await prisma.club.findFirst({
    where: {
      id: requestBody.clubId,
      presidentByTsimsStudentId: tsimsStudentId,
    },
  }))

  return !!club
})
