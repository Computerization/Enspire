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
    }
  }
  else {
    // Get the user's student ID first
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: auth.userId,
      },
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: '用户不存在',
      })
    }

    // Find all clubs where user is president or vice president
    const userClubs = await prisma.club.findMany({
      where: {
        OR: [
          {
            presidentByTsimsStudentId: user.tsimsStudentId,
          },
          {
            vicesByTsimsStudentId: {
              has: user.tsimsStudentId,
            },
          },
        ],
      },
    })

    const clubIds = userClubs.map(club => club.id)

    const currentReservation = await prisma.reservationRecord.findUnique({
      include: {
        club: true,
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

    // Check if user has access to this club's reservations
    if (!clubIds.includes(currentReservation.clubId)) {
      throw createError({
        statusCode: 403,
        message: '您没有权限管理此预约记录',
      })
    }

    if (query.action === 'DELETE') {
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
