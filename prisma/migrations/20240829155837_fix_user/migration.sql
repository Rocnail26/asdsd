/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isVerified" SET DEFAULT false,
ALTER COLUMN "active" SET DEFAULT false,
ALTER COLUMN "role_id" SET DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
