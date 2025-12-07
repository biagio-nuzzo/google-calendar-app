import type { ReactNode } from 'react';

type ButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  className?: string;
};

export function Button({ onClick, disabled, variant = 'primary', children, className = '' }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50';
  
  const variantStyles = {
    primary: 'group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100',
    secondary: 'rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:scale-105 active:scale-95'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
      <div className="relative flex items-center justify-center gap-3">
        {children}
      </div>
    </button>
  );
}
