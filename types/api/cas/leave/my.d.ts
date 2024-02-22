import type { LeaveRequest } from '@prisma/client'

interface MyRequests {
  total: number
  data: LeaveRequest[]
}
