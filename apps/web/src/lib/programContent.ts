export const LOCATION = {
  name: 'The BearHouse',
  address: '1701 Thornton Avenue, Sacramento',
};

export const PATHWAY_STEPS = [
  {
    name: 'Derby 101',
    tag: 'Training Program',
    description:
      'A beginner-level program open to all youth with no prior skills required. Focuses on basic skating skills, safety, and introduces roller derby concepts.',
  },
  {
    name: 'Derby 201',
    tag: 'Training Program',
    description:
      'Invitation-only, and requires completion of Derby 101. Focuses on roller derby gameplay and full contact to prepare skaters for Intergalactic.',
  },
  {
    name: 'Intergalactic',
    tag: 'Recreational Team',
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

export const TRAINING_TEAMS = [
  {
    name: 'Derby 101',
    tag: 'Beginner',
    ageNote: 'Open to all youth, ages 8-17',
    description:
      'No prior skills required. Skaters build basic skating skills, safety habits, and learn foundational roller derby concepts.',
  },
  {
    name: 'Derby 201',
    tag: 'Invitation Only',
    ageNote: 'Requires completion of Derby 101',
    description:
      'Skaters learn roller derby gameplay and full contact to prepare for joining the Intergalactic team.',
  },
];

export const COMPETITIVE_TEAMS = [
  {
    name: 'Intergalactic',
    tag: 'Recreational Team',
    ageNote: 'Ages 8-17',
    description:
      'Our recreational team, building the skills skaters need to be ready for higher-level, competitive play.',
  },
  {
    name: 'Sabotage',
    tag: 'Charter Team',
    ageNote: 'Ages 8-17 (18 if 17 at the start of the JRDA season, Sept 1)',
    description:
      'Our charter team, competing in sanctioned JRDA games, tournaments, and post-season play.',
  },
];

export const COACHES = [
  {
    displayName: 'Coach Bull Doze-Her',
    legalName: 'Melissa Wilcox',
    pronouns: 'they/she',
    role: 'Junior Program Head Coach',
    bio: 'Bull has been with SRD since 2019 — a skater with Kodiak Attack, an official on and off skates, and now the driving force behind the Junior Beastie Bears program. A coach with the junior program since 2023, Bull is passionate about sports that celebrate all body types, where every type has its own strength. Their favorite skill to teach is endurance — a foundational building block of derby that also teaches confidence and resilience.',
  },
  {
    displayName: 'Coach Billie the Squid',
    legalName: 'Abby Pratt',
    pronouns: 'she/her',
    role: 'Sabotage Head Coach',
    bio: 'Squid started roller derby in 2018, playing in Louisiana, Illinois, and Missouri before transferring to SRD in 2024. While she loves playing herself, coaching is where she really finds her derby joy — striving to create a safe space where kids of all ages can be themselves and find their confidence. Her favorite skill to teach is strategy, watching skaters have that aha moment.',
  },
  {
    displayName: 'Coach Quista',
    legalName: 'Paula Levitt',
    pronouns: 'she/her',
    role: 'Sabotage Coach',
  },
  {
    displayName: 'Coach Lazer Wolf',
    legalName: 'Justin Emery',
    pronouns: 'he/him',
    role: 'Intergalactic Head Coach',
  },
  {
    displayName: 'Coach Braveheart',
    legalName: 'Zevi Lev Horwitz',
    pronouns: 'he/him',
    role: 'Derby 101/201 Program Head Coach',
  },
  {
    displayName: 'Coach Reign of Tara',
    legalName: 'Tara Swick',
    pronouns: 'she/her',
    role: 'Intergalactic & Derby 101/201 Program Coach',
    bio: 'Tara has been involved with SRD since her first 101 in 2023 and now plays with the Kodiaks. She started coaching the Beastie Bears and assisting the junior 101 program in 2024. She believes every great skater starts with a solid foundation, and her favorite skill to teach is balance — the essential "secret sauce" for staying upright, agile, and powerful on eight wheels.',
  },
  {
    displayName: 'BamBOO',
    legalName: 'Michelle Ng',
    pronouns: 'she/her',
    role: 'Derby 101/201 Program Coach',
  },
];

export const QUICK_FACTS = [
  { label: 'Ages', value: '8-17 (18 by exception)' },
  { label: 'Program', value: 'Open gender' },
  { label: 'Association', value: 'JRDA member' },
];

export const JOIN_PATHS = [
  {
    tag: 'New to Roller Derby',
    title: 'Start with Derby 101',
    description:
      "Never played roller derby before? Start here — even skaters with general skating experience must complete Derby 101 to learn derby-specific rules, safety, and gameplay before joining a team.",
    cta: {
      type: 'scroll' as const,
      label: 'Registration is just below',
      href: '#register',
    },
  },
  {
    tag: 'Experienced Roller Derby Skater',
    title: 'Contact Us',
    description:
      'Transferring from another roller derby league? Reach out to us directly so we can get your skater set up quickly.',
    cta: {
      type: 'button' as const,
      label: 'Contact Us',
      href: 'mailto:juniorcoaches@sacramentorollerderby.com',
      variant: 'primary' as const,
    },
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
      'Derby 101 is our beginner-level program and does not require any prior skills. It focuses on basic skating skills, safety, and roller derby concepts, and is the entry point into our Training Program pipeline.',
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
