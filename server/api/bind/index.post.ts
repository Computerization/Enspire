import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

interface TsimsLoginResult {
  status: string
  username: string
  password: string
}

interface StoredData {
  sessionCookie: string
}

interface TsimsInfoResult {
  studentname: string
  nickname: string
  studentid: string
  studentNo: string
  tUsername: string
}

const requestSchema = z.object({
  username: z.string().length(9).startsWith('s'),
  password: z.string(),
  token: z.string().uuid(),
  captcha: z.string(),
})

export default defineEventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  const requestBody = await readValidatedBody(event, body => requestSchema.parse(body))

  if (!await useStorage().hasItem(requestBody.token)) {
    throw createError({
      statusCode: 403,
      message: 'Token Incorrect',
    })
  }

  const storedData = await useStorage().getItem<StoredData>(requestBody.token)

  if (!storedData) {
    throw createError({
      statusCode: 403,
      message: 'Token Incorrect',
    })
  }

  const sessionCookie = storedData.sessionCookie

  /**
   * First stage of request: login and get session cookies
   */
  // tsims is so dumb that it returns text/html as the MIME type so we have to first receive it as string
  const tsimsRawLoginResult: string = await $fetch(`${useRuntimeConfig().tsimsUrl}/php/login.php`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': sessionCookie,
    },
    body: `username=${requestBody.username}&password=${requestBody.password}&code=${requestBody.captcha}`,
  })
  const tsimsLoginResult: TsimsLoginResult = JSON.parse(tsimsRawLoginResult)

  if (tsimsLoginResult.status !== 'ok') {
    throw createError({
      statusCode: 403,
      message: 'Login Credentials Incorrect',
    })
  }

  /**
   * Second stage of request: get information of the user
   */
  const tsimsRawInfoResult: string = await $fetch(`${useRuntimeConfig().tsimsUrl}/php/init_info.php`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': sessionCookie,
    },
  })
  const tsimsInfoResult: TsimsInfoResult = JSON.parse(tsimsRawInfoResult)

  /**
   * Third stage of request: get clubs of the user
   */
  // const clubsAsMember = await prisma.club.findMany({
  //   where: {
  //     membersByTsimsStudentId: {
  //       has: Number(tsimsInfoResult.studentid),
  //     },
  //   },
  // });
  // const clubsAsVice = await prisma.club.findMany({
  //   where: {
  //     vicesByTsimsStudentId: {
  //       has: Number(tsimsInfoResult.studentid),
  //     },
  //   },
  // });
  // const clubsAsPresident = await prisma.club.findMany({
  //   where: {
  //     presidentByTsimsStudentId: {
  //       equals: Number(tsimsInfoResult.studentid),
  //     },
  //   },
  // });

  const continueToken = uuidv4()

  await useStorage().setItem(continueToken, {
    userId: auth.userId,
    name: tsimsInfoResult.studentname,
    studentId: tsimsInfoResult.studentid,
  })
  return {
    token: continueToken,
    name: tsimsInfoResult.studentname,
    studentNumber: tsimsInfoResult.studentNo,
  }
})
