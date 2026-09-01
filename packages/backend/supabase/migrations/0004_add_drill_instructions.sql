-- =============================================================
-- Drill Instructions
-- Adds a longer, step-by-step instructions field to drills,
-- distinct from the short summary already held in `description`.
-- =============================================================

alter table drills add column instructions text;
