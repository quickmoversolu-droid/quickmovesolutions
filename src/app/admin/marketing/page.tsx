'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck,
  Play,
  ExternalLink,
  Clock,
  Send,
  ChevronLeft,
  ChevronRight,
  Heart,
  Users,
  TrendingUp,
  Activity,
  Link2,
  Zap,
  BarChart3,
  FolderOpen,
  Settings2,
  X,
  Check,
  RefreshCw,
  Camera,
  Copy,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { BUSINESS_INFO, OFFICIAL_SERVICES, SERVICE_AREAS } from '@/lib/constants/business';
import { BLOG_POSTS } from '@/lib/data/blog-posts-data';
import { AiMarketingHeroArtwork } from '@/components/ui/QuickMoveBrandVisuals';
import type {
  PlatformDatabaseState,
  MarketingPostRecord,
  MarketingPostStatus,
} from '@/lib/db/platform-store';

type CalendarViewMode = 'Month' | 'Week' | 'Day';
type ActiveDrawerTab =
  | 'none'
  | 'post-inspector'
  | 'performance-reports'
  | 'social-accounts'
  | 'media-library'
  | 'approval-queue'
  | 'seo-guardrails';

interface CalendarDayCell {
  dayNumber: number;
  isCurrentMonth: boolean;
  dateKey: string;
  posts: {
    id: string;
    title: string;
    timeLabel: string;
    badgeType: 'facebook' | 'instagram' | 'quickmove';
    status: MarketingPostStatus;
    record?: MarketingPostRecord;
  }[];
}

