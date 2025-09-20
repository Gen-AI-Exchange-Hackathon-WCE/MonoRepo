-- CreateTable
CREATE TABLE "public"."Investor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "organization" TEXT,
    "investmentFocus" TEXT,
    "minInvestment" DOUBLE PRECISION,
    "maxInvestment" DOUBLE PRECISION,
    "location" TEXT,
    "description" TEXT,
    "website" TEXT,
    "linkedInUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvestorInterest" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,
    "investorId" INTEGER NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestorInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Investor_email_key" ON "public"."Investor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_phone_key" ON "public"."Investor"("phone");

-- AddForeignKey
ALTER TABLE "public"."Investor" ADD CONSTRAINT "Investor_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvestorInterest" ADD CONSTRAINT "InvestorInterest_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvestorInterest" ADD CONSTRAINT "InvestorInterest_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "public"."Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
