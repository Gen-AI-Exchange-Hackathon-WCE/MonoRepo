/*
  Warnings:

  - The primary key for the `Artist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Artist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ArtistProfile" DROP CONSTRAINT "ArtistProfile_artistId_fkey";

-- DropIndex
DROP INDEX "public"."Artist_userId_key";

-- AlterTable
ALTER TABLE "public"."Artist" DROP CONSTRAINT "Artist_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Artist_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "public"."ArtistProfile" ADD CONSTRAINT "ArtistProfile_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
