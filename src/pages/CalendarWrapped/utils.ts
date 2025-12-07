import type { CalendarStats } from '../../hooks/useCalendarStats/types';

export const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function minutesToHours(minutes: number): number {
  return Math.round(minutes / 60);
}

export interface CalendarPersona {
  badge: string;
  description: string;
}

export function getCalendarPersona(stats: CalendarStats): CalendarPersona {
  const { meetingVsFocus, remoteVsOnsite, recurringSummary } = stats;

  if (meetingVsFocus.meetingRatio > 0.7) {
    return {
      badge: 'Meeting Warrior',
      description:
        'You thrive in collaboration, spending most of your time connecting with others.',
    };
  }

  if (meetingVsFocus.focusMinutes > meetingVsFocus.meetingMinutes) {
    return {
      badge: 'Focus Monk',
      description:
        'You guard your time fiercely, carving out space for deep, focused work.',
    };
  }

  if (remoteVsOnsite.remoteRatio > 0.75) {
    return {
      badge: 'Remote Hero',
      description:
        "Your office is wherever you are. You've mastered the art of remote work.",
    };
  }

  if (recurringSummary.length >= 5) {
    return {
      badge: 'Routine Master',
      description:
        "You've built a stable rhythm with consistent routines that keep you on track.",
    };
  }

  return {
    badge: 'Calendar Explorer',
    description: 'Every day brings something new. You keep your schedule dynamic and flexible.',
  };
}
