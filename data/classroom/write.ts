import { PrismaClient } from '@prisma/client'
import data from '~/data/classroom/classroom.json'

const prisma = new PrismaClient()

const writtenData: { name: string, alias: string, size: number }[] = []
data.forEach((e) => {
  writtenData.push({
    name: e.name,
    alias: e.alias,
    size: e.size,
  })
})

await prisma.classroomData.createMany({
  data: writtenData,
})
