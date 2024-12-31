import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if ((auth?.userId) == null) {
    setResponseStatus(event, 403)
  }

  return readBody(event)
    .then(async (body) => {
      const { clubId, collection } = body
      const records = await prisma.fileUploadRecord.findMany({
        where: {
          clubId,
          fileUploadId: collection,
        },
        include: {
          file: true,
        },
      })
      return records
    })
})
