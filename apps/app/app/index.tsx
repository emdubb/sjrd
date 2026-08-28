import { Box, CircularProgress } from '@mui/material';
import { Image } from 'react-native';

export default function LoadingPage() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B233F',
        minHeight: '100vh',
        gap: 5,
      }}
    >
      <Image
        source={require('../src/assets/logo.png')}
        style={{ width: 160, height: 160, resizeMode: 'contain' }}
        accessibilityLabel="Sacramento Junior Roller Derby"
      />
      <CircularProgress sx={{ color: '#F2BF35' }} />
    </Box>
  );
}
