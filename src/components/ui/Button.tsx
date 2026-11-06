import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'outline-light'
  | 'ghost'
  | 'white'
  | 'call';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-orange text-white shadow-cta hover:bg-brand-orange-hover hover:shadow-cta-hover active:translate-y-[1px] focus-visible:ring-brand-orange',
  secondary:
    'bg-brand-navy text-white shadow-sm hover:bg-brand-navy-light active:translate-y-[1px] focus-visible:ring-brand-navy',
  outline:
    'border-2 border-brand-navy/20 bg-transparent text-brand-navy hover:border-brand-navy hover:bg-brand-navy/5 focus-visible:ring-brand-navy',
  'outline-light':
    'border-2 border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white/15 focus-visible:ring-white',
  ghost:
    'bg-transparent text-brand-charcoal hover:bg-brand-surface-grey hover:text-brand-navy focus-visible:ring-brand-navy',
  white:
    'bg-white text-brand-navy shadow-md hover:bg-brand-surface-grey focus-visible:ring-white',
  call:
    'border-2 border-brand-orange/30 bg-brand-orange/10 text-brand-navy hover:border-brand-orange hover:bg-brand-orange hover:text-white focus-visible:ring-brand-orange',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'h-11 px-5 text-sm font-semibold rounded-xl gap-2',
  lg: 'h-12 px-6 text-base font-bold rounded-xl gap-2.5',
  xl: 'h-14 px-8 text-base sm:text-lg font-bold rounded-2xl gap-3',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      href,
      external = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-heading transition-all duration-200 select-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-55 disabled:pointer-events-none',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    );

    const content = (
      <>
        {isLoading ? (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </>
    );

    if (href) {
      const isExternalOrProtocol =
        external || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http');

      if (isExternalOrProtocol) {
        return (
          <a
            href={href}
            className={baseClasses}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
          >
            {content}
          </a>
        );
      }

      return (
        <Link href={href} className={baseClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

