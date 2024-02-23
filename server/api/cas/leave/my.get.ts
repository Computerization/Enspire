import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const leaveRequestCount = await prisma.leaveRequest.count({
    where: {
      clerkUserId: auth.userId,
    },
  })

  const leaveRequests = await prisma.leaveRequest.findMany({
    where: {
      clerkUserId: auth.userId,
    },
    include: {
      club: {
        select: {
          name: true, // Only select the club's name
        },
      },
      user: {
        select: {
          name: true, // Only select the club's name
        },
      },
    },
  })

  return {
    data: leaveRequests,
    total: leaveRequestCount,
  }
})
