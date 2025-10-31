/*
  Warnings:

  - Changed the type of `provider` on the `AthleteToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."AthleteToken" DROP CONSTRAINT "AthleteToken_athleteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrackDetails" DROP CONSTRAINT "TrackDetails_trackId_fkey";

-- AlterTable
ALTER TABLE "public"."Athlete" ADD COLUMN     "passwordHash" TEXT;

-- AlterTable
ALTER TABLE "public"."AthleteToken" DROP COLUMN "provider",
ADD COLUMN     "provider" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."TokenProvider";

-- AddForeignKey
ALTER TABLE "public"."AthleteToken" ADD CONSTRAINT "AthleteToken_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackDetails" ADD CONSTRAINT "TrackDetails_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
