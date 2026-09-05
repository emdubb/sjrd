import { Box, Typography, Button } from '@mui/material';
import { UserAssignmentFields } from './UserAssignmentFields';
import { BRAND } from '../lib/brand';
import type { UserType } from '../lib/userTypes';

interface Props {
  name: string;
  email: string;
  userTypes: UserType[];
  onToggleUserType: (type: UserType) => void;
  teams: { id: string; name: string }[];
  teamIds: string[];
  onToggleTeam: (teamId: string) => void;
  saving: boolean;
  onSave: () => void;
}

export function AdminUserAssignmentForm({
  name,
  email,
  userTypes,
  onToggleUserType,
  teams,
  teamIds,
  onToggleTeam,
  saving,
  onSave,
}: Props) {
  return (
    <>
      <Box
        sx={{
          px: 3,
          pt: 1,
          pb: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
        }}
      >
        <Typography variant="body2" sx={{ color: '#6B7A8D' }}>
          {name} · {email}
        </Typography>
        <UserAssignmentFields
          userTypes={userTypes}
          onToggleUserType={onToggleUserType}
          teams={teams}
          teamIds={teamIds}
          onToggleTeam={onToggleTeam}
        />
      </Box>

      <Box
        sx={{ px: 3, pt: 1.5, pb: 'calc(env(safe-area-inset-bottom, 0px) + 20px)', flexShrink: 0 }}
      >
        <Button
          onClick={onSave}
          disabled={saving}
          fullWidth
          variant="contained"
          disableElevation
          sx={{
            bgcolor: BRAND.navy,
            color: '#fff',
            borderRadius: 1,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
            '&:hover': { bgcolor: '#112C56' },
            '&.Mui-disabled': { bgcolor: '#C8D0DA', color: '#fff' },
          }}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </Box>
    </>
  );
}
