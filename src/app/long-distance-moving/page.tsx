import type { Metadata } from 'next';
import { SERVICE_PAGES_DATA } from '@/lib/data/service-pages-data';
import { ServicePageTemplate } from '@/components/marketing-site/ServicePageTemplate';

const data = SERVICE_PAGES_DATA['long-distance-moving'];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: '/long-distance-moving' },
};

export default function LongDistanceMovingPage() {
  return <ServicePageTemplate data={data} />;
}

