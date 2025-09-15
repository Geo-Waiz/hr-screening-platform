-- 2025-09-15 add password column and sessions table
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  token text NOT NULL UNIQUE,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "expiresAt" timestamptz NOT NULL,
  CONSTRAINT sessions_user_fk FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

COMMIT;

