'use client';

import React, { useState } from 'react';
import {
  Trash2,
  Camera,
  Layers,
  MapPin,
  UserCheck,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
  AlertTriangle,
  Sofa,
  BedDouble,
  Tv,
  Refrigerator,
  Home,
  Warehouse,
  Building2,
  Boxes,
  Sparkles,
  Calendar,
  Package,
  Info,
  Check,
} from 'lucide-react';
import { PhotoUploadManager, UploadedPhotoItem } from './PhotoUploadManager';
import { BUSINESS_CONSTANTS, SERVICE_AREAS } from '@/lib/constants/business';
import { cn } from '@/lib/utils';

type JunkCategoryId =
  | 'furniture'
  | 'sofa'
  | 'mattress'
  | 'appliances'
  | 'electronics'
  | 'household-junk'
  | 'garage-clutter'
  | 'basement-clutter'
  | 'office-items'
  | 'property-cleanout'
  | 'other';

const PRIMARY_JUNK_CATEGORIES: {
  id: JunkCategoryId;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'furniture', label: 'Furniture', desc: 'Tables, chairs, dressers, desks', icon: Sofa },
  { id: 'sofa', label: 'Sofa / Couch', desc: 'Sectionals, loveseats, recliners', icon: Sofa },
  {
    id: 'mattress',
    label: 'Mattress & Box Spring',
    desc: 'Twin, queen, king mattresses',
    icon: BedDouble,
  },
  {
    id: 'appliances',
    label: 'Appliances',
    desc: 'Fridges, washers, dryers, stoves',
    icon: Refrigerator,
  },
  {
    id: 'electronics',
    label: 'Electronics (E-Waste)',
    desc: 'TVs, monitors, printers, PCs',
    icon: Tv,
  },
  {
    id: 'household-junk',
    label: 'Household Junk',
    desc: 'Boxes, bagged clutter, general items',
    icon: Trash2,
  },
];

const ADDITIONAL_JUNK_CATEGORIES: {
  id: JunkCategoryId;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'garage-clutter',
    label: 'Garage Clutter',
    desc: 'Tools, shelving, old gear, tires',
    icon: Warehouse,
  },
  {
    id: 'basement-clutter',
    label: 'Basement Clutter',
    desc: 'Stored items, renovation leftovers',
    icon: Home,
  },
  {
    id: 'office-items',
    label: 'Office Items',
    desc: 'Desks, cubicles, chairs, cabinets',
    icon: Building2,
  },
  {
    id: 'property-cleanout',
    label: 'Property Cleanout',
    desc: 'Estate, rental turnover, full room',
    icon: Sparkles,
  },
  {
    id: 'other',
    label: 'Other Non-Hazardous',
    desc: 'Describe in access & item notes',
    icon: Boxes,
  },
];

const VOLUME_OPTIONS = [
  {
    id: 'few-items',
    label: 'A Few Single Items',
    desc: '1 to 3 individual pieces (e.g., an old sofa, mattress, or fridge)',
    visualFill: 18,
  },
  {
    id: 'small-load',
    label: 'Small Load',
    desc: 'Roughly a pickup-bed worth of boxes, small furniture, or garage items',
    visualFill: 35,
  },
  {
    id: 'medium-load',
    label: 'Medium Load',
    desc: 'Multiple bulky furniture pieces or a partial room/garage cleanout',
    visualFill: 60,
  },
  {
    id: 'large-load',
    label: 'Large Load',
    desc: 'Multi-room cleanout, basement clearing, or large commercial removal',
    visualFill: 82,
  },
  {
    id: 'full-cleanout',
    label: 'Full Property Cleanout',
    desc: 'Whole-home, estate, or multi-load property cleanout',
    visualFill: 100,
  },
  {
    id: 'not-sure',
    label: 'Not Sure — Review My Photos',
    desc: 'Our Calgary coordinator will estimate load requirements from your photos',
    visualFill: 50,
  },
] as const;

