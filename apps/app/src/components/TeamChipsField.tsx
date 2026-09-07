import { Box, Typography, Chip } from '@mui/material';
import { BRAND, pillChipSx } from '../lib/brand';

interface Props {
  teams: { id: string; name: string }[];
  teamIds: string[];
  onToggleTeam: (teamId: string) => void;
}

export function TeamChipsField({ teams, teamIds, onToggleTeam }: Props) {
  return (
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
  );
}
