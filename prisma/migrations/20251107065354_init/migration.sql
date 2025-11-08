/*
  Warnings:

  - You are about to drop the column `severity` on the `LogModel` table. All the data in the column will be lost.
  - Added the required column `level` to the `LogModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `LogModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LogModel" DROP COLUMN "severity",
ADD COLUMN     "level" "SeverityLevel" NOT NULL,
ADD COLUMN     "origin" TEXT NOT NULL;
