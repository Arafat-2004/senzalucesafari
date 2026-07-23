-- Add Announcement/Celebration Banner fields to AppSettings
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "bannerEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "bannerText" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "bannerLink" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "bannerType" TEXT NOT NULL DEFAULT 'general';
