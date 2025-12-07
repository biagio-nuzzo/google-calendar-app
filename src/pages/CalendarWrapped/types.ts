export interface CalendarWrappedPageProps {
  accessToken: string;
  timeMin: string;
  timeMax: string;
  calendarIds?: string[];
}

export interface CardData {
  year: number;
  totalHours: number;
  busiestDayHours: number;
  meetingPercent: number;
  focusPercent: number;
  remotePercent: number;
  onsitePercent: number;
}
