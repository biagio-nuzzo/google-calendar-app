import type { ReactNode } from 'react';

type AlertProps = {
  children: ReactNode;
  variant: 'success' | 'error' | 'warning' | 'info';
  className?: string;
};

export function Alert({ children, variant, className = '' }: AlertProps) {
  const variantStyles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-orange-50 border-orange-200 text-orange-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  return (
    <div className={`rounded-lg border p-3 text-sm ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
