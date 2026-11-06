import type { Metadata } from 'next';
import { SERVICE_PAGES_DATA } from '@/lib/data/service-pages-data';
import { ServicePageTemplate } from '@/components/marketing-site/ServicePageTemplate';

const data = SERVICE_PAGES_DATA['delivery-services'];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: '/delivery-services' },
};

export default function DeliveryServicesPage() {
  return <ServicePageTemplate data={data} />;
}

