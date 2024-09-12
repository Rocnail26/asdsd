/*
  Warnings:

  - You are about to alter the column `number` on the `ParkingSlot` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - Added the required column `balance` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `ExpenseType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "balance" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "ExpenseType" ADD COLUMN     "value" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ParkingSlot" ALTER COLUMN "number" SET DATA TYPE INTEGER;
