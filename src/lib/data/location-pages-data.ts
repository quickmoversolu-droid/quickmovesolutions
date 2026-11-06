import { AccordionItemData } from '@/components/ui/Accordion';

export interface LocationPageDetail {
  slug: string;
  city: string;
  province: string;
  isPrimaryMarket: boolean;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heroHeadline: string;
  heroHighlight: string;
  heroDescription: string;
  corridorBadge: string;
  overviewTitle: string;
  overviewParagraphs: string[];
  localLogisticsTitle: string;
  localLogisticsCards: {
    title: string;
    description: string;
    highlights: string[];
  }[];
  junkRemovalSpotlight: {
    title: string;
    description: string;
    commonRequests: string[];
  };
  corridorNotes: string;
  faqs: AccordionItemData[];
}

/**
 * UNIQUE LOCATION SEO CONTENT (Section 14.2 of KNOWLEDGE.md)
 * Every city has distinct, non-duplicated content reflecting real local geography,
 * housing styles, and highway corridors. Never invents false physical branch addresses.
 */
export const LOCATION_PAGES_DATA: Record<string, LocationPageDetail> = {
  'moving-company-calgary': {
    slug: 'moving-company-calgary',
    city: 'Calgary',
    province: 'Alberta',
    isPrimaryMarket: true,
    metaTitle: 'Moving Company & Junk Removal in Calgary, AB | QuickMove Solutions',
    metaDescription:
      'QuickMove Solutions is based in Calgary, AB—offering residential moving, commercial moving, furniture delivery, packing, and photo-first junk removal across all four quadrants.',
    eyebrow: 'Primary Headquarters Market • Calgary, AB',
    heroHeadline: 'Trusted Moving, Delivery & Full Junk Removal Across',
    heroHighlight: 'All Four Quadrants of Calgary.',
    heroDescription:
      'Calgary is home base for QuickMove Solutions. From Beltline and Downtown high-rise condos to inner-city infills in Kensington and Marda Loop or family homes along Stoney Trail, our crews help Calgarians relocate and clear space with ease.',
    corridorBadge: 'NW • NE • SW • SE Calgary Coverage',
    overviewTitle: 'Built for Calgary’s Distinct Neighbourhoods & Property Types',
    overviewParagraphs: [
      'Moving within Calgary requires practical planning for diverse property layouts. High-density towers in the Beltline, East Village, Mission, and Eau Claire require strict freight elevator coordination and underground parkade height awareness. Inner-city communities like Mount Royal, Killarney, Bridgeland, and Altadore feature multi-level infills with narrow staircases and tight rear-lane access.',
      'Meanwhile, growing family communities across NW, NE, SW, and SE Calgary—linked by Deerfoot Trail, Crowchild Trail, Glenmore Trail, and the Stoney Trail ring road—call for well-organized multi-bedroom house loading, careful floor runners during snowy or Chinook weather, and coordinated possession-day scheduling.',
    ],
    localLogisticsTitle: 'How We Serve Every Corner of Calgary',
    localLogisticsCards: [
      {
        title: 'Downtown, Beltline & High-Rise Condo Moves',
        description:
          'Structured staging to get your furniture and boxes loaded within strict 2-to-3 hour condo elevator reservation windows.',
        highlights: [
          'Loading dock & service elevator coordination',
          'Long-corridor dollies for tower floor transfers',
          'Careful protection for lobby doors and elevator cabs',
        ],
      },
      {
        title: 'NW, NE, SW & SE Suburban Family Home Relocations',
        description:
          'Complete household moving for townhouses, duplexes, and multi-bedroom detached homes across Calgary.',
        highlights: [
          'Staircase, railing & hardwood floor protection',
          'Full basement, garage & patio furniture loading',
          'Optional packing & unpacking assistance',
        ],
      },
      {
        title: 'Calgary Commercial, Office & Retail Moves',
        description:
          'Organized relocations for offices, clinics, studios, and businesses in Downtown, Foothills, Manchester, and suburban centres.',
        highlights: [
          'Workstation, desk, chair & boardroom transport',
          'Itemized written quotations for business approval',
          'Combined office relocation + old furniture junk removal',
        ],
      },
    ],
    junkRemovalSpotlight: {
      title: 'Photo-First Junk Removal Across Calgary',
      description:
        'Preparing a Calgary home for sale, clearing out a basement or double garage, or replacing old furniture? Upload photos from your phone and let our Calgary crew handle the heavy lifting.',
      commonRequests: [
        'Old sofa, sectional & mattress removal from condos and houses',
        'Garage, basement & storage locker cleanouts',
        'Rental turnover & pre-listing property cleanouts',
        'Appliance & office furniture removal',
      ],
    },
    corridorNotes:
      'As our primary market in Calgary, Alberta, we coordinate both local quadrant-to-quadrant moves and regional relocations connecting Calgary with Airdrie, Strathmore, Red Deer, and Edmonton.',
    faqs: [
      {
        id: 'yyc-faq-1',
        question: 'Do you cover all four quadrants of Calgary (NW, NE, SW, SE)?',
        answer:
          'Yes. Calgary is our primary market, and we serve residential and commercial customers across all NW, NE, SW, and SE neighbourhoods as well as Downtown and inner-city communities.',
      },
      {
        id: 'yyc-faq-2',
        question: 'How do you handle winter or Chinook weather during a Calgary move?',
        answer:
          'Calgary weather can shift quickly. Our crews use protective blankets, stretch wrap, and floor protection at entrances to help keep moisture, slush, and grit off your floors and furniture.',
      },
      {
        id: 'yyc-faq-3',
        question: 'Can I book both a Calgary move and junk removal for the items I am leaving behind?',
        answer:
          'Yes! Many Calgary homeowners and tenants schedule junk removal before moving day—or immediately after—so unwanted furniture, mattresses, and garage clutter are cleared smoothly.',
      },
    ],
  },

  'moving-company-airdrie': {
    slug: 'moving-company-airdrie',
    city: 'Airdrie',
    province: 'Alberta',
    isPrimaryMarket: false,
    metaTitle: 'Moving Company & Junk Removal Serving Airdrie, AB | QuickMove Solutions',
    metaDescription:
      'Residential moving, commercial moving, furniture delivery, and photo-first junk removal serving Airdrie, Alberta and the Calgary–Airdrie QEII corridor.',
    eyebrow: 'Active Service Area • North Calgary / QEII Corridor',
    heroHeadline: 'Reliable Moving, Delivery & Junk Removal',
    heroHighlight: 'Serving Airdrie, Alberta.',
    heroDescription:
      'Whether you are moving between Calgary and Airdrie along the QEII corridor, relocating within an Airdrie neighbourhood, or clearing out a garage or basement, QuickMove Solutions provides responsive service from our Calgary dispatch hub.',
    corridorBadge: 'Calgary ↔ Airdrie & Local Airdrie Service Area',
    overviewTitle: 'Seamless Relocations for Growing Airdrie Families & Businesses',
    overviewParagraphs: [
      'Just north of Calgary along Highway 2, Airdrie has grown into one of Alberta’s most active residential markets. Families frequently relocate from Calgary apartments or townhomes into larger multi-bedroom houses in Airdrie communities, or move locally between neighbourhoods as their household needs change.',
      'QuickMove Solutions serves Airdrie as a core regional service area. We coordinate local Airdrie moves, Calgary-to-Airdrie and Airdrie-to-Calgary relocations, large-item furniture deliveries from Calgary showrooms to Airdrie homes, and full photo-first junk removal.',
    ],
    localLogisticsTitle: 'Moving & Cleanout Services Available in Airdrie',
    localLogisticsCards: [
      {
        title: 'Calgary ↔ Airdrie Commuter Corridor Moves',
        description:
          'Direct single-day household relocations connecting Calgary and Airdrie via the QEII highway.',
        highlights: [
          'Coordinated loading in Calgary and same-day placement in Airdrie (or vice versa)',
          'Full protection for multi-bedroom family home furniture',
          'Clear arrival windows and direct dispatch communication',
        ],
      },
      {
        title: 'Local Airdrie Residential & Townhouse Moves',
        description:
          'Moving within Airdrie neighbourhoods—from starter condos and townhouses to detached two-storey homes.',
        highlights: [
          'Careful handling of split-entry stairs and basement developments',
          'Appliance, bedroom, living room & garage item moving',
          'Optional packing and unpacking support',
        ],
      },
      {
        title: 'Showroom-to-Airdrie Furniture Delivery',
        description:
          'Bought furniture or appliances in Calgary or CrossIron/regional retail centres? We deliver to Airdrie.',
        highlights: [
          'Pickup from retail warehouses or private sellers',
          'Blanket-wrapped transport and indoor room placement',
          'Optional haul-away of the old sofa or mattress being replaced',
        ],
      },
    ],
    junkRemovalSpotlight: {
      title: 'Garage, Basement & Move-Out Junk Removal in Airdrie',
      description:
        'Skip the trip to the transfer site. Upload photos of your unwanted furniture, appliances, or garage clutter in Airdrie and receive a clear written estimate.',
      commonRequests: [
        'Basement & double-garage decluttering for Airdrie homeowners',
        'Pre-move and post-move property cleanouts',
        'Old couch, mattress & broken appliance removal',
        'Commercial & small business workspace junk removal',
      ],
    },
    corridorNotes:
      'Airdrie is served directly as an active service area from our primary Calgary headquarters—no hidden branch markups, just straightforward scheduling and written quotations.',
    faqs: [
      {
        id: 'air-faq-1',
        question: 'Is a move between Calgary and Airdrie considered local or long-distance?',
        answer:
          'Because Airdrie sits immediately north of Calgary on the QEII corridor, moves between Calgary and Airdrie are routinely completed in a single coordinated day. Submit your pickup and destination addresses in our Visual Moving Quote wizard for an exact itemized quotation.',
      },
      {
        id: 'air-faq-2',
        question: 'Can I use the Photo-First Junk Removal quote for an Airdrie property?',
        answer:
          'Yes! Select your item categories, upload photos from your phone, and enter your Airdrie pickup address to receive a reviewed estimate.',
      },
      {
        id: 'air-faq-3',
        question: 'Do you deliver furniture from Calgary stores to Airdrie homes?',
        answer:
          'Yes. Our Delivery Services regularly transport sofas, dining sets, and appliances from Calgary retailers or private sellers directly into Airdrie residences.',
      },
    ],
  },

  'moving-company-strathmore': {
    slug: 'moving-company-strathmore',
    city: 'Strathmore',
    province: 'Alberta',
    isPrimaryMarket: false,
    metaTitle: 'Moving Company & Junk Removal Serving Strathmore, AB | QuickMove Solutions',
    metaDescription:
      'Dependable residential moving, commercial moving, furniture delivery, and full junk removal serving Strathmore, Alberta and the East Highway 1 corridor.',
    eyebrow: 'Active Service Area • East Trans-Canada (Hwy 1) Corridor',
    heroHeadline: 'Professional Moving, Delivery & Cleanouts',
    heroHighlight: 'Serving Strathmore, Alberta.',
    heroDescription:
      'Located east of Calgary along the Trans-Canada Highway, Strathmore homeowners, renters, and property owners rely on organized scheduling for local moves, Calgary–Strathmore relocations, and full property cleanouts.',
    corridorBadge: 'Calgary ↔ Strathmore & Highway 1 Corridor',
    overviewTitle: 'Dedicated Moving & Junk Removal Coverage for Strathmore',
    overviewParagraphs: [
      'Moving in or out of Strathmore often involves larger single-family lots, spacious garages, basement storage areas, or transitions between Strathmore and eastern Calgary communities. Having a moving crew that plans ahead for highway transit times, driveway access, and full-property inventory makes all the difference.',
      'QuickMove Solutions serves Strathmore as an official regional service area. Whether you are moving your household, scheduling a large furniture delivery from Calgary, or clearing out a garage, shed, or rental property, our team delivers clear written quotations and dependable service.',
    ],
    localLogisticsTitle: 'How We Support Strathmore Moves & Cleanouts',
    localLogisticsCards: [
      {
        title: 'Household Moves In & Around Strathmore',
        description:
          'Complete residential moving for bungalows, two-storey houses, townhouses, and apartments.',
        highlights: [
          'Careful furniture wrapping and secure Highway 1 load strapping',
          'Full house, basement & garage relocation support',
          'Moves within Strathmore or between Strathmore and Calgary',
        ],
      },
      {
        title: 'Property, Garage & Shed Junk Cleanouts',
        description:
          'Full-service junk removal for accumulated household clutter, old furniture, and move-out cleanouts.',
        highlights: [
          'Photo-first estimate flow—upload photos from your phone',
          'Indoor and outdoor collection of approved non-hazardous items',
          'Ideal for downsizing, estate preparation, and rental turnovers',
        ],
      },
      {
        title: 'Scheduled Furniture & Appliance Delivery',
        description:
          'Transporting bulky purchases between Calgary retailers and Strathmore residences or businesses.',
        highlights: [
          'Coordinated pickup and scheduled Strathmore drop-off window',
          'Two-person+ carry-in and room placement',
          'Optional removal of old furniture being replaced',
        ],
      },
    ],
    junkRemovalSpotlight: {
      title: 'Full Junk Removal Serving Strathmore Properties',
      description:
        'Clearing out a basement, garage, or rental unit in Strathmore? Send photos through our Photo-First Junk Removal experience and let our crew handle all the loading.',
      commonRequests: [
        'Furniture, couch, recliner & mattress removal',
        'Appliance & electronics hauling',
        'Garage, basement & storage cleanouts',
        'Pre-sale and move-out property cleanouts',
      ],
    },
    corridorNotes:
      'Strathmore is served as a dedicated regional service area from our Calgary operations base along the Trans-Canada Highway (Hwy 1) corridor.',
    faqs: [
      {
        id: 'str-faq-1',
        question: 'How far in advance should I request a quote for a Strathmore move or cleanout?',
        answer:
          'We recommend submitting your quote request as early as possible once you know your target moving or cleanout date, especially for month-end or weekend windows, so our dispatch team can reserve crew and truck availability.',
      },
      {
        id: 'str-faq-2',
        question: 'Can you move a household from Strathmore to Calgary, Airdrie, Red Deer, or Edmonton?',
        answer:
          'Yes. Because we cover Calgary, Airdrie, Strathmore, Red Deer, and Edmonton, we can coordinate relocations connecting Strathmore with any of our Alberta service areas.',
      },
      {
        id: 'str-faq-3',
        question: 'How do I get a junk removal estimate in Strathmore?',
        answer:
          'Use our online Photo-First Junk Removal wizard: choose your item categories, upload photos from your phone, select an approximate load volume, and enter your Strathmore address.',
      },
    ],
  },

  'moving-company-red-deer': {
    slug: 'moving-company-red-deer',
    city: 'Red Deer',
    province: 'Alberta',
    isPrimaryMarket: false,
    metaTitle: 'Moving Company & Relocation Serving Red Deer, AB | QuickMove Solutions',
    metaDescription:
      'Coordinated residential moving, commercial moving, packing, and junk removal serving Red Deer, Alberta and the Central Alberta QEII corridor.',
    eyebrow: 'Active Service Area • Central Alberta / QEII Hub',
    heroHeadline: 'Coordinated Moving & Space Clearing',
    heroHighlight: 'Serving Red Deer & Central Alberta.',
    heroDescription:
      'Positioned at the midpoint between Calgary and Edmonton along Highway 2, Red Deer is a vital corridor for residential and commercial relocations. QuickMove Solutions provides structured inter-city and regional moving support for Red Deer customers.',
    corridorBadge: 'Central Alberta & Highway 2 Corridor',
    overviewTitle: 'Dependable Highway-Ready Moving for Red Deer & Area',
    overviewParagraphs: [
      'Relocating to or from Red Deer—whether connecting with Calgary to the south or Edmonton to the north—requires careful load balancing, thorough furniture padding, and punctual highway scheduling. A poorly packed truck over a 150-kilometre highway trip risks shifting and damage.',
      'QuickMove Solutions prepares every Red Deer move with highway-grade transit protection, clear itemized written quotations, and coordinated arrival windows so your household or commercial transition runs smoothly.',
    ],
    localLogisticsTitle: 'Services Available for Red Deer Customers',
    localLogisticsCards: [
      {
        title: 'Calgary ↔ Red Deer & Edmonton ↔ Red Deer Moves',
        description:
          'Dedicated inter-city residential and commercial relocations along the QEII corridor.',
        highlights: [
          'Full apartment, townhouse & detached family home relocations',
          'Multi-point tie-down securing and blanket wrapping for highway transit',
          'Coordinated pickup and delivery scheduling',
        ],
      },
      {
        title: 'Packing, Wrapping & Move Preparation',
        description:
          'Protect fragile kitchenware, electronics, and furniture before your Central Alberta move.',
        highlights: [
          'Full or partial household packing options',
          'Mattress, sofa & wood furniture protective wrapping',
          'Unpacking and room staging at your destination',
        ],
      },
      {
        title: 'Pre-Move & Move-Out Junk Removal',
        description:
          'Downsize unwanted furniture and clutter before paying to move it across the province.',
        highlights: [
          'Photo-first estimate—upload photos of items to be cleared',
          'Furniture, appliance, basement & garage cleanouts',
          'Combined moving + junk removal quotes available',
        ],
      },
    ],
    junkRemovalSpotlight: {
      title: 'Downsize Before Your Move with Photo-First Junk Removal',
      description:
        'Planning a move into or out of Red Deer? Send photos of the furniture, appliances, or garage clutter you don’t want to bring along, and we will prepare a clear removal estimate.',
      commonRequests: [
        'Pre-relocation downsizing of heavy old furniture',
        'Move-out property and garage cleanouts',
        'Mattress, sofa & appliance disposal',
        'Commercial workspace & office cleanouts',
      ],
    },
    corridorNotes:
      'Red Deer is served as an official regional service area connecting Calgary, Central Alberta, and Edmonton along the Highway 2 corridor.',
    faqs: [
      {
        id: 'rd-faq-1',
        question: 'Can you handle a full family home move between Calgary and Red Deer?',
        answer:
          'Yes. Our Visual Moving Quote wizard allows you to enter your exact origin and destination addresses, select your home size (up to 5+ bedrooms), and specify inventory details for an itemized quotation.',
      },
      {
        id: 'rd-faq-2',
        question: 'How are items protected during the highway drive to or from Red Deer?',
        answer:
          'Every piece of furniture is padded with moving blankets and stretch-wrapped where needed, and loads are tiered and strapped securely inside the truck before entering the highway.',
      },
      {
        id: 'rd-faq-3',
        question: 'How is a Red Deer move confirmed?',
        answer:
          'After you submit your quote request, our administrator prepares an itemized written quotation. Once you accept the quote and our team confirms crew and truck availability, your booking is officially confirmed.',
      },
    ],
  },

  'moving-company-edmonton': {
    slug: 'moving-company-edmonton',
    city: 'Edmonton',
    province: 'Alberta',
    isPrimaryMarket: false,
    metaTitle: 'Calgary to Edmonton Moving & Relocation Services | QuickMove Solutions',
    metaDescription:
      'Structured residential and commercial moving between Calgary and Edmonton, Alberta. Get an itemized written quote with QuickMove Solutions.',
    eyebrow: 'Active Service Area • Calgary ↔ Edmonton Corridor',
    heroHeadline: 'Structured Inter-City Moving & Relocations',
    heroHighlight: 'Serving Edmonton & the QEII Corridor.',
    heroDescription:
      'Moving between Calgary and Edmonton is one of Western Canada’s busiest relocation routes. QuickMove Solutions delivers organized city-to-city household and commercial moves with clear scheduling, careful load preparation, and transparent written quotations.',
    corridorBadge: 'Calgary ↔ Edmonton Inter-City Corridor',
    overviewTitle: 'Making the 300 km Calgary–Edmonton Move Predictable & Stress-Free',
    overviewParagraphs: [
      'A move between Calgary and Edmonton involves roughly 300 kilometres of highway travel plus loading and unloading at two different properties. Without disciplined planning, elevator windows can be missed, boxes can shift in transit, and families can be left waiting without clear arrival updates.',
      'QuickMove Solutions treats every Edmonton corridor relocation as a coordinated logistics project. We review your origin and destination access (whether a Downtown Edmonton condo, a Southside family home near Anthony Henday Drive, or a commercial workspace), verify inventory volume, and assign the proper crew and truck configuration.',
    ],
    localLogisticsTitle: 'Edmonton Corridor Relocation Capabilities',
    localLogisticsCards: [
      {
        title: 'Calgary → Edmonton & Edmonton → Calgary Home Moves',
        description:
          'Complete household relocations for apartments, condos, townhouses, and multi-bedroom homes.',
        highlights: [
          'Highway-grade furniture padding, wrapping & load strapping',
          'Clear pickup window and destination arrival coordination',
          'Room-by-room unloading and furniture placement',
        ],
      },
      {
        title: 'Commercial, Office & Employee Relocations',
        description:
          'Relocating business assets, office furniture, or transferring employees between Calgary and Edmonton.',
        highlights: [
          'Formal itemized PDF quotations for corporate or personal reimbursement',
          'Organized labeling of workstations, electronics & boxes',
          'Dedicated dispatch communication from start to finish',
        ],
      },
      {
        title: 'Full Packing & Pre-Move Junk Removal Add-Ons',
        description:
          'Prepare your household for the highway trip and leave unwanted clutter behind.',
        highlights: [
          'Fragile kitchen & full-home packing assistance',
          'Photo-first junk removal to clear old furniture before moving day',
          'One unified team managing your preparation and relocation',
        ],
      },
    ],
    junkRemovalSpotlight: {
      title: 'Don’t Pay to Move Unwanted Junk 300 Kilometres',
      description:
        'Before moving between Calgary and Edmonton, use our Photo-First Junk Removal experience to clear out old sofas, mattresses, broken appliances, and garage clutter so only the items you want make the trip.',
      commonRequests: [
        'Pre-move furniture, mattress & appliance removal',
        'Move-out basement, garage & storage locker cleanouts',
        'Property turnover cleanouts for sellers and tenants',
        'Office furniture clearance prior to relocation',
      ],
    },
    corridorNotes:
      'Edmonton is served as an official regional service area for coordinated moves and cleanouts along the Calgary–Red Deer–Edmonton corridor.',
    faqs: [
      {
        id: 'yeg-faq-1',
        question: 'Do you handle both Calgary-to-Edmonton and Edmonton-to-Calgary moves?',
        answer:
          'Yes. We coordinate relocations in both directions along the Calgary–Edmonton corridor for residential and commercial customers.',
      },
      {
        id: 'yeg-faq-2',
        question: 'Can I upload photos of my furniture or special items when requesting an Edmonton moving quote?',
        answer:
          'Yes! Step 5 of our Visual Moving Quote wizard allows optional photo uploads so our team can inspect large furniture, tight staircases, or specialty items when preparing your quotation.',
      },
      {
        id: 'yeg-faq-3',
        question: 'Will I receive a written itemized quotation before confirming my Edmonton move?',
        answer:
          'Always. Every move is backed by an itemized written quotation detailing labour, vehicle, any requested packing or junk removal services, and applicable taxes.',
      },
    ],
  },
};

