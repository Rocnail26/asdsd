-- AlterTable
ALTER TABLE "User" ADD COLUMN     "residence_id" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_residence_id_fkey" FOREIGN KEY ("residence_id") REFERENCES "Residence"("id") ON DELETE SET NULL ON UPDATE CASCADE;
