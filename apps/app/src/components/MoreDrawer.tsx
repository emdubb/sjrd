import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider, Badge,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { BRAND } from '../lib/mockEvents';

const ITEMS = [
  { label: 'Profile',       icon: <PersonOutlineIcon />,      badge: 0 },
  { label: 'Notifications', icon: <NotificationsNoneIcon />,  badge: 2 },
  { label: 'Admin',         icon: <AdminPanelSettingsIcon />, badge: 0 },
  { label: 'Eligibility',   icon: <VerifiedOutlinedIcon />,   badge: 0 },
  { label: 'References',    icon: <MenuBookIcon />,           badge: 0 },
];

interface Props {
  open: boolean;
  onClose: () => void;
  anchor?: 'bottom' | 'right';
}

export function MoreDrawer({ open, onClose, anchor = 'bottom' }: Props) {
  const isRight = anchor === 'right';

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: isRight
          ? { width: 280, pt: 2 }
          : { borderRadius: '16px 16px 0 0', pb: 'env(safe-area-inset-bottom, 12px)' },
      }}
    >
      {/* Drag handle — mobile only */}
      {!isRight && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.5, pb: 0.5 }}>
          <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: '#E0E6ED' }} />
        </Box>
      )}

      {/* Header */}
      <Box sx={{ px: 3, pt: isRight ? 0.5 : 1.5, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1rem' }}>
          More
        </Typography>
      </Box>

      <Divider />

      {/* Nav items */}
      <List disablePadding sx={{ px: 1, pt: 0.5, pb: 1 }}>
        {ITEMS.map(({ label, icon, badge }) => (
          <ListItemButton
            key={label}
            onClick={onClose}
            sx={{
              borderRadius: 2,
              py: 1.25,
              px: 2,
              '&:hover': { bgcolor: BRAND.notifBg },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: BRAND.navy }}>
              {badge > 0 ? (
                <Badge badgeContent={badge} color="error">{icon}</Badge>
              ) : icon}
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ fontWeight: 500, color: BRAND.navy, fontSize: '0.95rem' }}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
