insert into users (full_name, email)
values ('Alex Roller', 'alex@sjrd.local')
on conflict (email) do nothing;
