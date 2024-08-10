import type { ClubMembership } from '@prisma/client'

export interface ClubName {
  zh: string
  en: string
}
export interface Club {
  name: ClubName
  id: number
  memberships?: ClubMembership[]
}

export interface AllClubs {
  president: Club[]
  vice: Club[]
  member: Club[]
}
