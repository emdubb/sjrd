import { Box, Button } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { BRAND } from '../lib/brand';

interface Props {
  invited: boolean;
  inviting: boolean;
  onInvite: () => void;
  onEdit: () => void;
}

export function AdminUserViewActions({ invited, inviting, onInvite, onEdit }: Props) {
  return (
    <Box
      sx={{
        px: 3,
        pt: 1.5,
        pb: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {!invited && (
        <Button
          onClick={onInvite}
          disabled={inviting}
          fullWidth
          variant="contained"
          disableElevation
          sx={{
            bgcolor: '#B45300',
            color: '#fff',
            borderRadius: 1,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
            '&:hover': { bgcolor: '#8A4000' },
            '&.Mui-disabled': { bgcolor: '#C8D0DA', color: '#fff' },
          }}
        >
          {inviting ? 'Inviting…' : 'Invite'}
        </Button>
      )}
      <Button
        onClick={onEdit}
        fullWidth
        variant={invited ? 'contained' : 'outlined'}
        disableElevation
        startIcon={<EditOutlinedIcon />}
        sx={
          invited
            ? {
                bgcolor: BRAND.navy,
                color: '#fff',
                borderRadius: 1,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                '&:hover': { bgcolor: '#112C56' },
              }
            : {
                borderColor: BRAND.navy,
                color: BRAND.navy,
                borderRadius: 1,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
              }
        }
      >
        Edit Assignments
      </Button>
    </Box>
  );
}
