import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-semibold text-brand-navy font-heading flex items-center gap-1"
      >
        <span>{label}</span>
        {required && (
          <span className="text-brand-orange font-bold" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-xs text-brand-charcoal-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, leftIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-brand-charcoal-subtle">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-xl border bg-white px-4 py-2.5 text-sm sm:text-base text-brand-charcoal transition-colors',
            'placeholder:text-brand-charcoal-subtle/70',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:border-brand-orange',
            'disabled:cursor-not-allowed disabled:bg-brand-surface-grey disabled:opacity-60',
            leftIcon && 'pl-10',
            hasError
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-brand-surface-border hover:border-brand-navy/35',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[110px] w-full rounded-xl border bg-white px-4 py-3 text-sm sm:text-base text-brand-charcoal transition-colors',
          'placeholder:text-brand-charcoal-subtle/70',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:border-brand-orange',
          'disabled:cursor-not-allowed disabled:bg-brand-surface-grey disabled:opacity-60',
          hasError
            ? 'border-red-500 focus-visible:ring-red-500'
            : 'border-brand-surface-border hover:border-brand-navy/35',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'flex h-12 w-full rounded-xl border bg-white px-4 py-2.5 text-sm sm:text-base text-brand-charcoal transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:border-brand-orange',
          'disabled:cursor-not-allowed disabled:bg-brand-surface-grey disabled:opacity-60',
          hasError
            ? 'border-red-500 focus-visible:ring-red-500'
            : 'border-brand-surface-border hover:border-brand-navy/35',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

export interface SelectionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Interactive visual selection card used in the Visual Moving Quote
 * and Photo-First Junk Removal Quote wizards.
 */
export function SelectionCard({
  title,
  description,
  icon,
  badge,
  selected = false,
  onClick,
  className,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'group relative flex w-full flex-col items-start rounded-2xl border-2 p-5 text-left transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2',
        selected
          ? 'border-brand-orange bg-brand-orange-50/70 shadow-card'
          : 'border-brand-surface-border bg-white hover:border-brand-navy/35 hover:shadow-card',
        className
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        {icon && (
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
              selected
                ? 'bg-brand-orange text-white'
                : 'bg-brand-surface-grey text-brand-navy group-hover:bg-brand-navy group-hover:text-white'
            )}
          >
            {icon}
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          {badge && (
            <span className="rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-navy">
              {badge}
            </span>
          )}
          <div
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors',
              selected
                ? 'border-brand-orange bg-brand-orange text-white'
                : 'border-brand-surface-border bg-white group-hover:border-brand-navy/40'
            )}
          >
            {selected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </div>
        </div>
      </div>

      <h4 className="mt-3.5 font-heading text-base font-bold text-brand-navy">{title}</h4>
      {description && (
        <p className="mt-1 text-xs sm:text-sm leading-relaxed text-brand-charcoal-muted">
          {description}
        </p>
      )}
    </button>
  );
}

