/*
  Warnings:

  - You are about to drop the column `emailSend` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `User` table. All the data in the column will be lost.
  - Added the required column `isEmailSend` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "emailSend",
ADD COLUMN     "isEmailSend" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "active",
ADD COLUMN     "isActive" BOOLEAN DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;
