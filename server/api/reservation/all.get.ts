import { PrismaClient, ReservationStatuses } from '@prisma/client'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId)
    setResponseStatus(event, 403)

  const records = await prisma.reservationRecord.findMany()
  return JSON.stringify({
    enum: ReservationStatuses,
    data: Array.from(records.values()),
  })
})
