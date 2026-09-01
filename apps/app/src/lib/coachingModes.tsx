import type { ReactNode } from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';

export type CoachingSection = 'Beastie Bears' | 'Training Program';

export interface CoachingMode {
  slug: 'practice' | 'games' | 'training-program' | 'skaters';
  label: string;
  icon: ReactNode;
  blurb: string;
  section: CoachingSection;
}

export const COACHING_SECTIONS: CoachingSection[] = ['Beastie Bears', 'Training Program'];

export const COACHING_MODES: CoachingMode[] = [
  {
    slug: 'practice',
    label: 'Practice',
    icon: <FitnessCenterIcon />,
    blurb: 'Build and share practice plans with your team.',
    section: 'Beastie Bears',
  },
  {
    slug: 'games',
    label: 'Games',
    icon: <EmojiEventsIcon />,
    blurb: 'Manage lineups, rosters, and game day details.',
    section: 'Beastie Bears',
  },
  {
    slug: 'skaters',
    label: 'Skaters',
    icon: <GroupsIcon />,
    blurb: 'View skater profiles and roster details.',
    section: 'Beastie Bears',
  },
  {
    slug: 'training-program',
    label: 'Derby 101',
    icon: <AssignmentIcon />,
    blurb: 'Assign and track skater training programs.',
    section: 'Training Program',
  },
];
