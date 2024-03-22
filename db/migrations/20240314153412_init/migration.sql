-- CreateEnum
CREATE TYPE "LeaveRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL DEFAULT gen_random_uuid(),
    "clerkUserId" STRING NOT NULL,
    "name" STRING NOT NULL,
    "tsimsStudentId" INT4 NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" INT4 NOT NULL,
    "name" JSONB NOT NULL,
    "foundedYear" INT4,
    "presidentByTsimsStudentId" INT4 NOT NULL,
    "vicesByTsimsStudentId" INT4[],
    "membersByTsimsStudentId" INT4[],
    "description" JSONB NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "id" STRING NOT NULL DEFAULT gen_random_uuid(),
    "clerkUserId" STRING NOT NULL,
    "clubId" INT4 NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" STRING NOT NULL,
    "status" "LeaveRequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubRating" (
    "id" STRING NOT NULL DEFAULT gen_random_uuid(),
    "rateBy" STRING NOT NULL,
    "clubId" INT4 NOT NULL,
    "rating" INT4 NOT NULL DEFAULT 0,
    "comment" STRING,
    "ratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rateScope" STRING NOT NULL,

    CONSTRAINT "ClubRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_tsimsStudentId_key" ON "User"("tsimsStudentId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveRequest_id_clubId_startDate_endDate_key" ON "LeaveRequest"("id", "clubId", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "ClubRating_id_clubId_rateBy_rateScope_key" ON "ClubRating"("id", "clubId", "rateBy", "rateScope");

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRating" ADD CONSTRAINT "ClubRating_rateBy_fkey" FOREIGN KEY ("rateBy") REFERENCES "User"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubRating" ADD CONSTRAINT "ClubRating_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
