import { PrismaClient } from '@prisma/client'
import { getRole, isAdmin } from '~~/utils/user-roles'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if ((auth?.userId) == null || !isAdmin(await getRole(auth.userId))) {
    setResponseStatus(event, 403)
    return
  }

  const query = getQuery(event)
  if (query.id == null) {
    setResponseStatus(event, 400)
    return
  }

  const data = await prisma.fileUploadRecord.findMany({
    where: {
      fileUploadId: String(query.id),
    },
    include: {
      club: {
        select: {
          name: true,
        },
      },
      file: {
        select: {
          name: true,
        },
      },
    },
  })
  return data
})
