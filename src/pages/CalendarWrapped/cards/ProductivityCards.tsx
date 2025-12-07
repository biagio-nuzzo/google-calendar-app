import type { ReactNode } from 'react';
import { WrappedCard } from '../../../ui/molecules/WrappedCard';
import type { CalendarStats } from '../../../hooks/useCalendarStats/types';

interface MeetingVsFocusCardProps {
  stats: CalendarStats;
  meetingPercent: number;
  focusPercent: number;
}

export function createMeetingVsFocusCard({
  meetingPercent,
  focusPercent,
}: MeetingVsFocusCardProps): ReactNode {
  return (
    <WrappedCard
      key="meetings-focus"
      title="Meetings vs Focus"
      subtitle="How you split your time..."
      gradientFrom="from-blue-600"
      gradientTo="to-indigo-600"
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{meetingPercent}%</div>
            <div className="text-base sm:text-lg md:text-xl font-normal text-gray-600 mt-2">
              Meetings
            </div>
          </div>
          <div className="text-gray-400 text-2xl sm:text-3xl">vs</div>
          <div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{focusPercent}%</div>
            <div className="text-base sm:text-lg md:text-xl font-normal text-gray-600 mt-2">Focus</div>
          </div>
        </div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden flex">
          <div className="bg-blue-500" style={{ width: `${meetingPercent}%` }} />
          <div className="bg-green-500" style={{ width: `${focusPercent}%` }} />
        </div>
      </div>
    </WrappedCard>
  );
}

interface RemoteVsOnsiteCardProps {
  remotePercent: number;
  onsitePercent: number;
}

export function createRemoteVsOnsiteCard({
  remotePercent,
  onsitePercent,
}: RemoteVsOnsiteCardProps): ReactNode | null {
  const totalLocationMinutes = remotePercent + onsitePercent;
  if (totalLocationMinutes === 0) return null;

  return (
    <WrappedCard
      key="remote-onsite"
      title="Remote or On-site?"
      subtitle="Where you worked from..."
      gradientFrom="from-cyan-600"
      gradientTo="to-blue-600"
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{remotePercent}%</div>
            <div className="text-base sm:text-lg md:text-xl font-normal text-gray-600 mt-2">Remote</div>
          </div>
          <div className="text-gray-400 text-2xl sm:text-3xl">vs</div>
          <div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{onsitePercent}%</div>
            <div className="text-base sm:text-lg md:text-xl font-normal text-gray-600 mt-2">
              On-site
            </div>
          </div>
        </div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden flex">
          <div
            className="bg-cyan-500"
            style={{ width: `${remotePercent}%` }}
          />
          <div
            className="bg-orange-500"
            style={{ width: `${onsitePercent}%` }}
          />
        </div>
      </div>
    </WrappedCard>
  );
}
