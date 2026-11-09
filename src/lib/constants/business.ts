/**
 * QUICKMOVE SOLUTIONS — OFFICIAL BUSINESS CONSTANTS
 * Master Source of Truth per KNOWLEDGE.md Part 2, Part 3, and Part 5.
 * Never invent contact details, physical branch addresses, prices, or ratings.
 */

const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || '').trim();
// Strictly enforce canonical .ca domain (guard against old .com set in legacy Vercel env variables)
const RAW_SITE_URL =
  envUrl && !envUrl.includes('quickmovesolution.com')
    ? envUrl
    : 'https://www.quickmovesolution.ca';

const NORMALIZED_SITE_URL = RAW_SITE_URL.endsWith('/')
  ? RAW_SITE_URL
  : `${RAW_SITE_URL}/`;

export const BUSINESS_INFO = {
  name: 'QuickMove Solutions',
  tagline: 'Moving Made Easy. Space Made Clear.',
  website: NORMALIZED_SITE_URL,
  domain: 'quickmovesolution.ca',
  phoneDisplay: '(587) 999-9565',
  phoneE164: '+15879999565',
  phoneHref: 'tel:+15879999565',
  email: 'quickmoversolu@gmail.com',
  emailHref: 'mailto:quickmoversolu@gmail.com',
  primaryLocation: 'Calgary, Alberta, Canada',
  primaryCity: 'Calgary',
  province: 'Alberta',
  country: 'Canada',
  timezone: 'America/Edmonton',
  socials: {
    facebook: 'https://www.facebook.com/quickmovesolutions',
    instagram: 'https://www.instagram.com/quickmoverssolution/',
  },
  googleBusinessSearchUrl: 'https://www.google.com/search?q=quickmove+solutions',
} as const;

export const BUSINESS_CONSTANTS = BUSINESS_INFO;

export const BRAND_COLORS = {
  black: {
    name: 'Obsidian Black',
    hex: '#05080D',
    role: 'Deep dashboard backdrops, navigation bars, and luxury high-contrast frames',
  },
  navy: {
    name: 'Brand Navy',
    hex: '#101D35',
    role: 'Main brand colour — headers, hero backgrounds, primary headings, trust panels',
  },
  orange: {
    name: 'Action Orange',
    hex: '#F47732',
    role: 'Primary CTA buttons, interactive highlights, progress indicators, key badges',
  },
  white: {
    name: 'Pure White',
    hex: '#FFFFFF',
    role: 'Main page background, elevated cards, clean breathing room',
  },
  lightGrey: {
    name: 'Surface Light Grey',
    hex: '#F4F6F8',
    role: 'Alternate section backgrounds, form surfaces, subtle borders',
  },
  charcoal: {
    name: 'Body Charcoal',
    hex: '#222A35',
    role: 'Primary body typography and high-contrast readable content',
  },
} as const;

export interface ServiceItem {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  href: string;
  category: 'moving' | 'junk-removal' | 'delivery' | 'packing';
  tagline: string;
  description: string;
  highlights: string[];
  quoteHref: string;
}

