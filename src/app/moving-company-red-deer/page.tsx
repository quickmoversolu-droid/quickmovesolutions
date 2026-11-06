import type { Metadata } from 'next';
import { LOCATION_PAGES_DATA } from '@/lib/data/location-pages-data';
import { LocationPageTemplate } from '@/components/marketing-site/LocationPageTemplate';

const data = LOCATION_PAGES_DATA['moving-company-red-deer'];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: '/moving-company-red-deer' },
};

export default function RedDeerLocationPage() {
  return <LocationPageTemplate data={data} />;
}

