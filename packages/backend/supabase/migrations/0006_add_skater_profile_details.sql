-- Skater-specific details surfaced on the coaching Skaters page: allergies
-- (safety-critical, flagged in the list but only shown in detail) and free-text
-- likes/dislikes for building rapport.
alter table profiles
  add column allergies text,
  add column likes text,
  add column dislikes text;
