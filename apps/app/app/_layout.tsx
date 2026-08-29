import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { supabase } from '@sjrd/api-client';
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

  useEffect(() => {
    if (session === undefined) return; // still loading

    const onSignIn = segments[0] === 'sign-in';
    if (!session && !onSignIn) {
      router.replace('/sign-in');
    } else if (session && onSignIn) {
      router.replace('/');
    }
  }, [session, segments]);

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
