'use client';

import * as React from 'react';

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

/**
 * Robust wrapper that ensures all website sections, services, and cards
 * are 100% visible immediately across all browsers and devices without
 * opacity: 0 hiding bugs or scroll failure.
 */
export function FadeIn({
  children,
  className,
}: FadeInProps) {
  return <div className={className}>{children}</div>;
}
