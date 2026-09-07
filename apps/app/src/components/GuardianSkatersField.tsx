import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AttachedSkaterRow } from './AttachedSkaterRow';
import { ExistingSkaterPickerDialog } from './ExistingSkaterPickerDialog';
import { InlineNewSkaterForm } from './InlineNewSkaterForm';
import { BRAND } from '../lib/brand';
import { formatDisplayName } from '../lib/practice';
import type { SkaterAttachment } from '../lib/guardianSkaters';

interface Props {
  skaters: SkaterAttachment[];
  onChange: (skaters: SkaterAttachment[]) => void;
  teams: { id: string; name: string }[];
}

export function GuardianSkatersField({ skaters, onChange, teams }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addingNew, setAddingNew] = useState(false);

  const removeSkater = (index: number) => onChange(skaters.filter((_, i) => i !== index));

  const excludeIds = skaters.filter((s) => s.kind === 'existing').map((s) => `${s.source}:${s.id}`);

  return (
    <Box>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mb: 1 }}>
        Skaters
      </Typography>
      <Typography variant="body2" sx={{ color: '#6B7A8D', mb: 1 }}>
        Attach the skaters this guardian is responsible for.
      </Typography>

      {skaters.length === 0 ? (
        <Typography variant="body2" sx={{ color: '#9AABBD', py: 1 }}>
          No skaters added yet.
        </Typography>
      ) : (
        skaters.map((skater, index) => (
          <AttachedSkaterRow key={index} name={skater.name} onRemove={() => removeSkater(index)} />
        ))
      )}

      {addingNew ? (
        <InlineNewSkaterForm
          teams={teams}
          onCancel={() => setAddingNew(false)}
          onAdd={(skater) => {
            const name = formatDisplayName({
              first_name: skater.firstName,
              last_name: skater.lastName,
              preferred_name: skater.preferredName ?? null,
              derby_name: skater.derbyName ?? null,
            });
            onChange([...skaters, { kind: 'new', skater, name }]);
            setAddingNew(false);
          }}
        />
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <Button
            onClick={() => setPickerOpen(true)}
            startIcon={<AddIcon />}
            sx={{ color: BRAND.navy, fontWeight: 700, textTransform: 'none', mt: 1, minHeight: 44 }}
          >
            Add Existing Skater
          </Button>
          <Button
            onClick={() => setAddingNew(true)}
            startIcon={<AddIcon />}
            sx={{ color: BRAND.navy, fontWeight: 700, textTransform: 'none', mt: 1, minHeight: 44 }}
          >
            Add New Skater
          </Button>
        </Box>
      )}

      <ExistingSkaterPickerDialog
        open={pickerOpen}
        excludeIds={excludeIds}
        onClose={() => setPickerOpen(false)}
        onSelect={(option) => {
          onChange([
            ...skaters,
            { kind: 'existing', id: option.id, source: option.source, name: option.name },
          ]);
          setPickerOpen(false);
        }}
      />
    </Box>
  );
}
