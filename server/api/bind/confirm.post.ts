import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

import { clerkClient } from '@clerk/clerk-sdk-node'

const prisma = new PrismaClient()

interface StoredData {
  userId: string
  name: string
  studentId: string
}

const requestSchema = z.object({
  token: z.string().uuid(),
})

export default defineEventHandler(async (event) => {
  const requestBody = await readValidatedBody(event, body => requestSchema.safeParse(body))
  if (!requestBody.success)
    throw requestBody.error.issues

  if (!await useStorage().hasItem(requestBody.data.token)) {
    throw createError({
      statusCode: 403,
      message: 'Token Incorrect',
    })
  }

  const storedData = await useStorage().getItem<StoredData>(requestBody.data.token)

  if (!storedData) {
    throw createError({
      statusCode: 403,
      message: 'Token Incorrect',
    })
  }

  if (await prisma.user.findFirst({
    where: {
      tsimsStudentId: Number(storedData.studentId),
    },
  }) !== null) {
    throw createError({
      statusCode: 403,
      message: 'TSIMS Account already bound',
    })
  }

  await prisma.user.create({
    data: {
      clerkUserId: storedData.userId,
      name: storedData.name,
      tsimsStudentId: Number(storedData.studentId),
    },
  })

  await clerkClient.users.updateUser(storedData.userId, { firstName: storedData.name })
  await clerkClient.users.updateUser(storedData.userId, { publicMetadata: { binded: true } })

  await useStorage().removeItem(requestBody.data.token, true)

  return { success: true }
})
