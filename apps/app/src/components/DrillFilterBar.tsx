import { useState } from 'react';
import { Box, Typography, TextField, Chip, Badge, Popover, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { BRAND, pillChipSx } from '../lib/brand';
import {
  DRILL_CATEGORIES,
  DRILL_CATEGORY_LABELS,
  DRILL_TYPES,
  DRILL_TYPE_LABELS,
  type DrillCategory,
  type DrillType,
} from '../lib/drills';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  category: DrillCategory | null;
  onSelectCategory: (category: DrillCategory) => void;
  types: DrillType[];
  onToggleType: (type: DrillType) => void;
  onClearFilters: () => void;
}

export function DrillFilterBar({
  search,
  onSearchChange,
  category,
  onSelectCategory,
  types,
  onToggleType,
  onClearFilters,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const activeFilterCount = (category ? 1 : 0) + types.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
      <TextField
        label="Search drills"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        variant="outlined"
        fullWidth
      />

      <Box>
        <Badge
          badgeContent={activeFilterCount}
          sx={{ '& .MuiBadge-badge': { bgcolor: BRAND.navy, color: '#fff' } }}
        >
          <Chip
            icon={<FilterListIcon sx={{ fontSize: 18 }} />}
            label="Filters"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={pillChipSx(activeFilterCount > 0)}
          />
        </Badge>
      </Box>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { borderRadius: 2, p: 2.5, width: 300, maxWidth: '90vw' } } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1rem' }}>
            Filters
          </Typography>
          {activeFilterCount > 0 && (
            <Button
              onClick={onClearFilters}
              sx={{
                color: '#6B7A8D',
                fontWeight: 600,
                fontSize: '0.8rem',
                textTransform: 'none',
                minWidth: 0,
              }}
            >
              Clear
            </Button>
          )}
        </Box>

        <Typography
          sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mt: 1.5, mb: 1 }}
        >
          Category
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {DRILL_CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={DRILL_CATEGORY_LABELS[c]}
              onClick={() => onSelectCategory(c)}
              sx={pillChipSx(category === c)}
            />
          ))}
        </Box>

        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mt: 2, mb: 1 }}>
          Type
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {DRILL_TYPES.map((t) => (
            <Chip
              key={t}
              label={DRILL_TYPE_LABELS[t]}
              onClick={() => onToggleType(t)}
              sx={pillChipSx(types.includes(t))}
            />
          ))}
        </Box>
      </Popover>
    </Box>
  );
}
