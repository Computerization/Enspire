import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const now = new Date()
  let semester = now.getFullYear().toString() // string for storing scope: yyyy[a|b]

  if (([0, 1]).includes(now.getMonth()))
    semester += 'a' // the `a` period of year
  else if (([5, 6]).includes(now.getMonth()))
    semester += 'b' // the `b` period of year
  else
    return [] // one should ensure that this api will never be called when the current month is not in [0, 1, 5, 6]

  const tsimsStudentId = (await prisma.user.findUniqueOrThrow({
    where: {
      clerkUserId: auth.userId,
    },
  })).tsimsStudentId

  const clubsUnrated = await prisma.club.findMany({
    where: {
      membersByTsimsStudentId: {
        has: tsimsStudentId,
      },
      ClubRating: {
        none: {
          rateBy: { equals: auth.userId },
          rateScope: { equals: semester },
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  })

  return clubsUnrated
})
