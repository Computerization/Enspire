import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if ((auth?.userId) == null) {
    setResponseStatus(event, 403)
  }

  return readBody(event)
    .then(async (body) => {
      const { fileId } = body
      const file = await prisma.file.findFirst({
        where: {
          id: fileId,
        },
      })
      const data = await useStorage('s3').getItem(file.fileId)
      return {
        url: data,
        name: file.name,
      }
    })
})
