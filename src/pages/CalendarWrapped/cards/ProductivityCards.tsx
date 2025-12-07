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
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-8 text-5xl font-bold">
          <div>
            <div className="text-6xl">{meetingPercent}%</div>
            <div className="text-xl font-normal text-white/80 mt-2">
              Meetings
            </div>
          </div>
          <div className="text-white/40 text-3xl">vs</div>
          <div>
            <div className="text-6xl">{focusPercent}%</div>
            <div className="text-xl font-normal text-white/80 mt-2">Focus</div>
          </div>
        </div>
        <div className="h-4 bg-white/20 rounded-full overflow-hidden flex">
          <div className="bg-blue-400" style={{ width: `${meetingPercent}%` }} />
          <div className="bg-green-400" style={{ width: `${focusPercent}%` }} />
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
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-8 text-5xl font-bold">
          <div>
            <div className="text-6xl">{remotePercent}%</div>
            <div className="text-xl font-normal text-white/80 mt-2">Remote</div>
          </div>
          <div className="text-white/40 text-3xl">vs</div>
          <div>
            <div className="text-6xl">{onsitePercent}%</div>
            <div className="text-xl font-normal text-white/80 mt-2">
              On-site
            </div>
          </div>
        </div>
        <div className="h-4 bg-white/20 rounded-full overflow-hidden flex">
          <div
            className="bg-cyan-400"
            style={{ width: `${remotePercent}%` }}
          />
          <div
            className="bg-orange-400"
            style={{ width: `${onsitePercent}%` }}
          />
        </div>
      </div>
    </WrappedCard>
  );
}
