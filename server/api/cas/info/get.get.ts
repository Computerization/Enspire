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

  const query = await getValidatedQuery(event, query => requestSchema.parse(query))

  const groupInfo = await prisma.groupInfo.findUnique({
    where: {
      clubId: query.club,
    },
  })

  if (groupInfo && groupInfo.wechatGroupExpiration < new Date()) {
    return null
  }

  return groupInfo
})
