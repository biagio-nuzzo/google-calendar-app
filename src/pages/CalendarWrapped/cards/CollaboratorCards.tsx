import type { ReactNode } from 'react';
import { WrappedCard } from '../../../ui/molecules/WrappedCard';
import { minutesToHours } from '../utils';
import type { CalendarStats, CollaboratorStats } from '../../../hooks/useCalendarStats/types';

interface TopCollaboratorCardProps {
  topCollaborator: CollaboratorStats | undefined;
}

export function createTopCollaboratorCard({
  topCollaborator,
}: TopCollaboratorCardProps): ReactNode | null {
  if (!topCollaborator) return null;

  return (
    <WrappedCard
      key="partner"
      title="Your Partner in Crime"
      subtitle="You spent the most time with..."
      highlight={topCollaborator.email}
      description={`${minutesToHours(topCollaborator.totalMinutes)} hours together across ${topCollaborator.eventCount} events.`}
      gradientFrom="from-pink-600"
      gradientTo="to-rose-600"
    />
  );
}

interface CrewCardProps {
  stats: CalendarStats;
}

export function createCrewCard({ stats }: CrewCardProps): ReactNode | null {
  if (stats.topCollaborators.length === 0) return null;

  return (
    <WrappedCard
      key="crew"
      title="Your Crew"
      subtitle="Your top collaborators this year..."
      gradientFrom="from-violet-600"
      gradientTo="to-purple-600"
    >
      <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
        {stats.topCollaborators.slice(0, 5).map((collab, idx) => (
          <div
            key={collab.email}
            className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
          >
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm sm:text-base shrink-0">
                {idx + 1}
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                  {collab.email}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {collab.eventCount} events
                </div>
              </div>
            </div>
            <div className="text-lg sm:text-xl font-bold text-gray-900 ml-9 sm:ml-0">
              {minutesToHours(collab.totalMinutes)}h
            </div>
          </div>
        ))}
      </div>
    </WrappedCard>
  );
}
