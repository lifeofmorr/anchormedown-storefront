-- CreateTable
CREATE TABLE "Capture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Capture_createdAt_idx" ON "Capture"("createdAt");

-- CreateIndex
CREATE INDEX "Capture_source_idx" ON "Capture"("source");

-- CreateIndex
CREATE INDEX "Capture_email_idx" ON "Capture"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Capture_email_source_key" ON "Capture"("email", "source");
