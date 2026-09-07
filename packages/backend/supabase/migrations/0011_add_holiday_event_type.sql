-- New event type for school-holiday-style blocks that can span multiple days
-- (event_instances.date_end already exists and was previously unused).
-- Added standalone: a new enum value can't be used in the same transaction
-- it's created in, so no other statements reference 'holiday' here.
alter type event_type add value 'holiday';
