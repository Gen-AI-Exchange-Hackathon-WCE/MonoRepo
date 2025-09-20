/*
  Warnings:

  - You are about to drop the column `investmentFocus` on the `Investor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Investor" DROP COLUMN "investmentFocus",
ADD COLUMN     "investmentFocusCode" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Investor" ADD CONSTRAINT "Investor_investmentFocusCode_fkey" FOREIGN KEY ("investmentFocusCode") REFERENCES "public"."Profession"("code") ON DELETE SET NULL ON UPDATE CASCADE;
