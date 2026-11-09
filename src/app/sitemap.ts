import type { MetadataRoute } from 'next';
import { BUSINESS_INFO, OFFICIAL_SERVICES, SERVICE_AREAS } from '@/lib/constants/business';
import { BLOG_POSTS } from '@/lib/data/blog-posts-data';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const rawBase = BUSINESS_INFO.website.replace(/\/$/, '');
  const baseUrl = rawBase.includes('quickmovesolution.com')
    ? 'https://www.quickmovesolution.ca'
    : rawBase;
  const lastModified = new Date();

  const corePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/moving-services`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/service-areas`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/get-a-quote`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/get-a-quote/moving`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/get-a-quote/junk-removal`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/get-a-quote/delivery`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/about-us`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/junk-removal-policy`, lastModified, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = OFFICIAL_SERVICES.map((srv) => ({
    url: `${baseUrl}${srv.href}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const locationRoutes: MetadataRoute.Sitemap = SERVICE_AREAS.map((area) => ({
    url: `${baseUrl}${area.href}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: area.isPrimaryMarket ? 0.95 : 0.85,
  }));

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...corePages, ...serviceRoutes, ...locationRoutes, ...blogRoutes];
}

