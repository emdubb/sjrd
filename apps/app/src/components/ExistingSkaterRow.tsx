import { Box, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { BRAND } from '../lib/brand';

interface Props {
  name: string;
  onClick: () => void;
}

export function ExistingSkaterRow({ name, onClick }: Props) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        py: 1.5,
        px: 1.5,
        mx: -1.5,
        borderBottom: '1px solid #E0E6ED',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        '&:hover': { bgcolor: BRAND.notifBg },
      }}
    >
      <Typography sx={{ color: BRAND.navy, fontWeight: 600, fontSize: '1rem' }}>{name}</Typography>
      <AddCircleOutlineIcon sx={{ color: BRAND.navy, flexShrink: 0, fontSize: 26 }} />
    </Box>
  );
}
