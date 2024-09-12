/*
  Warnings:

  - Added the required column `community_id` to the `ResidenceType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResidenceType" ADD COLUMN     "community_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ResidenceType" ADD CONSTRAINT "ResidenceType_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Comunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
