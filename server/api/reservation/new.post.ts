import { PrismaClient } from '@prisma/client'
import { autoDiscoverNodePerformanceMonitoringIntegrations } from '@sentry/node'
import * as z from 'zod'

const prisma = new PrismaClient()

let START = 0
let DATE = 0

function toYYYYMMDD(d: Date) {
  const r = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return r
}

function toHHMM(d: Date) {
  return d.getHours() * 100 + d.getMinutes()
}

function isValidTime(t: number) {
  return Number.isInteger(t) && (t >= 0 && t <= 2359) && (t % 100 <= 59)
}

const requestSchema = z.object({
  date: z.number().min(toYYYYMMDD(new Date()), '预约时间必须在未来').refine((val) => {
    DATE = val
    return true
  }),
  loop: z.boolean(),
  day: z.string().length(7).regex(/^[01]+$/),
  start: z.number().refine((val) => {
    START = val
    if ((DATE === toYYYYMMDD(new Date())) && (val <= toHHMM(new Date())))
      return false

    return isValidTime(val)
  }),
  end: z.number().refine(val => (isValidTime(val) && val > START)),
  classroom: z.any(), // TODO: classroom id
  description: z.string().min(5, { message: 'hi' }).max(100),
  applicant: z.any(), // TODO: club id
  note: z.string().max(500),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  return readValidatedBody(event, body => requestSchema.parse(body))
    .then(async (body) => {
      const r = await prisma.reservationRecord.create({
        data: {
          userId: auth.userId,
          date: body.date,
          loop: body.loop,
          day: body.day,
          start: body.start,
          end: body.end,
          description: body.description,
          note: body.note,
        },
      })
      return {
        status: 'success',
        reservationId: r.id,
        timestamp: r.creationTimestamp,
      }
    })
    .catch((error) => {
      throw createError({
        statusCode: 400,
        message: error.message,
      })
    })
})
