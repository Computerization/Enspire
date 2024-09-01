import { PrismaClient } from '@prisma/client'

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

  if (query.action === 'DELETE') {
    if (query.id === -1)
      return
    return await prisma.reservationRecord.delete({
      where: {
        id: Number(query.id),
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
  }
  else if (query.action === 'DELALL') {
    return await prisma.reservationRecord.deleteMany({})
      .then(() => {
        return 'SUCCESS'
      })
      .catch(() => {
        throw createError({
          statusCode: 400,
          statusMessage: 'Record not found',
        })
      })
  }
  else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unknown action',
    })
  }
})
