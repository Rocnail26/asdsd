/*
  Warnings:

  - You are about to drop the column `expenseType_id` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `expireDate` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the `ExpenseType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isRecurrent` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owedValue` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_expenseType_id_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "ExpenseType" DROP CONSTRAINT "ExpenseType_residenceType_id_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "Responsable" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "expenseType_id",
DROP COLUMN "expireDate",
DROP COLUMN "status",
ADD COLUMN     "dayPayment" DATE,
ADD COLUMN     "isRecurrent" BOOLEAN NOT NULL,
ADD COLUMN     "owedValue" DECIMAL(8,2) NOT NULL,
ADD COLUMN     "value" DECIMAL(8,2) NOT NULL,
ALTER COLUMN "emitingDate" DROP NOT NULL,
ALTER COLUMN "payment_id" DROP NOT NULL;

-- DropTable
DROP TABLE "ExpenseType";

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
