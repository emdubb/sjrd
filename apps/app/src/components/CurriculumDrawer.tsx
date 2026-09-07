import { useState, useEffect } from 'react';
import { Drawer, Box, Button } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { EventDrawerHeader } from './EventDrawerHeader';
import { CurriculumViewBody } from './CurriculumViewBody';
import { CurriculumForm } from './CurriculumForm';
import { BRAND } from '../lib/brand';
import {
  type CurriculumItem,
  type CurriculumFormData,
  type CurriculumDrill,
} from '../lib/curriculum';

type Mode = 'view' | 'edit';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: CurriculumFormData) => Promise<void>;
  editItem?: CurriculumItem | null;
  onDelete?: () => void;
}

export function CurriculumDrawer({ open, onClose, onSave, editItem, onDelete }: Props) {
  const [mode, setMode] = useState<Mode>('edit');
  const [weekNumber, setWeekNumber] = useState('');
  const [content, setContent] = useState('');
  const [drills, setDrills] = useState<CurriculumDrill[]>([]);
  const [saving, setSaving] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;
    if (editItem) {
      setWeekNumber(String(editItem.weekNumber));
      setContent(editItem.content ?? '');
      setDrills(editItem.drills);
      setMode('view');
    } else {
      setWeekNumber('');
      setContent('');
      setDrills([]);
      setMode('edit');
    }
  }, [open, editItem]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const weekNumberValue = Number(weekNumber);
  const canSave = weekNumberValue > 0;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave({
        weekNumber: weekNumberValue,
        content,
        drillIds: drills.map((d) => d.id),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const showView = mode === 'view' && !!editItem;

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
        title={showView ? undefined : editItem ? 'Edit Curriculum' : 'Add Curriculum'}
        onClose={onClose}
      />

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {showView && editItem ? (
          <>
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <CurriculumViewBody item={editItem} />
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
                Edit Curriculum
              </Button>
            </Box>
          </>
        ) : (
          <>
            <CurriculumForm
              weekNumber={weekNumber}
              onWeekNumberChange={setWeekNumber}
              content={content}
              onContentChange={setContent}
              drills={drills}
              onDrillsChange={setDrills}
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

              {editItem && onDelete && (
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
