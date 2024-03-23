import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  club: z.string(),
  date: z.string().datetime(),
  score: z.number().lte(5),
  comment: z.string(),
  scope: z.string(),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const requestBody = await readValidatedBody(event, body => requestSchema.safeParse(body))
  if (requestBody.success) {
    const record = await prisma.clubRating.findUnique({
      where: {
        clubId_rateBy_rateScope: {
          clubId: Number(requestBody.data.club),
          rateBy: auth.userId,
          rateScope: requestBody.data.scope,
        },
      },
    })

    if (record) {
      setResponseStatus(event, 403)
      return
    }

    await prisma.clubRating.create({
      data: {
        rateBy: auth.userId,
        clubId: Number(requestBody.data.club),
        rating: requestBody.data.score,
        comment: requestBody.data.comment,
        ratedAt: requestBody.data.date,
        rateScope: requestBody.data.scope,
      },
    })
  }
})
