import { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Badge,
  Popover,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { BRAND, pillChipSx } from '../lib/brand';
import type { PracticeFilters } from '../lib/practice';

interface Props {
  filters: PracticeFilters;
  onChange: (filters: PracticeFilters) => void;
  teams: { id: string; name: string }[];
}

export function PracticeFilterPopover({ filters, onChange, teams }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const activeCount =
    (filters.startDate ? 1 : 0) + (filters.endDate ? 1 : 0) + (filters.teamId ? 1 : 0);

  const clearFilters = () => onChange({ startDate: null, endDate: null, teamId: null });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Badge
        badgeContent={activeCount}
        sx={{ '& .MuiBadge-badge': { bgcolor: BRAND.navy, color: '#fff' } }}
      >
        <Chip
          icon={<FilterListIcon sx={{ fontSize: 18 }} />}
          label="Filters"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={pillChipSx(activeCount > 0)}
        />
      </Badge>

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
          {activeCount > 0 && (
            <Button
              onClick={clearFilters}
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1.5 }}>
          <DatePicker
            label="Start date"
            value={filters.startDate ? dayjs(filters.startDate) : null}
            onChange={(value: Dayjs | null) =>
              onChange({ ...filters, startDate: value ? value.format('YYYY-MM-DD') : null })
            }
            slotProps={{ textField: { fullWidth: true } }}
          />
          <DatePicker
            label="End date"
            value={filters.endDate ? dayjs(filters.endDate) : null}
            onChange={(value: Dayjs | null) =>
              onChange({ ...filters, endDate: value ? value.format('YYYY-MM-DD') : null })
            }
            slotProps={{ textField: { fullWidth: true } }}
          />
          <FormControl fullWidth>
            <InputLabel id="practice-team-filter-label">Team</InputLabel>
            <Select
              labelId="practice-team-filter-label"
              label="Team"
              value={filters.teamId ?? ''}
              onChange={(e) =>
                onChange({ ...filters, teamId: e.target.value === '' ? null : e.target.value })
              }
            >
              <MenuItem value="">All teams</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Popover>
    </LocalizationProvider>
  );
}
