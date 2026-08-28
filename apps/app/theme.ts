import { createTheme } from '@mui/material/styles';

const sjrdTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0B233F',
      light: '#112C56',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F2BF35',
      contrastText: '#0B233F',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0B233F',
      secondary: '#6B7A8D',
    },
    error: {
      main: '#D32F2F',
    },
    divider: '#E0E6ED',
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

export default sjrdTheme;
