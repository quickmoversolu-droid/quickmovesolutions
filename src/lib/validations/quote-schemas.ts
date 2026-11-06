import { z } from 'zod';

export const UploadedPhotoInputSchema = z.object({
  id: z.string(),
  storageKey: z.string().optional(),
  dataUrl: z.string().optional(),
  originalFilename: z.string().min(1),
  mimeType: z.string().min(1),
  fileSizeBytes: z.number().nonnegative(),
  caption: z.string().max(300).optional().default(''),
});

export const CustomerContactSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name').max(120),
  phone: z
    .string()
    .min(7, 'Please enter a valid phone number')
    .max(30),
  email: z.string().email('Please enter a valid email address').max(160),
  preferredContact: z.enum(['phone', 'email', 'text']).default('phone'),
});

/**
 * 1. VISUAL MOVING QUOTE SCHEMA (Part 7.1 of KNOWLEDGE.md — 8 Steps)
 */
export const VisualMovingQuoteSchema = z.object({
  flowType: z.literal('moving'),
  honeypot: z.string().max(0).optional(),
  // Step 1: Moving service
  movingServiceType: z.enum([
    'residential',
    'apartment',
    'house',
    'commercial',
    'local',
    'long-distance',
    'other',
  ]),
  // Step 2: Pickup and destination
  pickupAddress: z.string().min(3, 'Pickup address is required').max(240),
  pickupCity: z.string().min(2, 'Pickup city is required').max(100),
  pickupPostalCode: z.string().max(20).optional().default(''),
  pickupAccessDetails: z.string().max(500).optional().default(''),
  destinationAddress: z.string().min(3, 'Destination address is required').max(240),
  destinationCity: z.string().min(2, 'Destination city is required').max(100),
  destinationPostalCode: z.string().max(20).optional().default(''),
  destinationAccessDetails: z.string().max(500).optional().default(''),
  // Step 3: Moving date
  preferredDate: z.string().min(4, 'Preferred moving date is required'),
  isFlexibleDate: z.boolean().default(false),
  preferredTimeWindow: z.enum([
    'morning',
    'afternoon',
    'evening',
    'flexible',
  ]),
  // Step 4: Property size
  propertySize: z.enum([
    'studio',
    'one-bedroom',
    'two-bedroom',
    'three-bedroom',
    'four-bedroom',
    'five-plus-bedroom',
    'commercial-property',
    'not-sure',
  ]),
  // Step 5: Inventory and requirements
  inventoryFlags: z.object({
    furniture: z.boolean().default(false),
    appliances: z.boolean().default(false),
    largeItems: z.boolean().default(false),
    fragileItems: z.boolean().default(false),
    heavyItems: z.boolean().default(false),
    packing: z.boolean().default(false),
    unpacking: z.boolean().default(false),
    stairs: z.boolean().default(false),
    elevator: z.boolean().default(false),
    parking: z.boolean().default(false),
    longWalk: z.boolean().default(false),
    additionalStops: z.boolean().default(false),
  }),
  specialRequirements: z.string().max(1500).optional().default(''),
  photos: z.array(UploadedPhotoInputSchema).max(12).optional().default([]),
  // Step 6: Contact details
  customer: CustomerContactSchema,
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

/**
 * 2. PHOTO-FIRST JUNK REMOVAL QUOTE SCHEMA (Part 7.2 of KNOWLEDGE.md — 6 Steps)
 */
export const PhotoJunkQuoteSchema = z.object({
  flowType: z.literal('junk-removal'),
  honeypot: z.string().max(0).optional(),
  // Step 1: Select categories
  categories: z
    .array(
      z.enum([
        'furniture',
        'sofa',
        'mattress',
        'appliances',
        'electronics',
        'household-junk',
        'garage-clutter',
        'basement-clutter',
        'office-items',
        'property-cleanout',
        'other',
      ])
    )
    .min(1, 'Please select at least one junk category'),
  // Step 2: Upload photos
  photos: z.array(UploadedPhotoInputSchema).max(15).default([]),
  // Step 3: Approximate volume
  volumeEstimate: z.enum([
    'few-items',
    'small-load',
    'medium-load',
    'large-load',
    'full-cleanout',
    'not-sure',
  ]),
  // Step 4: Access details
  pickupAddress: z.string().min(3, 'Pickup address is required').max(240),
  pickupCity: z.string().min(2, 'Pickup city is required').max(100),
  pickupPostalCode: z.string().max(20).optional().default(''),
  propertyType: z.enum([
    'house',
    'apartment-condo',
    'townhouse',
    'office-commercial',
    'garage-storage',
    'other',
  ]),
  itemLocation: z.enum(['indoors', 'outdoors', 'both']),
  stairsOrElevator: z.enum(['ground-level', 'stairs', 'elevator', 'both']),
  parkingNotes: z.string().max(300).optional().default(''),
  accessConditions: z.string().max(500).optional().default(''),
  preferredDate: z.string().min(4, 'Preferred collection date is required'),
  additionalNotes: z.string().max(1500).optional().default(''),
  // Step 5: Customer details
  customer: CustomerContactSchema,
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

/**
 * 3. DELIVERY & COMMERCIAL ITEM TRANSPORT SCHEMA (Phase 4.C)
 */
export const DeliveryQuoteSchema = z.object({
  flowType: z.literal('delivery'),
  honeypot: z.string().max(0).optional(),
  deliveryType: z.enum([
    'store-to-home',
    'marketplace-pickup',
    'appliance-delivery',
    'commercial-b2b',
    'other-delivery',
  ]),
  pickupLocationName: z.string().max(160).optional().default(''),
  pickupAddress: z.string().min(3, 'Pickup address is required').max(240),
  pickupCity: z.string().min(2, 'Pickup city is required').max(100),
  destinationAddress: z.string().min(3, 'Drop-off address is required').max(240),
  destinationCity: z.string().min(2, 'Drop-off city is required').max(100),
  itemSummary: z.string().min(3, 'Please describe the items to be delivered').max(1000),
  removeOldItem: z.boolean().default(false),
  accessNotes: z.string().max(600).optional().default(''),
  preferredDate: z.string().min(4, 'Preferred delivery date is required'),
  preferredTimeWindow: z.enum(['morning', 'afternoon', 'evening', 'flexible']).default('flexible'),
  photos: z.array(UploadedPhotoInputSchema).max(10).optional().default([]),
  customer: CustomerContactSchema,
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

/**
 * 4. GENERAL CONTACT INQUIRY SCHEMA
 */
export const ContactQuoteSchema = z.object({
  flowType: z.literal('contact'),
  honeypot: z.string().max(0).optional(),
  serviceType: z.string().default('general'),
  pickupCity: z.string().default('Calgary'),
  notes: z.string().min(2, 'Message is required').max(2000),
  customer: CustomerContactSchema,
});

export const UnifiedQuoteSubmissionSchema = z.discriminatedUnion('flowType', [
  VisualMovingQuoteSchema,
  PhotoJunkQuoteSchema,
  DeliveryQuoteSchema,
  ContactQuoteSchema,
]);

export type VisualMovingQuoteInput = z.infer<typeof VisualMovingQuoteSchema>;
export type PhotoJunkQuoteInput = z.infer<typeof PhotoJunkQuoteSchema>;
export type DeliveryQuoteInput = z.infer<typeof DeliveryQuoteSchema>;
export type UnifiedQuoteSubmissionInput = z.infer<typeof UnifiedQuoteSubmissionSchema>;

