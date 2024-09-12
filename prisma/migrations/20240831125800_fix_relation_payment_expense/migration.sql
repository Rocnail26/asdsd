/*
  Warnings:

  - You are about to drop the column `expense_id` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `payment_id` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_expense_id_fkey";

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "payment_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "expense_id";

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
