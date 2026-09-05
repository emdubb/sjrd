import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '@sjrd/api-client';
import { AppNav } from '../src/components/AppNav';
import { BRAND } from '../src/lib/brand';

const ITEMS = [
  { label: 'Profile', icon: <PersonOutlineIcon />, badge: 0, route: '/profile' as const },
  { label: 'Notifications', icon: <NotificationsNoneIcon />, badge: 2, route: null },
  { label: 'Admin', icon: <AdminPanelSettingsIcon />, badge: 0, route: '/admin' as const },
  { label: 'Eligibility', icon: <VerifiedOutlinedIcon />, badge: 0, route: null },
  { label: 'References', icon: <MenuBookIcon />, badge: 0, route: null },
];

export default function MorePage() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleItemClick = (route: string | null) => {
    if (route) router.push(route as `/${string}`);
  };

  const handleConfirmLogout = () => {
    setConfirmOpen(false);
    supabase.auth.signOut().catch(() => {});
  };

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav current="more" />

      <Box
        sx={{
          flex: 1,
          px: { xs: 2, md: 5 },
          pt: { xs: 3, md: 3.5 },
          pb: { xs: '88px', md: 3.5 },
          maxWidth: { md: 1140 },
          width: '100%',
          mx: { md: 'auto' },
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h5" sx={{ color: BRAND.navy, fontWeight: 700, mb: 2.5 }}>
          More
        </Typography>

        <List
          disablePadding
          sx={{ border: '1px solid #E0E6ED', borderRadius: 2, overflow: 'hidden', mb: 2 }}
        >
          {ITEMS.map(({ label, icon, badge, route }, i) => (
            <ListItemButton
              key={label}
              onClick={() => handleItemClick(route)}
              sx={{
                py: 2,
                px: 2.5,
                minHeight: 44,
                borderTop: i === 0 ? 'none' : '1px solid #E0E6ED',
                '&:hover': { bgcolor: BRAND.notifBg },
              }}
            >
              <ListItemIcon sx={{ minWidth: 44, color: BRAND.navy }}>
                {badge > 0 ? (
                  <Badge badgeContent={badge} color="error">
                    {icon}
                  </Badge>
                ) : (
                  icon
                )}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontWeight: 600, color: BRAND.navy, fontSize: '1rem' }}
              />
            </ListItemButton>
          ))}
        </List>

        <List
          disablePadding
          sx={{ border: '1px solid #E0E6ED', borderRadius: 2, overflow: 'hidden' }}
        >
          <ListItemButton
            onClick={() => setConfirmOpen(true)}
            sx={{
              py: 2,
              px: 2.5,
              minHeight: 44,
              '&:hover': { bgcolor: '#FFEBEE' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 44, color: '#C62828' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Log Out"
              primaryTypographyProps={{ fontWeight: 600, color: '#C62828', fontSize: '1rem' }}
            />
          </ListItemButton>
        </List>
      </Box>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, mx: 2 } }}
      >
        <IconButton
          onClick={() => setConfirmOpen(false)}
          aria-label="Close"
          sx={{ position: 'absolute', top: 8, right: 8, color: '#9AABBD', width: 44, height: 44 }}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle sx={{ fontWeight: 700, color: BRAND.navy, pr: 6 }}>Log out?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#4A5568' }}>
            You&apos;ll need to sign in again to access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{
              color: BRAND.navy,
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 44,
              px: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLogout}
            variant="contained"
            disableElevation
            sx={{
              bgcolor: '#C62828',
              color: '#fff',
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 700,
              minHeight: 44,
              px: 2.5,
              '&:hover': { bgcolor: '#A32020' },
            }}
          >
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
