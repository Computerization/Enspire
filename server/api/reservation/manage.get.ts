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
      message: 'Incomplete query',
    })
  }

  if (query.admin === 'true') {
    if (0 /* TODO: admin key validation failed */) {
      throw createError({
        statusCode: 400,
        message: '管理员认证失败',
      })
    }
    else { // admin validation success
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
              message: '未找到记录',
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
              message: '未找到记录',
            })
          })
      }
      else {
        throw createError({
          statusCode: 400,
          message: '未知操作',
        })
      }
    }
  }
  else {
    const currentReservation = await prisma.reservationRecord.findUnique({
      include: {
        user: true,
      },
      where: {
        id: query.id,
      },
    })
    if (!currentReservation) {
      throw createError({
        statusCode: 400,
        message: '未找到记录',
      })
    }
    else if (currentReservation.user.clerkUserId !== auth.userId) {
      throw createError({
        statusCode: 400,
        message: '这不是你的记录',
      })
    }
    else if (query.action === 'DELETE') {
      if (query.id === -1)
        return
      return await prisma.reservationRecord.delete({
        where: {
          id: query.id,
        },
      })
        .then(() => {
          return 'SUCCESS'
        })
        .catch(() => {
          throw createError({
            statusCode: 400,
            message: '未找到记录',
          })
        })
    }
    else {
      throw createError({
        statusCode: 400,
        message: '未知操作',
      })
    }
  }
})
