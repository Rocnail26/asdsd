/*
  Warnings:

  - You are about to drop the column `residence_id` on the `ParkingSlot` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `ParkingSlot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ParkingSlot" DROP CONSTRAINT "ParkingSlot_residence_id_fkey";

-- AlterTable
ALTER TABLE "ParkingSlot" DROP COLUMN "residence_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ParkingSlot" ADD CONSTRAINT "ParkingSlot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
