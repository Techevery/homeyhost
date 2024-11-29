/*
  Warnings:

  - Added the required column `gender` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "gender" TEXT NOT NULL;
