import type { Metadata } from 'next';
import { SERVICE_PAGES_DATA } from '@/lib/data/service-pages-data';
import { ServicePageTemplate } from '@/components/marketing-site/ServicePageTemplate';

const data = SERVICE_PAGES_DATA['residential-moving'];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: '/residential-moving' },
};

export default function ResidentialMovingPage() {
  return <ServicePageTemplate data={data} />;
}

