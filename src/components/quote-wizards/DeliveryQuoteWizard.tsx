'use client';

import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Package,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
  AlertTriangle,
  Store,
  ShoppingBag,
  Refrigerator,
  Building2,
  Check,
  Info,
} from 'lucide-react';
import { PhotoUploadManager, UploadedPhotoItem } from './PhotoUploadManager';
import { BUSINESS_CONSTANTS, SERVICE_AREAS } from '@/lib/constants/business';
import { cn } from '@/lib/utils';

const DELIVERY_TYPES = [
  {
    id: 'store-to-home',
    label: 'Retail Store-to-Home Delivery',
    desc: 'Furniture showroom, big-box store, or warehouse pickup to your home',
    icon: Store,
  },
  {
    id: 'marketplace-pickup',
    label: 'Private Seller / Marketplace Pickup',
    desc: 'Facebook Marketplace, Kijiji, or estate sale oversized item pickup',
    icon: ShoppingBag,
  },
  {
    id: 'appliance-delivery',
    label: 'Heavy Appliance Delivery',
    desc: 'Fridges, stoves, washers, dryers with padded room-of-choice placement',
    icon: Refrigerator,
  },
  {
    id: 'commercial-b2b',
    label: 'Commercial / B2B Item Transport',
    desc: 'Office equipment, designer staging pieces, or commercial freight',
    icon: Building2,
  },
  {
    id: 'other-delivery',
    label: 'Specialty / Other Delivery',
    desc: 'Custom single-item or multi-item transport across Calgary & Alberta',
    icon: Truck,
  },
] as const;

const STEP_LABELS = [
  { num: 1, title: 'Delivery Type' },
  { num: 2, title: 'Pickup & Drop-Off' },
  { num: 3, title: 'Item & Photos' },
  { num: 4, title: 'Contact & Send' },
];

interface DeliveryQuoteWizardProps {
  initialCity?: string;
}

