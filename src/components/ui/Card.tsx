import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'grey' | 'navy' | 'outlined' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const cardVariants = {
  default:
    'bg-[#0A1324]/95 border border-white/10 shadow-dark-card text-white',
  grey:
    'bg-[#060D1A]/90 border border-white/10 text-white',
  navy:
    'bg-[#0B162C] border border-white/15 shadow-dark-card text-white',
  outlined:
    'bg-[#070D18] border border-white/15 text-white',
  interactive:
    'bg-[#0A1324]/95 border border-white/10 shadow-dark-card text-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/50 hover:bg-[#0E1A32]',
};

const cardPaddings = {
  none: 'p-0',
  sm: 'p-4 sm:p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-7 sm:p-9',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-2xl', cardVariants[variant], cardPaddings[padding], className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-2 mb-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-heading text-heading-3 tracking-tight text-white font-extrabold', className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm sm:text-base leading-relaxed text-white/70', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4',
        className
      )}
      {...props}
    />
  );
}
