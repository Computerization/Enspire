import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  club: z.string(),
  date: z.string().datetime(),
  score: z.number().lte(5),
  comment: z.string().max(100),
})

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
    return // one should ensure that this api will never be called when the current month is not in [0, 1, 5, 6]

  const requestBody = await readValidatedBody(event, body => requestSchema.parse(body))
  const record = await prisma.clubRating.findUnique({
    where: {
      clubId_rateBy_rateScope: {
        clubId: Number(requestBody.club),
        rateBy: auth.userId,
        rateScope: semester,
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
      clubId: Number(requestBody.club),
      rating: requestBody.score,
      comment: requestBody.comment,
      ratedAt: requestBody.date,
      rateScope: semester,
    },
  })
})
