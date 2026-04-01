-- Store teacher OAuth refresh tokens for background cron sync
CREATE TABLE IF NOT EXISTS teacher_tokens (
  email       TEXT PRIMARY KEY,
  refresh_token TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
