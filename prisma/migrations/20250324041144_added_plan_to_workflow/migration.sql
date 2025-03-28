-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Worflow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defination" TEXT NOT NULL,
    "executionPlan" TEXT,
    "creditsCost" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "lastRunAt" DATETIME,
    "lastRunId" TEXT,
    "lastRunStatus" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Worflow" ("createdAt", "defination", "description", "id", "lastRunAt", "lastRunId", "lastRunStatus", "name", "status", "updatedAt", "userId") SELECT "createdAt", "defination", "description", "id", "lastRunAt", "lastRunId", "lastRunStatus", "name", "status", "updatedAt", "userId" FROM "Worflow";
DROP TABLE "Worflow";
ALTER TABLE "new_Worflow" RENAME TO "Worflow";
CREATE UNIQUE INDEX "Worflow_name_userId_key" ON "Worflow"("name", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
