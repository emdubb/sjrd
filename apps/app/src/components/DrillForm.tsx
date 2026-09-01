import type { RefObject } from 'react';
import {
  Box,
  TextField,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  type SelectChangeEvent,
} from '@mui/material';
import { BRAND, pillChipSx } from '../lib/brand';
import {
  DRILL_TYPES,
  DRILL_TYPE_LABELS,
  DRILL_CATEGORIES,
  DRILL_CATEGORY_LABELS,
  DRILL_EQUIPMENT,
  DRILL_EQUIPMENT_LABELS,
  type DrillType,
  type DrillCategory,
  type DrillEquipment,
} from '../lib/drills';

interface Props {
  title: string;
  onTitleChange: (value: string) => void;
  duration: string;
  onDurationChange: (value: string) => void;
  categories: DrillCategory[];
  onSelectCategory: (category: DrillCategory) => void;
  types: DrillType[];
  onToggleType: (type: DrillType) => void;
  equipment: DrillEquipment[];
  onEquipmentChange: (e: SelectChangeEvent<DrillEquipment[]>) => void;
  descriptionRef: RefObject<HTMLTextAreaElement | null>;
  instructionsRef: RefObject<HTMLTextAreaElement | null>;
}

export function DrillForm({
  title,
  onTitleChange,
  duration,
  onDurationChange,
  categories,
  onSelectCategory,
  types,
  onToggleType,
  equipment,
  onEquipmentChange,
  descriptionRef,
  instructionsRef,
}: Props) {
  return (
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
        label="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        variant="outlined"
        fullWidth
      />

      <TextField
        label="Duration (minutes)"
        type="number"
        value={duration}
        onChange={(e) => onDurationChange(e.target.value)}
        variant="outlined"
        fullWidth
      />

      <Box>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mb: 1 }}>
          Category
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {DRILL_CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={DRILL_CATEGORY_LABELS[category]}
              onClick={() => onSelectCategory(category)}
              sx={pillChipSx(categories.includes(category))}
            />
          ))}
        </Box>
      </Box>

      <Box>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mb: 1 }}>
          Type
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {DRILL_TYPES.map((type) => (
            <Chip
              key={type}
              label={DRILL_TYPE_LABELS[type]}
              onClick={() => onToggleType(type)}
              sx={pillChipSx(types.includes(type))}
            />
          ))}
        </Box>
      </Box>

      <FormControl fullWidth>
        <InputLabel id="drill-equipment-label">Equipment</InputLabel>
        <Select
          labelId="drill-equipment-label"
          label="Equipment"
          multiple
          value={equipment}
          onChange={onEquipmentChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {selected.map((value) => (
                <Chip key={value} label={DRILL_EQUIPMENT_LABELS[value]} size="small" />
              ))}
            </Box>
          )}
        >
          {DRILL_EQUIPMENT.map((item) => (
            <MenuItem key={item} value={item}>
              <Checkbox checked={equipment.includes(item)} />
              <ListItemText primary={DRILL_EQUIPMENT_LABELS[item]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Description"
        placeholder="Short summary of what the drill focuses on, e.g. builds pack endurance and gap control"
        defaultValue=""
        inputRef={descriptionRef}
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        InputProps={{ inputComponent: 'textarea' }}
      />

      <TextField
        label="Instructions"
        placeholder="Step-by-step directions for running the drill"
        defaultValue=""
        inputRef={instructionsRef}
        variant="outlined"
        fullWidth
        multiline
        rows={6}
        InputProps={{ inputComponent: 'textarea' }}
      />
    </Box>
  );
}
