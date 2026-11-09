import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StructuredDataJsonLd } from '@/components/seo/StructuredDataJsonLd';
import { AnalyticsAndUtmTracker } from '@/components/seo/AnalyticsAndUtmTracker';

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS_INFO.website),
  title: {
    default: `${BUSINESS_INFO.name} | Movers in Calgary, Airdrie, Red Deer & Edmonton`,
    template: `%s | ${BUSINESS_INFO.name}`,
  },
  description:
    'Top-rated Calgary moving company offering residential moving, commercial office relocations, furniture delivery, and photo-first junk removal in Calgary, Airdrie, Strathmore, Red Deer, and Edmonton. Get an upfront guaranteed quote online.',
  keywords: [
    'Movers Calgary',
    'Calgary moving company',
    'Residential movers Calgary',
    'Commercial movers Calgary',
    'Office relocation Calgary',
    'Junk removal Calgary',
    'Furniture delivery Calgary',
    'Packing and unpacking services Calgary',
    'Affordable movers Calgary AB',
    'Long distance moving Alberta',
    'Airdrie moving company',
    'Edmonton movers',
    'Red Deer moving services',
    'Strathmore movers',
    'Piano movers Calgary',
    'QuickMove Solutions',
  ],
  authors: [{ name: BUSINESS_INFO.name, url: BUSINESS_INFO.website }],
  creator: BUSINESS_INFO.name,
  publisher: BUSINESS_INFO.name,
  category: 'Moving & Relocation Services',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: BUSINESS_INFO.website,
    siteName: BUSINESS_INFO.name,
    title: `${BUSINESS_INFO.name} — Calgary Movers & Junk Removal Specialists`,
    description:
      'Professional residential & commercial moving, furniture delivery, and photo-first junk removal in Calgary, Airdrie, Strathmore, Red Deer, and Edmonton. Transparent pricing & verified 5-star service.',
    images: [
      {
        url: `${BUSINESS_INFO.website.replace(/\/$/, '')}/images/quickmove-logo.png`,
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} Logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BUSINESS_INFO.name} — Calgary Moving & Junk Removal`,
    description:
      'Residential and commercial moves, delivery, and junk removal across Calgary and Alberta. Upfront pricing and verified 5-star crews.',
    images: [`${BUSINESS_INFO.website.replace(/\/$/, '')}/images/quickmove-logo.png`],
  },
  verification: {
    google: 'nO6RLIS3NpCEu1TkOcExIn3V8oF3bIukGazpYNQicug',
  },
  other: {
    'geo.region': 'CA-AB',
    'geo.placename': 'Calgary, Alberta',
    'geo.position': '51.0447;-114.0719',
    ICBM: '51.0447, -114.0719',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-brand-charcoal antialiased">
        <StructuredDataJsonLd />
        <Suspense fallback={null}>
          <AnalyticsAndUtmTracker />
        </Suspense>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-orange focus:px-4 focus:py-2.5 focus:font-heading focus:font-bold focus:text-white focus:shadow-cta"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