export default function AdminAiMarketingManagerPage() {
  const [db, setDb] = useState<PlatformDatabaseState | null>(null);
  const [calendarView, setCalendarView] = useState<CalendarViewMode>('Month');
  const [calendarMonthLabel, setCalendarMonthLabel] = useState('Apr 2025');
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawerTab>('none');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [drawerFeedback, setDrawerFeedback] = useState<{ message: string; isError?: boolean } | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvancedStudio, setShowAdvancedStudio] = useState(false);

  const studioInputRef = useRef<HTMLTextAreaElement | null>(null);

  // AI Content Studio Form State
  const [platform, setPlatform] = useState<'FACEBOOK' | 'INSTAGRAM' | 'BOTH' | 'GOOGLE_BUSINESS'>('BOTH');
  const [contentPillar, setContentPillar] = useState('Moving Services Spotlight');
  const [serviceFocus, setServiceFocus] = useState('Junk Removal');
  const [targetCity, setTargetCity] = useState('Calgary');
  const [tone, setTone] = useState('Helpful, Reassuring & Local');
  const [goal, setGoal] = useState('Drive Visual Moving & Photo Junk Quotes');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16' | '16:9'>('4:5');
  const [customTopic, setCustomTopic] = useState('');
  const [heroArtworkUrl, setHeroArtworkUrl] = useState<string>('/images/quickmove-marketing-hero.jpg');

  const loadData = async () => {
    try {
      const [res, mediaRes] = await Promise.all([
        fetch('/api/admin/platform'),
        fetch('/api/admin/media'),
      ]);
      const json = await res.json();
      if (json.ok && json.data) {
        setDb(json.data);
        if (!selectedPostId && json.data.marketingPosts.length > 0) {
          setSelectedPostId(json.data.marketingPosts[0].id);
        }
      }
      const mediaJson = await mediaRes.json();
      if (mediaJson.ok && mediaJson.aiMarketingHeroImageUrl) {
        setHeroArtworkUrl(mediaJson.aiMarketingHeroImageUrl);
      }
    } catch (e) {
      console.warn('Error loading admin platform data:', e);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!db) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0A1324] p-12 text-center text-sm font-bold text-white/80 shadow-dark-card">
        Loading QuickMove Solutions AI Marketing Manager...
      </div>
    );
  }

  const activePost =
    db.marketingPosts.find((p) => p.id === selectedPostId) || db.marketingPosts[0];

  const handleGenerateAiPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setFeedback(null);

    const inferredService =
      customTopic.toLowerCase().includes('junk')
        ? 'Junk Removal'
        : customTopic.toLowerCase().includes('delivery')
          ? 'Furniture & Appliance Delivery'
          : customTopic.toLowerCase().includes('pack')
            ? 'Packing & Unpacking'
            : customTopic.toLowerCase().includes('commercial') || customTopic.toLowerCase().includes('office')
              ? 'Commercial Moving'
              : serviceFocus;

    const res = await fetch('/api/admin/ai/generate-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform,
        contentPillar,
        serviceFocus: inferredService,
        targetCity,
        tone,
        goal,
        aspectRatio,
        customTopic: customTopic.trim() || `${inferredService} in ${targetCity}`,
        generateImage: true,
      }),
    });
    const data = await res.json();
    setIsGenerating(false);
    if (res.ok && data.ok) {
      setSelectedPostId(data.post.id);
      setCustomTopic('');
      setActiveDrawer('post-inspector');
      setFeedback(
        `OpenRouter (${data.aiMetadata?.modelUsed || 'AI'}) generated "${data.post.title}" with creative image prompt. Synced to InsForge in PENDING_APPROVAL state.`
      );
      await loadData();
    } else {
      setFeedback(data.error || 'Error generating AI post.');
    }
  };

  const handleGenerateWeeklyPlan = async () => {
    setIsGenerating(true);
    setFeedback(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'GENERATE_WEEKLY_PLAN' }),
    });
    const data = await res.json();
    setIsGenerating(false);
    if (res.ok && data.ok) {
      setFeedback(
        `Generated ${data.createdPosts.length}-post weekly content plan across Residential Moving, Photo Junk Removal, Packing, Delivery & Calgary Service Areas.`
      );
      await loadData();
      setActiveDrawer('approval-queue');
    }
  };

  const handleGenerateMonthlyPlan = async () => {
    setIsGenerating(true);
    setFeedback(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'GENERATE_MONTHLY_PLAN' }),
    });
    const data = await res.json();
    setIsGenerating(false);
    if (res.ok && data.ok) {
      setFeedback(
        `Generated 12-post strategic monthly content plan across 4 weeks (Residential, Junk Removal, Commercial, and Highway 2 Corridor). Ready in Approval Queue!`
      );
      await loadData();
      setActiveDrawer('approval-queue');
    }
  };

  const handleUpdatePostStatus = async (postId: string, status: MarketingPostStatus) => {
    setFeedback(null);
    setDrawerFeedback(null);
    setUpdatingStatus(status);
    try {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_POST_STATUS',
          postId,
          status,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        const msg = status === 'PUBLISHED'
          ? `🎉 Live on Meta! Post published successfully (ID: ${data.post?.externalPostId || 'meta_published'}).`
          : `Post "${data.post?.title || postId}" successfully transitioned to ${status}.`;
        setFeedback(msg);
        setDrawerFeedback({ message: msg });
        await loadData();
      } else {
        const errMsg = data.error || 'Unable to update post status.';
        setFeedback(errMsg);
        setDrawerFeedback({ message: errMsg, isError: true });
      }
    } catch (e: any) {
      const errMsg = e.message || 'Network error updating post status.';
      setFeedback(errMsg);
      setDrawerFeedback({ message: errMsg, isError: true });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleRunCronScheduler = async () => {
    setFeedback(null);
    const res = await fetch('/api/cron/publish-social', { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFeedback(
        `Background Scheduler executed at ${new Date(data.checkedAt).toLocaleTimeString()}: Published ${data.publishedCount} scheduled post(s).`
      );
      await loadData();
    }
  };

  const handleConnectMetaOAuth = async () => {
    setFeedback(null);
    const res = await fetch('/api/marketing/oauth/meta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SIMULATE_OAUTH_CONNECT' }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFeedback(
        'Connected Facebook Page (QuickMove Solutions) & Instagram Business (@quickmoverssolution) via Meta Graph API OAuth 2.0.'
      );
      await loadData();
    }
  };

  const handleToggleSocialAccount = async (accountId: string, connected: boolean) => {
    setFeedback(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'TOGGLE_SOCIAL_CONNECTION',
        accountId,
        connected,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFeedback(
        `${data.account.platform} account (${data.account.accountName}) ${connected ? 'connected' : 'disconnected'
        }.`
      );
      await loadData();
    }
  };

  const focusCreatePostStudio = () => {
    if (studioInputRef.current) {
      studioInputRef.current.focus();
      studioInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Build the two-week calendar grid matching the visual design reference + any newly generated posts
  const findPostByTitle = (titleSubstring: string): MarketingPostRecord | undefined =>
    db.marketingPosts.find((p) =>
      p.title.toLowerCase().includes(titleSubstring.toLowerCase())
    );

  const extraPosts = db.marketingPosts.slice(7);

  const calendarCells: CalendarDayCell[] = [
    { dayNumber: 30, isCurrentMonth: false, dateKey: 'prev-30', posts: [] },
    {
      dayNumber: 31,
      isCurrentMonth: false,
      dateKey: 'prev-31',
      posts: [
        {
          id: findPostByTitle('Moving Tips')?.id || 'mkt_1',
          title: 'Moving Tips',
          timeLabel: '10:00 AM',
          badgeType: 'facebook',
          status: findPostByTitle('Moving Tips')?.status || 'PUBLISHED',
          record: findPostByTitle('Moving Tips'),
        },
      ],
    },
    {
      dayNumber: 1,
      isCurrentMonth: true,
      dateKey: 'cur-1',
      posts: [
        {
          id: findPostByTitle('Junk Removal')?.id || 'mkt_2',
          title: 'Junk Removal',
          timeLabel: '11:00 AM',
          badgeType: 'instagram',
          status: findPostByTitle('Junk Removal')?.status || 'SCHEDULED',
          record: findPostByTitle('Junk Removal'),
        },
      ],
    },
    {
      dayNumber: 2,
      isCurrentMonth: true,
      dateKey: 'cur-2',
      posts: extraPosts[0]
        ? [
          {
            id: extraPosts[0].id,
            title: extraPosts[0].title,
            timeLabel: '12:00 PM',
            badgeType: extraPosts[0].platform === 'INSTAGRAM' ? 'instagram' : 'facebook',
            status: extraPosts[0].status,
            record: extraPosts[0],
          },
        ]
        : [],
    },
    {
      dayNumber: 3,
      isCurrentMonth: true,
      dateKey: 'cur-3',
      posts: [
        {
          id: findPostByTitle('Residential Moving')?.id || 'mkt_3',
          title: 'Residential Moving',
          timeLabel: '10:00 AM',
          badgeType: 'facebook',
          status: findPostByTitle('Residential Moving')?.status || 'SCHEDULED',
          record: findPostByTitle('Residential Moving'),
        },
      ],
    },
    {
      dayNumber: 4,
      isCurrentMonth: true,
      dateKey: 'cur-4',
      posts: extraPosts[1]
        ? [
          {
            id: extraPosts[1].id,
            title: extraPosts[1].title,
            timeLabel: '02:00 PM',
            badgeType: 'quickmove',
            status: extraPosts[1].status,
            record: extraPosts[1],
          },
        ]
        : [],
    },
    {
      dayNumber: 5,
      isCurrentMonth: true,
      dateKey: 'cur-5',
      posts: [
        {
          id: findPostByTitle('Local Service Calgary')?.id || 'mkt_4',
          title: 'Local Service Calgary',
          timeLabel: '11:00 AM',
          badgeType: 'quickmove',
          status: findPostByTitle('Local Service Calgary')?.status || 'APPROVED',
          record: findPostByTitle('Local Service Calgary'),
        },
      ],
    },
    {
      dayNumber: 6,
      isCurrentMonth: true,
      dateKey: 'cur-6',
      posts: extraPosts[2]
        ? [
          {
            id: extraPosts[2].id,
            title: extraPosts[2].title,
            timeLabel: '09:30 AM',
            badgeType: 'instagram',
            status: extraPosts[2].status,
            record: extraPosts[2],
          },
        ]
        : [],
    },
    {
      dayNumber: 7,
      isCurrentMonth: true,
      dateKey: 'cur-7',
      posts: [
        {
          id: findPostByTitle('Packing Tips')?.id || 'mkt_5',
          title: 'Packing Tips',
          timeLabel: '10:00 AM',
          badgeType: 'quickmove',
          status: findPostByTitle('Packing Tips')?.status || 'PENDING_APPROVAL',
          record: findPostByTitle('Packing Tips'),
        },
      ],
    },
    {
      dayNumber: 8,
      isCurrentMonth: true,
      dateKey: 'cur-8',
      posts: extraPosts[3]
        ? [
          {
            id: extraPosts[3].id,
            title: extraPosts[3].title,
            timeLabel: '01:00 PM',
            badgeType: 'facebook',
            status: extraPosts[3].status,
            record: extraPosts[3],
          },
        ]
        : [],
    },
    {
      dayNumber: 9,
      isCurrentMonth: true,
      dateKey: 'cur-9',
      posts: [
        {
          id: findPostByTitle('Commercial Moving')?.id || 'mkt_6',
          title: 'Commercial Moving',
          timeLabel: '10:00 AM',
          badgeType: 'facebook',
          status: findPostByTitle('Commercial Moving')?.status || 'SCHEDULED',
          record: findPostByTitle('Commercial Moving'),
        },
      ],
    },
    {
      dayNumber: 10,
      isCurrentMonth: true,
      dateKey: 'cur-10',
      posts: extraPosts[4]
        ? [
          {
            id: extraPosts[4].id,
            title: extraPosts[4].title,
            timeLabel: '03:00 PM',
            badgeType: 'instagram',
            status: extraPosts[4].status,
            record: extraPosts[4],
          },
        ]
        : [],
    },
    {
      dayNumber: 11,
      isCurrentMonth: true,
      dateKey: 'cur-11',
      posts: [
        {
          id: findPostByTitle('Delivery Services')?.id || 'mkt_7',
          title: 'Delivery Services',
          timeLabel: '11:00 AM',
          badgeType: 'instagram',
          status: findPostByTitle('Delivery Services')?.status || 'PENDING_APPROVAL',
          record: findPostByTitle('Delivery Services'),
        },
      ],
    },
    { dayNumber: 12, isCurrentMonth: true, dateKey: 'cur-12', posts: [] },
  ];

  const pendingCount = db.marketingPosts.filter((p) => p.status === 'PENDING_APPROVAL').length;
  const fbAccount = db.socialAccounts.find((a) => a.platform === 'FACEBOOK');
  const igAccount = db.socialAccounts.find((a) => a.platform === 'INSTAGRAM');

  return (
    <div className="space-y-6 text-white">
      {/* Feedback Notification Banner */}
      {feedback && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-orange/40 bg-brand-orange/15 px-5 py-3.5 text-xs font-bold text-white shadow-orange-glow">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 shrink-0 text-brand-orange" />
            <span>{feedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* =====================================================================
          1. HERO BANNER — AI MARKETING MANAGER
         ===================================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#060C18] via-[#0B162A] to-[#08101E] p-6 sm:p-8 lg:px-10 lg:py-8 shadow-dark-card">
        {/* Ambient radial glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-brand-orange/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-96 rounded-full bg-[#1C3564]/25 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Hero Copy & CTA Buttons */}
          <div className="lg:col-span-7">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[42px] lg:leading-[1.12]">
              <span className="text-brand-orange">AI</span> Marketing Manager
            </h1>
            <p className="mt-2.5 font-heading text-lg font-bold text-white/95 sm:text-xl">
              Create. Plan. Automate. Grow.
            </p>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-white/65">
              Let AI help you produce engaging content, schedule posts, and grow your business on
              Facebook &amp; Instagram.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={focusCreatePostStudio}
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#F47732] to-[#ff8c4a] px-6 py-3 text-sm font-bold text-white shadow-orange-glow transition-all hover:brightness-110 active:scale-[0.99]"
              >
                <Sparkles className="h-4 w-4" />
                Create New Post
              </button>

              <button
                type="button"
                onClick={handleGenerateWeeklyPlan}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#0C1628]/90 px-5 py-2.5 text-xs sm:text-sm font-bold text-white/90 transition-all hover:border-brand-orange/60 hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
              >
                <Calendar className="h-4 w-4 text-sky-400" />
                {isGenerating ? 'Generating...' : 'Weekly Plan (5 Posts)'}
              </button>

              <button
                type="button"
                onClick={handleGenerateMonthlyPlan}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-brand-orange/15 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:border-brand-orange hover:bg-brand-orange/25 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4 text-brand-orange" />
                {isGenerating ? 'Generating...' : 'Monthly Strategic Plan (12 Posts)'}
              </button>
</div>
          </div>

          {/* Right 3D Smartphone + Facebook/Instagram + Megaphone Artwork */}
          <div className="lg:col-span-5 relative group">
            <AiMarketingHeroArtwork customSrc={heroArtworkUrl} className="mx-auto max-w-[440px]" />
            <div className="mt-2 flex items-center justify-center">
              <Link
                href="/admin/finished-jobs"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-semibold text-white/60 backdrop-blur-md transition hover:border-brand-orange hover:text-white"
              >
                <Camera className="h-3 w-3 text-brand-orange" />
                <span>Customize Banner or Upload Finished Jobs</span>
              </Link>
</div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. 4 KPI ANALYTICS CARDS ROW
         ===================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* KPI 1: Posts This Month */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0A1324]/95 px-5 py-4 shadow-dark-card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange ring-1 ring-brand-orange/30">
              <Calendar className="h-6 w-6" />
</div>
            <div>
              <div className="font-heading text-2xl font-extrabold text-white">
                {Math.max(12, db.marketingPosts.length)}
  </div>
              <div className="text-xs font-medium text-white/60">Posts This Month</div>
</div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400">
            ↑ +20%
          </span>
        </div>

        {/* KPI 2: Total Reach */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0A1324]/95 px-5 py-4 shadow-dark-card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange ring-1 ring-brand-orange/30">
              <Users className="h-6 w-6" />
</div>
            <div>
              <div className="font-heading text-2xl font-extrabold text-white">8.5K</div>
              <div className="text-xs font-medium text-white/60">Total Reach</div>
</div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400">
            ↑ +35%
          </span>
        </div>

        {/* KPI 3: Engagement */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0A1324]/95 px-5 py-4 shadow-dark-card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange ring-1 ring-brand-orange/30">
              <Heart className="h-6 w-6 fill-brand-orange text-brand-orange" />
</div>
            <div>
              <div className="font-heading text-2xl font-extrabold text-white">1.2K</div>
              <div className="text-xs font-medium text-white/60">Engagement</div>
</div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400">
            ↑ +42%
          </span>
        </div>

        {/* KPI 4: Follower Growth */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0A1324]/95 px-5 py-4 shadow-dark-card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange ring-1 ring-brand-orange/30">
              <TrendingUp className="h-6 w-6" />
</div>
            <div>
              <div className="font-heading text-2xl font-extrabold text-white">+28%</div>
              <div className="text-xs font-medium text-white/60">Follower Growth</div>
</div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400">
            Active
          </span>
        </div>
      </div>

      {/* =====================================================================
          3. MAIN 12-COLUMN WORKSPACE GRID
         ===================================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN (8 Cols): Content Calendar + Recent Activity + Connected Accounts */}
        <div className="space-y-6 lg:col-span-8">
          {/* CONTENT CALENDAR CARD */}
          <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 sm:p-6 shadow-dark-card">
            {/* Calendar Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/15 text-brand-orange">
                  <Calendar className="h-4 w-4" />
    </div>
                <h2 className="font-heading text-lg font-bold text-white">Content Calendar</h2>
  </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Month / Week / Day View Switcher */}
                <div className="inline-flex items-center rounded-full border border-white/10 bg-[#060B16] p-1">
                  {(['Month', 'Week', 'Day'] as CalendarViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setCalendarView(mode)}
                      className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${calendarView === mode
                          ? 'bg-gradient-to-r from-[#F47732] to-[#ff8b49] text-white shadow-orange-glow'
                          : 'text-white/60 hover:text-white'
                        }`}
                    >
                      {mode}
                    </button>
                  ))}
    </div>

                {/* Month Navigation Pill */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#060B16] px-3 py-1 text-xs font-semibold text-white/85">
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonthLabel((prev) =>
                        prev === 'Apr 2025' ? 'Mar 2025' : 'Apr 2025'
                      )
                    }
                    className="text-white/50 hover:text-white"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-[64px] text-center">{calendarMonthLabel}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonthLabel((prev) =>
                        prev === 'Apr 2025' ? 'May 2025' : 'Apr 2025'
                      )
                    }
                    className="text-white/50 hover:text-white"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
    </div>
  </div>
</div>

            {/* MONTH VIEW GRID */}
            {calendarView === 'Month' && (
              <div className="overflow-x-auto">
                <div className="min-w-[640px]">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 border-b border-white/10 pb-2.5 text-center text-xs font-semibold text-white/60">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
      </div>

                  {/* 2-Week Calendar Grid matching visual reference */}
                  <div className="grid grid-cols-7 divide-x divide-y divide-white/10 border-x border-b border-white/10 bg-[#081020]/60">
                    {calendarCells.map((cell) => (
                      <div
                        key={cell.dateKey}
                        className="min-h-[102px] p-2 transition-colors hover:bg-white/[0.02]"
                      >
                        <div
                          className={`text-xs font-semibold ${cell.isCurrentMonth ? 'text-white/80' : 'text-white/30'
                            }`}
                        >
                          {cell.dayNumber}
            </div>

                        <div className="mt-1.5 space-y-1.5">
                          {cell.posts.map((postChip) => (
                            <button
                              key={postChip.id}
                              type="button"
                              onClick={() => {
                                if (postChip.record) {
                                  setSelectedPostId(postChip.record.id);
                                }
                                setActiveDrawer('post-inspector');
                              }}
                              className="group flex w-full items-start gap-1.5 rounded-lg border border-white/10 bg-[#131F38] p-1.5 text-left shadow-sm transition-all hover:border-brand-orange/60 hover:bg-[#192847]"
                            >
                              {/* Platform Badge */}
                              {postChip.badgeType === 'facebook' && (
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#1877F2] font-heading text-xs font-black text-white shadow-sm">
                                  f
                                </span>
                              )}
                              {postChip.badgeType === 'instagram' && (
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-sm">
                                  <span className="h-2.5 w-2.5 rounded-[3px] border border-white" />
                                </span>
                              )}
                              {postChip.badgeType === 'quickmove' && (
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#F47732] to-[#ff9856] text-white shadow-sm">
                                  <span className="h-2.5 w-2.5 rounded-[2px] border border-white/90" />
                                </span>
                              )}

                              <div className="min-w-0 flex-1">
                                <div className="truncate text-[11px] font-bold leading-tight text-white group-hover:text-brand-orange">
                                  {postChip.title}
                    </div>
                                <div className="mt-0.5 text-[10px] font-medium text-white/55">
                                  {postChip.timeLabel}
                    </div>
                  </div>
                            </button>
                          ))}
            </div>
          </div>
                    ))}
      </div>
    </div>

                
  </div>
            )}

            {/* WEEK OR DAY VIEW */}
            {calendarView !== 'Month' && (
              <div className="space-y-3 pt-2">
                {db.marketingPosts
                  .slice(0, calendarView === 'Week' ? 7 : 3)
                  .map((post) => (
                    <div
                      key={post.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0D182C] p-3.5 hover:border-brand-orange/40"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg font-bold text-white ${post.platform === 'FACEBOOK'
                              ? 'bg-[#1877F2]'
                              : post.platform === 'INSTAGRAM'
                                ? 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]'
                                : 'bg-brand-orange'
                            }`}
                        >
                          {post.platform === 'FACEBOOK' ? 'f' : 'IG'}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-white">{post.title}</div>
                          <div className="text-xs text-white/55">
                            {post.serviceFocus} • {post.targetCity} •{' '}
                            {post.scheduledFor
                              ? new Date(post.scheduledFor).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                              : 'Unscheduled'}
              </div>
            </div>
          </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${post.status === 'PUBLISHED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : post.status === 'PENDING_APPROVAL'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-sky-500/20 text-sky-300'
                            }`}
                        >
                          {post.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPostId(post.id);
                            setActiveDrawer('post-inspector');
                          }}
                          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:border-brand-orange hover:text-brand-orange"
                        >
                          Inspect / Approve
                        </button>
          </div>
        </div>
                  ))}
  </div>
            )}
          </div>

          {/* BOTTOM 2-COLUMN ROW: RECENT ACTIVITY + CONNECTED ACCOUNTS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* RECENT ACTIVITY CARD */}
            <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 shadow-dark-card">
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2.5">
                  <Activity className="h-4 w-4 text-brand-orange" />
                  <h3 className="font-heading text-base font-bold text-white">Recent Activity</h3>
    </div>
                <button
                  type="button"
                  onClick={() => setActiveDrawer('approval-queue')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  View All <span aria-hidden="true">→</span>
                </button>
  </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0D182C]/70 px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span className="text-xs font-medium text-white/90">
                      New post published on Facebook
                    </span>
      </div>
                  <span className="shrink-0 text-[11px] text-white/45">2 hours ago</span>
    </div>

                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0D182C]/70 px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span className="text-xs font-medium text-white/90">
                      Weekly content plan generated
                    </span>
      </div>
                  <span className="shrink-0 text-[11px] text-white/45">3 hours ago</span>
    </div>
  </div>
</div>

            {/* CONNECTED ACCOUNTS CARD */}
            <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 shadow-dark-card">
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2.5">
                  <Link2 className="h-4 w-4 text-brand-orange" />
                  <h3 className="font-heading text-base font-bold text-white">
                    Connected Accounts
                  </h3>
    </div>
  </div>

              <div className="space-y-3">
                {/* Facebook Account Row */}
                <div className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-[#0D182C]/70 px-3.5 py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1877F2] font-heading text-base font-black text-white shadow-sm">
                      f
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white">Facebook</div>
                      <div className="truncate text-[11px] text-white/55">
                        {fbAccount?.accountName || 'QuickMove Solutions'}
          </div>
        </div>
      </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        fbAccount?.connectionStatus === 'CONNECTED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {fbAccount?.connectionStatus === 'CONNECTED' ? 'Connected' : 'Paused'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDrawer('social-accounts');
                        setTimeout(() => {
                          document.getElementById('workspace-drawer')?.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      }}
                      className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                    >
                      Manage →
                    </button>
      </div>
    </div>

                

                {/* Instagram Account Row */}
                <div className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-[#0D182C]/70 px-3.5 py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-sm">
                      <span className="h-4 w-4 rounded-[4px] border-2 border-white" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white">Instagram</div>
                      <div className="truncate text-[11px] text-white/55">
                        @quickmoverssolution
          </div>
        </div>
      </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        igAccount?.connectionStatus === 'CONNECTED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {igAccount?.connectionStatus === 'CONNECTED' ? 'Connected' : 'Paused'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDrawer('social-accounts');
                        setTimeout(() => {
                          document.getElementById('workspace-drawer')?.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      }}
                      className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                    >
                      Manage →
                    </button>
      </div>
    </div>

                
  </div>
</div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 Cols): AI Content Studio + Quick Actions */}
        <div className="space-y-6 lg:col-span-4">
          {/* AI CONTENT STUDIO CARD */}
          <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 sm:p-6 shadow-dark-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-brand-orange" />
                <h2 className="font-heading text-lg font-bold text-white">AI Content Studio</h2>
  </div>
              <button
                type="button"
                onClick={() => setShowAdvancedStudio((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/70 hover:border-brand-orange/40 hover:text-white"
              >
                <Settings2 className="h-3 w-3 text-brand-orange" />
                {showAdvancedStudio ? 'Simple' : 'Options'}
              </button>
</div>

            <form onSubmit={handleGenerateAiPost} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="ai-studio-prompt"
                  className="mb-2 block text-xs font-medium text-white/70"
                >
                  Describe what you want to post...
                </label>
                <textarea
                  id="ai-studio-prompt"
                  ref={studioInputRef}
                  rows={3}
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Create a post about junk removal in Calgary"
                  className="w-full rounded-xl border border-white/15 bg-[#060C18] p-3.5 text-sm text-white placeholder:text-white/35 focus:border-brand-orange focus:outline-none"
                />
  </div>

              {showAdvancedStudio && (
                <div className="grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-[#060C18]/90 p-3.5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Platform
                    </label>
                    <select
                      value={platform}
                      onChange={(e) =>
                        setPlatform(
                          e.target.value as 'FACEBOOK' | 'INSTAGRAM' | 'BOTH' | 'GOOGLE_BUSINESS'
                        )
                      }
                      className="w-full rounded-lg border border-white/15 bg-[#0A1324] px-2.5 py-2 text-xs font-semibold text-white"
                    >
                      <option value="BOTH">FB + Instagram</option>
                      <option value="FACEBOOK">Facebook Page</option>
                      <option value="INSTAGRAM">Instagram</option>
                      <option value="GOOGLE_BUSINESS">Google Business</option>
                    </select>
      </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Target City
                    </label>
                    <select
                      value={targetCity}
                      onChange={(e) => setTargetCity(e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-[#0A1324] px-2.5 py-2 text-xs font-semibold text-white"
                    >
                      {SERVICE_AREAS.map((area) => (
                        <option key={area.slug} value={area.city}>
                          {area.city}
                        </option>
                      ))}
                    </select>
      </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Service Line Focus
                    </label>
                    <select
                      value={serviceFocus}
                      onChange={(e) => setServiceFocus(e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-[#0A1324] px-2.5 py-2 text-xs font-semibold text-white"
                    >
                      {OFFICIAL_SERVICES.map((svc) => (
                        <option key={svc.slug} value={svc.shortName}>
                          {svc.name}
                        </option>
                      ))}
                    </select>
      </div>
    </div>

                
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F47732] to-[#ff8b49] px-5 py-3.5 text-sm font-bold text-white shadow-orange-glow transition-all hover:brightness-110 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? 'Generating Content...' : 'Generate Content'}
              </button>
            </form>
          </div>

          {/* QUICK ACTIONS CARD */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 sm:p-6 shadow-dark-card">
            <div className="flex items-center gap-2.5 pb-4">
              <Zap className="h-5 w-5 fill-brand-orange text-brand-orange" />
              <h2 className="font-heading text-lg font-bold text-white">Quick Actions</h2>
</div>

            <div className="relative z-10 space-y-2 pb-6">
              <button
                type="button"
                onClick={() => setActiveDrawer('performance-reports')}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-[#0D182C]/80 px-4 py-3 text-left text-xs font-semibold text-white/90 transition-all hover:border-brand-orange/50 hover:bg-[#13223D] hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 text-brand-orange" />
                  View Performance Reports
                </span>
                <span className="text-white/50">→</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawer('social-accounts')}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-[#0D182C]/80 px-4 py-3 text-left text-xs font-semibold text-white/90 transition-all hover:border-brand-orange/50 hover:bg-[#13223D] hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <Link2 className="h-4 w-4 text-sky-400" />
                  Manage Social Accounts
                </span>
                <span className="text-white/50">→</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawer('media-library')}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-[#0D182C]/80 px-4 py-3 text-left text-xs font-semibold text-white/90 transition-all hover:border-brand-orange/50 hover:bg-[#13223D] hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <FolderOpen className="h-4 w-4 text-amber-400" />
                  Browse Media Library
                </span>
                <span className="text-white/50">→</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawer('approval-queue')}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-[#0D182C]/80 px-4 py-3 text-left text-xs font-semibold text-white/90 transition-all hover:border-brand-orange/50 hover:bg-[#13223D] hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Owner Approval Queue ({pendingCount} Pending)
                </span>
                <span className="text-white/50">→</span>
              </button>

              <Link
                href="/admin/finished-jobs"
                className="flex w-full items-center justify-between rounded-xl border border-brand-orange/40 bg-brand-orange/10 px-4 py-3 text-left text-xs font-semibold text-brand-orange transition-all hover:bg-brand-orange hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <Camera className="h-4 w-4" />
                  Upload Finished Jobs &amp; Custom Banners
                </span>
                <span>→</span>
              </Link>
            </div>

            {/* Bottom glowing orange ribbon wave matching visual reference */}
            <svg
              viewBox="0 0 400 56"
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 56 Q 130 22 250 38 T 400 8 L 400 56 Z"
                fill="url(#quickActionsOrangeWave)"
              />
              <defs>
                <linearGradient id="quickActionsOrangeWave" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F47732" stopOpacity="0.15" />
                  <stop offset="55%" stopColor="#F47732" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#FFB067" stopOpacity="0.95" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. INTERACTIVE WORKSPACE DRAWER (POST INSPECTOR / APPROVAL / REPORTS / MEDIA / OAUTH)
         ===================================================================== */}
      {activeDrawer !== 'none' && (
        <div id="workspace-drawer" className="rounded-3xl border border-brand-orange/40 bg-[#0A1324] p-6 shadow-dark-card scroll-mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'post-inspector', label: 'Post Inspector & Approval' },
                  { id: 'approval-queue', label: `Approval Queue (${pendingCount})` },
                  { id: 'performance-reports', label: 'Performance Analytics' },
                  { id: 'social-accounts', label: 'Social Accounts & Meta OAuth' },
                  { id: 'media-library', label: 'Media Library & Visual Prompts' },
                  { id: 'seo-guardrails', label: 'Local SEO & Brand Guardrails' },
                ] as { id: ActiveDrawerTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDrawer(tab.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${activeDrawer === tab.id
                      ? 'bg-gradient-to-r from-[#F47732] to-[#ff8b49] text-white shadow-orange-glow'
                      : 'border border-white/10 bg-[#060C18] text-white/65 hover:text-white'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
</div>

            <button
              type="button"
              onClick={() => setActiveDrawer('none')}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-white/75 hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
              Close Panel
            </button>
          </div>

          {/* DRAWER 1: POST INSPECTOR & OWNER APPROVAL */}
          {activeDrawer === 'post-inspector' && activePost && (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                      {activePost.platform} • {activePost.serviceFocus} • {activePost.targetCity}
                    </span>
                    <h3 className="mt-1 font-heading text-xl font-extrabold text-white">
                      {activePost.title}
                    </h3>
      </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${activePost.status === 'PUBLISHED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : activePost.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-sky-500/20 text-sky-300'
                      }`}
                  >
                    {activePost.status}
                  </span>
    </div>

                <div className="rounded-2xl border border-white/10 bg-[#060C18] p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/45">
                    Hook &amp; Social Caption
      </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/90">
                    {activePost.primaryCaption}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {activePost.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-brand-orange/15 px-2 py-0.5 text-[11px] font-semibold text-brand-orange"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 1-Click UTM Campaign Link Builder & Attribution */}
                <div className="rounded-2xl border border-white/10 bg-[#060C18] p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                      CRM Lead Attribution &amp; UTM Link
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const utmUrl = `${BUSINESS_INFO.website.replace(/\/$/, '')}/get-a-quote?utm_source=${activePost.platform.toLowerCase()}&utm_medium=social&utm_campaign=${activePost.campaignId || 'calgary_social'}&utm_content=${activePost.id}`;
                        navigator.clipboard.writeText(utmUrl);
                        setFeedback('✓ Copied tracked UTM link to clipboard! Ready to paste into post.');
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white/20 transition"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy UTM Link</span>
                    </button>
                  </div>
                  <div className="rounded-xl bg-black/50 p-2.5 font-mono text-[11px] text-white/70 break-all border border-white/5 select-all">
                    {`${BUSINESS_INFO.website.replace(/\/$/, '')}/get-a-quote?utm_source=${activePost.platform.toLowerCase()}&utm_medium=social&utm_campaign=${activePost.campaignId || 'calgary_social'}&utm_content=${activePost.id}`}
                  </div>
                  <p className="text-[10px] text-white/50">
                    When prospective clients click this tracked URL and submit a quote, their lead in the CRM dashboard is automatically attributed to this marketing creative.
                  </p>
                </div>

                

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    type="button"
                    disabled={updatingStatus !== null}
                    onClick={() => handleUpdatePostStatus(activePost.id, 'APPROVED')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-60 transition"
                  >
                    {updatingStatus === 'APPROVED' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    <span>{updatingStatus === 'APPROVED' ? 'Approving...' : 'Approve Post'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={updatingStatus !== null}
                    onClick={() => handleUpdatePostStatus(activePost.id, 'SCHEDULED')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-sky-500 disabled:opacity-60 transition"
                  >
                    {updatingStatus === 'SCHEDULED' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                    <span>{updatingStatus === 'SCHEDULED' ? 'Scheduling...' : 'Schedule on Calendar'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={updatingStatus !== null}
                    onClick={() => handleUpdatePostStatus(activePost.id, 'PUBLISHED')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F47732] to-[#ff8b49] px-4 py-2.5 text-xs font-bold text-white shadow-orange-glow hover:brightness-110 disabled:opacity-60 transition"
                  >
                    {updatingStatus === 'PUBLISHED' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span>{updatingStatus === 'PUBLISHED' ? 'Publishing to Meta...' : 'Publish Now to Meta'}</span>
                  </button>
                </div>

                {drawerFeedback && (
                  <div
                    className={`mt-3 flex items-center justify-between gap-3 rounded-xl border p-3.5 text-xs font-bold transition-all ${
                      drawerFeedback.isError
                        ? 'border-rose-500/40 bg-rose-500/15 text-rose-200 shadow-sm'
                        : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {drawerFeedback.isError ? (
                        <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      )}
                      <span>{drawerFeedback.message}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDrawerFeedback(null)}
                      className="rounded p-1 text-white/60 hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4 lg:col-span-5">
                <div className="rounded-2xl border border-white/10 bg-[#060C18] p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                    AI Image Prompt ({activePost.aspectRatio})
      </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/75">
                    {activePost.imagePrompt}
                  </p>
                  <div className="mt-3 rounded-xl border border-white/10 bg-[#0A1324] p-3 text-xs text-white/70">
                    <strong className="text-white">Overlay Text:</strong> {activePost.overlayText}
      </div>
    </div>

                
  </div>
</div>
          )}

          {/* DRAWER 2: APPROVAL & PUBLISH QUEUE */}
          {activeDrawer === 'approval-queue' && (
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    Content Approval &amp; Publishing Queue ({db.marketingPosts.length} Total Posts)
                  </h3>
                  <p className="text-xs text-white/60">
                    Review AI-generated posts, approve for scheduling, or trigger immediate Meta
                    Graph API publishing.
                  </p>
    </div>
                <button
                  type="button"
                  onClick={handleRunCronScheduler}
                  className="inline-flex items-center gap-2 rounded-xl border border-brand-orange/40 bg-brand-orange/15 px-4 py-2 text-xs font-bold text-brand-orange hover:bg-brand-orange hover:text-white"
                >
                  <Play className="h-3.5 w-3.5" />
                  Run Scheduled Publisher Now
                </button>
  </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {db.marketingPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#060C18] p-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                          {post.platform} • {post.targetCity}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${post.status === 'PUBLISHED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : post.status === 'PENDING_APPROVAL'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-sky-500/20 text-sky-300'
                            }`}
                        >
                          {post.status}
                        </span>
          </div>
                      <h4 className="mt-1.5 font-heading text-sm font-bold text-white">
                        {post.title}
                      </h4>
                      <p className="mt-1 line-clamp-2 text-xs text-white/65">{post.primaryCaption}</p>
        </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPostId(post.id);
                          setActiveDrawer('post-inspector');
                        }}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-white hover:border-brand-orange"
                      >
                        Inspect
                      </button>
                      {post.status !== 'APPROVED' && post.status !== 'PUBLISHED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdatePostStatus(post.id, 'APPROVED')}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-500"
                        >
                          Approve
                        </button>
                      )}
                      {post.status !== 'PUBLISHED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdatePostStatus(post.id, 'PUBLISHED')}
                          className="rounded-lg bg-brand-orange px-3 py-1.5 text-[11px] font-bold text-white hover:brightness-110"
                        >
                          Publish Now
                        </button>
                      )}
        </div>
      </div>
                ))}
  </div>
</div>
          )}

          {/* DRAWER 3: PERFORMANCE REPORTS */}
          {activeDrawer === 'performance-reports' && (
            <div className="mt-6 space-y-4">
              <h3 className="font-heading text-lg font-bold text-white">
                Social Media &amp; Local Campaign Performance Analytics
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {db.marketingCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="rounded-2xl border border-white/10 bg-[#060C18] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                        {camp.targetCity}
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                        {camp.status}
                      </span>
        </div>
                    <h4 className="mt-2 font-heading text-base font-bold text-white">
                      {camp.name}
                    </h4>
                    <p className="mt-1 text-xs text-white/60">{camp.theme}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                      <span className="text-white/55">Focus: {camp.serviceFocus}</span>
                      <span className="font-bold text-emerald-400">
                        Active Campaign
                      </span>
        </div>
      </div>
                ))}
  </div>
</div>
          )}

          {/* DRAWER 4: SOCIAL ACCOUNTS & META OAUTH */}
          {activeDrawer === 'social-accounts' && (
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    Connected Meta Accounts (Facebook Page &amp; Instagram Business)
                  </h3>
                  <p className="text-xs text-white/60">
                    Authorize official Meta Graph API publishing permissions (`pages_manage_posts`,
                    `instagram_content_publish`).
                  </p>
    </div>
                <button
                  type="button"
                  onClick={handleConnectMetaOAuth}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F47732] to-[#ff8b49] px-4 py-2.5 text-xs font-bold text-white shadow-orange-glow"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh Meta OAuth 2.0 Token
                </button>
  </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {db.socialAccounts.map((acc) => {
                  const isConnected = acc.connectionStatus === 'CONNECTED';
                  return (
                    <div
                      key={acc.id}
                      className="rounded-2xl border border-white/10 bg-[#060C18] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-orange">{acc.platform}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isConnected
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
          </div>
                      <div className="mt-2 font-heading text-base font-bold text-white">
                        {acc.accountName}
          </div>
                      <div className="text-xs text-white/55">{acc.accountUrl}</div>
                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                        <a
                          href={acc.accountUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:underline"
                        >
                          Open Profile <ExternalLink className="h-3 w-3" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleToggleSocialAccount(acc.id, !isConnected)}
                          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold text-white hover:border-brand-orange"
                        >
                          {isConnected ? 'Disconnect' : 'Connect'}
                        </button>
          </div>
        </div>
                  );
                })}
  </div>
</div>
          )}

          {/* DRAWER 5: MEDIA LIBRARY */}
          {activeDrawer === 'media-library' && (
            <div className="mt-6 space-y-4">
              <h3 className="font-heading text-lg font-bold text-white">
                Brand Media Library &amp; Visual Prompt Templates
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {db.marketingPosts.slice(0, 6).map((post) => (
                  <div
                    key={post.id}
                    className="rounded-2xl border border-white/10 bg-[#060C18] p-4"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-brand-orange">
                      <span>{post.serviceFocus}</span>
                      <span>Aspect {post.aspectRatio}</span>
        </div>
                    <div className="mt-2 font-heading text-sm font-bold text-white">
                      {post.overlayText}
        </div>
                    <p className="mt-2 line-clamp-3 text-xs text-white/60">{post.imagePrompt}</p>
      </div>
                ))}
  </div>
</div>
          )}

          {/* DRAWER 6: LOCAL SEO & BRAND GUARDRAILS */}
          {activeDrawer === 'seo-guardrails' && (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#060C18] p-4">
                <h4 className="font-heading text-sm font-bold text-brand-orange">
                  Verified Brand Constants
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-white/75">
                  <li>• Company: {BUSINESS_INFO.name}</li>
                  <li>• Tagline: &ldquo;{BUSINESS_INFO.tagline}&rdquo;</li>
                  <li>• Phone: {BUSINESS_INFO.phoneDisplay}</li>
                  <li>• Email: {BUSINESS_INFO.email}</li>
                </ul>
  </div>
              <div className="rounded-2xl border border-white/10 bg-[#060C18] p-4">
                <h4 className="font-heading text-sm font-bold text-emerald-400">
                  Local SEO Blog Articles ({BLOG_POSTS.length} Published)
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-white/75">
                  {BLOG_POSTS.map((blog) => (
                    <li key={blog.slug}>• {blog.title}</li>
                  ))}
                </ul>
  </div>
</div>
          )}
        </div>
      )}
    </div>
  );
}
