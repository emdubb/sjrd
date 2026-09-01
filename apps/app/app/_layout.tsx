import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { ThemeProvider, CssBaseline, CircularProgress } from '@mui/material';
import { supabase } from '@sjrd/api-client';
import { BRAND } from '../src/lib/brand';
import sjrdTheme from '../theme';

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'];

export default function AppLayout() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  // Hand off from the static spinner rendered in +html.tsx to this component's
  // own (visually identical) loading state, now that React has mounted.
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.getElementById('initial-loading')?.remove();
    }
  }, []);

  const onSignIn = segments[0] === 'sign-in';
  const loading = session === undefined;
  const redirecting = !loading && ((!session && !onSignIn) || (session && onSignIn));

  useEffect(() => {
    if (loading) return;

    if (!session && !onSignIn) {
      router.replace('/sign-in');
    } else if (session && onSignIn) {
      router.replace('/');
    }
  }, [session, segments, loading, onSignIn]);

  return (
    <ThemeProvider theme={sjrdTheme}>
      <CssBaseline />
      <View style={styles.container}>
        {loading || redirecting ? (
          <View style={styles.loading}>
            <CircularProgress sx={{ color: BRAND.navy }} />
          </View>
        ) : (
          <Stack screenOptions={{ headerShown: false }} />
        )}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
