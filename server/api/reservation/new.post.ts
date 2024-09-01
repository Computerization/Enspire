import { Days, Periods, PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()
type Period = typeof Periods[keyof typeof Periods]

const schema = z.object({
  day: z.any(),
  period: z.custom(p => Object.values(Periods).includes(p as Period)),
  classroom: z.any(), // TODO: classroom id
  applicant: z.any(), // TODO: club id
  note: z.string().max(500),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const getUser = await prisma.user.findUnique({
    where: {
      clerkUserId: auth.userId,
    },
  })

  if (!getUser) {
    setResponseStatus(event, 403)
    return
  }

  return readBody(event)
    .then(body => schema.parse(body))
    .then(async (body) => {
      await prisma.reservationRecord.createMany({
        data: body.day.split('')
          .map((dayBit: any, index: number) => {
            if (dayBit === '1') {
              return {
                userId: getUser.id,
                day: [
                  Days.SUNDAY,
                  Days.MONDAY,
                  Days.TUESDAY,
                  Days.WEDNESDAY,
                  Days.THURSDAY,
                  Days.FRIDAY,
                  Days.SATURDAY,
                ][index],
                // There is no period #9 in Fridays; #8 is the last one
                period: (index === 5 && body.period === Periods.NINE) ? Periods.AFTERCLASS : body.period,
                classroomId: body.classroom,
                clubId: body.applicant,
                note: body.note,
              }
            }
            return null
          }).filter((record: any) => record !== null),
      })
      return {
        status: 'SUCCESS',
      }
    })
    .catch((error) => {
      if (error.code === 'P2002') {
        return {
          status: 'PRISMA_ERROR',
          message: '这个教室在此时段已被占用',
        }
      }
      else if (error.code.startsWith('P20')) {
        return {
          status: 'PRISMA_ERROR',
          message: `数据库错误: ${error.code}`,
        }
      }
      else {
        throw createError({
          statusCode: 400,
          message: error,
        })
      }
    })
})
