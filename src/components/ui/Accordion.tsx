'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id: string;
  question?: string;
  title?: string;
  answer?: string;
  content?: React.ReactNode;
  category?: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string;
  className?: string;
}

export function Accordion({ items, defaultOpenId, className }: AccordionProps) {
  const [openId, setOpenId] = React.useState<string | null>(defaultOpenId ?? items[0]?.id ?? null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={cn('divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#060D1A] text-white', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const displayTitle = item.title || item.question;
        const displayContent = item.content || item.answer;

        return (
          <div key={item.id} className="group">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`accordion-panel-${item.id}`}
                id={`accordion-trigger-${item.id}`}
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-heading text-base sm:text-lg font-bold text-white transition-colors hover:text-brand-orange focus-visible:outline-none"
              >
                <span>{displayTitle}</span>
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
                    isOpen
                      ? 'rotate-180 border-brand-orange bg-brand-orange text-white shadow-orange-glow'
                      : 'border-white/15 bg-white/5 text-white/70 group-hover:border-brand-orange/40 group-hover:text-white'
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div
              id={`accordion-panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-trigger-${item.id}`}
              hidden={!isOpen}
              className={cn(
                'px-6 pb-5 pt-1 text-sm sm:text-base leading-relaxed text-white/75',
                !isOpen && 'hidden'
              )}
            >
              {displayContent}
            </div>
          </div>
        );
      })}
    </div>
  );
}
