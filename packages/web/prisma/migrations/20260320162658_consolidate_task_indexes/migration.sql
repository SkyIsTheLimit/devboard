-- DropIndex
DROP INDEX "Task_userId_idx";

-- DropIndex
DROP INDEX "Task_deletedAt_idx";

-- CreateIndex
CREATE INDEX "Task_userId_deletedAt_status_idx" ON "Task"("userId", "deletedAt", "status");
