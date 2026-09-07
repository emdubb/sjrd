import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { TeamChipsField } from './TeamChipsField';
import { BRAND } from '../lib/brand';
import type { NewSkaterInput } from '../lib/guardianSkaters';

interface Props {
  teams: { id: string; name: string }[];
  onAdd: (skater: NewSkaterInput) => void;
  onCancel: () => void;
}

export function InlineNewSkaterForm({ teams, onAdd, onCancel }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [derbyName, setDerbyName] = useState('');
  const [email, setEmail] = useState('');
  const [teamIds, setTeamIds] = useState<string[]>([]);

  const toggleTeam = (teamId: string) =>
    setTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((t) => t !== teamId) : [...prev, teamId]
    );

  const canAdd = !!firstName.trim() && !!lastName.trim();

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      preferredName: preferredName.trim() || undefined,
      derbyName: derbyName.trim() || undefined,
      email: email.trim() || undefined,
      teamIds,
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1.5 }}>
      <TextField
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        variant="outlined"
        required
        fullWidth
      />
      <TextField
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        variant="outlined"
        required
        fullWidth
      />
      <TextField
        label="Preferred Name"
        value={preferredName}
        onChange={(e) => setPreferredName(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Derby Name"
        value={derbyName}
        onChange={(e) => setDerbyName(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <TeamChipsField teams={teams} teamIds={teamIds} onToggleTeam={toggleTeam} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          onClick={handleAdd}
          disabled={!canAdd}
          variant="contained"
          disableElevation
          sx={{
            bgcolor: BRAND.navy,
            color: '#fff',
            borderRadius: 1,
            fontWeight: 700,
            '&:hover': { bgcolor: '#112C56' },
            '&.Mui-disabled': { bgcolor: '#C8D0DA', color: '#fff' },
          }}
        >
          Add Skater
        </Button>
        <Button
          onClick={onCancel}
          sx={{ color: BRAND.navy, fontWeight: 700, textTransform: 'none' }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
