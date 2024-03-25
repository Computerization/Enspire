import type { ClubRating } from '@prisma/client'

interface MyRateableClubs {
  scope: string
  clubs: ClubRating[]
}
