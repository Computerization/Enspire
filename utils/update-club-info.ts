import { PrismaClient } from '@prisma/client'
import json from '../content/clubs.json' assert {'type': 'json'}
import type { Clubs } from '../content/clubs'

const prisma = new PrismaClient()
const clubs: Clubs = json as Clubs

const categories: (keyof Clubs)[] = ['Sports', 'Service', 'Arts', 'Life', 'Academic']

/*
 TODO: Current clubs.json downloading process is done with a Python script. We should rewrite it with javascript.
 */
async function main() {
  const runSequence = []
  for (const category of categories) {
    const categoryClubs = clubs[category]
    if (categoryClubs) {
      for (const club of categoryClubs) {
        /**
         * Get the foundedYear of the club
         */
        const foundedYear = club.groups[0].C_FoundTime.split('-')[0] !== '0000' ? Number(club.groups[0].C_FoundTime.split('-')[0]) : undefined
        /**
         * Get the members of the club
         */
        let presidentByTsimsStudentId = 0
        const vicesByTsimsStudentId: number[] = []
        const membersByTsimsStudentId: number[] = []

        for (const member of club.gmember) {
          if (member.LeaderYes === '2') {
            if (presidentByTsimsStudentId !== 0)
              throw new Error(`Two presidents in club ${club.groups[0].C_NameC}? Blame TSIMS, this club is fucked up like America.`)
            else
              presidentByTsimsStudentId = Number(member.StudentID)
          }
          else if (member.LeaderYes === '1') {
            vicesByTsimsStudentId.push(Number(member.StudentID))
          }
          else {
            membersByTsimsStudentId.push(Number(member.StudentID))
          }
        }
        /**
         * Add upsert action to the run sequence
         */
        runSequence.push(prisma.club.upsert({
          where: {
            id: Number(club.groups[0].C_GroupsID),
          },
          update: {
            name: {
              zh: club.groups[0].C_NameC,
              en: club.groups[0].C_NameE,
            },
            foundedYear,
            presidentByTsimsStudentId,
            vicesByTsimsStudentId,
            membersByTsimsStudentId,
            description: {
              zh: club.groups[0].C_DescriptionC,
              en: club.groups[0].C_DescriptionE,
            },
          },
          create: {
            id: Number(club.groups[0].C_GroupsID),
            name: {
              zh: club.groups[0].C_NameC,
              en: club.groups[0].C_NameE,
            },
            foundedYear,
            presidentByTsimsStudentId,
            vicesByTsimsStudentId,
            membersByTsimsStudentId,
            description: {
              zh: club.groups[0].C_DescriptionC,
              en: club.groups[0].C_DescriptionE,
            },
          },
        }))
      }
    }
  }
  /**
   * Use transaction API to run all the actions. Just in case one of the clubs fail.
   */
  await prisma.$transaction(runSequence)
}

main()
