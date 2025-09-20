-- CreateTable
CREATE TABLE "public"."Artist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArtistProfile" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,
    "profession" TEXT NOT NULL,
    "businessName" TEXT,
    "backgroundPoster" TEXT NOT NULL,
    "backgroundVideos" TEXT[],
    "badgeIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtistProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProfileDescription" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "backgroundInfo" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "descriptionMarkdown" TEXT NOT NULL,
    "descriptionText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProfileDescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_userId_key" ON "public"."Artist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistProfile_artistId_key" ON "public"."ArtistProfile"("artistId");

-- AddForeignKey
ALTER TABLE "public"."Artist" ADD CONSTRAINT "Artist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistProfile" ADD CONSTRAINT "ArtistProfile_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileDescription" ADD CONSTRAINT "ProfileDescription_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."ArtistProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
