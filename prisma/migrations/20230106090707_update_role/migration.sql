/*
  Warnings:

  - You are about to drop the column `userId` on the `UsersRole` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsersRole" DROP CONSTRAINT "UsersRole_userId_fkey";

-- DropIndex
DROP INDEX "UsersRole_userId_key";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "roleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UsersRole" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "UsersRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
