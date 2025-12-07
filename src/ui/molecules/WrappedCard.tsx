import type { ReactNode } from 'react';

interface WrappedCardProps {
  title: string;
  subtitle?: string;
  highlight?: string | ReactNode;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
}

export function WrappedCard({
  title,
  subtitle,
  highlight,
  description,
  footer,
  children,
  gradientFrom = 'from-purple-600',
  gradientTo = 'to-pink-600',
}: WrappedCardProps) {
  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center bg-gradient-to-br ${gradientFrom} ${gradientTo} p-4 sm:p-6 md:p-8 animate-fadeIn`}
    >
      <div className="max-w-4xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center space-y-4 sm:space-y-6">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-medium">
            {subtitle}
          </p>
        )}

        {/* Highlight (large number or key stat) */}
        {highlight && (
          <div className="py-4 sm:py-6 md:py-8">
            {typeof highlight === 'string' ? (
              <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent break-words px-2 sm:px-4`}>
                {highlight}
              </div>
            ) : (
              highlight
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            {description}
          </p>
        )}

        {/* Custom children */}
        {children && <div className="pt-2 sm:pt-4">{children}</div>}

        {/* Footer */}
        {footer && (
          <div className="pt-6 sm:pt-8 border-t border-gray-200">{footer}</div>
        )}
      </div>
    </div>
  );
}
