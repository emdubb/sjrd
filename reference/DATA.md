
## All tables
- created at
- updated at
- created by
-  updated by

## Users
Users have one to many user types


- First Name
- Last Name
- Preferred Name
- Derby Name
- Email
- Phone (optional for youth skaters)
- Status (default "Active")


## User types

- Guardian
- Skater
- Coach
- Trainer
- Medic
- Official
- Admin

## User relationships

Must be unique

- guardian user id
- child user id

## Teams
Have many users of type skater
- Name
  

## Rosters

Has an event of type game
Has many users of type skater


## Event Series

- Title
- Description
- Series Date Start
- Series Date End (optional)
- Start Time
- End Time
- Recurrence rule


## Event Instances 

Event has none, one, or many teams
Has one event type
Event has none, one, or many attendances

- Series id - null if one off
- Title
- Description
- Topics
- Notes
- Status (cancelled, scheduled)
- Date Start
- Date End (optional)
- Original Start Time
- Start Time
- End Time
- Primary Coach (user id, this might need to be a join table)
- Asst Coaches (user ids, this might need to be a join table)
- medics  (user ids, this might need to be a join table)

## Attendances

Has an event of type practice
Has many skaters

- present
- partial
- 

## Event Type

- Game
- Practice
- Scrimmage
- Other

# Drills

Has one to many drill types

- Title
- Author (user id)
- Description
- Time

## Drill Types


---

## Notifications

Automated and manual. Should this be a service?? For mvp, only automated rules

- event cancelled
- event info changed
- new event
- Roster notification
- Coach not scheduled
- Welcome?

- Type
- Text



# Notes
 - Attendance notes should be taken on the event
 - Delete vs Cancel an event - delete takes it off the calendar, but cancel shows clearly cancelled (i.e. not a mistake)