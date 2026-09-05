export const LOCATION = {
  name: 'The BearHouse',
  address: '1701 Thornton Avenue, Sacramento',
};

export const PATHWAY_STEPS = [
  {
    name: 'Ursa Minor',
    tag: 'Blast Off Bears',
    description:
      'A beginner-level program open to all youth with no prior skills required. Focuses on basic skating skills, safety, and introduces roller derby concepts.',
  },
  {
    name: 'Ursa Major',
    tag: 'Blast Off Bears',
    description:
      'Invitation-only, and requires completion of Ursa Minor. Focuses on roller derby gameplay and full contact to prepare skaters for Intergalactic.',
  },
  {
    name: 'Intergalactic',
    tag: 'Development Team',
    description:
      'Fosters a fun, competitive environment that builds the skills skaters need to be ready for higher-level play.',
  },
  {
    name: 'Sabotage',
    tag: 'Charter Team',
    description:
      'Our charter team, competing in sanctioned JRDA games, tournaments, and post-season play.',
  },
];

export const TEAMS = [
  {
    name: 'Ursa Minor',
    tag: 'Blast Off Bears · Beginner',
    ageNote: 'Open to all youth, ages 8-17',
    description:
      'No prior skills required. Skaters build basic skating skills, safety habits, and learn foundational roller derby concepts.',
  },
  {
    name: 'Ursa Major',
    tag: 'Blast Off Bears · Invitation Only',
    ageNote: 'Requires completion of Ursa Minor',
    description:
      'Skaters learn roller derby gameplay and full contact to prepare for joining the Intergalactic team.',
  },
  {
    name: 'Intergalactic',
    tag: 'Development Team',
    ageNote: 'Ages 8-17',
    description:
      'Our development team, building the skills skaters need to be ready for higher-level, competitive play.',
  },
  {
    name: 'Sabotage',
    tag: 'Charter Team',
    ageNote: 'Ages 8-17 (18 if 17 at the start of the JRDA season, Sept 1)',
    description:
      'Our charter team, competing in sanctioned JRDA games, tournaments, and post-season play.',
  },
];

export const PRACTICE_SCHEDULE = [
  { day: 'Wednesdays', time: '6:00 - 8:00 PM', team: 'Mixed team practice' },
  { day: 'Fridays', time: '5:00 - 7:00 PM', team: 'Sabotage' },
  { day: 'Sundays', time: '2:00 - 4:00 PM', team: 'Intergalactic' },
  { day: 'Sundays', time: '3:30 - 5:30 PM', team: 'Sabotage' },
];

export const QUICK_FACTS = [
  { label: 'Ages', value: '8-17 (18 by exception)' },
  { label: 'Program', value: 'Open gender' },
  { label: 'League', value: 'JRDA member' },
  { label: 'Home', value: LOCATION.name },
];

export const JOIN_STEPS = [
  {
    title: 'Try out or reach out',
    description:
      'Contact us to learn about upcoming tryouts and get your skater started. New and returning skaters are both welcome.',
  },
  {
    title: 'Complete required forms',
    description:
      'JRDA Player Registration, League Member Info Form, and confirmation of Handbook receipt are required. An Image and Likeness Release is optional.',
  },
  {
    title: 'Set up dues',
    description:
      'Dues are $41 per month plus a $1 PayPal processing fee. Automatic payments are available if you prefer.',
  },
  {
    title: 'Get geared up',
    description:
      'New skaters can use loaner gear from the 101 program at the warehouse. Ask about our rental program if you would like to use gear outside of practice.',
  },
  {
    title: 'Get connected',
    description:
      'You will be added to the junior skaters email list automatically. Skaters may optionally join our Discord server, at the guardian’s discretion.',
  },
];

export const FAQS = [
  {
    question: 'What ages can join the Beastie Bears?',
    answer:
      'Skaters ages 8 to 17 are welcome (a skater may be 18 if they are 17 at the beginning of the JRDA season on September 1).',
  },
  {
    question: 'Is this an open gender program?',
    answer: 'Yes. The Beastie Bears are an open gender program.',
  },
  {
    question: 'My skater has never skated before. Where do they start?',
    answer:
      'Ursa Minor is our beginner-level program and does not require any prior skills. It focuses on basic skating skills, safety, and roller derby concepts, and is the entry point into our Blast Off Bears pipeline.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Dues are $41 per month plus a $1 PayPal processing fee, with automatic payments available. Skaters who volunteer with JRDA also complete a one-time $20 JRDA Volunteer Requirement fee.',
  },
  {
    question: 'Do we need to buy gear right away?',
    answer:
      'No. New skaters can use loaner gear from the 101 program at the warehouse. A rental program is also available if you would like to use gear outside of team practice.',
  },
  {
    question: 'What paperwork do we need to complete?',
    answer:
      'JRDA Player Registration, the League Member Info Form, and confirmation of Handbook receipt are required for all skaters. An Image and Likeness Release is optional.',
  },
  {
    question: 'Is there a volunteer requirement?',
    answer:
      'Yes. Families earn volunteer credit ("Derby Work") through a sign-up spreadsheet or an individual assignment. Volunteering with skaters also requires completing the JRDA Volunteer Requirements, which includes a $20 fee.',
  },
  {
    question: 'Where do practices happen?',
    answer: `Practices and home games are held at ${LOCATION.name}, ${LOCATION.address}.`,
  },
  {
    question: 'How will we stay in the loop on schedules and news?',
    answer:
      'Registered families are added to our junior skaters email list, and given access to the SRD Master Calendar for all practices, games, and events. Skaters may also join our Discord server for team communication.',
  },
];
