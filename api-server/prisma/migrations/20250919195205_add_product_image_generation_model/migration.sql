-- CreateTable
CREATE TABLE "public"."ProductImageGeneration" (
    "id" SERIAL NOT NULL,
    "productMediaId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductImageGeneration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProductImageGeneration" ADD CONSTRAINT "ProductImageGeneration_productMediaId_fkey" FOREIGN KEY ("productMediaId") REFERENCES "public"."ProductMedia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
