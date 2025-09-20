/*
  Warnings:

  - You are about to drop the column `profession` on the `ArtistProfile` table. All the data in the column will be lost.
  - Added the required column `professionCode` to the `ArtistProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ArtistProfile" DROP COLUMN "profession",
ADD COLUMN     "professionCode" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Profession" (
    "code" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Profession_pkey" PRIMARY KEY ("code")
);

-- AddForeignKey
ALTER TABLE "public"."ArtistProfile" ADD CONSTRAINT "ArtistProfile_professionCode_fkey" FOREIGN KEY ("professionCode") REFERENCES "public"."Profession"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
