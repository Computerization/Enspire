import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  club: z.coerce.number(),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const requestQuery = await getValidatedQuery(event, body => requestSchema.parse(body))

  const activityRecordCount = await prisma.activityRecord.count({
    where: {
      clubId: requestQuery.club,
    },
  })

  const activityRecords = await prisma.activityRecord.findMany({
    where: {
      clubId: requestQuery.club,
    },
    include: {
      club: {
        select: {
          name: true, // Only select the club's name
          memberships: true,
        },
      },
      attendees: {
        select: {
          name: true, // Only select the club's name
        },
      },
    },
  })

  return {
    data: activityRecords,
    total: activityRecordCount,
  }
})
