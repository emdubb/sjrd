import { useEffect, useState } from 'react';
import { supabase, User } from '@sjrd/api-client';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email')
        .limit(1)
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setUser((data as User | null) ?? null);
    }

    fetchUser();
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#0B233F', color: '#FFFFFF', padding: '4rem 1.5rem' }}>
      <section style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.24em', color: '#F2BF35', fontWeight: 700 }}>Sacramento Junior Roller Derby</p>
        <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', margin: '1rem 0', lineHeight: 1.05 }}>A place for youth athletes to skate, learn, and lead.</h1>
        <p style={{ margin: '1.5rem auto', maxWidth: 600, color: '#B9C2CC', fontSize: '1.1rem', lineHeight: 1.8 }}>This landing page demonstrates the public site fetching backend data from Supabase. A seeded user is loaded and shown below.</p>
        <div style={{ margin: '2rem auto', padding: '2rem', background: '#112C56', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
          {error ? (
            <p style={{ color: '#FF7A7A' }}>Error loading user: {error}</p>
          ) : user ? (
            <>
              <p style={{ margin: 0, fontSize: '1rem', color: '#F2BF35', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Seeded Demo User</p>
              <h2 style={{ margin: '0.75rem 0 0', fontSize: '2rem' }}>Hello, {user.full_name}!</h2>
              <p style={{ margin: '0.75rem 0 0', color: '#B9C2CC' }}>Your email is {user.email}.</p>
            </>
          ) : (
            <p>Loading profile…</p>
          )}
        </div>
      </section>
    </main>
  );
}
