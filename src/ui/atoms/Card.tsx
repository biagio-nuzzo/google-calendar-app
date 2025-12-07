import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className = '', hover = false }: CardProps) {
  const hoverStyles = hover ? 'transition-all hover:shadow-xl hover:scale-[1.02]' : '';
  
  return (
    <div className={`rounded-2xl bg-white border border-gray-200 p-6 shadow-lg ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}