export function DeliveryQuoteWizard({ initialCity = 'Calgary' }: DeliveryQuoteWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  const [deliveryType, setDeliveryType] =
    useState<(typeof DELIVERY_TYPES)[number]['id']>('store-to-home');
  const [pickupLocationName, setPickupLocationName] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupCity, setPickupCity] = useState(initialCity || 'Calgary');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destinationCity, setDestinationCity] = useState(initialCity || 'Calgary');
  const [itemSummary, setItemSummary] = useState('');
  const [removeOldItem, setRemoveOldItem] = useState(false);
  const [accessNotes, setAccessNotes] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeWindow, setPreferredTimeWindow] = useState<
    'morning' | 'afternoon' | 'evening' | 'flexible'
  >('flexible');
  const [photos, setPhotos] = useState<UploadedPhotoItem[]>([]);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'email' | 'text'>('phone');
  const [honeypot, setHoneypot] = useState('');

  const validateStep = (): boolean => {
    setErrorMessage(null);
    if (step === 2) {
      if (!pickupAddress.trim() || !destinationAddress.trim()) {
        setErrorMessage('Please enter both the pickup address and drop-off address.');
        return false;
      }
      if (!preferredDate.trim()) {
        setErrorMessage('Please select a preferred delivery date.');
        return false;
      }
    }
    if (step === 3) {
      if (itemSummary.trim().length < 3) {
        setErrorMessage('Please describe the item(s) to be picked up and delivered.');
        return false;
      }
    }
    if (step === 4) {
      if (fullName.trim().length < 2 || phone.trim().length < 7 || !email.includes('@')) {
        setErrorMessage('Please provide your full name, valid phone number, and email address.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flowType: 'delivery',
          honeypot,
          deliveryType,
          pickupLocationName,
          pickupAddress,
          pickupCity,
          destinationAddress,
          destinationCity,
          itemSummary,
          removeOldItem,
          accessNotes,
          preferredDate,
          preferredTimeWindow,
          photos: photos.map((p) => ({
            id: p.id,
            storageKey: p.storageKey,
            dataUrl: p.dataUrl,
            originalFilename: p.originalFilename,
            mimeType: p.mimeType,
            fileSizeBytes: p.fileSizeBytes,
            caption: p.caption,
          })),
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
        throw new Error(data.error || 'Unable to submit delivery quote.');
      }
      setReferenceCode(data.referenceCode);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Submission error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const darkInputClass =
    'mt-1.5 w-full rounded-xl border border-white/15 bg-[#080E1A] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange';

  if (referenceCode) {
    return (
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-[#0B1322] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.65)] sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <span className="mb-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-4 py-1 text-xs font-heading font-bold text-emerald-300">
            Delivery Quote Request Received
          </span>
          <h3 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
            Delivery Request Logged, {fullName}!
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
            Our Calgary dispatch coordinator has received your pickup and delivery details and will
            reach out with a confirmed window and written estimate.
          </p>
          <div className="mt-6 w-full max-w-md rounded-2xl border border-brand-orange/40 bg-[#070D19] p-5 shadow-orange-glow">
            <p className="text-xs font-bold uppercase tracking-wider text-white/60">
              Delivery Reference Code
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-brand-orange">
              {referenceCode}
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
              Submit Another Delivery Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0B1322]/95 p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.65)] sm:p-8">
      {/* Connected Horizontal Numbered Stepper */}
      <div className="mb-8">
        <div className="relative flex items-center justify-between">
          <div className="pointer-events-none absolute left-6 right-6 top-4 h-[2px] bg-white/15" />
          <div
            className="pointer-events-none absolute left-6 top-4 h-[2px] bg-brand-orange transition-all duration-300"
            style={{ width: `${((step - 1) / (STEP_LABELS.length - 1)) * 88}%` }}
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
                className="relative z-10 flex flex-col items-center gap-2 focus:outline-none"
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
                    'text-[11px] sm:text-xs font-heading font-semibold tracking-tight',
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

      {step === 1 && (
        <div>
          <div className="flex items-start gap-3.5 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-orange/35 bg-brand-orange/15 text-brand-orange">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                What Type of Delivery Do You Need?
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-white/65">
                Choose the delivery option that best matches your pickup and drop-off needs.
              </p>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            {DELIVERY_TYPES.map((item) => {
              const Icon = item.icon;
              const selected = deliveryType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDeliveryType(item.id)}
                  className={cn(
                    'relative flex items-start gap-4 rounded-2xl p-5 text-left transition-all',
                    selected
                      ? 'qm-orange-border-glow bg-gradient-to-b from-brand-orange/20 to-[#0C1526]'
                      : 'border border-white/10 bg-[#101B30]/80 hover:border-brand-orange/45'
                  )}
                >
                  {selected && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                      selected
                        ? 'bg-brand-orange text-white'
                        : 'bg-white/5 text-[#BFD4F5] border border-white/10'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="pr-4">
                    <p className="font-heading text-base font-extrabold text-white">{item.label}</p>
                    <p className="mt-1 text-xs text-white/65">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="flex items-start gap-3.5 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-orange/35 bg-brand-orange/15 text-brand-orange">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                Pickup &amp; Delivery Locations
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-white/65">
                Enter your store/seller pickup location, destination address, and preferred date.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Store / Seller / Warehouse Name (Optional)
              </label>
              <input
                type="text"
                value={pickupLocationName}
                onChange={(e) => setPickupLocationName(e.target.value)}
                placeholder="e.g., IKEA Calgary, Ashley HomeStore, Private Residence"
                className={darkInputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Pickup Address *
              </label>
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Pickup street address"
                className={darkInputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Pickup City *
              </label>
              <select
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                className={darkInputClass}
              >
                {SERVICE_AREAS.map((a) => (
                  <option key={a.slug} value={a.city} className="bg-[#0B1322] text-white">
                    {a.city}, AB
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Drop-Off Address *
              </label>
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder="Destination street address"
                className={darkInputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Drop-Off City *
              </label>
              <select
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className={darkInputClass}
              >
                {SERVICE_AREAS.map((a) => (
                  <option key={a.slug} value={a.city} className="bg-[#0B1322] text-white">
                    {a.city}, AB
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Preferred Delivery Date *
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className={darkInputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Preferred Window
              </label>
              <select
                value={preferredTimeWindow}
                onChange={(e) =>
                  setPreferredTimeWindow(e.target.value as typeof preferredTimeWindow)
                }
                className={darkInputClass}
              >
                <option value="morning" className="bg-[#0B1322] text-white">
                  Morning (8:00 AM – 12:00 PM)
                </option>
                <option value="afternoon" className="bg-[#0B1322] text-white">
                  Afternoon (12:00 PM – 4:00 PM)
                </option>
                <option value="evening" className="bg-[#0B1322] text-white">
                  Late Afternoon / Evening
                </option>
                <option value="flexible" className="bg-[#0B1322] text-white">
                  Flexible Any Time
                </option>
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="flex items-start gap-3.5 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-orange/35 bg-brand-orange/15 text-brand-orange">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                What Are We Delivering?
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-white/65">
                Describe the items, optional old-item haul-away, and upload photos if available.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Item Description &amp; Dimensions *
              </label>
              <textarea
                rows={3}
                value={itemSummary}
                onChange={(e) => setItemSummary(e.target.value)}
                placeholder="e.g., 3-piece L-shaped sectional sofa and solid oak dining table..."
                className={darkInputClass}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-brand-orange/30 bg-brand-orange/10 p-4">
              <input
                type="checkbox"
                checked={removeOldItem}
                onChange={(e) => setRemoveOldItem(e.target.checked)}
                className="h-5 w-5 rounded accent-brand-orange"
              />
              <div>
                <p className="text-sm font-bold text-white">
                  Add Old Furniture / Appliance Haul-Away (Junk Removal)
                </p>
                <p className="text-xs text-white/65">
                  Have our crew remove your old sofa, mattress, or appliance on the same trip.
                </p>
              </div>
            </label>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Stairs, Elevator, or Receipt / Order Pickup Notes
              </label>
              <input
                type="text"
                value={accessNotes}
                onChange={(e) => setAccessNotes(e.target.value)}
                placeholder="e.g., Going to 2nd floor, loading dock order #4512"
                className={darkInputClass}
              />
            </div>

            <PhotoUploadManager
              photos={photos}
              onChange={setPhotos}
              maxPhotos={8}
              label="Optional Item / Listing Photos"
              helperText="Upload a screenshot of the item or doorway access if helpful."
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <div className="flex items-start gap-3.5 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-orange/35 bg-brand-orange/15 text-brand-orange">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                Your Contact Information
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-white/65">
                Where should our Calgary dispatch coordinator send your written delivery quote?
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
          </div>
        </div>
      )}

      {/* Bottom Info Bar & Glowing Orange Next Step CTA */}
      <div className="mt-8 pt-5 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070C16]/90 px-4 py-3 text-xs sm:text-sm text-white/80">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#38BDF8]/20 text-[#38BDF8]">
            <Info className="h-4 w-4" />
          </span>
          <span>
            Every delivery includes padded furniture blankets, tie-down strapping, and room-of-choice
            placement.
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 shrink-0">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3.5 font-heading text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (validateStep()) setStep((s) => s + 1);
              }}
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
              <span>{isSubmitting ? 'Submitting...' : 'Submit Delivery Quote'}</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
