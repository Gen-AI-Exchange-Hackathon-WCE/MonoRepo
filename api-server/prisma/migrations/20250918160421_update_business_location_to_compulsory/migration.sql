/*
  Warnings:

  - Made the column `businessLocation` on table `ArtistProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."ArtistProfile" ALTER COLUMN "businessLocation" SET NOT NULL;
