import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ThemeProvider, CssBaseline } from '@mui/material';
import githubTheme from '../theme';

export default function AppLayout() {
  return (
    <ThemeProvider theme={githubTheme}>
      <CssBaseline />
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: githubTheme.palette.background.default,
  },
});
