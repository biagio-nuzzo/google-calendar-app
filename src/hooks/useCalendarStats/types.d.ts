export type ISODateTime = string;

export interface UseCalendarStatsParams {
  accessToken: string;
  timeMin: ISODateTime;
  timeMax: ISODateTime;
  calendarIds?: string[];
}

export interface BusyDay {
  date: string; // "YYYY-MM-DD"
  totalMinutes: number;
}

export interface WeekdayIntensity {
  weekday: number; // 0 = Sunday, 1 = Monday, ...
  totalMinutes: number;
}

export interface HourBucket {
  hour: number; // 0-23
  totalMinutes: number;
}

export interface CollaboratorStats {
  email: string;
  displayName?: string;
  eventCount: number;
  totalMinutes: number;
}

export interface CalendarDistribution {
  calendarId: string;
  totalMinutes: number;
}

export interface MeetingVsFocusStats {
  meetingMinutes: number;
  focusMinutes: number;
  meetingRatio: number; // 0-1
}

export interface RemoteVsOnsiteStats {
  remoteMinutes: number;
  onsiteMinutes: number;
  remoteRatio: number; // 0-1
}

export interface RecurringSeriesSummary {
  key: string;
  count: number;
  totalMinutes: number;
}

export interface BackToBackStats {
  backToBackDayCount: number;
  definitionGapMinutes: number;
}

export interface FreeDaysStats {
  freeDayCount: number;
}

export interface CalendarStats {
  totalEventMinutes: number;
  busyDay: BusyDay | null;
  weekdayIntensity: WeekdayIntensity[];
  hourlyIntensity: HourBucket[];
  primeTimeHour: number | null;
  topCollaborators: CollaboratorStats[];
  calendarDistribution: CalendarDistribution[];
  meetingVsFocus: MeetingVsFocusStats;
  remoteVsOnsite: RemoteVsOnsiteStats;
  recurringSummary: RecurringSeriesSummary[];
  backToBack: BackToBackStats;
  freeDays: FreeDaysStats;
}

export interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    self?: boolean;
    responseStatus?: string;
  }>;
  creator?: { email?: string };
  organizer?: { email?: string };
  recurrence?: string[];
  status?: string;
}

export interface UseCalendarStatsReturn {
  stats: CalendarStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}
