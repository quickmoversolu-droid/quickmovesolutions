'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Home,
  Building2,
  Truck,
  MapPin,
  Route,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Edit3,
  Phone,
  Mail,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FormField,
  Input,
  Select,
  Textarea,
  SelectionCard,
} from '@/components/ui/FormControls';
import {
  PhotoUploadManager,
  type WizardPhotoItem,
} from '@/components/quote-wizards/PhotoUploadManager';
import { cn } from '@/lib/utils';

const MOVING_SERVICE_OPTIONS = [
  {
    id: 'residential',
    title: 'Residential Moving',
    description: 'Complete household relocation for families and individuals.',
    icon: Home,
  },
  {
    id: 'apartment',
    title: 'Apartment / Condo Move',
    description: 'Studio, 1-bedroom, or multi-bedroom condo & apartment moves.',
    icon: Building2,
  },
  {
    id: 'house',
    title: 'House / Townhouse Move',
    description: 'Detached homes, duplexes, and multi-level townhouses.',
    icon: Home,
  },
  {
    id: 'commercial',
    title: 'Commercial / Office Move',
    description: 'Offices, retail spaces, workstations, and business equipment.',
    icon: Building2,
  },
  {
    id: 'local',
    title: 'Local Moving (Calgary & Area)',
    description: 'Moving within Calgary neighbourhoods, Airdrie, or Strathmore.',
    icon: MapPin,
  },
  {
    id: 'long-distance',
    title: 'Long-Distance Moving',
    description: 'Inter-city moves connecting Calgary, Red Deer, Edmonton & beyond.',
    icon: Route,
  },
  {
    id: 'other',
    title: 'Other / Custom Move',
    description: 'Packing-only, internal building transfer, or custom relocation.',
    icon: Truck,
  },
] as const;

const PROPERTY_SIZE_OPTIONS = [
  { id: 'studio', title: 'Studio / Bachelor', description: 'Compact apartment or single room' },
  { id: 'one-bedroom', title: 'One Bedroom', description: '1-bedroom condo, basement suite, or apartment' },
  { id: 'two-bedroom', title: 'Two Bedrooms', description: '2-bedroom condo, townhouse, or bungalow', badge: 'Popular' },
  { id: 'three-bedroom', title: 'Three Bedrooms', description: 'Standard 3-bedroom family house or townhouse' },
  { id: 'four-bedroom', title: 'Four Bedrooms', description: 'Larger 4-bedroom family home + garage/basement' },
  { id: 'five-plus-bedroom', title: 'Five or More Bedrooms', description: 'Large estate or multi-level household' },
  { id: 'commercial-property', title: 'Commercial Property', description: 'Office suite, storefront, or workspace' },
  { id: 'not-sure', title: 'Not Sure', description: 'We will help assess your size during review' },
] as const;

const INVENTORY_CHECKBOX_ITEMS = [
  { key: 'furniture', label: 'Standard Furniture (Sofas, beds, tables, dressers)' },
  { key: 'appliances', label: 'Appliances (Fridge, washer, dryer, freezer)' },
  { key: 'largeItems', label: 'Large / Oversized Items (Sectionals, armoires, gym gear)' },
  { key: 'fragileItems', label: 'Fragile Items (Glass tabletops, mirrors, artwork, china)' },
  { key: 'heavyItems', label: 'Heavy Items (Safes, upright pianos, solid stone tables)' },
  { key: 'packing', label: 'Packing Assistance Needed' },
  { key: 'unpacking', label: 'Unpacking Assistance Needed' },
  { key: 'stairs', label: 'Stairs at Pickup or Destination' },
  { key: 'elevator', label: 'Elevator Booking Required' },
  { key: 'parking', label: 'Restricted / Street Parking Access' },
  { key: 'longWalk', label: 'Long Walking Distance (>50m from truck to door)' },
  { key: 'additionalStops', label: 'Additional Pickup or Drop-off Stops Required' },
] as const;

type InventoryFlagKey = (typeof INVENTORY_CHECKBOX_ITEMS)[number]['key'];

const STEP_LABELS = [
  { step: 1, title: 'Service' },
  { step: 2, title: 'Locations' },
  { step: 3, title: 'Date' },
  { step: 4, title: 'Property Size' },
  { step: 5, title: 'Inventory' },
  { step: 6, title: 'Contact' },
  { step: 7, title: 'Review' },
  { step: 8, title: 'Confirmation' },
];

