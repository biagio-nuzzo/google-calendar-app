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
      highlight={
        topCollaborator.displayName || topCollaborator.email.split('@')[0]
      }
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
      <div className="space-y-4 max-w-lg mx-auto">
        {stats.topCollaborators.slice(0, 5).map((collab, idx) => (
          <div
            key={collab.email}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <div className="text-left">
                <div className="font-semibold">
                  {collab.displayName || collab.email.split('@')[0]}
                </div>
                <div className="text-sm text-white/70">
                  {collab.eventCount} events
                </div>
              </div>
            </div>
            <div className="text-xl font-bold">
              {minutesToHours(collab.totalMinutes)}h
            </div>
          </div>
        ))}
      </div>
    </WrappedCard>
  );
}
