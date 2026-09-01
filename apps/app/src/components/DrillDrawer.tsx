import { useState, useEffect, useRef } from 'react';
import { Drawer, Box, Button, type SelectChangeEvent } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { EventDrawerHeader } from './EventDrawerHeader';
import { DrillViewBody } from './DrillViewBody';
import { DrillForm } from './DrillForm';
import { BRAND } from '../lib/brand';
import {
  type Drill,
  type DrillFormData,
  type DrillType,
  type DrillCategory,
  type DrillEquipment,
} from '../lib/drills';

type Mode = 'view' | 'edit';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: DrillFormData) => Promise<void>;
  editDrill?: Drill | null;
  onDelete?: () => void;
}

export function DrillDrawer({ open, onClose, onSave, editDrill, onDelete }: Props) {
  const [mode, setMode] = useState<Mode>('edit');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [types, setTypes] = useState<DrillType[]>([]);
  const [categories, setCategories] = useState<DrillCategory[]>([]);
  const [equipment, setEquipment] = useState<DrillEquipment[]>([]);
  const [saving, setSaving] = useState(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const instructionsRef = useRef<HTMLTextAreaElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;
    if (editDrill) {
      setTitle(editDrill.title);
      setDuration(String(editDrill.durationMinutes));
      setTypes(editDrill.types);
      setCategories(editDrill.categories);
      setEquipment(editDrill.equipment);
      setMode('view');
    } else {
      setTitle('');
      setDuration('');
      setTypes([]);
      setCategories([]);
      setEquipment([]);
      setMode('edit');
    }
  }, [open, editDrill]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // The description/instructions textareas only exist in the DOM while mode === 'edit',
  // so their values must be (re)synced whenever the form becomes visible, not just on open.
  useEffect(() => {
    if (mode !== 'edit') return;
    if (descriptionRef.current) descriptionRef.current.value = editDrill?.description ?? '';
    if (instructionsRef.current) instructionsRef.current.value = editDrill?.instructions ?? '';
  }, [mode, editDrill]);

  const toggleType = (type: DrillType) =>
    setTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));

  const selectCategory = (category: DrillCategory) =>
    setCategories((prev) => (prev[0] === category ? [] : [category]));

  const handleEquipmentChange = (e: SelectChangeEvent<DrillEquipment[]>) => {
    const value = e.target.value;
    setEquipment(typeof value === 'string' ? (value.split(',') as DrillEquipment[]) : value);
  };

  const durationMinutes = Number(duration);
  const canSave = !!title && durationMinutes > 0;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave({
        title,
        description: descriptionRef.current?.value ?? '',
        instructions: instructionsRef.current?.value ?? '',
        durationMinutes,
        types,
        categories,
        equipment,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const showView = mode === 'view' && !!editDrill;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px 16px 0 0',
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <EventDrawerHeader
        title={showView ? undefined : editDrill ? 'Edit Drill' : 'New Drill'}
        onClose={onClose}
      />

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {showView && editDrill ? (
          <>
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <DrillViewBody drill={editDrill} />
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
                onClick={() => setMode('edit')}
                fullWidth
                variant="contained"
                disableElevation
                startIcon={<EditOutlinedIcon />}
                sx={{
                  bgcolor: BRAND.navy,
                  color: '#fff',
                  borderRadius: 1,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#112C56' },
                }}
              >
                Edit Drill
              </Button>
            </Box>
          </>
        ) : (
          <>
            <DrillForm
              title={title}
              onTitleChange={setTitle}
              duration={duration}
              onDurationChange={setDuration}
              categories={categories}
              onSelectCategory={selectCategory}
              types={types}
              onToggleType={toggleType}
              equipment={equipment}
              onEquipmentChange={handleEquipmentChange}
              descriptionRef={descriptionRef}
              instructionsRef={instructionsRef}
            />

            <Box
              sx={{
                px: 3,
                pt: 1.5,
                pb: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
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
                {saving ? 'Saving…' : 'Save'}
              </Button>

              {editDrill && onDelete && (
                <Button
                  onClick={onDelete}
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderColor: '#C62828',
                    color: '#C62828',
                    borderRadius: 1,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#FFEBEE', borderColor: '#C62828' },
                  }}
                >
                  Delete
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
