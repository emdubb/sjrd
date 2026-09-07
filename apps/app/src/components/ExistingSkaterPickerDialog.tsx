import { useState, useEffect } from 'react';
import { Dialog, Box, TextField, Typography, useTheme, useMediaQuery } from '@mui/material';
import { EventDrawerHeader } from './EventDrawerHeader';
import { ExistingSkaterRow } from './ExistingSkaterRow';
import { fetchExistingSkaters, type ExistingSkaterOption } from '../lib/guardianSkaters';

interface Props {
  open: boolean;
  excludeIds: string[];
  onClose: () => void;
  onSelect: (option: ExistingSkaterOption) => void;
}

export function ExistingSkaterPickerDialog({ open, excludeIds, onClose, onSelect }: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [options, setOptions] = useState<ExistingSkaterOption[]>([]);
  const [search, setSearch] = useState('');

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;
    setSearch('');
    fetchExistingSkaters()
      .then(setOptions)
      .catch(() => {});
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const query = search.trim().toLowerCase();
  const availableOptions = options.filter(
    (option) => !excludeIds.includes(`${option.source}:${option.id}`)
  );
  const filteredOptions = availableOptions.filter((option) =>
    !query ? true : option.name.toLowerCase().includes(query)
  );

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
      <EventDrawerHeader title="Add Existing Skater" onClose={onClose} />

      <Box sx={{ px: 3, pt: 2 }}>
        <TextField
          label="Search skaters"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          fullWidth
        />
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 3, pt: 1.5, pb: 3 }}>
        {filteredOptions.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9AABBD', py: 4, textAlign: 'center' }}>
            {availableOptions.length === 0
              ? 'No existing skaters to add.'
              : 'No skaters match your search.'}
          </Typography>
        ) : (
          filteredOptions.map((option) => (
            <ExistingSkaterRow
              key={`${option.source}:${option.id}`}
              name={option.name}
              onClick={() => onSelect(option)}
            />
          ))
        )}
      </Box>
    </Dialog>
  );
}
