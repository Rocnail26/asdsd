-- DropForeignKey
ALTER TABLE "Cashout" DROP CONSTRAINT "Cashout_provider_id_fkey";

-- AlterTable
ALTER TABLE "Cashout" ADD COLUMN     "toAccount_id" TEXT,
ALTER COLUMN "provider_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Cashout" ADD CONSTRAINT "Cashout_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cashout" ADD CONSTRAINT "Cashout_toAccount_id_fkey" FOREIGN KEY ("toAccount_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
