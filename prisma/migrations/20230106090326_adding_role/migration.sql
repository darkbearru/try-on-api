-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UsersRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UsersRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsersRole_userId_key" ON "UsersRole"("userId");

-- AddForeignKey
ALTER TABLE "UsersRole" ADD CONSTRAINT "UsersRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
