-- CreateEnum
CREATE TYPE "ClubMemberRole" AS ENUM ('PRESIDENT', 'VICE_PRESIDENT', 'MEMBER');

-- CreateEnum
CREATE TYPE "Days" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "Periods" AS ENUM ('MORNING', 'ONE', 'TWO', 'THREE', 'FOUR', 'NOON', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'AFTERCLASS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clerkUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tsimsStudentId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" INTEGER NOT NULL,
    "name" JSONB NOT NULL,
    "foundedYear" INTEGER,
    "presidentByTsimsStudentId" INTEGER NOT NULL,
    "vicesByTsimsStudentId" INTEGER[],
    "membersByTsimsStudentId" INTEGER[],
    "description" JSONB NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubMembership" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "tsimsStudentId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "clubId" INTEGER NOT NULL,
    "role" "ClubMemberRole" NOT NULL,

    CONSTRAINT "ClubMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityRecord" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clubId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "ActivityRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubRating" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "rateBy" TEXT NOT NULL,
    "clubId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "ratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rateScope" TEXT NOT NULL,

    CONSTRAINT "ClubRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupInfo" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clubId" INTEGER NOT NULL,
    "wechatGroupUrl" TEXT NOT NULL,
    "wechatGroupExpiration" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomData" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "alias" TEXT,
    "size" INTEGER,

    CONSTRAINT "ClassroomData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservationRecord" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "creationTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "day" "Days" NOT NULL,
    "period" "Periods" NOT NULL,
    "classroomId" TEXT NOT NULL,
    "clubId" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "ReservationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ActivityRecordToClubMembership" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_tsimsStudentId_key" ON "User"("tsimsStudentId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMembership_tsimsStudentId_clubId_key" ON "ClubMembership"("tsimsStudentId", "clubId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubRating_clubId_rateBy_rateScope_key" ON "ClubRating"("clubId", "rateBy", "rateScope");

-- CreateIndex
CREATE UNIQUE INDEX "GroupInfo_clubId_key" ON "GroupInfo"("clubId");

-- CreateIndex
CREATE UNIQUE INDEX "ReservationRecord_classroomId_day_period_key" ON "ReservationRecord"("classroomId", "day", "period");

-- CreateIndex
CREATE UNIQUE INDEX "ReservationRecord_clubId_day_period_key" ON "ReservationRecord"("clubId", "day", "period");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityRecordToClubMembership_AB_unique" ON "_ActivityRecordToClubMembership"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityRecordToClubMembership_B_index" ON "_ActivityRecordToClubMembership"("B");

-- AddForeignKey
ALTER TABLE "ClubMembership" ADD CONSTRAINT "ClubMembership_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRecord" ADD CONSTRAINT "ActivityRecord_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRating" ADD CONSTRAINT "ClubRating_rateBy_fkey" FOREIGN KEY ("rateBy") REFERENCES "User"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRating" ADD CONSTRAINT "ClubRating_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInfo" ADD CONSTRAINT "GroupInfo_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationRecord" ADD CONSTRAINT "ReservationRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationRecord" ADD CONSTRAINT "ReservationRecord_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "ClassroomData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationRecord" ADD CONSTRAINT "ReservationRecord_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityRecordToClubMembership" ADD CONSTRAINT "_ActivityRecordToClubMembership_A_fkey" FOREIGN KEY ("A") REFERENCES "ActivityRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityRecordToClubMembership" ADD CONSTRAINT "_ActivityRecordToClubMembership_B_fkey" FOREIGN KEY ("B") REFERENCES "ClubMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
