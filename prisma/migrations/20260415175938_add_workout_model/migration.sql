/*
  Warnings:

  - You are about to drop the column `blocks` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Workout` table. All the data in the column will be lost.
  - Added the required column `content` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "blocks",
DROP COLUMN "deletedAt",
ADD COLUMN     "content" JSONB NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Workout_date_idx" ON "Workout"("date");
