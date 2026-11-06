import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'navy'
  | 'orange'
  | 'orange-solid'
  | 'light'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}

const badgeStyles: Record<BadgeVariant, string> = {
  navy: 'bg-brand-navy text-white border border-brand-navy',
  orange: 'bg-brand-orange/12 text-brand-orange-700 border border-brand-orange/25',
  'orange-solid': 'bg-brand-orange text-white border border-brand-orange',
  light: 'bg-brand-surface-grey text-brand-navy border border-brand-surface-border',
  outline: 'bg-transparent text-brand-navy border border-brand-navy/25',
  success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border border-amber-200',
  info: 'bg-sky-50 text-sky-800 border border-sky-200',
};

export function Badge({
  className,
  variant = 'orange',
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide font-heading',
        badgeStyles[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

