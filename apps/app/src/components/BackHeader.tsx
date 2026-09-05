import type { ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BRAND } from '../lib/brand';

interface Props {
  title: string;
  onBack: () => void;
  action?: ReactNode;
}

export function BackHeader({ title, onBack, action }: Props) {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        px: 1,
        py: 1,
      }}
    >
      <Button
        onClick={onBack}
        aria-label="Back"
        startIcon={<ArrowBackIcon fontSize="small" />}
        sx={{
          color: BRAND.steel,
          fontWeight: 600,
          fontSize: '0.8125rem',
          textTransform: 'none',
          minHeight: 44,
          px: 1,
          zIndex: 1,
        }}
      >
        Back
      </Button>
      <Typography
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontWeight: 700,
          fontSize: '1.05rem',
          color: BRAND.navy,
          maxWidth: '55%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </Typography>
      {action && <Box sx={{ ml: 'auto', zIndex: 1 }}>{action}</Box>}
    </Box>
  );
}