export const OFFICIAL_SERVICES: ServiceItem[] = [
  {
    id: 'residential-moving',
    name: 'Residential Moving',
    shortName: 'Residential',
    slug: 'residential-moving',
    href: '/residential-moving',
    category: 'moving',
    tagline: 'Careful, organized household moves for apartments, condos, townhouses, and family homes.',
    description:
      'From studio apartments and high-rise condos to multi-bedroom family houses, our team handles residential relocations with careful protection, clear scheduling, and respectful service.',
    highlights: [
      'Apartment & condo moves (elevator booking support)',
      'House & townhouse relocations',
      'Furniture wrapping & floor protection',
      'Small & larger household moves',
    ],
    quoteHref: '/get-a-quote?service=residential-moving',
  },
  {
    id: 'commercial-moving',
    name: 'Commercial Moving',
    shortName: 'Commercial',
    slug: 'commercial-moving',
    href: '/commercial-moving',
    category: 'moving',
    tagline: 'Structured office, workspace, and commercial equipment relocations.',
    description:
      'Minimize operational downtime with organized commercial moving for offices, retail spaces, workstations, commercial furniture, and business equipment.',
    highlights: [
      'Office & workspace relocations',
      'Commercial furniture & workstation moving',
      'Small business relocations',
      'Equipment transportation & coordinated scheduling',
    ],
    quoteHref: '/get-a-quote?service=commercial-moving',
  },
  {
    id: 'local-moving',
    name: 'Local Moving',
    shortName: 'Local Moving',
    slug: 'local-moving',
    href: '/local-moving',
    category: 'moving',
    tagline: 'Dependable moving across Calgary neighbourhoods and surrounding communities.',
    description:
      'Whether you are moving across the street or across Calgary and nearby communities, we provide responsive local moving tailored to your property access and timeline.',
    highlights: [
      'All Calgary quadrants (NW, NE, SW, SE)',
      'Surrounding communities including Airdrie & Strathmore',
      'Clear arrival windows & access planning',
      'Careful loading, transport & placement',
    ],
    quoteHref: '/get-a-quote?service=local-moving',
  },
  {
    id: 'long-distance-moving',
    name: 'Long-Distance Moving',
    shortName: 'Long-Distance',
    slug: 'long-distance-moving',
    href: '/long-distance-moving',
    category: 'moving',
    tagline: 'Coordinated city-to-city relocations across Alberta and confirmed destinations.',
    description:
      'Planning a move between Calgary, Red Deer, Edmonton, or other confirmed destinations? We coordinate secure loading, transport scheduling, and clear communication throughout your relocation.',
    highlights: [
      'Calgary to Red Deer & Edmonton corridors',
      'Dedicated load preparation & secure tie-downs',
      'Clear pickup & delivery coordination',
      'Residential & commercial inter-city moves',
    ],
    quoteHref: '/get-a-quote?service=long-distance-moving',
  },
  {
    id: 'packing-unpacking',
    name: 'Packing & Unpacking',
    shortName: 'Packing & Unpacking',
    slug: 'packing-unpacking',
    href: '/packing-unpacking',
    category: 'packing',
    tagline: 'Professional packing assistance, furniture protection, and unpacking support.',
    description:
      'Save hours of preparation before moving day. We help wrap fragile belongings, prepare household rooms, protect furniture, and unpack at your new property.',
    highlights: [
      'Full or partial household packing assistance',
      'Fragile item & kitchen preparation',
      'Furniture wrapping & protective padding',
      'Unpacking & box organization at destination',
    ],
    quoteHref: '/get-a-quote?service=packing-unpacking',
  },
  {
    id: 'delivery-services',
    name: 'Delivery Services',
    shortName: 'Delivery',
    slug: 'delivery-services',
    href: '/delivery-services',
    category: 'delivery',
    tagline: 'Reliable pickup, transport, and drop-off for furniture, appliances, and large items.',
    description:
      'Need a heavy sofa, dining set, appliance, or business order picked up and delivered safely? Our delivery service handles large household and commercial items without the hassle.',
    highlights: [
      'Store-to-home & private-sale furniture delivery',
      'Large household item & appliance transportation',
      'Business & commercial deliveries',
      'Scheduled pickup & room-of-choice drop-off',
    ],
    quoteHref: '/get-a-quote?service=delivery-services',
  },
  {
    id: 'junk-removal',
    name: 'Full Junk Removal',
    shortName: 'Junk Removal',
    slug: 'junk-removal',
    href: '/junk-removal',
    category: 'junk-removal',
    tagline: 'Complete residential and commercial junk removal — send photos for a fast estimate.',
    description:
      'Junk removal is a complete standalone service line at QuickMove Solutions. Whether clearing out a single sofa or mattress, cleaning out a garage or basement, or preparing a property for move-out, we do the heavy lifting.',
    highlights: [
      'Furniture, sofa, mattress & appliance removal',
      'Garage, basement & storage unit cleanouts',
      'Move-out, rental turnover & property cleanouts',
      'Office & commercial junk removal',
    ],
    quoteHref: '/get-a-quote?service=junk-removal',
  },
];

