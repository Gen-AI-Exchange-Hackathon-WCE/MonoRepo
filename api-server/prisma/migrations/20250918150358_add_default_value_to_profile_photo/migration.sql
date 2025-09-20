/*
  Warnings:

  - Made the column `profilePhoto` on table `ArtistProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."ArtistProfile" ALTER COLUMN "profilePhoto" SET NOT NULL,
ALTER COLUMN "profilePhoto" SET DEFAULT 'https://res.cloudinary.com/durmfn82k/image/upload/v1758207360/artist_profiles/artist_2_profile_photo_1758207367173.jpg';
