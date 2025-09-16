-- Add password column to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" TEXT;

-- Create sessions table
CREATE TABLE IF NOT EXISTS "sessions" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON "sessions"(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_token ON "sessions"(token);
