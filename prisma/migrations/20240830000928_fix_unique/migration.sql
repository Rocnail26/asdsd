-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_id_fkey";

-- DropIndex
DROP INDEX "Account_comunity_id_key";

-- DropIndex
DROP INDEX "Cashout_account_id_key";

-- DropIndex
DROP INDEX "Cashout_provider_id_key";

-- DropIndex
DROP INDEX "Expense_residence_id_key";

-- DropIndex
DROP INDEX "ParkingSlot_residence_id_key";

-- DropIndex
DROP INDEX "Payment_account_id_key";

-- DropIndex
DROP INDEX "Payment_created_by_key";

-- DropIndex
DROP INDEX "Payment_expense_id_key";

-- DropIndex
DROP INDEX "Payment_owner_id_key";

-- DropIndex
DROP INDEX "Provider_comunity_id_key";

-- DropIndex
DROP INDEX "Residence_comunity_id_key";

-- DropIndex
DROP INDEX "Residence_owner_id_key";

-- DropIndex
DROP INDEX "User_comunity_id_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isVerified" DROP NOT NULL,
ALTER COLUMN "active" DROP NOT NULL,
ALTER COLUMN "role_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
