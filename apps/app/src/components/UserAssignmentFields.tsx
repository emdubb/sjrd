import { Box, Typography, Chip } from '@mui/material';
import { BRAND, pillChipSx } from '../lib/brand';
import { USER_TYPE_ORDER, USER_TYPE_LABELS, type UserType } from '../lib/userTypes';

interface Props {
  userTypes: UserType[];
  onToggleUserType: (type: UserType) => void;
  teams: { id: string; name: string }[];
  teamIds: string[];
  onToggleTeam: (teamId: string) => void;
}

export function UserAssignmentFields({
  userTypes,
  onToggleUserType,
  teams,
  teamIds,
  onToggleTeam,
}: Props) {
  return (
    <>
      <Box>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mb: 1 }}>
          Role Types
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {USER_TYPE_ORDER.map((type) => (
            <Chip
              key={type}
              label={USER_TYPE_LABELS[type]}
              onClick={() => onToggleUserType(type)}
              sx={pillChipSx(userTypes.includes(type))}
            />
          ))}
        </Box>
      </Box>

      <Box>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mb: 1 }}>
          Team
        </Typography>
        {teams.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9AABBD' }}>
            No teams set up yet.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {teams.map((team) => (
              <Chip
                key={team.id}
                label={team.name}
                onClick={() => onToggleTeam(team.id)}
                sx={pillChipSx(teamIds.includes(team.id))}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
