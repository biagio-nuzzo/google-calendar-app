import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCalendarStats } from '../hooks/useCalendarStats';
import type { CalendarStats } from '../hooks/useCalendarStats/types';
import { WrappedCard } from '../ui/molecules/WrappedCard';
import { Spinner } from '../ui/atoms/Spinner';
import { Alert } from '../ui/atoms/Alert';
import { Button } from '../ui/atoms/Button';

interface CalendarWrappedPageProps {
  accessToken: string;
  timeMin: string;
  timeMax: string;
  calendarIds?: string[];
}

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function minutesToHours(minutes: number): number {
  return Math.round(minutes / 60);
}

function getCalendarPersona(stats: CalendarStats): {
  badge: string;
  description: string;
} {
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

export function CalendarWrappedPage({
  accessToken,
  timeMin,
  timeMax,
  calendarIds,
}: CalendarWrappedPageProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const { stats, loading, error } = useCalendarStats({
    accessToken,
    timeMin,
    timeMax,
    calendarIds,
  });

  // Navigation functions - defined here to avoid hook order issues
  const goToNext = useCallback(() => {
    setCurrentCard((prev) => prev + 1);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentCard((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch handlers for swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();

    setTouchStart(0);
    setTouchEnd(0);
  }, [touchStart, touchEnd, goToNext, goToPrev]);

  // Build cards array - must be done before any conditional returns
  const { cards, totalCards } = useMemo(() => {
    if (!stats) {
      return { cards: [], totalCards: 0 };
    }

    const year = new Date(timeMin).getFullYear();
    const totalHours = minutesToHours(stats.totalEventMinutes);
    const busiestDayHours = stats.busyDay
      ? minutesToHours(stats.busyDay.totalMinutes)
      : 0;

    // Find busiest weekday
    const busiestWeekday = stats.weekdayIntensity.reduce((max, curr) =>
      curr.totalMinutes > max.totalMinutes ? curr : max
    );

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

    const cardsArray = [
      // Card 1: Your year in numbers
      <WrappedCard
        key="year-numbers"
        title="Your Year in Numbers"
        subtitle={`In ${year}, you spent...`}
        highlight={`${totalHours.toLocaleString()}h`}
        description="...inside your calendar. Let's dive into the details."
        gradientFrom="from-indigo-600"
        gradientTo="to-purple-600"
      />,
      // Card 2: Your busiest day
      ...(stats.busyDay
        ? [
            <WrappedCard
              key="busiest-day"
              title="Your Busiest Day"
              subtitle={formatDate(stats.busyDay.date)}
              highlight={`${busiestDayHours}h`}
              description="That was your marathon day — packed from start to finish."
              gradientFrom="from-orange-600"
              gradientTo="to-red-600"
            />,
          ]
        : []),
      // Card 3: Your prime time
      ...(stats.primeTimeHour !== null
        ? [
            <WrappedCard
              key="prime-time"
              title="Your Prime Time"
              subtitle="Your calendar comes alive at..."
              highlight={`${stats.primeTimeHour.toString().padStart(2, '0')}:00`}
              description="This is when you're most active and engaged."
              gradientFrom="from-yellow-500"
              gradientTo="to-orange-600"
            />,
          ]
        : []),
      // Card 4: Your weekday vibe
      <WrappedCard
        key="weekday-vibe"
        title="Your Weekday Vibe"
        subtitle="Your heaviest day of the week is..."
        highlight={WEEKDAY_NAMES[busiestWeekday.weekday]}
        description={`With ${minutesToHours(busiestWeekday.totalMinutes)} hours of scheduled time.`}
        gradientFrom="from-green-600"
        gradientTo="to-teal-600"
      />,
      // Card 5: Back-to-back marathons
      <WrappedCard
        key="back-to-back"
        title="Back-to-Back Marathons"
        subtitle="Days with almost no break..."
        highlight={stats.backToBack.backToBackDayCount.toString()}
        description={
          stats.backToBack.backToBackDayCount > 0
            ? "You powered through with barely a moment to breathe."
            : "You managed to keep breathing room in your schedule!"
        }
        gradientFrom="from-red-600"
        gradientTo="to-pink-600"
      />,
      // Card 6: Meetings vs Focus
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
              <div className="text-xl font-normal text-white/80 mt-2">
                Focus
              </div>
            </div>
          </div>
          <div className="h-4 bg-white/20 rounded-full overflow-hidden flex">
            <div
              className="bg-blue-400"
              style={{ width: `${meetingPercent}%` }}
            />
            <div className="bg-green-400" style={{ width: `${focusPercent}%` }} />
          </div>
        </div>
      </WrappedCard>,
      // Card 7: Remote or On-site
      ...(totalLocationMinutes > 0
        ? [
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
                    <div className="text-xl font-normal text-white/80 mt-2">
                      Remote
                    </div>
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
            </WrappedCard>,
          ]
        : []),
      // Card 8: Your partner in crime
      ...(topCollaborator
        ? [
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
            />,
          ]
        : []),
      // Card 9: Your crew
      ...(stats.topCollaborators.length > 0
        ? [
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
            </WrappedCard>,
          ]
        : []),
      // Card 10: Your routines
      ...(topRecurring.length > 0
        ? [
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
                          <div className="font-semibold break-words">
                            {series.key}
                          </div>
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
            </WrappedCard>,
          ]
        : []),
      // Card 11: Creature of habit
      <WrappedCard
        key="creature-habit"
        title="Creature of Habit?"
        subtitle="You kept..."
        highlight={stats.recurringSummary.length.toString()}
        description={`stable routine${stats.recurringSummary.length !== 1 ? 's' : ''} in your calendar.`}
        gradientFrom="from-lime-600"
        gradientTo="to-green-600"
      />,
      // Card 12: Days completely free
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
      />,
      // Card 13: Your calendar persona
      <WrappedCard
        key="persona"
        title={`Your ${year} Calendar Persona`}
        highlight={
          <div className="space-y-4">
            <div className="text-6xl md:text-7xl font-black">
              {persona.badge}
            </div>
            <div className="text-2xl text-white/90 font-normal max-w-xl mx-auto">
              {persona.description}
            </div>
          </div>
        }
        gradientFrom="from-fuchsia-600"
        gradientTo="to-pink-600"
      />,
      // Card 14: Share your wrapped
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
      </WrappedCard>,
    ];

    return { cards: cardsArray, totalCards: cardsArray.length };
  }, [stats, timeMin]);

  // Ensure currentCard stays within bounds
  useEffect(() => {
    if (currentCard >= totalCards) {
      setCurrentCard(Math.max(0, totalCards - 1));
    }
  }, [currentCard, totalCards]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="text-white scale-[3]">
              <Spinner />
            </div>
          </div>
          <p className="text-white text-xl">Analyzing your calendar...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-600 p-8">
        <div className="max-w-md">
          <Alert variant="error">{error}</Alert>
        </div>
      </div>
    );
  }

  // No stats
  if (!stats) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 p-8">
        <div className="text-center text-white space-y-4">
          <h2 className="text-3xl font-bold">No calendar data available</h2>
          <p className="text-white/80">
            Try selecting a different time range or calendar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-screen overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Container */}
      <div 
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentCard * 100}vw)` }}
      >
        {cards.map((card, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0">
            {card}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {currentCard > 0 && (
        <button
          onClick={goToPrev}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all hover:scale-110 active:scale-95"
          aria-label="Previous card"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentCard < totalCards - 1 && (
        <button
          onClick={goToNext}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all hover:scale-110 active:scale-95"
          aria-label="Next card"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Progress Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentCard(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentCard
                ? 'bg-white w-8'
                : 'bg-white/30 w-2 hover:bg-white/50'
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>

      {/* Card Counter */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
        {currentCard + 1} / {totalCards}
      </div>
    </div>
  );
}
