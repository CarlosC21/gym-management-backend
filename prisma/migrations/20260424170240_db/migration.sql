-- CreateEnum
CREATE TYPE "WodType" AS ENUM ('AMRAP', 'FOR_TIME', 'WEIGHT', 'EMOM', 'COMPLETION');

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" "WodType" NOT NULL DEFAULT 'COMPLETION',
ALTER COLUMN "content" DROP NOT NULL;

-- CreateTable
CREATE TABLE "WodResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wodId" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "rx" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WodResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WodResult_userId_wodId_key" ON "WodResult"("userId", "wodId");

-- AddForeignKey
ALTER TABLE "WodResult" ADD CONSTRAINT "WodResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WodResult" ADD CONSTRAINT "WodResult_wodId_fkey" FOREIGN KEY ("wodId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
