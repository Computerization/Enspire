import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId)
    setResponseStatus(event, 403)

  return prisma.classroomData.findMany({
    include: {
      ReservationRecord: {
        include: {
          club: true,
        },
      },
    },
  })
})
