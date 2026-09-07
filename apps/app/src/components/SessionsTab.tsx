import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SessionGroupCard } from './SessionGroupCard';
import { AddSessionDialog } from './AddSessionDialog';
import { PracticeDetailDrawer } from './PracticeDetailDrawer';
import { BRAND } from '../lib/brand';
import { fetchSessions, type TrainingSessionGroup } from '../lib/sessions';
import { fetchCoaches, type PracticeEvent, type CoachOption } from '../lib/practice';

export function SessionsTab() {
  const [sessions, setSessions] = useState<TrainingSessionGroup[]>([]);
  const [coaches, setCoaches] = useState<CoachOption[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState<PracticeEvent | null>(null);

  const loadSessions = useCallback(() => {
    fetchSessions()
      .then(setSessions)
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    fetchCoaches()
      .then(setCoaches)
      .catch(() => {});
  }, []);

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        px: 2,
        py: 2,
        pb: { xs: '88px', md: 3 },
        overflowY: 'auto',
      }}
    >
      {sessions.length === 0 ? (
        <Typography variant="body2" sx={{ color: '#9AABBD', py: 4, textAlign: 'center' }}>
          No sessions yet.
        </Typography>
      ) : (
        sessions.map((session) => (
          <SessionGroupCard
            key={session.id}
            session={session}
            onOpenPractice={setSelectedPractice}
          />
        ))
      )}

      <Fab
        onClick={() => setAddOpen(true)}
        aria-label="Add session"
        sx={{
          position: 'fixed',
          bottom: { xs: 80, md: 32 },
          right: { xs: 20, md: 32 },
          bgcolor: BRAND.navy,
          color: '#fff',
          boxShadow: 3,
          '&:hover': { bgcolor: '#112C56' },
        }}
      >
        <AddIcon />
      </Fab>

      <AddSessionDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => {
          setAddOpen(false);
          loadSessions();
        }}
      />

      <PracticeDetailDrawer
        event={selectedPractice}
        coaches={coaches}
        onClose={() => setSelectedPractice(null)}
        onEventUpdated={loadSessions}
      />
    </Box>
  );
}
