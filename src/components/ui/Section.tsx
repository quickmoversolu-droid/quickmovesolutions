import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './Badge';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'white' | 'grey' | 'navy' | 'navy-mesh' | 'obsidian' | 'dark-card';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  containerSize?: 'default' | 'narrow' | 'wide';
}

const sectionVariants = {
  white: 'bg-[#060C18] text-white border-b border-white/10',
  grey: 'bg-[#091122] text-white border-b border-white/10',
  navy: 'bg-[#0B1528] text-white border-b border-white/10',
  obsidian: 'bg-[#05080D] text-white border-b border-white/10',
  'dark-card': 'bg-[#070D1A] text-white border-b border-white/10',
  'navy-mesh':
    'bg-[#060C18] text-white bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#132240] via-[#091122] to-[#05080D] border-b border-white/10',
};

const sectionSpacings = {
  sm: 'py-10 sm:py-14',
  md: 'py-14 sm:py-20',
  lg: 'py-16 sm:py-24 lg:py-28',
  xl: 'py-20 sm:py-28 lg:py-32',
};

export function Section({
  className,
  variant = 'obsidian',
  spacing = 'lg',
  containerSize = 'default',
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn('relative overflow-hidden', sectionVariants[variant], sectionSpacings[spacing], className)}
      {...props}
    >
      <div
        className={cn(
          'container mx-auto',
          containerSize === 'narrow' && 'max-w-4xl',
          containerSize === 'wide' && 'max-w-[1440px]'
        )}
      >
        {children}
      </div>
    </section>
  );
}

export interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowIcon?: React.ReactNode;
  eyebrowVariant?: 'navy' | 'orange' | 'white';
  title: string;
  description?: string;
  align?: 'left' | 'center';
  lightText?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  eyebrowIcon,
  eyebrowVariant = 'orange',
  title,
  description,
  align = 'center',
  lightText = true,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12 sm:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <div className={cn('mb-3', align === 'center' ? 'flex justify-center' : '')}>
          <Badge
            variant={eyebrowVariant === 'orange' ? 'orange' : 'navy'}
            icon={eyebrowIcon}
            className="border border-brand-orange/30 bg-brand-orange/15 text-brand-orange font-bold text-xs"
          >
            {eyebrow}
          </Badge>
        </div>
      )}

      <h2
        className={cn(
          'font-heading text-heading-1 font-extrabold tracking-tight',
          lightText ? 'text-white' : 'text-white'
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'mt-3.5 text-base sm:text-lg leading-relaxed',
            lightText ? 'text-white/75' : 'text-white/75'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
