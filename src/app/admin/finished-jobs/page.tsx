'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  Trash2,
  Eye,
  Plus,
  RefreshCw,
  Image as ImageIcon,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { FinishedJobRecord } from '@/lib/db/platform-store';

export default function AdminFinishedJobsPage() {
  const [finishedJobs, setFinishedJobs] = useState<FinishedJobRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Hero Image states
  const [homepageHeroUrl, setHomepageHeroUrl] = useState<string>('/images/quickmove-truck-hero.jpg');
  const [aiMarketingHeroUrl, setAiMarketingHeroUrl] = useState<string>('/images/quickmove-marketing-hero.jpg');
  const [isUploadingBanner, setIsUploadingBanner] = useState<string | null>(null);

  // Modal / Form states for new finished job
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [serviceType, setServiceType] = useState<FinishedJobRecord['serviceType']>('RESIDENTIAL_MOVING');
  const [location, setLocation] = useState<string>('Calgary, AB');
  const [completionDate, setCompletionDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState<string>('');
  const [featuredOnHome, setFeaturedOnHome] = useState<boolean>(true);
  const [afterPhotoPreview, setAfterPhotoPreview] = useState<string>('');
  const [beforePhotoPreview, setBeforePhotoPreview] = useState<string>('');
  const [pastedImageUrl, setPastedImageUrl] = useState<string>('');
  const [isSubmittingJob, setIsSubmittingJob] = useState<boolean>(false);

  const homeFileInputRef = useRef<HTMLInputElement>(null);
  const marketingFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);
  const beforeFileInputRef = useRef<HTMLInputElement>(null);

  // Enable Ctrl+V paste support for images
  useEffect(() => {
    if (!isModalOpen) return;
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              setAfterPhotoPreview(reader.result as string);
              setPastedImageUrl('');
            };
            reader.readAsDataURL(file);
            setStatusMessage({ text: 'Image pasted from clipboard (Ctrl+V) successfully!', type: 'success' });
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isModalOpen]);

  // Load finished jobs and current banners
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [mediaRes, jobsRes] = await Promise.all([
        fetch('/api/admin/media'),
        fetch('/api/admin/finished-jobs'),
      ]);

      const mediaData = await mediaRes.json();
      if (mediaData.ok) {
        if (mediaData.homepageHeroImageUrl) setHomepageHeroUrl(mediaData.homepageHeroImageUrl);
        if (mediaData.aiMarketingHeroImageUrl) setAiMarketingHeroUrl(mediaData.aiMarketingHeroImageUrl);
      }

      const jobsData = await jobsRes.json();
      if (jobsData.ok && jobsData.data) {
        setFinishedJobs(jobsData.data);
      }
    } catch {
      setStatusMessage({ text: 'Error loading portfolio data.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle uploading custom banner (Homepage Hero or AI Marketing Hero)
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'homepage-hero' | 'ai-marketing-hero') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setStatusMessage({ text: 'Please select a valid .png, .jpeg, or .webp image.', type: 'error' });
      return;
    }

    setIsUploadingBanner(target);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target', target);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        if (target === 'homepage-hero') {
          setHomepageHeroUrl(data.url);
          setStatusMessage({ text: 'Homepage hero banner updated successfully!', type: 'success' });
        } else {
          setAiMarketingHeroUrl(data.url);
          setStatusMessage({ text: 'AI Marketing Manager hero banner updated successfully!', type: 'success' });
        }
      } else {
        setStatusMessage({ text: data.error || 'Failed to upload image.', type: 'error' });
      }
    } catch {
      setStatusMessage({ text: 'Network error uploading banner.', type: 'error' });
    } finally {
      setIsUploadingBanner(null);
      e.target.value = '';
    }
  };

  // Reset banner to default HD artwork
  const handleResetBanner = async (target: 'homepage-hero' | 'ai-marketing-hero') => {
    const defaultUrl = target === 'homepage-hero'
      ? '/images/quickmove-truck-hero.jpg'
      : '/images/quickmove-marketing-hero.jpg';

    try {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_SETTINGS',
          ...(target === 'homepage-hero'
            ? { homepageHeroImageUrl: defaultUrl }
            : { aiMarketingHeroImageUrl: defaultUrl }),
        }),
      });

      if (res.ok) {
        if (target === 'homepage-hero') setHomepageHeroUrl(defaultUrl);
        else setAiMarketingHeroUrl(defaultUrl);
        setStatusMessage({ text: `Reset ${target === 'homepage-hero' ? 'Homepage' : 'Marketing'} banner to default HD image.`, type: 'success' });
      }
    } catch {
      setStatusMessage({ text: 'Error resetting banner.', type: 'error' });
    }
  };

  // Convert File to base64 for job photos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle saving new finished job
  const handleCreateFinishedJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !afterPhotoPreview) {
      setStatusMessage({ text: 'Please provide a job title and upload a completed job photo.', type: 'error' });
      return;
    }

    setIsSubmittingJob(true);
    setStatusMessage(null);

    try {
      // 1. Upload the completed job photo via API
      let finalAfterUrl = afterPhotoPreview;
      if (afterPhotoPreview.startsWith('data:')) {
        const uploadRes = await fetch('/api/admin/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Data: afterPhotoPreview,
            filename: `${jobTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-after.jpg`,
            target: 'finished-job',
          }),
        });
        const uploadData = await uploadRes.json();
        if (uploadData.ok && uploadData.url) {
          finalAfterUrl = uploadData.url;
        }
      }

      let finalBeforeUrl = '';
      if (beforePhotoPreview && beforePhotoPreview.startsWith('data:')) {
        const uploadRes = await fetch('/api/admin/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Data: beforePhotoPreview,
            filename: `${jobTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-before.jpg`,
            target: 'finished-job',
          }),
        });
        const uploadData = await uploadRes.json();
        if (uploadData.ok && uploadData.url) {
          finalBeforeUrl = uploadData.url;
        }
      }

      // 2. Save finished job record to database
      const saveRes = await fetch('/api/admin/finished-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          job: {
            title: jobTitle,
            serviceType,
            location,
            completionDate,
            description,
            beforePhotoUrl: finalBeforeUrl,
            afterPhotoUrl: finalAfterUrl,
            featuredOnHome,
          },
        }),
      });

      const saveData = await saveRes.json();
      if (saveRes.ok && saveData.ok) {
        setFinishedJobs((prev) => [saveData.data, ...prev]);
        setStatusMessage({ text: `Finished job "${jobTitle}" uploaded and published to showcase!`, type: 'success' });
        setIsModalOpen(false);
        // Reset form
        setJobTitle('');
        setDescription('');
        setAfterPhotoPreview('');
        setBeforePhotoPreview('');
      } else {
        setStatusMessage({ text: saveData.error || 'Failed to save job.', type: 'error' });
      }
    } catch {
      setStatusMessage({ text: 'Error uploading finished job.', type: 'error' });
    } finally {
      setIsSubmittingJob(false);
    }
  };

  // Toggle feature on website
  const handleToggleFeatured = async (id: string) => {
    try {
      const res = await fetch('/api/admin/finished-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_FEATURED', id }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setFinishedJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, featuredOnHome: data.data.featuredOnHome } : j))
        );
      }
    } catch {
      setStatusMessage({ text: 'Error updating status.', type: 'error' });
    }
  };

  // Delete finished job
  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to remove this finished job from the showcase?')) return;

    try {
      const res = await fetch('/api/admin/finished-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE', id }),
      });
      if (res.ok) {
        setFinishedJobs((prev) => prev.filter((j) => j.id !== id));
        setStatusMessage({ text: 'Job removed from showcase.', type: 'success' });
      }
    } catch {
      setStatusMessage({ text: 'Error deleting job.', type: 'error' });
    }
  };

  const filteredJobs = finishedJobs.filter((job) => {
    if (selectedFilter === 'ALL') return true;
    return job.serviceType === selectedFilter;
  });

  const getServiceBadge = (type: FinishedJobRecord['serviceType']) => {
    switch (type) {
      case 'RESIDENTIAL_MOVING':
        return <Badge variant="orange">Residential Move</Badge>;
      case 'COMMERCIAL_MOVING':
        return <Badge variant="outline" className="border-sky-500/40 text-sky-400 bg-sky-500/10">Commercial Move</Badge>;
      case 'JUNK_REMOVAL':
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10">Junk Removal</Badge>;
      case 'DELIVERY':
        return <Badge variant="outline" className="border-purple-500/40 text-purple-400 bg-purple-500/10">Delivery</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hidden file inputs for direct banner changes */}
      <input
        ref={homeFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleBannerUpload(e, 'homepage-hero')}
      />
      <input
        ref={marketingFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleBannerUpload(e, 'ai-marketing-hero')}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="orange">Media &amp; Portfolio Hub</Badge>
            <span className="text-xs text-white/50">PNG &amp; JPEG Supported</span>
          </div>
          <h1 className="mt-2 font-heading text-2xl font-extrabold text-white sm:text-3xl">
            Finished Jobs &amp; Hero Banner Manager
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Upload completed job photos from Calgary relocations &amp; clearouts, and customize website hero banners anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/#recent-work"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
          >
            <Eye className="h-4 w-4 text-sky-400" />
            <span>View Public Showcase</span>
            <ExternalLink className="h-3.5 w-3.5 text-white/50" />
          </Link>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-orange to-[#ff8c4a] px-5 py-2.5 text-xs font-bold text-white shadow-orange-glow transition hover:brightness-110 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Finished Job</span>
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold ${
            statusMessage.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
              : 'border border-red-500/30 bg-red-950/40 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Quick Photo Instructions Card */}
      <div className="rounded-2xl border border-brand-orange/30 bg-gradient-to-r from-brand-orange/10 via-[#0A1324] to-[#0A1324] p-5 shadow-dark-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brand-orange font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>How To Add, Paste &amp; Remove Finished Work Photos</span>
            </div>
            <p className="text-sm font-semibold text-white">
              Manage what prospective clients see in the &quot;Recent Completed Work in Calgary&quot; section:
            </p>
            <ul className="grid grid-cols-1 gap-2 pt-1 text-xs text-white/80 sm:grid-cols-3">
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-brand-orange">1. Paste or Upload:</span>
                <span>Click &quot;+ Upload Finished Job&quot;, browse your disk, paste an image link, or press <strong className="text-white">Ctrl + V</strong>.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-brand-orange">2. Remove or Hide:</span>
                <span>Click <strong className="text-red-400">Delete</strong> on any card to remove it permanently, or toggle <strong className="text-emerald-400">Featured</strong> to hide it.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-brand-orange">3. Direct Folder:</span>
                <span>Drop files into <code className="rounded bg-black/50 px-1 py-0.5 text-[11px] text-brand-orange">public/images/</code> on your computer.</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 rounded-xl bg-brand-orange px-4 py-2.5 text-xs font-bold text-white shadow-orange-glow transition hover:brightness-110 active:scale-95"
          >
            + Upload / Paste Photo Now
          </button>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: HERO BANNERS CUSTOMIZER (HOMEPAGE & AI MARKETING MANAGER)
         ===================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-brand-orange" />
          <h2 className="font-heading text-lg font-bold text-white">
            Custom Hero Banners (.png / .jpeg)
          </h2>
          <span className="text-xs text-white/50">Replace or restore anytime</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Card 1: Homepage Hero Banner */}
          <div className="rounded-3xl border border-white/10 bg-[#0A1324] p-5 shadow-dark-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">Website Front Page</span>
                <h3 className="font-heading text-base font-extrabold text-white">Homepage Hero Banner</h3>
              </div>
              <Badge variant="outline" className="border-white/15 text-white/70">16:9 Landscape</Badge>
            </div>

            {/* Image Preview */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#05080D]">
              <img
                src={homepageHeroUrl}
                alt="Homepage hero preview"
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>Active on Homepage</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => homeFileInputRef.current?.click()}
                disabled={isUploadingBanner === 'homepage-hero'}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 active:scale-[0.99] disabled:opacity-50"
              >
                <Upload className="h-4 w-4 text-brand-orange" />
                <span>{isUploadingBanner === 'homepage-hero' ? 'Uploading...' : 'Upload New Image (.png / .jpg)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleResetBanner('homepage-hero')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 transition hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset to Default HD Truck</span>
              </button>
            </div>
          </div>

          {/* Card 2: AI Marketing Manager Hero Banner */}
          <div className="rounded-3xl border border-white/10 bg-[#0A1324] p-5 shadow-dark-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Admin Dashboard</span>
                <h3 className="font-heading text-base font-extrabold text-white">AI Marketing Manager Hero Graphic</h3>
              </div>
              <Badge variant="outline" className="border-white/15 text-white/70">3D Artwork</Badge>
            </div>

            {/* Image Preview */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#05080D] flex items-center justify-center p-3">
              <img
                src={aiMarketingHeroUrl}
                alt="AI Marketing Manager hero preview"
                className="h-full w-full object-contain drop-shadow-[0_15px_30px_rgba(244,119,50,0.2)]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>Active on AI Marketing Dashboard</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => marketingFileInputRef.current?.click()}
                disabled={isUploadingBanner === 'ai-marketing-hero'}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 active:scale-[0.99] disabled:opacity-50"
              >
                <Upload className="h-4 w-4 text-sky-400" />
                <span>{isUploadingBanner === 'ai-marketing-hero' ? 'Uploading...' : 'Upload New Graphic (.png / .jpg)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleResetBanner('ai-marketing-hero')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 transition hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset to Default 3D Artwork</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 2: FINISHED JOBS SHOWCASE & PORTFOLIO
         ===================================================================== */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-brand-orange" />
            <h2 className="font-heading text-lg font-bold text-white">
              Finished Jobs Showcase ({finishedJobs.length})
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-[#0A1324] p-1 text-xs">
            {['ALL', 'RESIDENTIAL_MOVING', 'COMMERCIAL_MOVING', 'JUNK_REMOVAL', 'DELIVERY'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`rounded-lg px-3 py-1.5 font-bold transition ${
                  selectedFilter === filter
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {filter === 'ALL'
                  ? 'All Work'
                  : filter === 'RESIDENTIAL_MOVING'
                  ? 'Residential'
                  : filter === 'COMMERCIAL_MOVING'
                  ? 'Commercial'
                  : filter === 'JUNK_REMOVAL'
                  ? 'Junk Removal'
                  : 'Delivery'}
              </button>
            ))}
          </div>
        </div>

        {/* Finished Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#0A1324] p-12 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-3 font-heading text-base font-bold text-white">No finished jobs in this category yet.</p>
            <p className="mt-1 text-xs text-white/60">Upload your completed relocations to showcase real work to prospective clients.</p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2 text-xs font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Finished Job</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0A1324] shadow-dark-card transition hover:border-brand-orange/40"
              >
                {/* Photo Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                  <img
                    src={job.afterPhotoUrl}
                    alt={job.title}
                    className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {getServiceBadge(job.serviceType)}
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(job.id)}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-md transition ${
                        job.featuredOnHome
                          ? 'bg-emerald-500/80 text-white'
                          : 'bg-black/60 text-white/60 hover:text-white'
                      }`}
                      title="Toggle featured on homepage showcase"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{job.featuredOnHome ? 'Featured on Home' : 'Hidden from Home'}</span>
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
                    <MapPin className="h-3 w-3 text-brand-orange" />
                    <span>{job.location}</span>
                  </div>
                </div>

                {/* Job Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Completed {job.completionDate}</span>
                    </div>
                  </div>

                  <h3 className="font-heading text-base font-bold text-white group-hover:text-brand-orange transition">
                    {job.title}
                  </h3>

                  <p className="text-xs leading-relaxed text-white/70 line-clamp-3">
                    {job.description || 'Completed on schedule with 100% customer satisfaction.'}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-[11px] font-mono text-white/40">ID: {job.id}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteJob(job.id)}
                      className="inline-flex items-center gap-1 text-red-400/80 hover:text-red-400 transition"
                      title="Delete from showcase"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================================
          MODAL: UPLOAD FINISHED JOB FORM
         ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-[#0B1426] p-6 shadow-2xl sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="h-6 w-6 text-brand-orange" />
                <h2 className="font-heading text-xl font-extrabold text-white">Upload Finished Job</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFinishedJob} className="space-y-4 text-xs">
              {/* Job Title */}
              <div>
                <label className="block font-bold text-white/80 mb-1.5">Job Title / Project Name *</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. 4-Bedroom Relocation in Mount Royal"
                  className="w-full rounded-xl border border-white/15 bg-[#05080D] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand-orange focus:outline-none"
                />
              </div>

              {/* Service Type & Location */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-white/80 mb-1.5">Service Category</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="w-full rounded-xl border border-white/15 bg-[#05080D] px-3 py-2.5 text-xs text-white focus:border-brand-orange focus:outline-none"
                  >
                    <option value="RESIDENTIAL_MOVING">Residential Moving</option>
                    <option value="COMMERCIAL_MOVING">Commercial Moving</option>
                    <option value="JUNK_REMOVAL">Photo-First Junk Removal</option>
                    <option value="DELIVERY">Furniture &amp; Appliance Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1.5">City / Neighborhood</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. SW Calgary, AB"
                    className="w-full rounded-xl border border-white/15 bg-[#05080D] px-3 py-2.5 text-xs text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block font-bold text-white/80 mb-1.5">Date Completed</label>
                <input
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#05080D] px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                />
              </div>

              {/* Primary Photo Upload (Completed Job) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-white/80">
                    Completed Job Photo * (.png, .jpeg, .webp)
                  </label>
                  <span className="text-[11px] text-brand-orange font-medium flex items-center gap-1">
                    <span>💡 Press Ctrl+V anytime to paste photo</span>
                  </span>
                </div>

                <input
                  ref={afterFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setAfterPhotoPreview)}
                />

                {afterPhotoPreview ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/20 bg-black/60 group">
                    <img src={afterPhotoPreview} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => afterFileInputRef.current?.click()}
                        className="rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-bold text-white shadow-lg hover:bg-brand-orange-hover"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAfterPhotoPreview('');
                          setPastedImageUrl('');
                        }}
                        className="rounded-lg bg-red-600/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg hover:bg-red-600"
                      >
                        Remove Photo
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 rounded-lg bg-black/80 px-2.5 py-1 text-[11px] text-emerald-400 font-bold backdrop-blur-md">
                      ✓ Ready to publish
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => afterFileInputRef.current?.click()}
                      className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02] p-5 text-center transition hover:border-brand-orange hover:bg-white/[0.04]"
                    >
                      <Upload className="h-7 w-7 text-brand-orange/80 mb-1.5" />
                      <span className="font-bold text-white text-xs">Click to browse file (.png or .jpeg)</span>
                      <span className="text-[11px] text-white/50 mt-0.5">Or simply press Ctrl + V on your keyboard</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">OR PASTE URL / PATH</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pastedImageUrl}
                        onChange={(e) => {
                          setPastedImageUrl(e.target.value);
                          if (e.target.value.trim()) {
                            setAfterPhotoPreview(e.target.value.trim());
                          }
                        }}
                        placeholder="Paste web URL or path: https://... or /images/truck.jpg"
                        className="flex-1 rounded-xl border border-white/15 bg-[#05080D] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-brand-orange focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (pastedImageUrl.trim()) {
                            setAfterPhotoPreview(pastedImageUrl.trim());
                          }
                        }}
                        className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-white/80 mb-1.5">Short Story / Customer Notes</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Carefully packed and transported fragile glassware, custom furniture, and piano with zero delays."
                  className="w-full rounded-xl border border-white/15 bg-[#05080D] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-brand-orange focus:outline-none"
                />
              </div>

              {/* Feature checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={featuredOnHome}
                  onChange={(e) => setFeaturedOnHome(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-[#05080D] text-brand-orange focus:ring-brand-orange"
                />
                <span className="font-medium text-white/90">Feature this job on the Public Website Showcase</span>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/20 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingJob}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-5 py-2 text-xs font-bold text-white shadow-orange-glow hover:brightness-110 disabled:opacity-50"
                >
                  {isSubmittingJob ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Uploading to Showcase...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Publish to Showcase</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

