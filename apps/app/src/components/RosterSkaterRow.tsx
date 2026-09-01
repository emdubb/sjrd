import type { ReactNode } from 'react';
import { ListItemButton, ListItemIcon, Checkbox, Typography, Box } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VerifiedIcon from '@mui/icons-material/Verified';
import { BRAND } from '../lib/brand';
import type { AvailabilityStatus, RosterSkater } from '../lib/games';

interface Props {
  skater: RosterSkater;
  selected: boolean;
  onToggle: () => void;
}

const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  available: 'Available',
  not_available: 'Not Available',
  no_response: 'No Response',
};

function StatusDetail({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ color: '#9AABBD', display: 'flex' }}>{icon}</Box>
      <Typography variant="body2" sx={{ color: '#4A5568' }}>
        {text}
      </Typography>
    </Box>
  );
}

export function RosterSkaterRow({ skater, selected, onToggle }: Props) {
  return (
    <ListItemButton
      onClick={onToggle}
      disableGutters
      alignItems="flex-start"
      sx={{ px: 0.5, py: 1, minHeight: 44, borderBottom: '1px solid #E0E6ED' }}
    >
      <ListItemIcon sx={{ minWidth: 40, mt: 0.25 }}>
        <Checkbox edge="start" checked={selected} tabIndex={-1} disableRipple sx={{ p: 0.5 }} />
      </ListItemIcon>
      <Box>
        <Typography sx={{ color: BRAND.navy, fontWeight: 600, fontSize: '1rem' }}>
          {skater.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 0.25, flexWrap: 'wrap' }}>
          <StatusDetail
            icon={<EventAvailableIcon sx={{ fontSize: 16 }} />}
            text={AVAILABILITY_LABELS[skater.availability]}
          />
          <StatusDetail
            icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
            text={skater.eligible ? 'Eligible' : 'Not Eligible'}
          />
        </Box>
      </Box>
    </ListItemButton>
  );
}
