import { createTheme } from '@mui/material/styles';

const githubTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#58A6FF',
      dark: '#1F6FEB',
      light: '#79C0FF',
      contrastText: '#0D1117',
    },
    secondary: {
      main: '#3FB950',
      dark: '#238636',
      light: '#56D364',
      contrastText: '#0D1117',
    },
    error: {
      main: '#F85149',
      dark: '#DA3633',
      light: '#FF7B72',
    },
    warning: {
      main: '#D29922',
      dark: '#BB8009',
      light: '#E3B341',
    },
    success: {
      main: '#3FB950',
      dark: '#238636',
      light: '#56D364',
    },
    background: {
      default: '#0D1117',
      paper: '#161B22',
    },
    text: {
      primary: '#E6EDF3',
      secondary: '#8B949E',
      disabled: '#484F58',
    },
    divider: '#30363D',
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '5px 16px',
          fontSize: '0.875rem',
          lineHeight: '20px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          backgroundColor: '#238636',
          color: '#FFFFFF',
          border: '1px solid rgba(240,246,252,0.1)',
          '&:hover': { backgroundColor: '#2EA043' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #30363D',
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#30363D',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#8B949E',
          },
        },
      },
    },
  },
});

export default githubTheme;
