-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileUploadRecord" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clubId" INTEGER NOT NULL,
    "fileId" TEXT NOT NULL,
    "fileUploadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileUploadRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileUpload" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "status" "FormStatus" NOT NULL,
    "fileNaming" TEXT NOT NULL,
    "fileTypes" TEXT[],

    CONSTRAINT "FileUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileUploadRecord_clubId_key" ON "FileUploadRecord"("clubId");

-- CreateIndex
CREATE UNIQUE INDEX "FileUploadRecord_fileId_key" ON "FileUploadRecord"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "FileUploadRecord_fileUploadId_key" ON "FileUploadRecord"("fileUploadId");

-- AddForeignKey
ALTER TABLE "FileUploadRecord" ADD CONSTRAINT "FileUploadRecord_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileUploadRecord" ADD CONSTRAINT "FileUploadRecord_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileUploadRecord" ADD CONSTRAINT "FileUploadRecord_fileUploadId_fkey" FOREIGN KEY ("fileUploadId") REFERENCES "FileUpload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
