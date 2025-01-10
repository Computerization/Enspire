import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if ((auth?.userId) == null) {
    setResponseStatus(event, 403)
    return
  }

  const data = await prisma.club.findMany({
    where: {
      NOT: {
        membersByTsimsStudentId: {
          equals: [],
        },
      },
    },
    select: {
      name: true,
      id: true,
    },
  })
  return data
})