export interface ServiceAreaItem {
  id: string;
  city: string;
  province: string;
  slug: string;
  href: string;
  isPrimaryMarket: boolean;
  summary: string;
}

export const SERVICE_AREAS: ServiceAreaItem[] = [
  {
    id: 'calgary',
    city: 'Calgary',
    province: 'AB',
    slug: 'moving-company-calgary',
    href: '/moving-company-calgary',
    isPrimaryMarket: true,
    summary: 'Primary market headquarters serving all Calgary quadrants for residential moving, commercial relocation, delivery, and junk removal.',
  },
  {
    id: 'airdrie',
    city: 'Airdrie',
    province: 'AB',
    slug: 'moving-company-airdrie',
    href: '/moving-company-airdrie',
    isPrimaryMarket: false,
    summary: 'Local and commuter corridor moving, furniture delivery, and household cleanouts across Airdrie neighbourhoods.',
  },
  {
    id: 'strathmore',
    city: 'Strathmore',
    province: 'AB',
    slug: 'moving-company-strathmore',
    href: '/moving-company-strathmore',
    isPrimaryMarket: false,
    summary: 'Residential moves, rural/town property cleanouts, and scheduled deliveries serving Strathmore and eastern Calgary corridor.',
  },
  {
    id: 'red-deer',
    city: 'Red Deer',
    province: 'AB',
    slug: 'moving-company-red-deer',
    href: '/moving-company-red-deer',
    isPrimaryMarket: false,
    summary: 'Central Alberta relocations, Highway 2 corridor moves, commercial transport, and property cleanout support.',
  },
  {
    id: 'edmonton',
    city: 'Edmonton',
    province: 'AB',
    slug: 'moving-company-edmonton',
    href: '/moving-company-edmonton',
    isPrimaryMarket: false,
    summary: 'Coordinated Calgary–Edmonton long-distance relocations, residential moves, and commercial transport services.',
  },
];

export const MAIN_NAVIGATION = [
  { label: 'Home', href: '/' },
  {
    label: 'Moving Services',
    href: '/moving-services',
    children: [
      { label: 'All Moving Services', href: '/moving-services', description: 'Complete overview of our relocation solutions' },
      { label: 'Residential Moving', href: '/residential-moving', description: 'Houses, condos, apartments & townhouses' },
      { label: 'Commercial Moving', href: '/commercial-moving', description: 'Offices, workspaces & business equipment' },
      { label: 'Local Moving', href: '/local-moving', description: 'Calgary & surrounding community moves' },
      { label: 'Long-Distance Moving', href: '/long-distance-moving', description: 'City-to-city moves across Alberta' },
      { label: 'Packing & Unpacking', href: '/packing-unpacking', description: 'Preparation, wrapping & unpacking assistance' },
    ],
  },
  { label: 'Junk Removal', href: '/junk-removal', badge: 'Photo Quote' },
  { label: 'Delivery', href: '/delivery-services' },
  {
    label: 'Service Areas',
    href: '/service-areas',
    children: [
      { label: 'All Service Areas', href: '/service-areas', description: 'Alberta regions we serve' },
      { label: 'Calgary (Primary)', href: '/moving-company-calgary', description: 'Primary service market across all quadrants' },
      { label: 'Airdrie', href: '/moving-company-airdrie', description: 'Residential & commercial moves in Airdrie' },
      { label: 'Strathmore', href: '/moving-company-strathmore', description: 'Moving, delivery & junk removal in Strathmore' },
      { label: 'Red Deer', href: '/moving-company-red-deer', description: 'Central Alberta & Highway 2 corridor moves' },
      { label: 'Edmonton', href: '/moving-company-edmonton', description: 'Calgary–Edmonton relocations & moving support' },
    ],
  },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact', href: '/contact' },
] as const;

export const JUNK_REMOVAL_DISCLAIMER =
  'QuickMove Solutions removes approved household, office, and property items. We do not collect hazardous waste, asbestos, medical waste, chemicals, pressurized tanks, or regulated materials without verified authorization and appropriate disposal arrangements.';

