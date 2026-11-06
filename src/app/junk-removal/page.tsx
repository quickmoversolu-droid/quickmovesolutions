import type { Metadata } from 'next';
import { SERVICE_PAGES_DATA } from '@/lib/data/service-pages-data';
import { ServicePageTemplate } from '@/components/marketing-site/ServicePageTemplate';

const data = SERVICE_PAGES_DATA['junk-removal'];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: '/junk-removal' },
};

export default function JunkRemovalPage() {
  return <ServicePageTemplate data={data} />;
}

