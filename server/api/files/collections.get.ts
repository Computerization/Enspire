import { FormStatus, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  const { auth } = event.context

  if ((auth?.userId) == null) {
    setResponseStatus(event, 403)
  }

  const collections = await prisma.fileCollection.findMany({
    where: {
      status: FormStatus.OPEN,
    },
  })
  return collections
})
