import { useRouter } from 'expo-router';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Tab,
  Tabs,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SportsIcon from '@mui/icons-material/Sports';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuIcon from '@mui/icons-material/Menu';
import { BRAND } from '../lib/brand';

export type NavRoute = 'home' | 'calendar' | 'coaching' | 'more';

const TAB_TO_ROUTE: Record<number, string> = {
  0: '/',
  1: '/calendar',
  2: '/coaching',
  3: '/more',
};
const ROUTE_TO_TAB: Record<NavRoute, number> = { home: 0, calendar: 1, coaching: 2, more: 3 };

export function AppNav({ current }: { current: NavRoute }) {
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const tabIndex = ROUTE_TO_TAB[current];

  const navigate = (v: number) => {
    const path = TAB_TO_ROUTE[v];
    if (path) router.replace(path as `/${string}`);
  };

  if (isDesktop) {
    return (
      <AppBar position="static" elevation={0} sx={{ bgcolor: BRAND.navy }}>
        <Toolbar sx={{ gap: 0 }}>
          <Tabs
            value={tabIndex}
            onChange={(_, v) => navigate(v)}
            sx={{
              '& .MuiTab-root': {
                color: '#FFFFFF',
                textTransform: 'none',
                fontSize: '0.95rem',
                minWidth: 0,
                px: 2.5,
                opacity: 1,
              },
              '& .MuiTab-root.Mui-selected': { color: BRAND.gold },
              '& .MuiTabs-indicator': { backgroundColor: BRAND.gold, height: 3 },
            }}
          >
            <Tab label="Home" />
            <Tab label="Calendar" />
            <Tab label="Coaching" />
          </Tabs>
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={() => navigate(3)} sx={{ color: '#fff' }}>
            <Badge variant="dot" color="error">
              <MenuIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <BottomNavigation
      showLabels
      value={tabIndex}
      onChange={(_, v) => navigate(v)}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        bgcolor: BRAND.navy,
        height: 68,
        '& .MuiBottomNavigationAction-root': { color: '#FFFFFF', minWidth: 0 },
        '& .MuiBottomNavigationAction-root.Mui-selected': { color: BRAND.gold },
        '& .MuiBottomNavigationAction-label': { fontSize: '0.7rem', mt: 0.25, opacity: 1 },
        '& .MuiBottomNavigationAction-label.Mui-selected': { fontSize: '0.7rem' },
      }}
    >
      <BottomNavigationAction label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction label="Calendar" icon={<CalendarMonthIcon />} />
      <BottomNavigationAction label="Coaching" icon={<SportsIcon />} />
      <BottomNavigationAction
        label="More"
        icon={
          <Badge badgeContent={2} color="error">
            <MoreHorizIcon />
          </Badge>
        }
      />
    </BottomNavigation>
  );
}
