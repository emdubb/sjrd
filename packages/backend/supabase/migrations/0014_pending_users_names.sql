-- =============================================================
-- Pending Users: derby name and preferred name
-- Mirrors the optional name fields already on profiles so admins
-- can capture them when adding a user before they're invited.
-- =============================================================

alter table pending_users add column preferred_name text;
alter table pending_users add column derby_name text;
