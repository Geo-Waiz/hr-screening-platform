-- Add MFA fields to User table
ALTER TABLE "users" ADD COLUMN "mfaEnabled" BOOLEAN DEFAULT false;
ALTER TABLE "users" ADD COLUMN "mfaSecret" TEXT;
ALTER TABLE "users" ADD COLUMN "lastLoginAt" TIMESTAMP;
ALTER TABLE "users" ADD COLUMN "failedLoginAttempts" INTEGER DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "lockedUntil" TIMESTAMP;

-- Create SecurityEvent table for audit logging
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "location" TEXT,
    "riskLevel" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- Create SecuritySettings table
CREATE TABLE "security_settings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "passwordPolicy" JSONB NOT NULL,
    "sessionTimeout" INTEGER NOT NULL DEFAULT 24,
    "rateLimiting" JSONB NOT NULL,
    "auditLogging" JSONB NOT NULL,
    "ipWhitelist" TEXT[],
    "failedLoginThreshold" INTEGER NOT NULL DEFAULT 5,
    "accountLockoutDuration" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "security_settings_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "security_settings" ADD CONSTRAINT "security_settings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes for performance
CREATE INDEX "security_events_userId_idx" ON "security_events"("userId");
CREATE INDEX "security_events_type_idx" ON "security_events"("type");
CREATE INDEX "security_events_createdAt_idx" ON "security_events"("createdAt");
CREATE INDEX "security_events_riskLevel_idx" ON "security_events"("riskLevel");
CREATE UNIQUE INDEX "security_settings_companyId_key" ON "security_settings"("companyId");
