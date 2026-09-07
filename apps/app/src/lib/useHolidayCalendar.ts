import { useState, useEffect, useMemo, useCallback } from 'react';
import { eachDateInRange } from './dateRange';
import { getUsHolidaysForMonth } from './usHolidays';
import {
  fetchHolidayEventsForMonth,
  fetchConflictingEvents,
  cancelEvents,
  createEvent,
  type AppEvent,
  type EventFormData,
} from './events';

export function useHolidayCalendar(
  viewYear: number,
  viewMonth: number,
  reloadEvents: () => Promise<void>
) {
  const [holidayEvents, setHolidayEvents] = useState<AppEvent[]>([]);
  const [pendingHolidayData, setPendingHolidayData] = useState<EventFormData | null>(null);
  const [conflictEvents, setConflictEvents] = useState<AppEvent[]>([]);
  const [saving, setSaving] = useState(false);

  const refreshHolidays = useCallback(async () => {
    try {
      setHolidayEvents(await fetchHolidayEventsForMonth(viewYear, viewMonth));
    } catch {
      // silently ignore — no holiday tinting is better than a crash
    }
  }, [viewYear, viewMonth]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    refreshHolidays();
  }, [refreshHolidays]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const holidayDays = useMemo(() => {
    const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-`;
    const days = new Set<number>();

    getUsHolidaysForMonth(viewYear, viewMonth).forEach((h) => days.add(Number(h.date.slice(-2))));

    holidayEvents.forEach((h) => {
      eachDateInRange(h.dateStartRaw, h.dateEnd ?? h.dateStartRaw).forEach((d) => {
        if (d.startsWith(monthPrefix)) days.add(Number(d.slice(-2)));
      });
    });

    return days;
  }, [viewYear, viewMonth, holidayEvents]);

  const saveEvent = useCallback(
    async (data: EventFormData) => {
      if (data.eventType === 'Holiday') {
        const conflicts = await fetchConflictingEvents(data.date, data.dateEnd || data.date);
        if (conflicts.length > 0) {
          setPendingHolidayData(data);
          setConflictEvents(conflicts);
          return;
        }
      }
      await createEvent(data);
      await reloadEvents();
      if (data.eventType === 'Holiday') await refreshHolidays();
    },
    [reloadEvents, refreshHolidays]
  );

  const confirmConflicts = useCallback(
    async (selectedIds: string[]) => {
      if (!pendingHolidayData) return;
      setSaving(true);
      try {
        await cancelEvents(selectedIds);
        await createEvent(pendingHolidayData);
        await reloadEvents();
        await refreshHolidays();
        setPendingHolidayData(null);
        setConflictEvents([]);
      } finally {
        setSaving(false);
      }
    },
    [pendingHolidayData, reloadEvents, refreshHolidays]
  );

  const cancelConflicts = useCallback(() => {
    setPendingHolidayData(null);
    setConflictEvents([]);
  }, []);

  return { holidayDays, conflictEvents, saving, saveEvent, confirmConflicts, cancelConflicts };
}
