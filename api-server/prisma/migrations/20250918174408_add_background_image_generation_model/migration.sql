-- CreateTable
CREATE TABLE "public"."BackgroundImageGeneration" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackgroundImageGeneration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."BackgroundImageGeneration" ADD CONSTRAINT "BackgroundImageGeneration_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;
