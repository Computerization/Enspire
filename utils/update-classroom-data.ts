import { PrismaClient } from '@prisma/client'
import data from '~/data/classroom/classroom.json'

const prisma = new PrismaClient()

async function updateClassroomData() {
  const runSequence: any = []

  data.forEach((e) => {
    runSequence.push(
      prisma.classroomData.upsert({
        where: {
          name: e.name,
        },
        update: {
          name: e.name,
          alias: e.alias,
          size: e.size,
        },
        create: {
          name: e.name,
          alias: e.alias,
          size: e.size,
        },
      }),
    )
  })

  // eslint-disable-next-line no-console
  console.log(`start transaction with length ${runSequence.length}`)
  await prisma.$transaction(runSequence)
}

updateClassroomData().catch((e) => {
  console.error(e)
  prisma.$disconnect()
})
