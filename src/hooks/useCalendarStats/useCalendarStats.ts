import { useEffect, useMemo, useState, useCallback } from 'react';
import type {
  UseCalendarStatsParams,
  UseCalendarStatsReturn,
  GoogleCalendarEvent,
  CalendarStats,
  BusyDay,
  WeekdayIntensity,
  HourBucket,
  CollaboratorStats,
  CalendarDistribution,
  RecurringSeriesSummary,
} from './types';

async function fetchAllEventsForCalendar(
  calendarId: string,
  accessToken: string,
  timeMin: string,
  timeMax: string
): Promise<GoogleCalendarEvent[]> {
  const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    calendarId
  )}/events`;

  let events: GoogleCalendarEvent[] = [];
  let nextPageToken: string | undefined;

  do {
    const url = new URL(baseUrl);
    url.searchParams.set('timeMin', timeMin);
    url.searchParams.set('timeMax', timeMax);
    url.searchParams.set('singleEvents', 'true');
    url.searchParams.set('maxResults', '2500');
    if (nextPageToken) {
      url.searchParams.set('pageToken', nextPageToken);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Google Calendar API error for ${calendarId}: ${res.status} ${text}`
      );
    }

    const data = await res.json();
    const batch = (data.items || []) as GoogleCalendarEvent[];
    events = events.concat(batch);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return events;
}

function getEventDurationMinutes(event: GoogleCalendarEvent): number {
  if (event.start.date && event.end.date) {
    return 0;
  }

  if (!event.start.dateTime || !event.end.dateTime) return 0;

  const start = new Date(event.start.dateTime).getTime();
  const end = new Date(event.end.dateTime).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0;

  return (end - start) / (1000 * 60);
}

