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
      className={`min-h-screen w-full flex items-center justify-center bg-gradient-to-br ${gradientFrom} ${gradientTo} p-8 animate-fadeIn`}
    >
      <div className="max-w-2xl w-full text-white text-center space-y-6">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 font-medium">
            {subtitle}
          </p>
        )}

        {/* Highlight (large number or key stat) */}
        {highlight && (
          <div className="py-8">
            {typeof highlight === 'string' ? (
              <div className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-2xl break-words px-4">
                {highlight}
              </div>
            ) : (
              highlight
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto">
            {description}
          </p>
        )}

        {/* Custom children */}
        {children && <div className="pt-4">{children}</div>}

        {/* Footer */}
        {footer && (
          <div className="pt-8 border-t border-white/20">{footer}</div>
        )}
      </div>
    </div>
  );
}
