import { Card } from '../atoms';
import { formatMinutesToHours, formatMinutesToDays } from '../../constants/calendar';
import type { CalendarStats } from '../../hooks/useCalendarStats';

type CalendarStatsOverviewProps = {
  stats: CalendarStats | null;
  loading: boolean;
};

export function CalendarStatsOverview({ stats, loading }: CalendarStatsOverviewProps) {
  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Caricamento statistiche...</span>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="p-8">
        <p className="text-center text-gray-500">Nessuna statistica disponibile</p>
      </Card>
    );
  }

  const totalHours = formatMinutesToHours(stats.totalEventMinutes);
  const totalDays = formatMinutesToDays(stats.totalEventMinutes);
  const busyDayFormatted = stats.busyDay
    ? new Date(stats.busyDay.date).toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : 'N/A';
  const busyDayHours = stats.busyDay ? formatMinutesToHours(stats.busyDay.totalMinutes) : 'N/A';

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Le tue statistiche del calendario</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Tempo totale in eventi</p>
            <p className="text-3xl font-bold text-blue-600">{totalHours}</p>
            <p className="text-xs text-gray-500 mt-1">{totalDays}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Giorno più intenso</p>
            <p className="text-lg font-bold text-orange-600">{busyDayFormatted}</p>
            <p className="text-xs text-gray-500 mt-1">{busyDayHours} di eventi</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Meeting vs Focus</p>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round(stats.meetingVsFocus.meetingRatio * 100)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">tempo in meeting</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Giorni liberi</p>
            <p className="text-3xl font-bold text-green-600">{stats.freeDays.freeDayCount}</p>
            <p className="text-xs text-gray-500 mt-1">senza eventi</p>
          </div>
        </div>
      </Card>

      {/* Remote vs Onsite */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Modalità di lavoro</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Remoto</span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatMinutesToHours(stats.remoteVsOnsite.remoteMinutes)}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${stats.remoteVsOnsite.remoteRatio * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">In sede</span>
                <span className="text-sm font-semibold text-gray-600">
                  {formatMinutesToHours(stats.remoteVsOnsite.onsiteMinutes)}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-500 transition-all"
                  style={{ width: `${(1 - stats.remoteVsOnsite.remoteRatio) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Back-to-Back Meetings</h4>
          <div className="text-center">
            <p className="text-5xl font-bold text-orange-600 mb-2">{stats.backToBack.backToBackDayCount}</p>
            <p className="text-sm text-gray-600">giorni con meeting consecutivi</p>
            <p className="text-xs text-gray-500 mt-2">
              (gap &lt; {stats.backToBack.definitionGapMinutes} minuti)
            </p>
          </div>
        </Card>
      </div>

      {/* Top Collaborators */}
      {stats.topCollaborators.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Top Collaboratori</h4>
          <div className="space-y-3">
            {stats.topCollaborators.map((collab, idx) => (
              <div key={collab.email} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-bold text-white">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {collab.displayName || collab.email}
                    </p>
                    <p className="text-xs text-gray-500">{collab.eventCount} eventi</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  {formatMinutesToHours(collab.totalMinutes)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
