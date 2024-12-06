-- AlterTable
ALTER TABLE "_ActivityRecordToClubMembership" ADD CONSTRAINT "_ActivityRecordToClubMembership_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ActivityRecordToClubMembership_AB_unique";
