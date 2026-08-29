import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BRAND } from '../lib/brand';

interface Props {
  title: string;
  onClose: () => void;
}

export function EventDrawerHeader({ title, onClose }: Props) {
  return (
    <Box sx={{ flexShrink: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.5, pb: 0.5 }}>
        <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: '#E0E6ED' }} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          px: 3,
          pt: 1,
          pb: 1.5,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: BRAND.navy }}>
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{ color: '#9AABBD', width: 44, height: 44 }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
