import { Drawer } from '@mui/material';
import { EventDrawerHeader } from './EventDrawerHeader';
import { EventForm } from './EventForm';
import { type EventFormData } from '../lib/events';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => Promise<void>;
  defaultDate?: string;
}

export function NewEventDrawer({ open, onClose, onSave, defaultDate }: Props) {
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
      <EventDrawerHeader title="New Event" onClose={onClose} />
      <EventForm open={open} defaultDate={defaultDate} onSave={onSave} onSaved={onClose} />
    </Drawer>
  );
}
