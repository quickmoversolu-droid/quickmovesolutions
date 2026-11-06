import * as React from 'react';

/**
 * 1. QuickMove Solutions — Branded Moving Truck & Luxury Twilight Home Visual
 * Renders the photorealistic commercial box truck outside the modern luxury home at dusk
 * with crystal-clear high-definition imagery and custom upload support.
 */
export function QuickMoveTruckTwilightVisual({
  className = '',
  customSrc,
}: {
  className?: string;
  customSrc?: string;
}) {
  const imageSrc = customSrc || '/images/quickmove-truck-hero.jpg';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#070D19] shadow-dark-card group ${className}`}
    >
      <img
        src={imageSrc}
        alt="QuickMove Solutions commercial moving truck outside illuminated luxury home at dusk"
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        loading="eager"
      />
      {/* Subtle overlay gradient to blend with dark luxury styling */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05080D]/40 via-transparent to-transparent" />
    </div>
  );
}

/**
 * 2. QuickMove Solutions — AI Marketing Hero 3D Artwork
 * Renders the 3D tilted smartphone, floating 3D Facebook and Instagram badges,
 * and 3D megaphone with glowing orange ribbon waves from the AI Marketing Manager concept.
 */
export function AiMarketingHeroArtwork({
  className = '',
  customSrc,
}: {
  className?: string;
  customSrc?: string;
}) {
  const imageSrc = customSrc || '/images/quickmove-marketing-hero.jpg';

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <img
        src={imageSrc}
        alt="AI Marketing Manager 3D smartphone, megaphone and social media artwork"
        className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(244,119,50,0.18)]"
        loading="eager"
      />
    </div>
  );
}

/**
 * 3. QuickMove Solutions — Calgary Skyline Silhouette & Orange Wave Footer Graphic
 * Matches the bottom of the "Need Help?" support card in the visual reference.
 */
export function CalgarySkylineFooterGraphic({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 320 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="calgarySky" x1="0" y1="0" x2="0" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#05080D" stopOpacity="0" />
            <stop offset="60%" stopColor="#0A1426" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#05080D" />
          </linearGradient>
          <linearGradient id="orangeCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F47732" stopOpacity="0.1" />
            <stop offset="45%" stopColor="#F47732" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFA666" />
          </linearGradient>
        </defs>

        <rect width="320" height="90" fill="url(#calgarySky)" />

        {/* Night Sky Stars */}
        <circle cx="28" cy="22" r="1" fill="#FFFFFF" opacity="0.6" />
        <circle cx="86" cy="14" r="1.2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="160" cy="18" r="0.8" fill="#FFFFFF" opacity="0.5" />
        <circle cx="240" cy="12" r="1" fill="#FFFFFF" opacity="0.7" />
        <circle cx="295" cy="24" r="1.2" fill="#FFFFFF" opacity="0.8" />

        {/* Calgary Downtown Skyline Silhouette with Calgary Tower */}
        <g fill="#101D35" opacity="0.85">
          {/* Western office buildings */}
          <rect x="25" y="44" width="18" height="34" />
          <rect x="47" y="38" width="22" height="40" />
          <rect x="73" y="32" width="26" height="46" />

          {/* Calgary Tower */}
          <rect x="110" y="22" width="5" height="56" />
          <ellipse cx="112.5" cy="30" rx="9" ry="4.5" fill="#1C3256" />
          <line x1="112.5" y1="12" x2="112.5" y2="22" stroke="#F47732" strokeWidth="1.5" />

          {/* Central skyline skyscrapers (The Bow, Telus Sky) */}
          <polygon points="126,26 142,34 142,78 126,78" fill="#162744" />
          <rect x="146" y="28" width="30" height="50" />
          <rect x="180" y="36" width="24" height="42" />
          <rect x="208" y="42" width="28" height="36" />
          <rect x="240" y="48" width="22" height="30" />
          <rect x="266" y="52" width="30" height="26" />
        </g>

        {/* Window Lights in Silhouette */}
        <g fill="#F59E0B" opacity="0.75">
          <circle cx="54" cy="48" r="0.8" />
          <circle cx="60" cy="54" r="0.8" />
          <circle cx="82" cy="42" r="0.8" />
          <circle cx="88" cy="48" r="0.8" />
          <circle cx="154" cy="38" r="0.8" />
          <circle cx="162" cy="46" r="0.8" />
          <circle cx="190" cy="44" r="0.8" />
          <circle cx="220" cy="50" r="0.8" />
        </g>

        {/* Glowing Orange Swoop Wave at Base */}
        <path
          d="M0 86 Q 140 68 220 74 T 320 62 L 320 90 L 0 90 Z"
          fill="url(#orangeCurveGrad)"
        />
      </svg>
    </div>
  );
}
