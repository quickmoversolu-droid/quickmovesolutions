import type { Metadata } from 'next';
import { LOCATION_PAGES_DATA } from '@/lib/data/location-pages-data';
import { LocationPageTemplate } from '@/components/marketing-site/LocationPageTemplate';

const data = LOCATION_PAGES_DATA['moving-company-airdrie'];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: '/moving-company-airdrie' },
};

export default function AirdrieLocationPage() {
  return <LocationPageTemplate data={data} />;
}

