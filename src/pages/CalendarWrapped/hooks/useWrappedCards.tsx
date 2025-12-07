import { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { CalendarStats } from '../../../hooks/useCalendarStats/types';
import { minutesToHours, getCalendarPersona } from '../utils';
import {
  createOverviewCards,
  createWeekdayCard,
  createBackToBackCard,
} from '../cards/OverviewCards';
import {
  createMeetingVsFocusCard,
  createRemoteVsOnsiteCard,
} from '../cards/ProductivityCards';
import {
  createTopCollaboratorCard,
  createCrewCard,
} from '../cards/CollaboratorCards';
import {
  createRoutinesCard,
  createCreatureOfHabitCard,
  createFreeDaysCard,
} from '../cards/RoutineCards';
import { createPersonaCard, createShareCard } from '../cards/FinalCards';

interface UseWrappedCardsParams {
  stats: CalendarStats | null;
  timeMin: string;
}

interface UseWrappedCardsReturn {
  cards: ReactNode[];
  totalCards: number;
}

export function useWrappedCards({
  stats,
  timeMin,
}: UseWrappedCardsParams): UseWrappedCardsReturn {
  return useMemo(() => {
    if (!stats) {
      return { cards: [], totalCards: 0 };
    }

    const year = new Date(timeMin).getFullYear();
    const totalHours = minutesToHours(stats.totalEventMinutes);
    const busiestDayHours = stats.busyDay
      ? minutesToHours(stats.busyDay.totalMinutes)
      : 0;

    // Calculate meeting vs focus percentages
    const totalMinutes =
      stats.meetingVsFocus.meetingMinutes + stats.meetingVsFocus.focusMinutes;
    const meetingPercent =
      totalMinutes > 0
        ? Math.round((stats.meetingVsFocus.meetingMinutes / totalMinutes) * 100)
        : 0;
    const focusPercent = 100 - meetingPercent;

    // Calculate remote vs onsite percentages
    const totalLocationMinutes =
      stats.remoteVsOnsite.remoteMinutes + stats.remoteVsOnsite.onsiteMinutes;
    const remotePercent =
      totalLocationMinutes > 0
        ? Math.round(
            (stats.remoteVsOnsite.remoteMinutes / totalLocationMinutes) * 100
          )
        : 0;
    const onsitePercent = 100 - remotePercent;

    // Get top collaborator
    const topCollaborator = stats.topCollaborators[0];

    // Get top recurring series
    const topRecurring = stats.recurringSummary
      .sort((a, b) => b.totalMinutes - a.totalMinutes)
      .slice(0, 3);

    // Get calendar persona
    const persona = getCalendarPersona(stats);

    // Build cards array
    const cardsArray: ReactNode[] = [
      // Overview cards (1-3)
      ...createOverviewCards({ stats, year, totalHours, busiestDayHours }),

      // Weekday card (4)
      createWeekdayCard({ stats }),

      // Back-to-back card (5)
      createBackToBackCard({ stats }),

      // Productivity cards (6-7)
      createMeetingVsFocusCard({ stats, meetingPercent, focusPercent }),
      createRemoteVsOnsiteCard({ remotePercent, onsitePercent }),

      // Collaborator cards (8-9)
      createTopCollaboratorCard({ topCollaborator }),
      createCrewCard({ stats }),

      // Routine cards (10-12)
      createRoutinesCard({ topRecurring }),
      createCreatureOfHabitCard({ stats }),
      createFreeDaysCard({ stats }),

      // Final cards (13-14)
      createPersonaCard({ year, persona }),
      createShareCard({ year, totalHours, busiestDayHours, stats, persona }),
    ].filter(Boolean); // Remove null cards

    return { cards: cardsArray, totalCards: cardsArray.length };
  }, [stats, timeMin]);
}
