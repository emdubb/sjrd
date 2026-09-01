import { getAccentColor, type AppEvent } from '../lib/events';
import { ColoredTag } from './ColoredTag';

interface Props {
  event: AppEvent;
}

export function EventTypeLabel({ event }: Props) {
  const cancelled = !!event.cancelled;
  const label = cancelled ? `Cancelled · ${event.type}` : event.type;

  return <ColoredTag label={label} color={getAccentColor(event)} />;
}
