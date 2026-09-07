import { Box, Typography, Chip } from '@mui/material';
import { TeamChipsField } from './TeamChipsField';
import { BRAND, pillChipSx } from '../lib/brand';
import { USER_TYPE_ORDER, USER_TYPE_LABELS, type UserType } from '../lib/userTypes';

interface Props {
  userTypes: UserType[];
  onToggleUserType: (type: UserType) => void;
  teams?: { id: string; name: string }[];
  teamIds?: string[];
  onToggleTeam?: (teamId: string) => void;
  userTypeOptions?: UserType[];
  showTeams?: boolean;
}

export function UserAssignmentFields({
  userTypes,
  onToggleUserType,
  teams = [],
  teamIds = [],
  onToggleTeam = () => {},
  userTypeOptions = USER_TYPE_ORDER,
  showTeams = true,
}: Props) {
  return (
    <>
      <Box>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mb: 1 }}>
          Role Types
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {userTypeOptions.map((type) => (
            <Chip
              key={type}
              label={USER_TYPE_LABELS[type]}
              onClick={() => onToggleUserType(type)}
              sx={pillChipSx(userTypes.includes(type))}
            />
          ))}
        </Box>
      </Box>

      {showTeams && <TeamChipsField teams={teams} teamIds={teamIds} onToggleTeam={onToggleTeam} />}
    </>
  );
}
