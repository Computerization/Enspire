import {z} from "zod";
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

import clerkClient from '@clerk/clerk-sdk-node';

interface StoredData {
  "userId": string,
  "name": string,
  "studentId": string
}

const requestSchema = z.object({
  token: z.string().uuid()
})

export default defineEventHandler(async (event) => {
  const requestBody = await readValidatedBody(event, body => requestSchema.safeParse(body))
  if (!requestBody.success) throw requestBody.error.issues

  if (!await useStorage().hasItem(requestBody.data.token)) {
    throw createError({
      statusCode: 403, statusMessage: 'Token Incorrect',
    })
  }

  const storedData = await useStorage().getItem<StoredData>(requestBody.data.token)

  if (!storedData) {
    throw createError({
      statusCode: 403, statusMessage: 'Token Incorrect',
    })
  }

  if (await prisma.user.findFirst({
    where: {
      tsimsStudentId: Number(storedData.studentId)
    }
  }) !== null) {
    throw createError({
      statusCode: 403, statusMessage: 'TSIMS Account already binded',
    })
  }

  await prisma.user.create({
    data: {
      id: storedData.userId, name: storedData.name, tsimsStudentId: Number(storedData.studentId),
    },
  })

  await clerkClient.users.updateUser(storedData.userId, {firstName: storedData.name});

  useStorage().removeItem(requestBody.data.token, true);

  return {"success": true}

})
