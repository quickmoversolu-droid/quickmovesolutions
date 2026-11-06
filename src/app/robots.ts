import type { MetadataRoute } from 'next';
import { BUSINESS_INFO } from '@/lib/constants/business';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = BUSINESS_INFO.website.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

