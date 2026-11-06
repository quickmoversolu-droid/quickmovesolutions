'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Truck,
  Trash2,
  Package,
  Camera,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Sparkles,
  Box,
  Home,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SceneMode = 'moving' | 'junk-removal' | 'delivery';

/**
 * Interactive 3D-Perspective Relocation & Space-Clearing Hero Composition
 * - Respects prefers-reduced-motion automatically
 * - Interactive 3D tilt parallax on pointer movement
 * - Allows visitors to switch between Moving, Space-Clearing (Junk Removal), and Delivery modes
 * - Zero heavy external binary dependencies so LCP and interactivity stay instant
 */
export function HeroRelocationScene() {
  const prefersReducedMotion = useReducedMotion();
  const [activeMode, setActiveMode] = React.useState<SceneMode>('moving');
  const [spaceClearedProgress, setSpaceClearedProgress] = React.useState<number>(85);
  const [tilt, setTilt] = React.useState({ rotateX: 0, rotateY: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: Number((-y * 10).toFixed(2)),
      rotateY: Number((x * 12).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Ambient Brand Glow Behind 3D Stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-orange/25 via-brand-navy-light/30 to-transparent blur-2xl"
      />

      {/* Interactive 3D Stage Card */}
      <motion.div
        animate={
          prefersReducedMotion
            ? { rotateX: 0, rotateY: 0 }
            : { rotateX: tilt.rotateX, rotateY: tilt.rotateY }
        }
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-[#17294A]/95 to-[#0D172B]/95 p-5 sm:p-7 shadow-navy-lg backdrop-blur-xl"
      >
        {/* Top Mode Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-white/10">
          <div className="inline-flex rounded-xl bg-brand-navy-dark/80 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveMode('moving')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-heading font-bold transition-all',
                activeMode === 'moving'
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'text-brand-navy-100 hover:text-white'
              )}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>3D Relocation View</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('junk-removal')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-heading font-bold transition-all',
                activeMode === 'junk-removal'
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'text-brand-navy-100 hover:text-white'
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Space Clearing</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('delivery')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-heading font-bold transition-all',
                activeMode === 'delivery'
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'text-brand-navy-100 hover:text-white'
              )}
            >
              <Package className="h-3.5 w-3.5" />
              <span>Delivery</span>
            </button>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Calgary &amp; Alberta Dispatch
          </span>
        </div>

        {/* 3D Isometric Viewport */}
        <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0A1324] p-5 sm:p-6 min-h-[290px] flex flex-col justify-between">
          {/* Isometric Perspective Floor Grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(244,119,50,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              transform: 'perspective(500px) rotateX(45deg) scale(1.35)',
              transformOrigin: 'center bottom',
            }}
          />

          {/* MODE 1: 3D RELOCATION & MOVING SCENE */}
          {activeMode === 'moving' && (
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between text-xs text-brand-navy-100">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-orange/20 text-brand-orange">
                    <Home className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading font-bold text-white">Pickup: Calgary, AB</p>
                    <p className="text-[11px] text-brand-navy-200">Wrapped &amp; Floor-Protected</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-brand-orange font-mono text-[11px]">
                  <span>●</span>
                  <span>───</span>
                  <span>───</span>
                  <span>▶</span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <div>
                    <p className="font-heading font-bold text-white">Destination Ready</p>
                    <p className="text-[11px] text-brand-navy-200">Local &amp; Alberta Corridors</p>
                  </div>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white">
                    <Building2 className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* Stylized 3D Isometric Truck & Moving Composition */}
              <div className="relative py-2 flex items-center justify-center">
                <svg
                  viewBox="0 0 520 190"
                  className="w-full max-w-[460px] h-auto drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
                  role="img"
                  aria-label="3D stylized QuickMove Solutions moving truck and organized relocation boxes"
                >
                  <defs>
                    <linearGradient id="qmCargoSide" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1B345E" />
                      <stop offset="100%" stopColor="#101D35" />
                    </linearGradient>
                    <linearGradient id="qmCargoTop" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#274880" />
                      <stop offset="100%" stopColor="#1B345E" />
                    </linearGradient>
                    <linearGradient id="qmOrangeAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FA8B4F" />
                      <stop offset="100%" stopColor="#F47732" />
                    </linearGradient>
                  </defs>

                  {/* Glowing Route Line on Road */}
                  <path
                    d="M30 162 L490 162"
                    stroke="#F47732"
                    strokeWidth="3"
                    strokeDasharray="10 8"
                    strokeOpacity="0.65"
                  />

                  {/* Ground Shadow */}
                  <ellipse cx="265" cy="162" rx="175" ry="14" fill="#050912" opacity="0.7" />

                  {/* Stacked Protected Moving Boxes (Left Rear) */}
                  <g transform="translate(42, 88)">
                    <rect x="0" y="28" width="38" height="36" rx="4" fill="#F47732" />
                    <path d="M0 40 H38" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.5" />
                    <rect x="26" y="10" width="42" height="54" rx="4" fill="#1B345E" stroke="#F47732" strokeWidth="1.5" />
                    <rect x="34" y="20" width="26" height="10" rx="2" fill="#FFFFFF" opacity="0.85" />
                  </g>

                  {/* 3D Truck Cargo Body */}
                  <g>
                    {/* 3D Roof Roof-Bevel */}
                    <polygon points="115,32 345,32 360,44 130,44" fill="url(#qmCargoTop)" />
                    {/* Main Cargo Box */}
                    <rect
                      x="115"
                      y="44"
                      width="235"
                      height="98"
                      rx="6"
                      fill="url(#qmCargoSide)"
                      stroke="#3960A3"
                      strokeWidth="1.5"
                    />
                    {/* Brand Orange Stripe */}
                    <rect x="115" y="114" width="235" height="14" fill="url(#qmOrangeAccent)" />

                    {/* Branded Text on Truck Side */}
                    <text
                      x="138"
                      y="82"
                      fill="#FFFFFF"
                      fontFamily="sans-serif"
                      fontWeight="800"
                      fontSize="21"
                      letterSpacing="-0.5"
                    >
                      QuickMove
                    </text>
                    <text
                      x="138"
                      y="102"
                      fill="#F47732"
                      fontFamily="sans-serif"
                      fontWeight="700"
                      fontSize="13"
                      letterSpacing="2"
                    >
                      SOLUTIONS • CALGARY
                    </text>
                  </g>

                  {/* 3D Truck Cab (Right) */}
                  <g>
                    <path
                      d="M350 68 H408 C418 68 426 73 431 82 L448 112 V142 H350 V68 Z"
                      fill="#FFFFFF"
                    />
                    {/* Cab Windshield */}
                    <path
                      d="M364 78 H406 L422 106 H364 V78 Z"
                      fill="#101D35"
                    />
                    {/* Cab Orange Highlight */}
                    <rect x="350" y="120" width="98" height="8" fill="#F47732" />
                    {/* Headlight */}
                    <rect x="441" y="122" width="7" height="12" rx="2" fill="#FFE7D6" />
                  </g>

                  {/* Wheels */}
                  <g>
                    <circle cx="175" cy="146" r="20" fill="#0A1222" stroke="#DCE5F3" strokeWidth="4" />
                    <circle cx="175" cy="146" r="8" fill="#F47732" />
                    <circle cx="395" cy="146" r="20" fill="#0A1222" stroke="#DCE5F3" strokeWidth="4" />
                    <circle cx="395" cy="146" r="8" fill="#F47732" />
                  </g>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                  <p className="text-[11px] text-brand-navy-200">Service Scope</p>
                  <p className="font-heading text-xs sm:text-sm font-bold text-white mt-0.5">
                    Home &amp; Office
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                  <p className="text-[11px] text-brand-navy-200">Preparation</p>
                  <p className="font-heading text-xs sm:text-sm font-bold text-white mt-0.5">
                    Packing &amp; Care
                  </p>
                </div>
                <div className="rounded-xl bg-brand-orange/15 border border-brand-orange/30 p-2.5">
                  <p className="text-[11px] text-brand-orange-200">Quote Format</p>
                  <p className="font-heading text-xs sm:text-sm font-bold text-white mt-0.5">
                    Visual 8-Step
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: INTERACTIVE SPACE-CLEARING (JUNK REMOVAL) SCENE */}
          {activeMode === 'junk-removal' && (
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                    Interactive Space Transformation
                  </span>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                    Slide to Clear Unwanted Clutter &amp; Furniture
                  </h3>
                </div>
                <span className="rounded-lg bg-brand-orange px-2.5 py-1 font-mono text-xs font-bold text-white">
                  {spaceClearedProgress}% Clear
                </span>
              </div>

              {/* Interactive Before/After Space Clearing Visual */}
              <div className="relative h-36 rounded-xl border border-white/15 bg-gradient-to-r from-[#132340] to-[#1A355B] p-4 overflow-hidden flex items-center justify-between">
                {/* Cluttered Items Fade Out as Slider Increases */}
                <div className="grid grid-cols-4 gap-3 w-full items-center">
                  {[
                    { label: 'Old Sofa', threshold: 25 },
                    { label: 'Mattress', threshold: 50 },
                    { label: 'Appliances', threshold: 75 },
                    { label: 'Garage Boxes', threshold: 90 },
                  ].map((item) => {
                    const isCleared = spaceClearedProgress >= item.threshold;
                    return (
                      <div
                        key={item.label}
                        className={cn(
                          'flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all duration-300',
                          isCleared
                            ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200 scale-95'
                            : 'border-brand-orange/40 bg-brand-orange/15 text-white'
                        )}
                      >
                        {isCleared ? (
                          <CheckCircle2 className="h-6 w-6 text-emerald-400 mb-1" />
                        ) : (
                          <Box className="h-6 w-6 text-brand-orange mb-1" />
                        )}
                        <span className="text-[11px] font-heading font-bold">{item.label}</span>
                        <span className="text-[10px] opacity-80">
                          {isCleared ? 'Cleared' : 'To Remove'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Slider Control */}
              <div className="space-y-1.5">
                <label
                  htmlFor="space-clear-slider"
                  className="flex justify-between text-xs text-brand-navy-100"
                >
                  <span>Cluttered Room / Garage</span>
                  <span className="text-brand-orange font-semibold">Spotless, Ready Space</span>
                </label>
                <input
                  id="space-clear-slider"
                  type="range"
                  min={0}
                  max={100}
                  value={spaceClearedProgress}
                  onChange={(e) => setSpaceClearedProgress(Number(e.target.value))}
                  className="w-full accent-brand-orange cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-brand-navy-100">
                <span className="inline-flex items-center gap-2">
                  <Camera className="h-4 w-4 text-brand-orange" />
                  <span>Snap photos on your phone — no item-by-item typing needed.</span>
                </span>
                <Link
                  href="/get-a-quote?service=junk-removal"
                  className="font-heading font-bold text-brand-orange hover:underline shrink-0 ml-2"
                >
                  Start Photo Quote →
                </Link>
              </div>
            </div>
          )}

          {/* MODE 3: DIRECT FURNITURE & LARGE-ITEM DELIVERY */}
          {activeMode === 'delivery' && (
            <div className="relative z-10 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                  Scheduled Pickup &amp; Drop-Off
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                  Furniture, Appliances &amp; Commercial Deliveries
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <Package className="h-5 w-5 text-brand-orange mb-2" />
                  <p className="font-heading text-xs font-bold text-white">1. Store or Home Pickup</p>
                  <p className="mt-1 text-[11px] text-brand-navy-200">
                    Retail showroom, warehouse, or private marketplace pickup.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <ShieldCheck className="h-5 w-5 text-brand-orange mb-2" />
                  <p className="font-heading text-xs font-bold text-white">2. Blanket-Wrapped Care</p>
                  <p className="mt-1 text-[11px] text-brand-navy-200">
                    Secured in our moving truck with protective padding and straps.
                  </p>
                </div>
                <div className="rounded-xl border border-brand-orange/35 bg-brand-orange/15 p-3.5">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange mb-2" />
                  <p className="font-heading text-xs font-bold text-white">3. Room Placement</p>
                  <p className="mt-1 text-[11px] text-brand-navy-100">
                    Careful delivery directly into your home or business workspace.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-brand-navy-100">
                <span>Need a single heavy item or business load transported?</span>
                <Link
                  href="/get-a-quote?service=delivery-services"
                  className="font-heading font-bold text-brand-orange hover:underline shrink-0 ml-2"
                >
                  Request Delivery →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Quick Quote Service Selector inside Hero Stage */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-brand-navy-100">
            <Sparkles className="h-4 w-4 text-brand-orange shrink-0" />
            <span>Choose your interactive quote experience:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/get-a-quote?service=residential-moving"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-orange px-3.5 py-2 text-xs font-heading font-bold text-white hover:bg-brand-orange-hover transition-colors"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Moving Quote</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/get-a-quote?service=junk-removal"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-heading font-bold text-white hover:bg-white/20 transition-colors"
            >
              <Camera className="h-3.5 w-3.5 text-brand-orange" />
              <span>Photo Junk Estimate</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

