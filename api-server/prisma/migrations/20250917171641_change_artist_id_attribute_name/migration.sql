/*
  Warnings:

  - The primary key for the `Artist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Artist` table. All the data in the column will be lost.
  - Added the required column `artistId` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Artist" DROP CONSTRAINT "Artist_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArtistProfile" DROP CONSTRAINT "ArtistProfile_artistId_fkey";

-- AlterTable
ALTER TABLE "public"."Artist" DROP CONSTRAINT "Artist_pkey",
DROP COLUMN "userId",
ADD COLUMN     "artistId" INTEGER NOT NULL,
ADD CONSTRAINT "Artist_pkey" PRIMARY KEY ("artistId");

-- AddForeignKey
ALTER TABLE "public"."Artist" ADD CONSTRAINT "Artist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistProfile" ADD CONSTRAINT "ArtistProfile_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;
