import type { ReactNode } from 'react';
import { WrappedCard } from '../../../ui/molecules/WrappedCard';
import { formatDate, minutesToHours, WEEKDAY_NAMES } from '../utils';
import type { CalendarStats } from '../../../hooks/useCalendarStats/types';

interface OverviewCardsProps {
  stats: CalendarStats;
  year: number;
  totalHours: number;
  busiestDayHours: number;
}

export function createOverviewCards({
  stats,
  year,
  totalHours,
  busiestDayHours,
}: OverviewCardsProps): ReactNode[] {
  const cards: ReactNode[] = [];

  // Card 1: Your year in numbers
  cards.push(
    <WrappedCard
      key="year-numbers"
      title="Your Year in Numbers"
      subtitle={`In ${year}, you spent...`}
      highlight={`${totalHours.toLocaleString()}h`}
      description="...inside your calendar. Let's dive into the details."
      gradientFrom="from-indigo-600"
      gradientTo="to-purple-600"
    />
  );

  // Card 2: Your busiest day
  if (stats.busyDay) {
    cards.push(
      <WrappedCard
        key="busiest-day"
        title="Your Busiest Day"
        subtitle={formatDate(stats.busyDay.date)}
        highlight={`${busiestDayHours}h`}
        description="That was your marathon day — packed from start to finish."
        gradientFrom="from-orange-600"
        gradientTo="to-red-600"
      />
    );
  }

  // Card 3: Your prime time
  if (stats.primeTimeHour !== null) {
    cards.push(
      <WrappedCard
        key="prime-time"
        title="Your Prime Time"
        subtitle="Your calendar comes alive at..."
        highlight={`${stats.primeTimeHour.toString().padStart(2, '0')}:00`}
        description="This is when you're most active and engaged."
        gradientFrom="from-yellow-500"
        gradientTo="to-orange-600"
      />
    );
  }

  return cards;
}

interface WeekdayCardProps {
  stats: CalendarStats;
}

export function createWeekdayCard({ stats }: WeekdayCardProps): ReactNode {
  const busiestWeekday = stats.weekdayIntensity.reduce((max, curr) =>
    curr.totalMinutes > max.totalMinutes ? curr : max
  );

  return (
    <WrappedCard
      key="weekday-vibe"
      title="Your Weekday Vibe"
      subtitle="Your heaviest day of the week is..."
      highlight={WEEKDAY_NAMES[busiestWeekday.weekday]}
      description={`With ${minutesToHours(busiestWeekday.totalMinutes)} hours of scheduled time.`}
      gradientFrom="from-green-600"
      gradientTo="to-teal-600"
    />
  );
}

interface BackToBackCardProps {
  stats: CalendarStats;
}

export function createBackToBackCard({ stats }: BackToBackCardProps): ReactNode {
  return (
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
    />
  );
}
