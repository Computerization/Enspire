/*
  Warnings:

  - You are about to drop the `_UserClubs` table. If the table is not empty, all the data it contains will be lost.

*/

-- CreateEnum
CREATE TYPE "UserRoleInClub" AS ENUM ('President', 'Vice', 'Member');

-- CreateTable
CREATE TABLE "UserClubRelation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,
    "role" "UserRoleInClub" NOT NULL,

    CONSTRAINT "UserClubRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserClubRelation_userId_clubId_key" ON "UserClubRelation"("userId", "clubId");

-- AddForeignKey
ALTER TABLE "UserClubRelation" ADD CONSTRAINT "UserClubRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClubRelation" ADD CONSTRAINT "UserClubRelation_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "_UserClubs" DROP CONSTRAINT "_UserClubs_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserClubs" DROP CONSTRAINT "_UserClubs_B_fkey";

-- DropTable
DROP TABLE "_UserClubs";

-- CreateTable
CREATE TABLE "_ClubToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClubToUser_AB_unique" ON "_ClubToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ClubToUser_B_index" ON "_ClubToUser"("B");

-- AddForeignKey
ALTER TABLE "_ClubToUser" ADD CONSTRAINT "_ClubToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToUser" ADD CONSTRAINT "_ClubToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
