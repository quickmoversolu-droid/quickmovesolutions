import React from 'react';
import { BUSINESS_INFO, OFFICIAL_SERVICES, SERVICE_AREAS } from '@/lib/constants/business';

export function StructuredDataJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['MovingCompany', 'LocalBusiness'],
        '@id': `${BUSINESS_INFO.website}#organization`,
        name: BUSINESS_INFO.name,
        legalName: BUSINESS_INFO.name,
        slogan: BUSINESS_INFO.tagline,
        url: BUSINESS_INFO.website,
        logo: `${BUSINESS_INFO.website.replace(/\/$/, '')}/images/quickmove-logo.png`,
        image: `${BUSINESS_INFO.website.replace(/\/$/, '')}/images/quickmove-logo.png`,
        telephone: BUSINESS_INFO.phoneE164,
        email: BUSINESS_INFO.email,
        priceRange: '$$',
        currenciesAccepted: 'CAD',
        paymentAccepted: 'Interac e-Transfer, Debit Card',
        address: {
          '@type': 'PostalAddress',
          addressLocality: BUSINESS_INFO.primaryCity,
          addressRegion: BUSINESS_INFO.province,
          addressCountry: 'CA',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 51.0447,
          longitude: -114.0719,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '07:00',
            closes: '21:00',
          },
        ],
        areaServed: SERVICE_AREAS.map((area) => ({
          '@type': 'City',
          name: area.city,
          containedInPlace: {
            '@type': 'AdministrativeArea',
            name: 'Alberta, Canada',
          },
        })),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '48',
          reviewCount: '48',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: BUSINESS_INFO.phoneE164,
            contactType: 'customer service',
            areaServed: 'CA-AB',
            availableLanguage: ['English'],
          },
        ],
        sameAs: [
          BUSINESS_INFO.socials.facebook,
          BUSINESS_INFO.socials.instagram,
          BUSINESS_INFO.googleReviewUrl,
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Moving, Delivery, Packing & Photo-First Junk Removal Services',
          itemListElement: OFFICIAL_SERVICES.map((srv) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: srv.name,
              description: srv.description,
              url: `${BUSINESS_INFO.website.replace(/\/$/, '')}${srv.href}`,
            },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${BUSINESS_INFO.website}#website`,
        url: BUSINESS_INFO.website,
        name: BUSINESS_INFO.name,
        description: BUSINESS_INFO.tagline,
        publisher: {
          '@id': `${BUSINESS_INFO.website}#organization`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

