import type { ReactNode } from 'react';

interface NavigationArrowsProps {
  currentCard: number;
  totalCards: number;
  onPrev: () => void;
  onNext: () => void;
}

export function NavigationArrows({
  currentCard,
  totalCards,
  onPrev,
  onNext,
}: NavigationArrowsProps) {
  return (
    <>
      {/* Previous Arrow */}
      {currentCard > 0 && (
        <button
          onClick={onPrev}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all hover:scale-110 active:scale-95"
          aria-label="Previous card"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Next Arrow */}
      {currentCard < totalCards - 1 && (
        <button
          onClick={onNext}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all hover:scale-110 active:scale-95"
          aria-label="Next card"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </>
  );
}

interface ProgressIndicatorProps {
  cards: ReactNode[];
  currentCard: number;
  onCardSelect: (index: number) => void;
}

export function ProgressIndicator({
  cards,
  currentCard,
  onCardSelect,
}: ProgressIndicatorProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
      {cards.map((_, index) => (
        <button
          key={index}
          onClick={() => onCardSelect(index)}
          className={`h-2 rounded-full transition-all ${
            index === currentCard
              ? 'bg-white w-8'
              : 'bg-white/30 w-2 hover:bg-white/50'
          }`}
          aria-label={`Go to card ${index + 1}`}
        />
      ))}
    </div>
  );
}

interface CardCounterProps {
  currentCard: number;
  totalCards: number;
}

export function CardCounter({ currentCard, totalCards }: CardCounterProps) {
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
      {currentCard + 1} / {totalCards}
    </div>
  );
}
