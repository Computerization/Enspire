-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "tsimsUsername" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" INTEGER NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserClubs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_tsimsUsername_key" ON "User"("tsimsUsername");

-- CreateIndex
CREATE UNIQUE INDEX "_UserClubs_AB_unique" ON "_UserClubs"("A", "B");

-- CreateIndex
CREATE INDEX "_UserClubs_B_index" ON "_UserClubs"("B");

-- AddForeignKey
ALTER TABLE "_UserClubs" ADD CONSTRAINT "_UserClubs_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserClubs" ADD CONSTRAINT "_UserClubs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
