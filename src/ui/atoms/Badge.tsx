import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant?: 'success' | 'default';
  className?: string;
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantStyles = {
    success: 'bg-green-100 text-green-700',
    default: 'bg-gray-100 text-gray-700'
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
