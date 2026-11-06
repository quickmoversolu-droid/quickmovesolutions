import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface BrandLogoProps {
  theme?: 'dark' | 'light';
  variant?: 'horizontal' | 'stacked';
  showTagline?: boolean;
  href?: string;
  className?: string;
}

/**
 * Official QuickMove Solutions Dual-House Brand Mark & Wordmark
 * Matches the official visual reference:
 * - Warm gold/amber smaller house on the left with 2x2 window panes
 * - Action Orange (#F47732) larger roof/house overlapping on the right
 * - Bold white/navy "QuickMove Solutions" wordmark + "Moving Made Easy. Space Made Clear."
 */
export function QuickMoveHouseMark({ className = 'h-11 w-14' }: { className?: string }) {
  return (
    <img
      src="/images/quickmove-logo.png"
      alt="QuickMove Solutions Mark"
      className={cn('shrink-0 select-none object-contain', className)}
    />
  );
}

export function BrandLogo({
  theme = 'light',
  variant = 'horizontal',
  showTagline = false,
  href = '/',
  className,
}: BrandLogoProps) {
  const isLightText = theme === 'light';

  if (variant === 'stacked') {
    return (
      <Link
        href={href}
        className={cn(
          'group flex flex-col items-center text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-2xl',
          className
        )}
        aria-label="QuickMove Solutions — Moving Made Easy. Space Made Clear."
      >
        <div className="transition-transform duration-200 group-hover:scale-105">
          <QuickMoveHouseMark className="h-14 w-20" />
        </div>
        <div className="mt-2 flex flex-col items-center">
          <span
            className={cn(
              'font-heading text-2xl font-extrabold tracking-tight leading-none',
              isLightText ? 'text-white' : 'text-brand-navy'
            )}
          >
            QuickMove
          </span>
          <span
            className={cn(
              'font-heading text-xl font-extrabold tracking-tight leading-tight',
              isLightText ? 'text-white' : 'text-brand-navy'
            )}
          >
            Solutions
          </span>
          {showTagline && (
            <span
              className={cn(
                'mt-1.5 text-[11px] font-medium tracking-wide',
                isLightText ? 'text-white/65' : 'text-brand-charcoal-subtle'
              )}
            >
              Moving Made Easy. Space Made Clear.
            </span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-xl',
        className
      )}
      aria-label="QuickMove Solutions — Moving Made Easy. Space Made Clear."
    >
      <div className="transition-transform duration-200 group-hover:scale-[1.04]">
        <QuickMoveHouseMark className="h-10 w-14 sm:h-11 sm:w-15" />
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col font-heading font-extrabold tracking-tight leading-[1.06]">
          <span
            className={cn(
              'text-lg sm:text-xl',
              isLightText ? 'text-white' : 'text-brand-navy'
            )}
          >
            QuickMove
          </span>
          <span
            className={cn(
              'text-base sm:text-lg',
              isLightText ? 'text-white/95' : 'text-brand-orange'
            )}
          >
            Solutions
          </span>
        </div>
        {showTagline && (
          <span
            className={cn(
              'mt-0.5 text-[10px] font-medium tracking-wide',
              isLightText ? 'text-white/65' : 'text-brand-charcoal-subtle'
            )}
          >
            Moving Made Easy. Space Made Clear.
          </span>
        )}
      </div>
    </Link>
  );
}
