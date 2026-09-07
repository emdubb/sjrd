-- Show the real street address instead of a placeholder rink name.
update locations
  set name = '1701 Thorton Ave, Sacramento CA 95811'
  where is_default = true;

-- Derby 101 sessions always assign both the 101 and 201 teams; make sure
-- a 101 team exists alongside the existing 201 team.
insert into teams (name)
select '101'
where not exists (select 1 from teams where name = '101');
