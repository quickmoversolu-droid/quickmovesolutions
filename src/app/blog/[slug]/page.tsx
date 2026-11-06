import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  Clock,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { BLOG_POSTS } from '@/lib/data/blog-posts-data';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    return { title: 'Article Not Found' };
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  const baseUrl = BUSINESS_INFO.website.replace(/\/$/, '');
  const articleUrl = `${baseUrl}/blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${baseUrl}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: articleUrl,
          },
        ],
      },
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        url: articleUrl,
        datePublished: post.publishedAt,
        author: {
          '@type': 'Organization',
          name: BUSINESS_INFO.name,
          url: BUSINESS_INFO.website,
        },
        publisher: {
          '@type': 'Organization',
          name: BUSINESS_INFO.name,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/images/quickmove-logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleUrl,
        },
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Article Header */}
      <Section variant="navy-mesh" spacing="md" containerSize="narrow">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs text-brand-navy-200"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-brand-orange" />
          <Link href="/blog" className="hover:text-white transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-brand-orange" />
          <span className="font-semibold text-white line-clamp-1">{post.title}</span>
        </nav>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-brand-navy-100">
            <Badge variant="orange-solid">{post.category}</Badge>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-brand-orange" />
              <span>{post.readingTime}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-brand-orange" />
              <span>Published {post.publishedAt}</span>
            </span>
          </div>

          <h1 className="font-heading text-display-lg text-white">{post.title}</h1>
          <p className="text-base sm:text-lg text-brand-navy-100 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </Section>

      {/* Article Body */}
      <Section variant="white" spacing="lg" containerSize="narrow">
        <article className="space-y-10">
          {post.sections.map((sec) => (
            <div key={sec.heading} className="space-y-4">
              <h2 className="font-heading text-heading-2 text-brand-navy">
                {sec.heading}
              </h2>
              {sec.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="text-base leading-relaxed text-brand-charcoal"
                >
                  {p}
                </p>
              ))}
              {sec.bullets && (
                <ul className="space-y-2.5 rounded-2xl bg-brand-surface-grey p-6 border border-brand-surface-border">
                  {sec.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-sm sm:text-base text-brand-charcoal"
                    >
                      <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </article>

        {/* Contextual Service & Quote CTA Box */}
        <Card variant="navy" padding="lg" className="mt-12 space-y-5">
          <Badge variant="orange-solid">Put This Guide Into Action</Badge>
          <h3 className="font-heading text-heading-2 text-white">
            Planning Your Next Move, Delivery or Space Cleanout?
          </h3>
          <p className="text-sm sm:text-base text-brand-navy-100 leading-relaxed">
            Explore our dedicated{' '}
            <Link
              href={post.relatedServiceHref}
              className="font-bold text-brand-orange hover:underline"
            >
              {post.relatedServiceLabel}
            </Link>{' '}
            page or start your online quote request in minutes.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              href={post.relatedQuoteHref}
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Start Your Free Quote
            </Button>
            <Button
              href={post.relatedServiceHref}
              variant="outline-light"
              size="lg"
            >
              View {post.relatedServiceLabel}
            </Button>
            <Button
              href={BUSINESS_INFO.phoneHref}
              variant="outline-light"
              size="lg"
              leftIcon={<Phone className="h-4 w-4 text-brand-orange" />}
            >
              {BUSINESS_INFO.phoneDisplay}
            </Button>
          </div>
        </Card>

        {/* More Articles */}
        <div className="mt-14 pt-10 border-t border-brand-surface-border">
          <h3 className="font-heading text-heading-2 text-brand-navy mb-6">
            More Helpful Guides from QuickMove Solutions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherPosts.map((other) => (
              <Link
                key={other.slug}
                href={`/blog/${other.slug}`}
                className="rounded-2xl border border-brand-surface-border bg-brand-surface-grey p-5 hover:border-brand-orange hover:bg-white transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-brand-orange">
                    {other.category}
                  </span>
                  <h4 className="mt-1.5 font-heading text-sm font-bold text-brand-navy">
                    {other.title}
                  </h4>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-heading font-bold text-brand-orange">
                  <span>Read Guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