interface PhotoJunkQuoteWizardProps {
  initialCity?: string;
}

export function PhotoJunkQuoteWizard({ initialCity = 'Calgary' }: PhotoJunkQuoteWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  // Step 1: Categories
  const [categories, setCategories] = useState<JunkCategoryId[]>(['furniture']);

  // Step 2: Photos
  const [photos, setPhotos] = useState<UploadedPhotoItem[]>([]);

  // Step 3: Approximate Volume
  const [volumeEstimate, setVolumeEstimate] =
    useState<(typeof VOLUME_OPTIONS)[number]['id']>('medium-load');

  // Step 4: Access details
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupCity, setPickupCity] = useState(initialCity || 'Calgary');
  const [pickupPostalCode, setPickupPostalCode] = useState('');
  const [propertyType, setPropertyType] = useState<
    'house' | 'apartment-condo' | 'townhouse' | 'office-commercial' | 'garage-storage' | 'other'
  >('house');
  const [itemLocation, setItemLocation] = useState<'indoors' | 'outdoors' | 'both'>('indoors');
  const [stairsOrElevator, setStairsOrElevator] = useState<
    'ground-level' | 'stairs' | 'elevator' | 'both'
  >('ground-level');
  const [parkingNotes, setParkingNotes] = useState('');
  const [accessConditions, setAccessConditions] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Step 5: Customer contact
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'email' | 'text'>('phone');
  const [honeypot, setHoneypot] = useState('');

  const toggleCategory = (catId: JunkCategoryId) => {
    setCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const validateCurrentStep = (): boolean => {
    setErrorMessage(null);
    if (step === 1 && categories.length === 0) {
      setErrorMessage('Please select at least one category of items to remove.');
      return false;
    }
    if (step === 4) {
      if (!pickupAddress.trim() || !pickupCity.trim()) {
        setErrorMessage('Please enter the pickup address and city.');
        return false;
      }
      if (!preferredDate.trim()) {
        setErrorMessage('Please choose a preferred collection date.');
        return false;
      }
    }
    if (step === 5) {
      if (fullName.trim().length < 2) {
        setErrorMessage('Please enter your full name.');
        return false;
      }
      if (phone.trim().length < 7) {
        setErrorMessage('Please enter a valid phone number.');
        return false;
      }
      if (!email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep((s) => Math.min(6, s + 1));
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flowType: 'junk-removal',
          honeypot,
          categories,
          photos: photos.map((p) => ({
            id: p.id,
            storageKey: p.storageKey,
            dataUrl: p.dataUrl,
            originalFilename: p.originalFilename,
            mimeType: p.mimeType,
            fileSizeBytes: p.fileSizeBytes,
            caption: p.caption,
          })),
          volumeEstimate,
          pickupAddress,
          pickupCity,
          pickupPostalCode,
          propertyType,
          itemLocation,
          stairsOrElevator,
          parkingNotes,
          accessConditions,
          preferredDate,
          additionalNotes,
          customer: {
            fullName,
            phone,
            email,
            preferredContact,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to submit junk removal quote.');
      }
      setReferenceCode(data.referenceCode);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong submitting your quote.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmation View after Step 6 submission
  if (referenceCode) {
    return (
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-[#0B1322] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.65)] sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <span className="mb-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-4 py-1 text-xs font-heading font-bold text-emerald-300">
            Photo-First Junk Removal Request Received
          </span>
          <h3 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
            Thank You, {fullName}!
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
            Your junk removal request and {photos.length} uploaded photo(s) have been saved in the
            QuickMove Solutions operations platform. Our Calgary coordinator will review your items
            and follow up with a clear, written scope and price estimate.
          </p>

          <div className="mt-6 w-full max-w-md rounded-2xl border border-brand-orange/40 bg-[#070D19] p-5 shadow-orange-glow">
            <p className="text-xs font-bold uppercase tracking-wider text-white/60">
              Your Reference Code
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-brand-orange">
              {referenceCode}
            </p>
            <p className="mt-2 text-xs text-white/65">
              Target Date: <strong className="text-white">{preferredDate}</strong> (Pending
              coordinator review &amp; confirmation)
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={BUSINESS_CONSTANTS.phoneHref}
              className="qm-orange-pill inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold text-white"
            >
              <Phone className="h-4 w-4" />
              Call {BUSINESS_CONSTANTS.phoneDisplay}
            </a>
            <button
              type="button"
              onClick={() => {
                setReferenceCode(null);
                setStep(1);
              }}
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  const STEP_LABELS = [
    { num: 1, title: 'Select Category', icon: Trash2 },
    { num: 2, title: 'Upload Photos', icon: Camera },
    { num: 3, title: 'Job Details', icon: Layers },
    { num: 4, title: 'Access Info', icon: MapPin },
    { num: 5, title: 'Contact Info', icon: UserCheck },
    { num: 6, title: 'Review & Submit', icon: ClipboardCheck },
  ];

  const stepHelperMessages: Record<number, string> = {
    1: "Don't worry — you can upload photos in the next step for a more accurate estimate.",
    2: 'Photos are optional but strongly recommended so our team can give you our fastest written quote.',
    3: 'Preliminary load size is a helpful visual guide — final scope is confirmed from your photos.',
    4: 'Sharing stairs, elevator, or alley access helps our crew bring the right dollies and truck.',
    5: 'Your contact details are private and used strictly to send your QuickMove Solutions quote.',
    6: 'Review your selections below and click Submit to receive your instant tracking reference code.',
  };

  const darkInputClass =
    'mt-1.5 w-full rounded-xl border border-white/15 bg-[#080E1A] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange';

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0B1322]/95 p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.65)] sm:p-8">
      {/* Connected Horizontal Numbered Stepper — Matches Visual Reference */}
      <div className="mb-8">
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Track Line */}
          <div className="pointer-events-none absolute left-4 right-4 top-4 h-[2px] bg-white/15" />
          <div
            className="pointer-events-none absolute left-4 top-4 h-[2px] bg-brand-orange transition-all duration-300"
            style={{ width: `${((step - 1) / (STEP_LABELS.length - 1)) * 92}%` }}
          />

          {STEP_LABELS.map((item) => {
            const active = step === item.num;
            const completed = step > item.num;
            return (
              <button
                key={item.num}
                type="button"
                onClick={() => {
                  if (item.num < step) setStep(item.num);
                }}
                disabled={item.num > step}
                className="relative z-10 flex flex-col items-center gap-2 group focus:outline-none"
              >
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full font-heading text-xs font-extrabold transition-all',
                    active
                      ? 'bg-brand-orange text-white shadow-[0_0_20px_rgba(244,119,50,0.85)] ring-4 ring-brand-orange/25'
                      : completed
                        ? 'cursor-pointer bg-brand-orange/80 text-white hover:bg-brand-orange'
                        : 'cursor-not-allowed bg-[#1A253B] text-white/55 border border-white/10'
                  )}
                >
                  {completed ? <Check className="h-4 w-4" /> : item.num}
                </span>
                <span
                  className={cn(
                    'text-[11px] sm:text-xs font-heading font-semibold tracking-tight transition-colors hidden sm:block',
                    active
                      ? 'text-white font-bold'
                      : completed
                        ? 'text-brand-orange'
                        : 'text-white/50'
                  )}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Honeypot field */}
      <input
        type="text"
        name="company_website_hp"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm font-medium text-red-200">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: SELECT JUNK CATEGORIES — Exact Match to Reference Image */}
      {step === 1 && (
        <div>
          <div className="flex items-start gap-3.5 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-orange/35 bg-brand-orange/15 text-brand-orange">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                What Needs to Be Removed?
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-white/65">
                Select one or more categories to help us estimate your junk removal.
              </p>
            </div>
          </div>

          {/* Primary 6 Visual Category Tiles (Matches 6-Card Grid in Reference) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {PRIMARY_JUNK_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={cn(
                    'group relative flex flex-col items-center justify-center rounded-2xl p-4 sm:p-5 text-center transition-all duration-200 min-h-[126px]',
                    isSelected
                      ? 'qm-orange-border-glow bg-gradient-to-b from-brand-orange/20 via-[#152440] to-[#0C1526]'
                      : 'border border-white/10 bg-[#101B30]/80 hover:border-brand-orange/45 hover:bg-[#14223C]'
                  )}
                >
                  {isSelected && (
                    <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-white shadow">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}

                  <Icon
                    className={cn(
                      'h-8 w-8 mb-3 transition-transform duration-200 group-hover:scale-105',
                      isSelected ? 'text-brand-orange' : 'text-[#BFD4F5]'
                    )}
                  />
                  <span className="font-heading text-xs sm:text-sm font-bold text-white leading-snug">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Additional Property & Commercial Cleanout Categories */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-[11px] font-heading font-bold uppercase tracking-wider text-white/50 mb-3">
              Full Room, Garage, Basement &amp; Commercial Cleanout Categories:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {ADDITIONAL_JUNK_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = categories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      'relative flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left transition-all',
                      isSelected
                        ? 'border border-brand-orange bg-brand-orange/20 text-white shadow-sm'
                        : 'border border-white/10 bg-[#0D1729] text-white/75 hover:border-brand-orange/40 hover:text-white'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isSelected ? 'text-brand-orange' : 'text-[#BFD4F5]'
                      )}
                    />
                    <span className="font-heading text-xs font-bold truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: UPLOAD PHOTOS */}
      {step === 2 && (
        <div>
          <div className="flex items-start gap-3.5 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-orange/35 bg-brand-orange/15 text-brand-orange">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                Snap or Upload Photos of Your Items
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-white/65">
                Uploading 1–5 clear photos lets our coordinator verify item size and stairs/access
                for a fast written estimate.
              </p>
            </div>
          </div>

          <PhotoUploadManager
            photos={photos}
            onChange={setPhotos}
            maxPhotos={15}
            label="Junk & Space-Clearing Photos (Recommended)"
            helperText="Take photos directly with your phone camera or drag and drop images from your gallery. Add optional captions for heavy items."
          />

          <div className="mt-5 rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100">
            <strong className="font-bold text-amber-300">
              Important Non-Hazardous Materials Notice:
            </strong>{' '}
            QuickMove Solutions cannot transport regulated hazardous materials (wet liquid paint,
            chemicals, solvents, pressurized propane tanks, asbestos, biohazards, or ammunition).
          </div>
        </div>
      )}

      {/* STEP 3: APPROXIMATE VOLUME */}
      {step === 3 && (
        <div>
          <div className="flex items-start gap-3.5 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-orange/35 bg-brand-orange/15 text-brand-orange">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                How Much Space Do Your Items Take Up?
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-white/65">
                Select the card that best describes your approximate load size so we assign the
                right truck capacity.
              </p>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            {VOLUME_OPTIONS.map((opt) => {
              const selected = volumeEstimate === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setVolumeEstimate(opt.id)}
                  className={cn(
                    'flex flex-col justify-between rounded-2xl p-5 text-left transition-all',
                    selected
                      ? 'qm-orange-border-glow bg-gradient-to-b from-brand-orange/20 to-[#0C1526]'
                      : 'border border-white/10 bg-[#101B30]/80 hover:border-brand-orange/45'
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-base font-extrabold text-white">
                        {opt.label}
                      </span>
                      {selected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-white">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/65">{opt.desc}</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-white/55">
                      <span>Preliminary Capacity Indicator</span>
                      <span className="text-brand-orange">
                        {opt.id === 'not-sure' ? 'Photo Review' : `${opt.visualFill}%`}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-brand-orange transition-all"
                        style={{ width: `${opt.visualFill}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: ACCESS DETAILS */}
      {step === 4 && (
        <div>
          <div className="flex items-start gap-3.5 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-orange/35 bg-brand-orange/15 text-brand-orange">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                Where Are the Items Located?
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-white/65">
                Tell us about pickup access so our crew brings the right dollies, floor runners,
                and team size.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Pickup Street Address *
              </label>
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="e.g., 420 14 St NW"
                className={darkInputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                City / Service Area *
              </label>
              <select
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                className={darkInputClass}
              >
                {SERVICE_AREAS.map((area) => (
                  <option key={area.slug} value={area.city} className="bg-[#0B1322] text-white">
                    {area.city}, AB
                  </option>
                ))}
                <option value="Other Alberta Location" className="bg-[#0B1322] text-white">
                  Other Alberta Location
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Postal Code (Optional)
              </label>
              <input
                type="text"
                value={pickupPostalCode}
                onChange={(e) => setPickupPostalCode(e.target.value)}
                placeholder="T2N 1Z8"
                className={darkInputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as typeof propertyType)}
                className={darkInputClass}
              >
                <option value="house" className="bg-[#0B1322] text-white">
                  Detached / Semi-Detached House
                </option>
                <option value="apartment-condo" className="bg-[#0B1322] text-white">
                  Apartment / Condo
                </option>
                <option value="townhouse" className="bg-[#0B1322] text-white">
                  Townhouse / Duplex
                </option>
                <option value="office-commercial" className="bg-[#0B1322] text-white">
                  Office / Commercial Space
                </option>
                <option value="garage-storage" className="bg-[#0B1322] text-white">
                  Garage / Storage Unit
                </option>
                <option value="other" className="bg-[#0B1322] text-white">
                  Other Property Type
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Where Are the Items?
              </label>
              <select
                value={itemLocation}
                onChange={(e) =>
                  setItemLocation(e.target.value as 'indoors' | 'outdoors' | 'both')
                }
                className={darkInputClass}
              >
                <option value="indoors" className="bg-[#0B1322] text-white">
                  Indoors (Inside rooms, basement, or hallway)
                </option>
                <option value="outdoors" className="bg-[#0B1322] text-white">
                  Outdoors (Driveway, alley, garage, curb)
                </option>
                <option value="both" className="bg-[#0B1322] text-white">
                  Both Indoors &amp; Outdoors
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Stairs or Elevator Access
              </label>
              <select
                value={stairsOrElevator}
                onChange={(e) => setStairsOrElevator(e.target.value as typeof stairsOrElevator)}
                className={darkInputClass}
              >
                <option value="ground-level" className="bg-[#0B1322] text-white">
                  Ground Level / No Stairs
                </option>
                <option value="stairs" className="bg-[#0B1322] text-white">
                  Stairs Required (Basement or Upper Floor)
                </option>
                <option value="elevator" className="bg-[#0B1322] text-white">
                  Elevator Available
                </option>
                <option value="both" className="bg-[#0B1322] text-white">
                  Both Stairs &amp; Elevator
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Preferred Collection Date *
              </label>
              <div className="relative mt-1.5">
                <Calendar className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-brand-orange" />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#080E1A] pl-10 pr-4 py-3 text-sm text-white focus:border-brand-orange focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Truck Parking Details
              </label>
              <input
                type="text"
                value={parkingNotes}
                onChange={(e) => setParkingNotes(e.target.value)}
                placeholder="e.g., Front driveway, back alley pad"
                className={darkInputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Access Conditions / Gate Codes
              </label>
              <input
                type="text"
                value={accessConditions}
                onChange={(e) => setAccessConditions(e.target.value)}
                placeholder="e.g., Narrow stairwell, buzzer #104"
                className={darkInputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Additional Notes About Items
              </label>
              <textarea
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="List specific heavy items, dismantling needs, or special instructions..."
                className={darkInputClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: CUSTOMER DETAILS */}
      {step === 5 && (
        <div>
          <div className="flex items-start gap-3.5 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-orange/35 bg-brand-orange/15 text-brand-orange">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                Where Should We Send Your Written Junk Removal Quote?
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-white/65">
                We respect your privacy and never share your contact details with third-party lead
                brokers.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className={darkInputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(587) 555-0199"
                className={darkInputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={darkInputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Preferred Contact Method
              </label>
              <div className="mt-2 flex flex-wrap gap-3">
                {(['phone', 'text', 'email'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPreferredContact(method)}
                    className={cn(
                      'rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all',
                      preferredContact === method
                        ? 'border-brand-orange bg-brand-orange text-white shadow-md'
                        : 'border-white/15 bg-[#080E1A] text-white/75 hover:border-brand-orange/40'
                    )}
                  >
                    {method === 'phone'
                      ? 'Phone Call'
                      : method === 'text'
                        ? 'Text Message (SMS)'
                        : 'Email'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: REVIEW AND SUBMIT */}
      {step === 6 && (
        <div>
          <div className="flex items-start gap-3.5 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-orange/35 bg-brand-orange/15 text-brand-orange">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                Review Your Junk Removal Request
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-white/65">
                Verify your categories, uploaded photos, and access details before sending to our
                Calgary team.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="rounded-2xl border border-white/10 bg-[#080E1A] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Categories &amp; Preliminary Load
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-brand-orange hover:underline"
                >
                  Edit
                </button>
              </div>
              <p className="mt-1 text-sm font-bold text-white capitalize">
                {categories.join(', ').replace(/-/g, ' ')}
              </p>
              <p className="mt-0.5 text-xs text-white/65">
                Preliminary Volume Description:{' '}
                <strong className="text-brand-orange">
                  {VOLUME_OPTIONS.find((v) => v.id === volumeEstimate)?.label}
                </strong>
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#080E1A] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Uploaded Photos ({photos.length})
                </span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-brand-orange hover:underline"
                >
                  Add / Edit Photos
                </button>
              </div>
              {photos.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {photos.map((p) => (
                    <div
                      key={p.id}
                      className="h-16 w-16 overflow-hidden rounded-lg border border-white/15 bg-black"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.dataUrl}
                        alt={p.originalFilename}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-xs text-white/60">
                  No photos uploaded (Our coordinator can still follow up by phone/text).
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#080E1A] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Location, Access &amp; Date
                </span>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs font-bold text-brand-orange hover:underline"
                >
                  Edit
                </button>
              </div>
              <p className="mt-1 text-sm font-bold text-white">
                {pickupAddress}, {pickupCity} {pickupPostalCode}
              </p>
              <p className="mt-0.5 text-xs text-white/65">
                Property: {propertyType} • Location: {itemLocation} • Access: {stairsOrElevator} •
                Preferred Date: <strong className="text-brand-orange">{preferredDate}</strong>
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#080E1A] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Customer Contact
                </span>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="text-xs font-bold text-brand-orange hover:underline"
                >
                  Edit
                </button>
              </div>
              <p className="mt-1 text-sm font-bold text-white">{fullName}</p>
              <p className="mt-0.5 text-xs text-white/65">
                {phone} • {email} (Preferred: {preferredContact})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Info Strip & Glowing Orange Next Step CTA — Matches Reference Image */}
      <div className="mt-8 pt-5 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070C16]/90 px-4 py-3 text-xs sm:text-sm text-white/80">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#38BDF8]/20 text-[#38BDF8]">
            <Info className="h-4 w-4" />
          </span>
          <span>{stepHelperMessages[step]}</span>
        </div>

        <div className="flex items-center justify-end gap-3 shrink-0">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3.5 font-heading text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="qm-orange-pill inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-heading text-sm sm:text-base font-extrabold text-white transition-all hover:scale-[1.02]"
            >
              <span>Next Step</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="qm-orange-pill inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-heading text-sm sm:text-base font-extrabold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Photo Quote'}</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
