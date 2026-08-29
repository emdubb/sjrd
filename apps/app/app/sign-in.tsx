import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { supabase } from '@sjrd/api-client';
import { BRAND } from '../src/lib/brand';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) setError(authError.message);
  };

  const fieldSx = {};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: BRAND.navy,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Paper elevation={0} sx={{ borderRadius: 3, p: 4, width: '100%', maxWidth: 400 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: BRAND.navy, mb: 0.5, textAlign: 'center' }}
        >
          Sacramento Jr. Roller Derby
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7A8D', mb: 3.5, textAlign: 'center' }}>
          Sign in to continue
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            sx={fieldSx}
            InputLabelProps={{ shrink: true }}
            onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            sx={fieldSx}
            InputLabelProps={{ shrink: true }}
            onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
          />

          {error && (
            <Typography variant="body2" sx={{ color: '#C62828' }}>
              {error}
            </Typography>
          )}

          <Button
            onClick={handleSignIn}
            disabled={loading || !email || !password}
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              bgcolor: BRAND.navy,
              color: '#fff',
              borderRadius: 1,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              mt: 0.5,
              '&:hover': { bgcolor: '#112C56' },
              '&.Mui-disabled': { bgcolor: '#C8D0DA', color: '#fff' },
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
