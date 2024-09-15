import type { ClubMemberRole } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import type { Clubs } from '~/types/clubs'
import crawler from './crawler'

const prisma = new PrismaClient()
const clubs: Clubs = await crawler() as Clubs

interface ClubMembership {
  tsimsStudentId: number
  name: string
  clubId: number
  role: ClubMemberRole
}

const categories: (keyof Clubs)[] = ['Sports', 'Service', 'Arts', 'Life', 'Academic']

export default async function main() {
  const runSequence = []
  for (const category of categories) {
    const categoryClubs = clubs[category]
    if (categoryClubs) {
      for (const club of categoryClubs) {
        /**
         * TSIMS is so funny lol there's even a test club in there
         */
        if (club.groups[0].C_GroupsID === '86')
          continue
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

        const memberships: ClubMembership[] = []

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

          memberships.push({
            tsimsStudentId: Number(member.StudentID),
            name: member.S_Name,
            clubId: Number(club.groups[0].C_GroupsID),
            role: member.LeaderYes === '2' ? 'PRESIDENT' : (member.LeaderYes === '1' ? 'VICE_PRESIDENT' : 'MEMBER'),
          })
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

        for (const member of memberships) {
          runSequence.push(prisma.clubMembership.upsert({
            where: {
              tsimsStudentId_clubId: {
                tsimsStudentId: member.tsimsStudentId,
                clubId: member.clubId,
              },
            },
            update: {
              role: member.role,
              name: member.name,
            },
            create: {
              tsimsStudentId: member.tsimsStudentId,
              clubId: member.clubId,
              role: member.role,
              name: member.name,
            },
          }))
        }
      }
    }
  }
  /**
   * Use transaction API to run all the actions. Just in case one of the clubs fail.
   */
  // eslint-disable-next-line no-console
  console.log(`start transaction with length ${runSequence.length}`)
  await prisma.$transaction(runSequence)

  return clubs
}

main()
