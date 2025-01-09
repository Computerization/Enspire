import { PrismaClient } from '@prisma/client'

interface Body {
  clubId: number
  collection: string
}

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if ((auth?.userId) == null) {
    setResponseStatus(event, 403)
  }

  return readBody(event)
    .then(async (body: Body) => {
      const { clubId, collection } = body
      const records = await prisma.fileUploadRecord.findMany({
        where: {
          clubId: {
            equals: clubId,
          },
          fileUploadId: {
            equals: collection,
          },
        },
        include: {
          file: true,
        },
      })
      return records
    })
})
