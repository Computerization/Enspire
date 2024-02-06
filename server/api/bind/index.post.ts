import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

interface TsimsLoginResult {
  status: string
  username: string
  password: string
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
  userId: z.string(),
})

export default defineEventHandler(async (event) => {
  let sessionCookie = ''
  const result = await readValidatedBody(event, body => requestSchema.safeParse(body))
  if (!result.success)
    throw result.error.issues

  /**
   * First stage of request: login and get session cookies
   */
  // tsims is so dumb that it returns text/html as the MIME type so we have to first receive it as string
  const tsimsRawLoginResult = await $fetch<string>('http://101.230.1.173:6300/php/login.php', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: `username=${result.data.username}&password=${result.data.password}`,
    onResponse(context) {
      sessionCookie = context.response.headers.get('set-cookie') ?? ''
    },
  })
  const tsimsLoginResult: TsimsLoginResult = JSON.parse(tsimsRawLoginResult)

  if (tsimsLoginResult.status !== 'ok') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Login Credentials Incorrect',
    })
  }

  /**
   * Second stage of request: get information of the user
   */
  const tsimsRawInfoResult = await $fetch<string>('http://101.230.1.173:6300/php/init_info.php', {
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
    userId: result.data.userId,
    name: tsimsInfoResult.studentname,
    studentId: tsimsInfoResult.studentid,
  })
  return {
    token: continueToken,
    name: tsimsInfoResult.studentname,
    studentNumber: tsimsInfoResult.studentNo,
  }
})
