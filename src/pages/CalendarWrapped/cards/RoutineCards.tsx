import type { ReactNode } from 'react';
import { WrappedCard } from '../../../ui/molecules/WrappedCard';
import { minutesToHours } from '../utils';
import type { CalendarStats, RecurringSeriesSummary } from '../../../hooks/useCalendarStats/types';

interface RoutinesCardProps {
  topRecurring: RecurringSeriesSummary[];
}

export function createRoutinesCard({
  topRecurring,
}: RoutinesCardProps): ReactNode | null {
  if (topRecurring.length === 0) return null;

  return (
    <WrappedCard
      key="routines"
      title="Your Routines"
      subtitle="Your most consistent meetings..."
      gradientFrom="from-emerald-600"
      gradientTo="to-green-600"
    >
      <div className="space-y-4 max-w-lg mx-auto">
        {topRecurring.map((series, idx) => (
          <div
            key={series.key}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">
                  {idx + 1}
                </div>
                <div className="text-left">
                  <div className="font-semibold break-words">{series.key}</div>
                  <div className="text-sm text-white/70 mt-1">
                    {series.count}× · {minutesToHours(series.totalMinutes)}h
                    total
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WrappedCard>
  );
}

interface CreatureOfHabitCardProps {
  stats: CalendarStats;
}

export function createCreatureOfHabitCard({
  stats,
}: CreatureOfHabitCardProps): ReactNode {
  return (
    <WrappedCard
      key="creature-habit"
      title="Creature of Habit?"
      subtitle="You kept..."
      highlight={stats.recurringSummary.length.toString()}
      description={`stable routine${stats.recurringSummary.length !== 1 ? 's' : ''} in your calendar.`}
      gradientFrom="from-lime-600"
      gradientTo="to-green-600"
    />
  );
}

interface FreeDaysCardProps {
  stats: CalendarStats;
}

export function createFreeDaysCard({ stats }: FreeDaysCardProps): ReactNode {
  return (
    <WrappedCard
      key="free-days"
      title="Days Completely Free"
      subtitle="Days with no events at all..."
      highlight={stats.freeDays.freeDayCount.toString()}
      description={
        stats.freeDays.freeDayCount > 0
          ? "Time to recharge and breathe."
          : "Looks like you were fully booked!"
      }
      gradientFrom="from-sky-600"
      gradientTo="to-blue-600"
    />
  );
}