const STORAGE_KEY = 'qm_visual_moving_quote_draft_v1';

export interface VisualMovingQuoteWizardProps {
  initialService?: string;
  initialCity?: string;
}

export function VisualMovingQuoteWizard({
  initialService,
  initialCity,
}: VisualMovingQuoteWizardProps) {
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [stepError, setStepError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Step 1
  const [movingServiceType, setMovingServiceType] = React.useState<string>(() => {
    if (initialService?.includes('commercial')) return 'commercial';
    if (initialService?.includes('local')) return 'local';
    if (initialService?.includes('long-distance')) return 'long-distance';
    if (initialService?.includes('packing')) return 'other';
    return 'residential';
  });

  // Step 2
  const [pickupAddress, setPickupAddress] = React.useState('');
  const [pickupCity, setPickupCity] = React.useState(initialCity || 'Calgary');
  const [pickupPostalCode, setPickupPostalCode] = React.useState('');
  const [pickupAccessDetails, setPickupAccessDetails] = React.useState('');
  const [destinationAddress, setDestinationAddress] = React.useState('');
  const [destinationCity, setDestinationCity] = React.useState('Calgary');
  const [destinationPostalCode, setDestinationPostalCode] = React.useState('');
  const [destinationAccessDetails, setDestinationAccessDetails] = React.useState('');

  // Step 3
  const [preferredDate, setPreferredDate] = React.useState('');
  const [isFlexibleDate, setIsFlexibleDate] = React.useState(false);
  const [preferredTimeWindow, setPreferredTimeWindow] = React.useState<
    'morning' | 'afternoon' | 'evening' | 'flexible'
  >('morning');

  // Step 4
  const [propertySize, setPropertySize] = React.useState<string>('two-bedroom');

  // Step 5
  const [inventoryFlags, setInventoryFlags] = React.useState<Record<InventoryFlagKey, boolean>>({
    furniture: true,
    appliances: false,
    largeItems: false,
    fragileItems: false,
    heavyItems: false,
    packing: initialService?.includes('packing') ?? false,
    unpacking: false,
    stairs: false,
    elevator: false,
    parking: false,
    longWalk: false,
    additionalStops: false,
  });
  const [specialRequirements, setSpecialRequirements] = React.useState('');
  const [photos, setPhotos] = React.useState<WizardPhotoItem[]>([]);

  // Step 6
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [preferredContact, setPreferredContact] = React.useState<'phone' | 'email' | 'text'>('phone');

  // Step 8 Submission Result
  const [submissionResult, setSubmissionResult] = React.useState<{
    referenceCode: string;
    createdAt: string;
    photoCount: number;
  } | null>(null);

  // Restore draft from sessionStorage on mount
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.movingServiceType && !initialService) setMovingServiceType(parsed.movingServiceType);
        if (parsed.pickupAddress) setPickupAddress(parsed.pickupAddress);
        if (parsed.pickupCity && !initialCity) setPickupCity(parsed.pickupCity);
        if (parsed.pickupPostalCode) setPickupPostalCode(parsed.pickupPostalCode);
        if (parsed.pickupAccessDetails) setPickupAccessDetails(parsed.pickupAccessDetails);
        if (parsed.destinationAddress) setDestinationAddress(parsed.destinationAddress);
        if (parsed.destinationCity) setDestinationCity(parsed.destinationCity);
        if (parsed.destinationPostalCode) setDestinationPostalCode(parsed.destinationPostalCode);
        if (parsed.destinationAccessDetails) setDestinationAccessDetails(parsed.destinationAccessDetails);
        if (parsed.preferredDate) setPreferredDate(parsed.preferredDate);
        if (typeof parsed.isFlexibleDate === 'boolean') setIsFlexibleDate(parsed.isFlexibleDate);
        if (parsed.preferredTimeWindow) setPreferredTimeWindow(parsed.preferredTimeWindow);
        if (parsed.propertySize) setPropertySize(parsed.propertySize);
        if (parsed.inventoryFlags) setInventoryFlags((prev) => ({ ...prev, ...parsed.inventoryFlags }));
        if (parsed.specialRequirements) setSpecialRequirements(parsed.specialRequirements);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.preferredContact) setPreferredContact(parsed.preferredContact);
      }
    } catch {
      // Ignore storage errors
    }
  }, [initialService, initialCity]);

  // Save draft to sessionStorage
  React.useEffect(() => {
    if (currentStep === 8) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          movingServiceType,
          pickupAddress,
          pickupCity,
          pickupPostalCode,
          pickupAccessDetails,
          destinationAddress,
          destinationCity,
          destinationPostalCode,
          destinationAccessDetails,
          preferredDate,
          isFlexibleDate,
          preferredTimeWindow,
          propertySize,
          inventoryFlags,
          specialRequirements,
          fullName,
          phone,
          email,
          preferredContact,
        })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [
    currentStep,
    movingServiceType,
    pickupAddress,
    pickupCity,
    pickupPostalCode,
    pickupAccessDetails,
    destinationAddress,
    destinationCity,
    destinationPostalCode,
    destinationAccessDetails,
    preferredDate,
    isFlexibleDate,
    preferredTimeWindow,
    propertySize,
    inventoryFlags,
    specialRequirements,
    fullName,
    phone,
    email,
    preferredContact,
  ]);

  const toggleInventoryFlag = (key: InventoryFlagKey) => {
    setInventoryFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validateCurrentStep = (): boolean => {
    setStepError(null);
    if (currentStep === 1 && !movingServiceType) {
      setStepError('Please select a moving service type to continue.');
      return false;
    }
    if (currentStep === 2) {
      if (!pickupAddress.trim() || !pickupCity.trim()) {
        setStepError('Please enter your pickup address and city.');
        return false;
      }
      if (!destinationAddress.trim() || !destinationCity.trim()) {
        setStepError('Please enter your destination address and city.');
        return false;
      }
    }
    if (currentStep === 3) {
      if (!preferredDate) {
        setStepError('Please select your preferred moving date.');
        return false;
      }
    }
    if (currentStep === 4) {
      if (!propertySize) {
        setStepError('Please select your property size.');
        return false;
      }
    }
    if (currentStep === 6) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setStepError('Please enter your full name.');
        return false;
      }
      if (!phone.trim() || phone.trim().length < 7) {
        setStepError('Please enter a valid phone number.');
        return false;
      }
      if (!email.trim() || !email.includes('@')) {
        setStepError('Please enter a valid email address.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setCurrentStep((prev) => Math.min(7, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStepError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpToStep = (step: number) => {
    setStepError(null);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    setStepError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flowType: 'moving',
          movingServiceType,
          pickupAddress: pickupAddress.trim(),
          pickupCity: pickupCity.trim(),
          pickupPostalCode: pickupPostalCode.trim(),
          pickupAccessDetails: pickupAccessDetails.trim(),
          destinationAddress: destinationAddress.trim(),
          destinationCity: destinationCity.trim(),
          destinationPostalCode: destinationPostalCode.trim(),
          destinationAccessDetails: destinationAccessDetails.trim(),
          preferredDate,
          isFlexibleDate,
          preferredTimeWindow,
          propertySize,
          inventoryFlags,
          specialRequirements: specialRequirements.trim(),
          photos: photos.map((p) => ({
            id: p.id,
            originalFilename: p.originalFilename,
            mimeType: p.mimeType,
            fileSizeBytes: p.fileSizeBytes,
            dataUrl: p.dataUrl,
            caption: p.caption,
          })),
          customer: {
            fullName: fullName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            preferredContact,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setStepError(data.error || 'Could not submit quote request. Please check your details.');
        setIsSubmitting(false);
        return;
      }

      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }

      setSubmissionResult({
        referenceCode: data.referenceCode,
        createdAt: data.createdAt,
        photoCount: data.photoCount ?? photos.length,
      });
      setCurrentStep(8);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setStepError('Network error while submitting. Please try again or call (587) 999-9565.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = Math.round((currentStep / 8) * 100);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0B1322]/95 p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
      {/* Connected Horizontal Numbered Stepper */}
      <div className="mb-8">
        <div className="relative flex items-center justify-between">
          <div className="pointer-events-none absolute left-4 right-4 top-4 h-[2px] bg-white/15" />
          <div
            className="pointer-events-none absolute left-4 top-4 h-[2px] bg-brand-orange transition-all duration-300"
            style={{ width: `${Math.min(94, ((currentStep - 1) / (STEP_LABELS.length - 1)) * 94)}%` }}
          />
          {STEP_LABELS.map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <button
                key={item.step}
                type="button"
                disabled={item.step >= currentStep || currentStep === 8}
                onClick={() => item.step < currentStep && jumpToStep(item.step)}
                className="relative z-10 flex flex-col items-center gap-2 focus:outline-none"
              >
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full font-heading text-xs font-extrabold transition-all',
                    isCurrent
                      ? 'bg-brand-orange text-white shadow-[0_0_20px_rgba(244,119,50,0.85)] ring-4 ring-brand-orange/25'
                      : isCompleted
                        ? 'cursor-pointer bg-brand-orange/80 text-white hover:bg-brand-orange'
                        : 'cursor-default bg-[#1A253B] text-white/55 border border-white/10'
                  )}
                >
                  {isCompleted ? '✓' : item.step}
                </span>
                <span
                  className={cn(
                    'text-[11px] font-heading font-semibold tracking-tight hidden sm:block',
                    isCurrent
                      ? 'text-white font-bold'
                      : isCompleted
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

      {stepError && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{stepError}</span>
        </div>
      )}

      {/* STEP 1: MOVING SERVICE */}
      {currentStep === 1 && (
        <Card variant="default" padding="lg" className="space-y-6">
          <div>
            <Badge variant="orange">Step 1 of 8</Badge>
            <h2 className="mt-2 font-heading text-heading-2 text-brand-navy">
              What Type of Moving Service Do You Need?
            </h2>
            <p className="mt-1 text-sm text-brand-charcoal-muted">
              Select the option that best describes your upcoming move.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOVING_SERVICE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <SelectionCard
                  key={opt.id}
                  title={opt.title}
                  description={opt.description}
                  icon={<Icon className="h-5 w-5" />}
                  selected={movingServiceType === opt.id}
                  onClick={() => setMovingServiceType(opt.id)}
                />
              );
            })}
          </div>
        </Card>
      )}

      {/* STEP 2: PICKUP AND DESTINATION */}
      {currentStep === 2 && (
        <Card variant="default" padding="lg" className="space-y-8">
          <div>
            <Badge variant="orange">Step 2 of 8</Badge>
            <h2 className="mt-2 font-heading text-heading-2 text-brand-navy">
              Pickup &amp; Destination Locations
            </h2>
            <p className="mt-1 text-sm text-brand-charcoal-muted">
              Enter the addresses, cities, postal codes, and access details for your move.
            </p>
          </div>

          {/* Pickup Block */}
          <div className="space-y-4 rounded-2xl bg-brand-surface-grey p-5 border border-brand-surface-border">
            <h3 className="font-heading text-base font-bold text-brand-navy flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-orange" />
              <span>Pickup Location (Origin)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <FormField
                label="Pickup Street Address"
                htmlFor="mov-pickup-address"
                required
                className="sm:col-span-6"
              >
                <Input
                  id="mov-pickup-address"
                  placeholder="e.g., 450 8 Ave SW"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                />
              </FormField>

              <FormField
                label="Pickup City"
                htmlFor="mov-pickup-city"
                required
                className="sm:col-span-4"
              >
                <Input
                  id="mov-pickup-city"
                  placeholder="Calgary"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                />
              </FormField>

              <FormField
                label="Postal Code"
                htmlFor="mov-pickup-postal"
                className="sm:col-span-2"
              >
                <Input
                  id="mov-pickup-postal"
                  placeholder="T2P 1E1"
                  value={pickupPostalCode}
                  onChange={(e) => setPickupPostalCode(e.target.value.toUpperCase())}
                />
              </FormField>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-brand-charcoal-subtle mr-1">Quick select city:</span>
              {['Calgary', 'Airdrie', 'Strathmore', 'Red Deer', 'Edmonton'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setPickupCity(city)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 font-heading font-semibold transition-colors',
                    pickupCity === city
                      ? 'bg-brand-navy text-white'
                      : 'bg-white border border-brand-surface-border text-brand-charcoal hover:border-brand-orange'
                  )}
                >
                  {city}
                </button>
              ))}
            </div>

            <FormField
              label="Pickup Access Information"
              htmlFor="mov-pickup-access"
              hint="Mention floor level, elevator, rear alley access, or driveway clearance."
            >
              <Input
                id="mov-pickup-access"
                placeholder="e.g., 3rd floor condo with freight elevator, loading zone in rear alley"
                value={pickupAccessDetails}
                onChange={(e) => setPickupAccessDetails(e.target.value)}
              />
            </FormField>
          </div>

          {/* Destination Block */}
          <div className="space-y-4 rounded-2xl bg-brand-surface-grey p-5 border border-brand-surface-border">
            <h3 className="font-heading text-base font-bold text-brand-navy flex items-center gap-2">
              <Route className="h-4 w-4 text-brand-orange" />
              <span>Destination Location (Drop-Off)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <FormField
                label="Destination Street Address"
                htmlFor="mov-dest-address"
                required
                className="sm:col-span-6"
              >
                <Input
                  id="mov-dest-address"
                  placeholder="e.g., 1200 Main St NW"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                />
              </FormField>

              <FormField
                label="Destination City"
                htmlFor="mov-dest-city"
                required
                className="sm:col-span-4"
              >
                <Input
                  id="mov-dest-city"
                  placeholder="Calgary"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                />
              </FormField>

              <FormField
                label="Postal Code"
                htmlFor="mov-dest-postal"
                className="sm:col-span-2"
              >
                <Input
                  id="mov-dest-postal"
                  placeholder="T3A 2Y4"
                  value={destinationPostalCode}
                  onChange={(e) => setDestinationPostalCode(e.target.value.toUpperCase())}
                />
              </FormField>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-brand-charcoal-subtle mr-1">Quick select city:</span>
              {['Calgary', 'Airdrie', 'Strathmore', 'Red Deer', 'Edmonton'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setDestinationCity(city)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 font-heading font-semibold transition-colors',
                    destinationCity === city
                      ? 'bg-brand-navy text-white'
                      : 'bg-white border border-brand-surface-border text-brand-charcoal hover:border-brand-orange'
                  )}
                >
                  {city}
                </button>
              ))}
            </div>

            <FormField
              label="Destination Access Information"
              htmlFor="mov-dest-access"
              hint="Mention stairs, driveway parking, or building rules at your new address."
            >
              <Input
                id="mov-dest-access"
                placeholder="e.g., Two-storey detached house with front driveway parking"
                value={destinationAccessDetails}
                onChange={(e) => setDestinationAccessDetails(e.target.value)}
              />
            </FormField>
          </div>
        </Card>
      )}

      {/* STEP 3: MOVING DATE */}
      {currentStep === 3 && (
        <Card variant="default" padding="lg" className="space-y-6">
          <div>
            <Badge variant="orange">Step 3 of 8</Badge>
            <h2 className="mt-2 font-heading text-heading-2 text-brand-navy">
              Preferred Moving Date &amp; Time Window
            </h2>
            <p className="mt-1 text-sm text-brand-charcoal-muted">
              Select your target moving date. Note: requested dates are reviewed against crew and
              truck availability before final confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              label="Preferred Moving Date"
              htmlFor="mov-pref-date"
              required
              hint="Select your ideal moving day."
            >
              <Input
                id="mov-pref-date"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                leftIcon={<Calendar className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label="Date Flexibility"
              htmlFor="mov-flex-date"
              hint="Let us know if your date can shift by 1–2 days."
            >
              <Select
                id="mov-flex-date"
                value={isFlexibleDate ? 'flexible' : 'fixed'}
                onChange={(e) => setIsFlexibleDate(e.target.value === 'flexible')}
              >
                <option value="fixed">Exact Date Preferred</option>
                <option value="flexible">Flexible (+/- 1 to 3 days)</option>
              </Select>
            </FormField>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-sm font-semibold text-brand-navy font-heading block">
              Preferred Time Window *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  id: 'morning',
                  title: 'Morning Window (8:00 AM – 12:00 PM)',
                  desc: 'Recommended for full residential and commercial moves.',
                },
                {
                  id: 'afternoon',
                  title: 'Afternoon Window (12:00 PM – 4:00 PM)',
                  desc: 'Ideal for condo elevator afternoon slots or smaller loads.',
                },
                {
                  id: 'evening',
                  title: 'Late Afternoon / Evening',
                  desc: 'For commercial after-hours or scheduled late transfers.',
                },
                {
                  id: 'flexible',
                  title: 'Flexible / Any Time of Day',
                  desc: 'Open to the best available dispatch window.',
                },
              ].map((win) => (
                <SelectionCard
                  key={win.id}
                  title={win.title}
                  description={win.desc}
                  icon={<Clock className="h-5 w-5" />}
                  selected={preferredTimeWindow === win.id}
                  onClick={() =>
                    setPreferredTimeWindow(
                      win.id as 'morning' | 'afternoon' | 'evening' | 'flexible'
                    )
                  }
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: PROPERTY SIZE */}
      {currentStep === 4 && (
        <Card variant="default" padding="lg" className="space-y-6">
          <div>
            <Badge variant="orange">Step 4 of 8</Badge>
            <h2 className="mt-2 font-heading text-heading-2 text-brand-navy">
              Select Your Property Size
            </h2>
            <p className="mt-1 text-sm text-brand-charcoal-muted">
              Choose the visual card that best matches the size of the property being moved.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROPERTY_SIZE_OPTIONS.map((size) => (
              <SelectionCard
                key={size.id}
                title={size.title}
                description={size.description}
                badge={'badge' in size ? size.badge : undefined}
                icon={
                  size.id === 'commercial-property' ? (
                    <Building2 className="h-5 w-5" />
                  ) : size.id === 'not-sure' ? (
                    <HelpCircle className="h-5 w-5" />
                  ) : (
                    <Home className="h-5 w-5" />
                  )
                }
                selected={propertySize === size.id}
                onClick={() => setPropertySize(size.id)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* STEP 5: INVENTORY AND REQUIREMENTS + OPTIONAL PHOTOS */}
      {currentStep === 5 && (
        <Card variant="default" padding="lg" className="space-y-8">
          <div>
            <Badge variant="orange">Step 5 of 8</Badge>
            <h2 className="mt-2 font-heading text-heading-2 text-brand-navy">
              Inventory, Access &amp; Special Requirements
            </h2>
            <p className="mt-1 text-sm text-brand-charcoal-muted">
              Select all items and property conditions that apply to your move so our crew arrives
              with the right equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INVENTORY_CHECKBOX_ITEMS.map((item) => {
              const checked = inventoryFlags[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleInventoryFlag(item.key)}
                  aria-pressed={checked}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-xl border-2 p-3.5 text-left transition-all',
                    checked
                      ? 'border-brand-orange bg-brand-orange-50/70 text-brand-navy font-semibold'
                      : 'border-brand-surface-border bg-white text-brand-charcoal hover:border-brand-navy/35'
                  )}
                >
                  <span className="text-xs sm:text-sm">{item.label}</span>
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border',
                      checked
                        ? 'border-brand-orange bg-brand-orange text-white'
                        : 'border-brand-surface-border bg-brand-surface-grey'
                    )}
                  >
                    {checked && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>

          <FormField
            label="Special Requirements or Key Inventory Notes"
            htmlFor="mov-special-notes"
            hint="Mention major furniture counts, fragile items, extra stop addresses, or pre-move junk removal needs."
          >
            <Textarea
              id="mov-special-notes"
              placeholder="e.g., 1 king bed, 2 queen beds, L-shaped sectional sofa, dining table with 6 chairs, ~35 medium boxes..."
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
            />
          </FormField>

          <div className="pt-4 border-t border-brand-surface-border">
            <Badge variant="light" className="mb-3">
              Optional Photo Upload
            </Badge>
            <PhotoUploadManager
              photos={photos}
              onChange={setPhotos}
              title="Add Optional Photos of Rooms or Large Items"
              helperText="Have a large sectional, tight staircase, or heavy piece? Upload optional photos to help our team prepare your quotation."
            />
          </div>
        </Card>
      )}

      {/* STEP 6: CONTACT DETAILS */}
      {currentStep === 6 && (
        <Card variant="default" padding="lg" className="space-y-6">
          <div>
            <Badge variant="orange">Step 6 of 8</Badge>
            <h2 className="mt-2 font-heading text-heading-2 text-brand-navy">
              Your Contact Information
            </h2>
            <p className="mt-1 text-sm text-brand-charcoal-muted">
              Where should we send your written moving quotation and confirmation reference?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Full Name" htmlFor="mov-cust-name" required>
              <Input
                id="mov-cust-name"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormField>

            <FormField label="Phone Number" htmlFor="mov-cust-phone" required>
              <Input
                id="mov-cust-phone"
                type="tel"
                placeholder="(587) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormField>

            <FormField label="Email Address" htmlFor="mov-cust-email" required>
              <Input
                id="mov-cust-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>

            <FormField label="Preferred Contact Method" htmlFor="mov-cust-pref" required>
              <Select
                id="mov-cust-pref"
                value={preferredContact}
                onChange={(e) =>
                  setPreferredContact(e.target.value as 'phone' | 'email' | 'text')
                }
              >
                <option value="phone">Phone Call</option>
                <option value="email">Email</option>
                <option value="text">Text Message / SMS</option>
              </Select>
            </FormField>
          </div>
        </Card>
      )}

      {/* STEP 7: REVIEW BEFORE SUBMISSION */}
      {currentStep === 7 && (
        <Card variant="default" padding="lg" className="space-y-6">
          <div>
            <Badge variant="orange">Step 7 of 8 — Final Review</Badge>
            <h2 className="mt-2 font-heading text-heading-2 text-brand-navy">
              Review Your Moving Quote Request
            </h2>
            <p className="mt-1 text-sm text-brand-charcoal-muted">
              Please verify your details below. You can click <strong>Edit</strong> on any section
              to make changes before submitting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service & Size */}
            <div className="rounded-2xl bg-brand-surface-grey p-4 border border-brand-surface-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold uppercase text-brand-charcoal-subtle">
                  1. Service &amp; Property Size
                </span>
                <button
                  type="button"
                  onClick={() => jumpToStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <p className="font-heading text-sm font-bold text-brand-navy capitalize">
                Service: {movingServiceType.replace('-', ' ')}
              </p>
              <p className="text-xs text-brand-charcoal">
                Property Size: <strong>{propertySize.replace(/-/g, ' ')}</strong>
              </p>
            </div>

            {/* Date & Window */}
            <div className="rounded-2xl bg-brand-surface-grey p-4 border border-brand-surface-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold uppercase text-brand-charcoal-subtle">
                  3. Preferred Moving Date
                </span>
                <button
                  type="button"
                  onClick={() => jumpToStep(3)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <p className="font-heading text-sm font-bold text-brand-navy">
                Date: {preferredDate} {isFlexibleDate ? '(Flexible)' : '(Exact Date)'}
              </p>
              <p className="text-xs text-brand-charcoal capitalize">
                Time Window: <strong>{preferredTimeWindow}</strong>
              </p>
            </div>

            {/* Locations */}
            <div className="md:col-span-2 rounded-2xl bg-brand-surface-grey p-4 border border-brand-surface-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold uppercase text-brand-charcoal-subtle">
                  2. Pickup &amp; Destination Locations
                </span>
                <button
                  type="button"
                  onClick={() => jumpToStep(2)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-brand-navy block">Pickup:</span>
                  <span>
                    {pickupAddress}, {pickupCity} {pickupPostalCode}
                  </span>
                  {pickupAccessDetails && (
                    <span className="block text-xs text-brand-charcoal-muted mt-0.5">
                      Access: {pickupAccessDetails}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-bold text-brand-navy block">Destination:</span>
                  <span>
                    {destinationAddress}, {destinationCity} {destinationPostalCode}
                  </span>
                  {destinationAccessDetails && (
                    <span className="block text-xs text-brand-charcoal-muted mt-0.5">
                      Access: {destinationAccessDetails}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Inventory & Photos */}
            <div className="rounded-2xl bg-brand-surface-grey p-4 border border-brand-surface-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold uppercase text-brand-charcoal-subtle">
                  5. Inventory &amp; Requirements
                </span>
                <button
                  type="button"
                  onClick={() => jumpToStep(5)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <p className="text-xs text-brand-charcoal">
                Selected:{' '}
                <strong>
                  {Object.entries(inventoryFlags)
                    .filter(([, v]) => v)
                    .map(([k]) => k)
                    .join(', ') || 'Standard move'}
                </strong>
              </p>
              {specialRequirements && (
                <p className="text-xs text-brand-charcoal-muted">
                  Notes: {specialRequirements}
                </p>
              )}
              <p className="text-xs font-semibold text-brand-navy">
                Attached Photos: {photos.length}
              </p>
            </div>

            {/* Contact Info */}
            <div className="rounded-2xl bg-brand-surface-grey p-4 border border-brand-surface-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold uppercase text-brand-charcoal-subtle">
                  6. Customer Contact Details
                </span>
                <button
                  type="button"
                  onClick={() => jumpToStep(6)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <p className="font-heading text-sm font-bold text-brand-navy">{fullName}</p>
              <p className="text-xs text-brand-charcoal">
                {phone} • {email}
              </p>
              <p className="text-xs text-brand-charcoal-muted capitalize">
                Preferred Contact: {preferredContact}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 8: SUBMITTED CONFIRMATION RECEIPT */}
      {currentStep === 8 && submissionResult && (
        <Card
          variant="default"
          padding="lg"
          className="border-t-4 border-t-emerald-500 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-surface-border pb-5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <Badge variant="success">Step 8 of 8 — Quote Request Submitted</Badge>
                <h2 className="font-heading text-heading-2 text-brand-navy mt-1">
                  Your Moving Quote Request Has Been Received!
                </h2>
              </div>
            </div>
            <div className="rounded-xl bg-brand-navy px-4 py-2.5 text-white">
              <span className="text-[10px] uppercase tracking-wider text-brand-navy-200 block">
                Official Reference Number
              </span>
              <span className="font-mono text-base font-bold text-brand-orange">
                {submissionResult.referenceCode}
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-brand-charcoal-muted leading-relaxed">
            Thank you, <strong>{fullName}</strong>. Your moving request from{' '}
            <strong>{pickupCity}</strong> to <strong>{destinationCity}</strong> for{' '}
            <strong>{preferredDate}</strong> has been saved in the QuickMove Solutions CRM and
            assigned reference code{' '}
            <span className="font-mono font-bold text-brand-navy">
              {submissionResult.referenceCode}
            </span>
            .
          </p>

          <div className="rounded-2xl bg-brand-surface-grey p-5 border border-brand-surface-border space-y-3 text-xs sm:text-sm">
            <h3 className="font-heading text-sm font-bold text-brand-navy">
              What Happens Next?
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5 text-brand-charcoal">
              <li>
                Our Calgary dispatch and estimating team reviews your property size, access details,
                and inventory notes.
              </li>
              <li>
                We prepare an itemized written quotation and contact you via your preferred method (
                <strong>{preferredContact}</strong>).
              </li>
              <li>
                Once you review and accept your quotation, our administrator confirms your booking
                and assigns your crew and truck.
              </li>
            </ol>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-xs sm:text-sm text-brand-charcoal-muted">
              Need immediate assistance? Call{' '}
              <a
                href={BUSINESS_INFO.phoneHref}
                className="font-heading font-bold text-brand-orange hover:underline"
              >
                {BUSINESS_INFO.phoneDisplay}
              </a>{' '}
              or email{' '}
              <a
                href={BUSINESS_INFO.emailHref}
                className="font-semibold text-brand-navy hover:underline"
              >
                {BUSINESS_INFO.email}
              </a>
              .
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/" variant="outline" size="md">
                Return to Homepage
              </Button>
              <Button
                href="/get-a-quote/junk-removal"
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Also Need Junk Removal?
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation Footer Controls (Steps 1 to 7) */}
      {currentStep < 8 && (
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#070C16]/90 px-4 py-3 text-xs sm:text-sm text-white/80">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#38BDF8]/20 text-[#38BDF8] font-bold">
              i
            </span>
            <span>
              Your progress is saved automatically. Complete all 8 steps for a custom itemized
              moving quote.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 shrink-0">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3.5 font-heading text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}

            {currentStep < 7 ? (
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
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="qm-orange-pill inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-heading text-sm sm:text-base font-extrabold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Moving Quote'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

