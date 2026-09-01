import { useState, useEffect } from 'react';
import { Dialog, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { EventDrawerHeader } from './EventDrawerHeader';
import { DrillRow } from './DrillRow';
import { DrillFilterBar } from './DrillFilterBar';
import { BRAND } from '../lib/brand';
import {
  fetchDrills,
  filterDrills,
  type Drill,
  type DrillCategory,
  type DrillType,
} from '../lib/drills';

interface Props {
  open: boolean;
  excludeDrillIds: string[];
  onClose: () => void;
  onSelect: (drillId: string) => void;
}

export function DrillPickerDialog({ open, excludeDrillIds, onClose, onSelect }: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [drillLibrary, setDrillLibrary] = useState<Drill[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DrillCategory | null>(null);
  const [typeFilters, setTypeFilters] = useState<DrillType[]>([]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;
    setSearch('');
    setCategoryFilter(null);
    setTypeFilters([]);
    fetchDrills()
      .then(setDrillLibrary)
      .catch(() => {});
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleTypeFilter = (type: DrillType) =>
    setTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const selectCategoryFilter = (category: DrillCategory) =>
    setCategoryFilter((prev) => (prev === category ? null : category));

  const clearFilters = () => {
    setCategoryFilter(null);
    setTypeFilters([]);
  };

  const availableDrills = drillLibrary.filter((d) => !excludeDrillIds.includes(d.id));
  const filteredDrills = filterDrills(availableDrills, {
    search,
    category: categoryFilter,
    types: typeFilters,
  });

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
      <EventDrawerHeader title="Add Drills" onClose={onClose} />

      <Box sx={{ px: 3, pt: 2 }}>
        <DrillFilterBar
          search={search}
          onSearchChange={setSearch}
          category={categoryFilter}
          onSelectCategory={selectCategoryFilter}
          types={typeFilters}
          onToggleType={toggleTypeFilter}
          onClearFilters={clearFilters}
        />
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 3, pt: 1.5, pb: 3 }}>
        {filteredDrills.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9AABBD', py: 4, textAlign: 'center' }}>
            {availableDrills.length === 0
              ? 'All drills have been added.'
              : 'No drills match your filters.'}
          </Typography>
        ) : (
          filteredDrills.map((drill) => (
            <DrillRow
              key={drill.id}
              drill={drill}
              onClick={() => onSelect(drill.id)}
              trailingIcon={
                <AddCircleOutlineIcon sx={{ color: BRAND.navy, flexShrink: 0, fontSize: 26 }} />
              }
            />
          ))
        )}
      </Box>
    </Dialog>
  );
}
