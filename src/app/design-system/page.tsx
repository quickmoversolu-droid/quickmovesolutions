import type { Metadata } from 'next';
import { DesignSystemShowcase } from '@/components/design-system/DesignSystemShowcase';

export const metadata: Metadata = {
  title: 'Brand & Design System Foundation',
  description:
    'Official QuickMove Solutions design system, colour palette (#101D35 Navy, #F47732 Orange), typography hierarchy, and reusable UI components.',
};

export default function DesignSystemPage() {
  return <DesignSystemShowcase />;
}

