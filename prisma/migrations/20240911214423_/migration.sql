/*
  Warnings:

  - You are about to drop the column `comunity_id` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `comunity_id` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `comunity_id` on the `Residence` table. All the data in the column will be lost.
  - You are about to drop the column `comunity_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Comunity` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `community_id` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `community_id` to the `Provider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `community_id` to the `Residence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_comunity_id_fkey";

-- DropForeignKey
ALTER TABLE "Provider" DROP CONSTRAINT "Provider_comunity_id_fkey";

-- DropForeignKey
ALTER TABLE "Residence" DROP CONSTRAINT "Residence_comunity_id_fkey";

-- DropForeignKey
ALTER TABLE "ResidenceType" DROP CONSTRAINT "ResidenceType_community_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_comunity_id_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "comunity_id",
ADD COLUMN     "community_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "comunity_id",
ADD COLUMN     "community_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Residence" DROP COLUMN "comunity_id",
ADD COLUMN     "community_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "comunity_id",
ADD COLUMN     "community_id" TEXT NOT NULL DEFAULT '1';

-- DropTable
DROP TABLE "Comunity";

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Residence" ADD CONSTRAINT "Residence_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidenceType" ADD CONSTRAINT "ResidenceType_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
