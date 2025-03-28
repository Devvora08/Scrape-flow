-- AlterTable
ALTER TABLE "Worflow" ADD COLUMN "cron" TEXT;
ALTER TABLE "Worflow" ADD COLUMN "nextRunAt" DATETIME;
