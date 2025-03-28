-- AlterTable
ALTER TABLE "Worflow" ADD COLUMN "lastRunAt" DATETIME;
ALTER TABLE "Worflow" ADD COLUMN "lastRunId" TEXT;
ALTER TABLE "Worflow" ADD COLUMN "lastRunStatus" TEXT;
