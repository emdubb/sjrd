import { useState, useEffect } from 'react';
import { Drawer, Box, Button } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { EventDrawerHeader } from './EventDrawerHeader';
import { EventViewBody } from './EventViewBody';
import { EventForm } from './EventForm';
import { BRAND } from '../lib/brand';
import { getAccentColor, type AppEvent, type EventFormData } from '../lib/events';

type Mode = 'view' | 'edit';

interface Props {
  event: AppEvent | null;
  onClose: () => void;
  onSave?: (data: EventFormData) => Promise<void>;
  onDelete?: () => void;
  onCancelEvent?: () => void;
}

export function EventDrawer({ event, onClose, onSave, onDelete, onCancelEvent }: Props) {
  const [mode, setMode] = useState<Mode>('view');

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (event) setMode('view');
  }, [event?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!event) return null;

  const accentColor = mode === 'view' ? getAccentColor(event) : undefined;

  return (
    <Drawer
      anchor="bottom"
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px 16px 0 0',
          borderTop: accentColor ? `4px solid ${accentColor}` : 'none',
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <EventDrawerHeader title={mode === 'view' ? undefined : 'Edit Event'} onClose={onClose} />
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {mode === 'view' ? (
          <>
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <EventViewBody event={event} />
            </Box>
            {onSave && (
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
                  Edit Event
                </Button>
              </Box>
            )}
          </>
        ) : (
          onSave && (
            <EventForm
              open={mode === 'edit'}
              editEvent={event}
              onSave={onSave}
              onSaved={onClose}
              onDelete={onDelete}
              onCancelEvent={onCancelEvent}
            />
          )
        )}
      </Box>
    </Drawer>
  );
}
