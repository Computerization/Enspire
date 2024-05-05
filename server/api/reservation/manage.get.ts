import { PrismaClient, ReservationStatuses } from '@prisma/client'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const query = getQuery(event)
  if (!query.id || !query.action) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Incomplete query',
    })
  }
  if (query.action !== 'UNDO' && query.action !== 'APPROVE' && query.action !== 'DENY') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unknown action',
    })
  }

  return await prisma.reservationRecord.update({
    where: {
      id: Number(query.id),
    },
    data: {
      status: query.action === 'UNDO'
        ? ReservationStatuses.PENDING
        : (query.action === 'APPROVE' ? ReservationStatuses.APPROVED : ReservationStatuses.DENIED),
    },
  })
    .then(() => {
      return 'SUCCESS'
    })
    .catch(() => {
      throw createError({
        statusCode: 400,
        statusMessage: 'Record not found',
      })
    })
})
