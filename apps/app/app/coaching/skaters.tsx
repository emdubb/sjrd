import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Box, Typography, Chip, TextField } from '@mui/material';
import { AppNav } from '../../src/components/AppNav';
import { BackHeader } from '../../src/components/BackHeader';
import { SkaterRow } from '../../src/components/SkaterRow';
import { SkaterDetailDrawer } from '../../src/components/SkaterDetailDrawer';
import { pillChipSx } from '../../src/lib/brand';
import { fetchSkaters, filterSkaters, type SkaterListItem } from '../../src/lib/skaters';
import { fetchTeams } from '../../src/lib/events';

export default function SkatersPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [skaters, setSkaters] = useState<SkaterListItem[]>([]);
  const [selectedSkaterId, setSelectedSkaterId] = useState<string | null>(null);

  const loadSkaters = useCallback((teamId: string | null) => {
    fetchSkaters({ teamId, currentOnly: false })
      .then(setSkaters)
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadSkaters(teamFilter);
  }, [teamFilter, loadSkaters]);

  useEffect(() => {
    fetchTeams()
      .then(setTeams)
      .catch(() => {});
  }, []);

  const visibleSkaters = filterSkaters(skaters, search);

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav current="coaching" />
      <BackHeader title="Skaters" onBack={() => router.replace('/coaching')} />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          px: 2,
          py: 2,
          pb: { xs: '88px', md: 3 },
          overflowY: 'auto',
        }}
      >
        <TextField
          label="Search skaters"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          fullWidth
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
          <Chip
            label="All Teams"
            onClick={() => setTeamFilter(null)}
            sx={pillChipSx(teamFilter === null)}
          />
          {teams.map((team) => (
            <Chip
              key={team.id}
              label={team.name}
              onClick={() => setTeamFilter(team.id)}
              sx={pillChipSx(teamFilter === team.id)}
            />
          ))}
        </Box>

        {visibleSkaters.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9AABBD', py: 4, textAlign: 'center' }}>
            {skaters.length === 0 ? 'No skaters found.' : 'No skaters match your search.'}
          </Typography>
        ) : (
          visibleSkaters.map((skater) => (
            <SkaterRow
              key={skater.id}
              skater={skater}
              onOpen={() => setSelectedSkaterId(skater.id)}
            />
          ))
        )}
      </Box>

      <SkaterDetailDrawer skaterId={selectedSkaterId} onClose={() => setSelectedSkaterId(null)} />
    </Box>
  );
}
