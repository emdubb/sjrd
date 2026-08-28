import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, CssBaseline } from '@mui/material';
import sjrdTheme from '../theme';

export default function AppLayout() {
  return (
    <ThemeProvider theme={sjrdTheme}>
      <CssBaseline />
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
