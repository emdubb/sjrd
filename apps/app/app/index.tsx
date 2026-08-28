import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { supabase, User } from '@sjrd/api-client';

export default function SplashPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email')
        .limit(1)
        .single() as { data: User | null; error: { message: string } | null };

      if (error) {
        setError(error.message);
      } else {
        setUser(data);
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.brand}>Sacramento Junior Roller Derby</Text>
        <Text style={styles.heading}>App splash demo</Text>
        <Text style={styles.copy}>This unsupported public splash page loads a seeded user from the backend.</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#F2BF35" style={{ marginTop: 24 }} />
        ) : error ? (
          <Text style={styles.error}>Error loading user: {error}</Text>
        ) : user ? (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Demo user</Text>
            <Text style={styles.cardName}>Hello, {user.full_name}!</Text>
            <Text style={styles.cardEmail}>{user.email}</Text>
          </View>
        ) : (
          <Text style={styles.copy}>No user found.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B233F'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  brand: {
    color: '#F2BF35',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 12
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16
  },
  copy: {
    color: '#B9C2CC',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 340
  },
  card: {
    marginTop: 28,
    width: '100%',
    backgroundColor: '#112C56',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  cardLabel: {
    color: '#F2BF35',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700'
  },
  cardEmail: {
    color: '#B9C2CC',
    fontSize: 14,
    marginTop: 8
  },
  error: {
    marginTop: 24,
    color: '#FF7A7A',
    textAlign: 'center'
  }
});
