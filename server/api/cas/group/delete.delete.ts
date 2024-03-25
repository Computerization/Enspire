import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  clubId: z.string(),
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

  const requestBody = await readValidatedBody(event, body => requestSchema.parse(body))

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

  await prisma.joinGroup.delete({
    where: {
      clubId: Number(requestBody.clubId),
    },
  }).catch(() => {
    setResponseStatus(event, 404)
  })
})
