-- Capi Career Simulator — D1 database schema
-- Run once: wrangler d1 execute capi-db --file=schema.sql

CREATE TABLE IF NOT EXISTS results (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),

  -- Final outcome
  final_role  TEXT    NOT NULL,   -- Explorer | Builder | Operator | Connector | Communicator
  mission_id  TEXT    NOT NULL,   -- e.g. "m1", "m2" …

  -- Phase 1 scores (JSON object: {E,B,O,C,Cm})
  p1_scores   TEXT    NOT NULL,
  -- Phase 2 scores
  p2_scores   TEXT    NOT NULL,
  -- Phase 3 scores
  p3_scores   TEXT    NOT NULL,

  -- Confidence rating chosen after Phase 1 (1–5)
  confidence  INTEGER,

  -- Optional metadata
  user_agent  TEXT,
  share_hash  TEXT    -- btoa-encoded share token stored in URL hash
);

-- Indexes for common admin queries
CREATE INDEX IF NOT EXISTS idx_final_role  ON results (final_role);
CREATE INDEX IF NOT EXISTS idx_mission_id  ON results (mission_id);
CREATE INDEX IF NOT EXISTS idx_created_at  ON results (created_at);
