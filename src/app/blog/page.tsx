import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { BLOG_POSTS } from '@/lib/data/blog-posts-data';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardTitle, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Moving, Packing & Junk Removal Blog | QuickMove Solutions Calgary',
  description:
    'Helpful moving checklists, packing tips, junk removal preparation guides, and Calgary-to-Edmonton relocation advice from QuickMove Solutions.',
  alternates: { canonical: '/blog' },
};

export default function BlogIndexPage() {
  return (
    <div>
      {/* Hero */}
      <Section variant="navy-mesh" spacing="md">
        <div className="max-w-3xl space-y-4">
          <Badge variant="orange-solid" icon={<BookOpen className="h-3.5 w-3.5" />}>
            QuickMove Solutions Resource Library
          </Badge>
          <h1 className="font-heading text-display-xl text-white">
            Moving Checklists, Packing Advice &amp;{' '}
            <span className="text-brand-orange">Space-Clearing Guides.</span>
          </h1>
          <p className="text-base sm:text-lg text-brand-navy-100 leading-relaxed">
            Practical, local advice for preparing your home, apartment, or office for relocation
            and junk removal across Calgary, Airdrie, Strathmore, Red Deer, and Edmonton.
          </p>
        </div>
      </Section>

      {/* Articles Grid */}
      <Section variant="white" spacing="lg">
        <SectionHeader
          eyebrow="All Articles"
          title="Explore Our Moving & Cleanout Guides"
          description="Every guide connects directly to our visual quote tools and service checklists."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <Card
              key={post.slug}
              variant="interactive"
              padding="md"
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Badge variant={post.category === 'Junk Removal' ? 'orange' : 'light'}>
                    {post.category}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-brand-charcoal-subtle">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readingTime}</span>
                  </span>
                </div>

                <Link href={`/blog/${post.slug}`} className="group">
                  <CardTitle className="text-brand-navy group-hover:text-brand-orange transition-colors">
                    {post.title}
                  </CardTitle>
                </Link>

                <p className="mt-2.5 text-sm text-brand-charcoal-muted leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <CardFooter>
                <span className="inline-flex items-center gap-1 text-xs text-brand-charcoal-subtle">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{post.publishedAt}</span>
                </span>
                <Button
                  href={`/blog/${post.slug}`}
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-transparent text-brand-orange hover:text-brand-orange-hover"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Read Article
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

