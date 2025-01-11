-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('MEMBER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'MEMBER';
