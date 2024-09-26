/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_owner_id_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "owner_id",
ADD COLUMN     "whoPay" TEXT;
