import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const tsimsStudentId = (await prisma.user.findUniqueOrThrow({
    where: {
      clerkUserId: auth.userId,
    },
  })).tsimsStudentId

  const query = getQuery(event)

  return {
    president: await prisma.club.findMany({
      where: {
        presidentByTsimsStudentId: tsimsStudentId,
      },
      select: {
        id: true,
        name: true,
        memberships: query.includeMemberships === 'true',
      },
    }),
    vice: await prisma.club.findMany({
      where: {
        vicesByTsimsStudentId: {
          has: tsimsStudentId,
        },
      },
      select: {
        id: true,
        name: true,
        memberships: query.includeMemberships === 'true',
      },
    }),
    member: await prisma.club.findMany({
      where: {
        membersByTsimsStudentId: {
          has: tsimsStudentId,
        },
      },
      select: {
        id: true,
        name: true,
        memberships: query.includeMemberships === 'true',
      },
    }),
  }
})
