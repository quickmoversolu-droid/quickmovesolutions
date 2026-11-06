import * as React from 'react';
import { cn } from '@/lib/utils';

export interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'navy' | 'orange' | 'soft-orange' | 'soft-navy' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

const variantMap = {
  navy: 'bg-brand-navy text-white shadow-sm',
  orange: 'bg-brand-orange text-white shadow-cta',
  'soft-orange': 'bg-brand-orange/12 text-brand-orange border border-brand-orange/20',
  'soft-navy': 'bg-brand-navy/8 text-brand-navy border border-brand-navy/15',
  white: 'bg-white text-brand-navy shadow-sm border border-brand-surface-border',
};

const sizeMap = {
  sm: 'h-10 w-10 rounded-xl',
  md: 'h-12 w-12 rounded-xl',
  lg: 'h-14 w-14 rounded-2xl',
};

export function IconBox({
  className,
  variant = 'soft-orange',
  size = 'md',
  children,
  ...props
}: IconBoxProps) {
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center transition-transform duration-200',
        variantMap[variant],
        sizeMap[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

