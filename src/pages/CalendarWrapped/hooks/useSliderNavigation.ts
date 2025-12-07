import { useState, useEffect, useCallback } from 'react';

interface UseSliderNavigationParams {
  totalCards: number;
}

interface UseSliderNavigationReturn {
  currentCard: number;
  setCurrentCard: (index: number) => void;
  goToNext: () => void;
  goToPrev: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export function useSliderNavigation({
  totalCards,
}: UseSliderNavigationParams): UseSliderNavigationReturn {
  const [currentCard, setCurrentCard] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Navigation functions
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

  // Ensure currentCard stays within bounds
  useEffect(() => {
    if (currentCard >= totalCards) {
      setCurrentCard(Math.max(0, totalCards - 1));
    }
  }, [currentCard, totalCards]);

  return {
    currentCard,
    setCurrentCard,
    goToNext,
    goToPrev,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
