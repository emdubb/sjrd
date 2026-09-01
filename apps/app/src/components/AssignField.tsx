import { useState, type ReactNode } from 'react';
import { Box, Typography, Button, Menu, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { BRAND } from '../lib/brand';
import type { CoachOption } from '../lib/practice';

interface Props {
  icon: ReactNode;
  label: string;
  valueText: string;
  hasValue: boolean;
  options: CoachOption[];
  selectedIds: string[];
  multiple: boolean;
  onChange: (ids: string[]) => void;
}

export function AssignField({
  icon,
  label,
  valueText,
  hasValue,
  options,
  selectedIds,
  multiple,
  onChange,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const selectCoach = (id: string | null) => {
    onChange(id ? [id] : []);
    setAnchorEl(null);
  };

  const toggleAssistant = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id]);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ color: '#9AABBD', flexShrink: 0, display: 'flex' }}>{icon}</Box>
      <Typography
        variant="body2"
        noWrap
        sx={{ color: '#4A5568', lineHeight: 1.6, flex: 1, minWidth: 0 }}
      >
        {label}: {hasValue ? valueText : '—'}
      </Typography>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label={`Assign ${label}`}
        sx={{
          color: BRAND.navy,
          fontWeight: 700,
          fontSize: '0.8125rem',
          textTransform: 'none',
          minWidth: 0,
          minHeight: 44,
          px: 1,
          flexShrink: 0,
        }}
      >
        assign
      </Button>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {!multiple && (
          <MenuItem selected={selectedIds.length === 0} onClick={() => selectCoach(null)}>
            None
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem
            key={option.id}
            selected={!multiple && selectedIds.includes(option.id)}
            onClick={() => (multiple ? toggleAssistant(option.id) : selectCoach(option.id))}
          >
            {multiple && (
              <Checkbox checked={selectedIds.includes(option.id)} sx={{ p: 0, mr: 1.5 }} />
            )}
            <ListItemText primary={option.name} />
          </MenuItem>
        ))}
        {options.length === 0 && <MenuItem disabled>No coaches found</MenuItem>}
      </Menu>
    </Box>
  );
}
