import type { ActivityRecord } from '@prisma/client'

interface MyRecords {
  total: number
  data: ActivityRecord[]
}
