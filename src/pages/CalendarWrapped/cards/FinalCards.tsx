import type { ReactNode } from 'react';
import { WrappedCard } from '../../../ui/molecules/WrappedCard';
import { Button } from '../../../ui/atoms/Button';
import type { CalendarPersona } from '../utils';
import type { CalendarStats } from '../../../hooks/useCalendarStats/types';

interface PersonaCardProps {
  year: number;
  persona: CalendarPersona;
}

export function createPersonaCard({ year, persona }: PersonaCardProps): ReactNode {
  return (
    <WrappedCard
      key="persona"
      title={`Your ${year} Calendar Persona`}
      highlight={
        <div className="space-y-4">
          <div className="text-6xl md:text-7xl font-black">{persona.badge}</div>
          <div className="text-2xl text-white/90 font-normal max-w-xl mx-auto">
            {persona.description}
          </div>
        </div>
      }
      gradientFrom="from-fuchsia-600"
      gradientTo="to-pink-600"
    />
  );
}

interface ShareCardProps {
  year: number;
  totalHours: number;
  busiestDayHours: number;
  stats: CalendarStats;
  persona: CalendarPersona;
}

export function createShareCard({
  year,
  totalHours,
  busiestDayHours,
  stats,
  persona,
}: ShareCardProps): ReactNode {
  return (
    <WrappedCard
      key="share"
      title="Share Your Calendar Wrapped"
      subtitle={`${year} — A year in review`}
      gradientFrom="from-purple-600"
      gradientTo="to-indigo-600"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{totalHours}h</div>
            <div className="text-sm text-white/70 mt-1">Total Time</div>
          </div>
          {stats.busyDay && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{busiestDayHours}h</div>
              <div className="text-sm text-white/70 mt-1">Busiest Day</div>
            </div>
          )}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{persona.badge}</div>
            <div className="text-sm text-white/70 mt-1">Your Badge</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button variant="primary">Download PDF</Button>
          <Button variant="secondary">Share</Button>
        </div>
      </div>
    </WrappedCard>
  );
}