function getEventLocalDateKey(event: GoogleCalendarEvent): string | null {
  const dt =
    event.start.dateTime ??
    (event.start.date ? `${event.start.date}T00:00:00` : undefined);
  if (!dt) return null;
  const d = new Date(dt);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getWeekday(dateKey: string): number {
  const d = new Date(dateKey + 'T00:00:00');
  return d.getDay();
}

function getHour(dateTime?: string, allDayFallback?: boolean): number | null {
  if (!dateTime) return allDayFallback ? 0 : null;
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return null;
  return d.getHours();
}

function isRemote(location?: string): boolean {
  if (!location) return false;
  const loc = location.toLowerCase();
  return (
    loc.includes('zoom') ||
    loc.includes('meet.google.com') ||
    loc.includes('teams.microsoft.com') ||
    loc.startsWith('https://') ||
    loc.startsWith('http://')
  );
}

function computeStats(
  events: GoogleCalendarEvent[],
  timeMin: string,
  timeMax: string
): CalendarStats {
  if (events.length === 0) {
    return {
      totalEventMinutes: 0,
      busyDay: null,
      weekdayIntensity: [],
      hourlyIntensity: [],
      primeTimeHour: null,
      topCollaborators: [],
      calendarDistribution: [],
      meetingVsFocus: {
        meetingMinutes: 0,
        focusMinutes: 0,
        meetingRatio: 0,
      },
      remoteVsOnsite: {
        remoteMinutes: 0,
        onsiteMinutes: 0,
        remoteRatio: 0,
      },
      recurringSummary: [],
      backToBack: {
        backToBackDayCount: 0,
        definitionGapMinutes: 5,
      },
      freeDays: {
        freeDayCount: 0,
      },
    };
  }

  let totalEventMinutes = 0;
  const minutesPerDay = new Map<string, number>();
  const minutesPerWeekday = new Map<number, number>();
  const minutesPerHour = new Map<number, number>();
  const collaboratorMap = new Map<string, CollaboratorStats>();
  const calendarMap = new Map<string, number>();
  const recurringMap = new Map<string, { count: number; totalMinutes: number }>();
  const eventsByDay = new Map<string, GoogleCalendarEvent[]>();

  let meetingMinutes = 0;
  let focusMinutes = 0;
  let remoteMinutes = 0;
  let onsiteMinutes = 0;

  for (const event of events) {
    const duration = getEventDurationMinutes(event);
    if (duration <= 0) continue;

    totalEventMinutes += duration;

    const dateKey = getEventLocalDateKey(event);
    if (dateKey) {
      minutesPerDay.set(dateKey, (minutesPerDay.get(dateKey) ?? 0) + duration);

      const weekday = getWeekday(dateKey);
      minutesPerWeekday.set(weekday, (minutesPerWeekday.get(weekday) ?? 0) + duration);

      const hour = getHour(event.start.dateTime, !!event.start.date);
      if (hour !== null) {
        minutesPerHour.set(hour, (minutesPerHour.get(hour) ?? 0) + duration);
      }

      const dayEvents = eventsByDay.get(dateKey) ?? [];
      dayEvents.push(event);
      eventsByDay.set(dateKey, dayEvents);
    }

    const calId = 'all';
    calendarMap.set(calId, (calendarMap.get(calId) ?? 0) + duration);

    const attendees = event.attendees ?? [];
    const nonDeclined = attendees.filter((a) => a.responseStatus !== 'declined');
    if (nonDeclined.length > 1) {
      meetingMinutes += duration;
    } else {
      focusMinutes += duration;
    }

    if (isRemote(event.location)) {
      remoteMinutes += duration;
    } else {
      onsiteMinutes += duration;
    }

    for (const a of attendees) {
      if (!a.email || a.self) continue;
      const existing = collaboratorMap.get(a.email);
      if (existing) {
        existing.eventCount += 1;
        existing.totalMinutes += duration;
        if (a.displayName && !existing.displayName) {
          existing.displayName = a.displayName;
        }
      } else {
        collaboratorMap.set(a.email, {
          email: a.email,
          displayName: a.displayName,
          eventCount: 1,
          totalMinutes: duration,
        });
      }
    }

    const key = (event.summary ?? 'Untitled').toLowerCase();
    const recEntry = recurringMap.get(key) ?? { count: 0, totalMinutes: 0 };
    recEntry.count += 1;
    recEntry.totalMinutes += duration;
    recurringMap.set(key, recEntry);
  }

  let busyDay: BusyDay | null = null;
  for (const [date, minutes] of minutesPerDay.entries()) {
    if (!busyDay || minutes > busyDay.totalMinutes) {
      busyDay = { date, totalMinutes: minutes };
    }
  }

  const weekdayIntensity: WeekdayIntensity[] = Array.from(minutesPerWeekday.entries())
    .map(([weekday, totalMinutes]) => ({ weekday, totalMinutes }))
    .sort((a, b) => a.weekday - b.weekday);

  const hourlyIntensity: HourBucket[] = Array.from(minutesPerHour.entries())
    .map(([hour, totalMinutes]) => ({ hour, totalMinutes }))
    .sort((a, b) => a.hour - b.hour);

  let primeTimeHour: number | null = null;
  let maxHourMinutes = 0;
  for (const bucket of hourlyIntensity) {
    if (bucket.totalMinutes > maxHourMinutes) {
      maxHourMinutes = bucket.totalMinutes;
      primeTimeHour = bucket.hour;
    }
  }

  const topCollaborators = Array.from(collaboratorMap.values())
    .sort((a, b) => b.totalMinutes - a.totalMinutes)
    .slice(0, 5);

  const calendarDistribution: CalendarDistribution[] = Array.from(calendarMap.entries()).map(
    ([calendarId, totalMinutes]) => ({ calendarId, totalMinutes })
  );

  const totalMeetingFocus = meetingMinutes + focusMinutes;
  const meetingRatio = totalMeetingFocus > 0 ? meetingMinutes / totalMeetingFocus : 0;

  const totalRemoteOnsite = remoteMinutes + onsiteMinutes;
  const remoteRatio = totalRemoteOnsite > 0 ? remoteMinutes / totalRemoteOnsite : 0;

  const recurringSummary: RecurringSeriesSummary[] = Array.from(recurringMap.entries())
    .filter(([_, v]) => v.count >= 3)
    .map(([key, v]) => ({ key, count: v.count, totalMinutes: v.totalMinutes }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes)
    .slice(0, 10);

  const definitionGapMinutes = 5;
  let backToBackDayCount = 0;

  for (const [dateKey, dayEvents] of eventsByDay.entries()) {
    const sorted = [...dayEvents].sort((a, b) => {
      const sa = new Date(a.start.dateTime ?? a.start.date ?? dateKey).getTime();
      const sb = new Date(b.start.dateTime ?? b.start.date ?? dateKey).getTime();
      return sa - sb;
    });

    let hasBackToBack = false;
    for (let i = 0; i < sorted.length - 1; i++) {
      const currentEnd = new Date(
        sorted[i].end.dateTime ?? sorted[i].end.date ?? dateKey
      ).getTime();
      const nextStart = new Date(
        sorted[i + 1].start.dateTime ?? sorted[i + 1].start.date ?? dateKey
      ).getTime();

      const gapMinutes = (nextStart - currentEnd) / (1000 * 60);
      if (gapMinutes <= definitionGapMinutes && gapMinutes >= 0) {
        hasBackToBack = true;
        break;
      }
    }

    if (hasBackToBack) {
      backToBackDayCount += 1;
    }
  }

  const startDate = new Date(timeMin);
  const endDate = new Date(timeMax);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  let freeDayCount = 0;
  const millisPerDay = 24 * 60 * 60 * 1000;

  for (let d = startDate.getTime(); d <= endDate.getTime(); d += millisPerDay) {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const key = `${year}-${month}-${day}`;
    if (!minutesPerDay.has(key)) {
      freeDayCount += 1;
    }
  }

  return {
    totalEventMinutes,
    busyDay,
    weekdayIntensity,
    hourlyIntensity,
    primeTimeHour,
    topCollaborators,
    calendarDistribution,
    meetingVsFocus: {
      meetingMinutes,
      focusMinutes,
      meetingRatio,
    },
    remoteVsOnsite: {
      remoteMinutes,
      onsiteMinutes,
      remoteRatio,
    },
    recurringSummary,
    backToBack: {
      backToBackDayCount,
      definitionGapMinutes,
    },
    freeDays: {
      freeDayCount,
    },
  };
}

export function useCalendarStats(params: UseCalendarStatsParams): UseCalendarStatsReturn {
  const { accessToken, timeMin, timeMax, calendarIds } = params;
  const [events, setEvents] = useState<GoogleCalendarEvent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calendarsToUse = calendarIds && calendarIds.length > 0 ? calendarIds : ['primary'];

  const fetchEvents = useCallback(async () => {
    if (!accessToken) {
      setError('Missing access token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const all: GoogleCalendarEvent[] = [];
      for (const calId of calendarsToUse) {
        const calEvents = await fetchAllEventsForCalendar(calId, accessToken, timeMin, timeMax);
        all.push(...calEvents.filter((e) => e.status !== 'cancelled'));
      }
      setEvents(all);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Unknown error');
      setEvents(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, timeMin, timeMax, calendarsToUse]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const stats: CalendarStats | null = useMemo(() => {
    if (!events) return null;
    return computeStats(events, timeMin, timeMax);
  }, [events, timeMin, timeMax]);

  return {
    stats,
    loading,
    error,
    refresh: fetchEvents,
  };
}
