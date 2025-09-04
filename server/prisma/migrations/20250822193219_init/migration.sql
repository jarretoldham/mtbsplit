-- CreateEnum
CREATE TYPE "public"."TokenProvider" AS ENUM ('strava');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('ride');

-- CreateEnum
CREATE TYPE "public"."ActivitySource" AS ENUM ('strava');

-- CreateTable
CREATE TABLE "public"."Athlete" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AthleteToken" (
    "id" SERIAL NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "provider" "public"."TokenProvider" NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AthleteToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Track" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "activityType" "public"."ActivityType" NOT NULL DEFAULT 'ride',
    "distance" DOUBLE PRECISION NOT NULL,
    "elevationGain" DOUBLE PRECISION NOT NULL,
    "elevationLoss" DOUBLE PRECISION,
    "startLatLng" DOUBLE PRECISION[],
    "endLatLng" DOUBLE PRECISION[],
    "polyline" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrackDetails" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER NOT NULL,
    "streams" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrackEffort" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "time" INTEGER NOT NULL,
    "polyline" TEXT NOT NULL,
    "streams" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackEffort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Activity" (
    "id" SERIAL NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ActivityType" NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "elevationGain" DOUBLE PRECISION NOT NULL,
    "elevationLoss" DOUBLE PRECISION,
    "averageSpeed" DOUBLE PRECISION,
    "maxSpeed" DOUBLE PRECISION,
    "startLatLng" DOUBLE PRECISION[],
    "endLatLng" DOUBLE PRECISION[],
    "polyline" TEXT NOT NULL,
    "elapsedTime" INTEGER NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL,
    "source" "public"."ActivitySource" NOT NULL DEFAULT 'strava',
    "sourceId" TEXT,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Athlete_email_key" ON "public"."Athlete"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TrackDetails_trackId_key" ON "public"."TrackDetails"("trackId");

-- AddForeignKey
ALTER TABLE "public"."AthleteToken" ADD CONSTRAINT "AthleteToken_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackDetails" ADD CONSTRAINT "TrackDetails_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackEffort" ADD CONSTRAINT "TrackEffort_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackEffort" ADD CONSTRAINT "TrackEffort_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackEffort" ADD CONSTRAINT "TrackEffort_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
