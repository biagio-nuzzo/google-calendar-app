import { useCalendarStats } from '../../hooks/useCalendarStats';
import { useWrappedCards } from './hooks/useWrappedCards';
import { useSliderNavigation } from './hooks/useSliderNavigation';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import {
  NavigationArrows,
  ProgressIndicator,
  CardCounter,
} from './components/SliderControls';
import type { CalendarWrappedPageProps } from './types';

export function CalendarWrappedPage({
  accessToken,
  timeMin,
  timeMax,
  calendarIds,
}: CalendarWrappedPageProps) {
  // Fetch calendar stats
  const { stats, loading, error } = useCalendarStats({
    accessToken,
    timeMin,
    timeMax,
    calendarIds,
  });

  // Generate cards from stats
  const { cards, totalCards } = useWrappedCards({ stats, timeMin });

  // Handle slider navigation
  const {
    currentCard,
    setCurrentCard,
    goToNext,
    goToPrev,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useSliderNavigation({ totalCards });

  // Handle loading state
  if (loading) {
    return <LoadingState />;
  }

  // Handle error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // Handle empty state
  if (!stats || cards.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Slider Container */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${currentCard * 100}%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="min-w-full h-full flex items-center justify-center"
          >
            {card}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <NavigationArrows
        currentCard={currentCard}
        totalCards={totalCards}
        onPrev={goToPrev}
        onNext={goToNext}
      />

      {/* Progress Indicator */}
      <ProgressIndicator
        cards={cards}
        currentCard={currentCard}
        onCardSelect={setCurrentCard}
      />

      {/* Card Counter */}
      <CardCounter currentCard={currentCard} totalCards={totalCards} />
    </div>
  );
}
