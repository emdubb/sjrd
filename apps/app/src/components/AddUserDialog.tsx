import { useState, useEffect } from 'react';
import { Dialog, Box, TextField, Button, useTheme, useMediaQuery } from '@mui/material';
import { EventDrawerHeader } from './EventDrawerHeader';
import { UserAssignmentFields } from './UserAssignmentFields';
import { GuardianSkatersField } from './GuardianSkatersField';
import { BRAND } from '../lib/brand';
import { fetchTeams } from '../lib/events';
import { addPendingUser } from '../lib/adminUsers';
import type { SkaterAttachment } from '../lib/guardianSkaters';
import { USER_TYPE_ORDER, type UserType } from '../lib/userTypes';

const ADD_USER_TYPE_OPTIONS = USER_TYPE_ORDER.filter((type) => type !== 'skater');

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export function AddUserDialog({ open, onClose, onAdded }: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [derbyName, setDerbyName] = useState('');
  const [email, setEmail] = useState('');
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [skaters, setSkaters] = useState<SkaterAttachment[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTeams()
      .then(setTeams)
      .catch(() => {});
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;
    setFirstName('');
    setLastName('');
    setPreferredName('');
    setDerbyName('');
    setEmail('');
    setUserTypes([]);
    setSkaters([]);
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleUserType = (type: UserType) => {
    const next = userTypes.includes(type)
      ? userTypes.filter((t) => t !== type)
      : [...userTypes, type];
    if (type === 'guardian' && !next.includes('guardian')) setSkaters([]);
    setUserTypes(next);
  };

  const canSave = !!firstName.trim() && !!lastName.trim() && !!email.trim();

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await addPendingUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        preferredName: preferredName.trim() || undefined,
        derbyName: derbyName.trim() || undefined,
        userTypes,
        teamIds: [],
        skaters,
      });
      onAdded();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={!isDesktop}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: isDesktop ? 2 : 0,
          height: isDesktop ? '85vh' : '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <EventDrawerHeader title="Add User" onClose={onClose} />

      <Box
        sx={{
          px: 3,
          pt: 1,
          pb: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
        }}
      >
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
          required
          fullWidth
        />

        <UserAssignmentFields
          userTypes={userTypes}
          onToggleUserType={toggleUserType}
          userTypeOptions={ADD_USER_TYPE_OPTIONS}
          showTeams={false}
        />

        {userTypes.includes('guardian') && (
          <GuardianSkatersField skaters={skaters} onChange={setSkaters} teams={teams} />
        )}
      </Box>

      <Box
        sx={{
          px: 3,
          pt: 1.5,
          pb: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
          flexShrink: 0,
        }}
      >
        <Button
          onClick={handleSave}
          disabled={saving || !canSave}
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
            '&:hover': { bgcolor: '#112C56' },
            '&.Mui-disabled': { bgcolor: '#C8D0DA', color: '#fff' },
          }}
        >
          {saving ? 'Adding…' : 'Add User'}
        </Button>
      </Box>
    </Dialog>
  );
}
