export const CalendarWrappedStatKey = {
  TOTAL_EVENT_MINUTES: 'totalEventMinutes',

  BUSY_DAY_DATE: 'busyDay.date',
  BUSY_DAY_TOTAL_MINUTES: 'busyDay.totalMinutes',

  WEEKDAY_INTENSITY: 'weekdayIntensity',
  HOURLY_INTENSITY: 'hourlyIntensity',
  PRIME_TIME_HOUR: 'primeTimeHour',

  TOP_COLLABORATORS: 'topCollaborators',
  CALENDAR_DISTRIBUTION: 'calendarDistribution',

  MEETING_MINUTES: 'meetingVsFocus.meetingMinutes',
  FOCUS_MINUTES: 'meetingVsFocus.focusMinutes',
  MEETING_RATIO: 'meetingVsFocus.meetingRatio',

  REMOTE_MINUTES: 'remoteVsOnsite.remoteMinutes',
  ONSITE_MINUTES: 'remoteVsOnsite.onsiteMinutes',
  REMOTE_RATIO: 'remoteVsOnsite.remoteRatio',

  RECURRING_SUMMARY: 'recurringSummary',

  BACK_TO_BACK_DAY_COUNT: 'backToBack.backToBackDayCount',
  BACK_TO_BACK_GAP_MINUTES: 'backToBack.definitionGapMinutes',

  FREE_DAY_COUNT: 'freeDays.freeDayCount',
} as const

// Helper per formattare i minuti in ore/giorni
export function formatMinutesToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatMinutesToDays(minutes: number): string {
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  if (days === 0) return `${hours}h`;
  if (hours === 0) return `${days}d`;
  return `${days}d ${hours}h`;
}

// Nomi dei giorni della settimana
export const WEEKDAY_NAMES = [
  'Domenica',
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
];

// Range temporale di default (ultimo anno)
export function getDefaultTimeRange(): { timeMin: string; timeMax: string } {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  return {
    timeMin: oneYearAgo.toISOString(),
    timeMax: now.toISOString(),
  };
}
