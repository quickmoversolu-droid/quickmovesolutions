import { AccordionItemData } from '@/components/ui/Accordion';

export interface ServiceScenario {
  title: string;
  description: string;
  bullets: string[];
}

export interface ServicePageDetail {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heroHeadline: string;
  heroHighlight: string;
  heroDescription: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  overviewTitle: string;
  overviewParagraphs: string[];
  scenariosTitle: string;
  scenarios: ServiceScenario[];
  checklistTitle: string;
  checklistSubtitle: string;
  operationalChecklist: string[];
  preparationTipsTitle: string;
  preparationTips: { title: string; detail: string }[];
  faqs: AccordionItemData[];
  relatedServices: { name: string; href: string; summary: string }[];
  isJunkRemoval?: boolean;
}

export const SERVICE_PAGES_DATA: Record<string, ServicePageDetail> = {
  'residential-moving': {
    slug: 'residential-moving',
    title: 'Residential Moving',
    metaTitle: 'Residential Moving in Calgary & Alberta | QuickMove Solutions',
    metaDescription:
      'Professional residential moving for apartments, condos, townhouses, and houses in Calgary, Airdrie, Strathmore, Red Deer, and Edmonton. Request a free visual moving quote.',
    eyebrow: 'Residential Relocation Specialists',
    heroHeadline: 'Stress-Free Residential Moving for',
    heroHighlight: 'Apartments, Condos & Family Homes.',
    heroDescription:
      'Moving your household is about more than lifting boxes—it is about protecting your furniture, respecting your floors and doorways, and coordinating arrival windows so moving day runs smoothly.',
    primaryCtaLabel: 'Start Visual Moving Quote',
    primaryCtaHref: '/get-a-quote?service=residential-moving',
    overviewTitle: 'Organized Household Moves Built Around Your Property Type',
    overviewParagraphs: [
      'Every residential property presents different logistical challenges. A downtown Calgary high-rise condo requires strict freight elevator time-window adherence and long-corridor dollies, whereas a two-storey suburban family home in NW Calgary or Airdrie requires staircase runners, banister padding, and strategic truck loading.',
      'QuickMove Solutions plans your residential move around your exact property layout, bedroom count, and access conditions. Before moving day, our dispatch team confirms your inventory details, parking access, and any specialty items so our crew arrives prepared.',
    ],
    scenariosTitle: 'Residential Property Types We Move Every Day',
    scenarios: [
      {
        title: 'Apartments & High-Rise Condos',
        description:
          'Coordinated around building management rules, loading docks, and reserved elevator windows.',
        bullets: [
          'Efficient staging to maximize booked elevator time',
          'Long-walk corridor & underground parkade navigation',
          'Protective wrapping for tight condo doorways',
        ],
      },
      {
        title: 'Townhouses & Multi-Level Split Homes',
        description:
          'Careful maneuvering up and down narrow staircases, split-level landings, and courtyard walkways.',
        bullets: [
          'Staircase & railing protection protocols',
          'Two-person and team lifting for bulky bedroom sets',
          'Organized room-by-room placement at your new address',
        ],
      },
      {
        title: 'Single-Family Detached Houses',
        description:
          'Complete household relocations from one-bedroom bungalows to five-plus bedroom family estates.',
        bullets: [
          'Full living room, dining, kitchen, bedroom & garage loading',
          'Appliance & heavy furniture securing with transit blankets',
          'Optional pre-move junk removal for basement or garage clutter',
        ],
      },
    ],
    checklistTitle: 'Our Residential Moving Operational Checklist',
    checklistSubtitle:
      'Every residential move managed in our operations platform follows a structured nine-point workflow:',
    operationalChecklist: [
      'Confirm customer contact details, pickup address, and destination address',
      'Review property size (Studio to 5+ bedrooms) and key furniture inventory',
      'Verify stairs, elevator booking windows, and walking distances',
      'Confirm truck parking clearance at both pickup and drop-off locations',
      'Confirm any packing, unpacking, or furniture wrapping requirements',
      'Assign appropriately sized moving crew and equipped moving vehicle',
      'Wrap furniture, protect high-traffic floors, and load systematically',
      'Place furniture and boxes into designated rooms at the new home',
      'Complete final walkthrough with customer and record job completion',
    ],
    preparationTipsTitle: 'How to Prepare for Your Residential Move',
    preparationTips: [
      {
        title: 'Reserve Condo Elevators Early',
        detail:
          'If you are moving into or out of a condo or apartment building, book the service elevator as soon as your moving date is confirmed and share the time window with our dispatch team.',
      },
      {
        title: 'Declutter Before Packing',
        detail:
          'Avoid paying to pack and move items you no longer want. You can book our Photo-First Junk Removal service prior to moving day to clear old furniture, mattresses, or basement clutter.',
      },
      {
        title: 'Label Boxes on the Side by Room',
        detail:
          'Writing the destination room ("Master Bedroom", "Kitchen") on the side of each box—rather than just the top—allows movers to read labels even when boxes are stacked.',
      },
    ],
    faqs: [
      {
        id: 'res-faq-1',
        question: 'Can you handle both small apartment moves and large multi-bedroom house moves?',
        answer:
          'Yes. Our Visual Moving Quote wizard lets you select property sizes ranging from Studio and 1-Bedroom apartments up to 5+ Bedroom family homes, allowing us to assign the right crew and truck size.',
      },
      {
        id: 'res-faq-2',
        question: 'Do you protect furniture during a residential move?',
        answer:
          'Yes. We use moving blankets, stretch wrap, and secure tie-down straps inside the truck to protect wooden furniture, upholstered sofas, mattresses, and fragile household items.',
      },
      {
        id: 'res-faq-3',
        question: 'Can I add packing assistance or junk removal to my residential move?',
        answer:
          'Absolutely. You can request partial or full packing assistance, or schedule a pre-move junk removal pickup to clear unwanted items before your move.',
      },
    ],
    relatedServices: [
      {
        name: 'Packing & Unpacking',
        href: '/packing-unpacking',
        summary: 'Add full or partial household packing and fragile item wrapping.',
      },
      {
        name: 'Full Junk Removal',
        href: '/junk-removal',
        summary: 'Clear unwanted furniture, mattresses, and clutter before moving day.',
      },
      {
        name: 'Local Moving',
        href: '/local-moving',
        summary: 'Moving across Calgary neighbourhoods and surrounding communities.',
      },
    ],
  },

  'commercial-moving': {
    slug: 'commercial-moving',
    title: 'Commercial Moving',
    metaTitle: 'Commercial & Office Moving in Calgary & Alberta | QuickMove Solutions',
    metaDescription:
      'Organized commercial moving for offices, retail spaces, workstations, commercial furniture, and business equipment in Calgary and across Alberta.',
    eyebrow: 'Business & Workspace Relocations',
    heroHeadline: 'Structured Commercial Moving That',
    heroHighlight: 'Minimizes Business Downtime.',
    heroDescription:
      'Relocating an office, studio, retail storefront, or commercial workspace requires careful coordination. QuickMove Solutions delivers organized commercial moving with itemized written quotations and disciplined execution.',
    primaryCtaLabel: 'Request Commercial Moving Quote',
    primaryCtaHref: '/get-a-quote?service=commercial-moving',
    overviewTitle: 'Reliable Relocation Partner for Calgary & Alberta Businesses',
    overviewParagraphs: [
      'When a business relocates, disorganized moving translates directly into lost productivity. Desks, ergonomic chairs, conference tables, reception furniture, shelving, and boxed equipment must arrive intact and be placed in the right zone at the new facility.',
      'QuickMove Solutions works directly with business owners, office managers, and property managers to plan access rules, commercial loading bay schedules, freight elevators, and floor-plan placement.',
    ],
    scenariosTitle: 'Commercial Relocation Solutions We Provide',
    scenarios: [
      {
        title: 'Office & Corporate Suite Relocations',
        description:
          'Moving professional offices, workstations, executive suites, and conference rooms.',
        bullets: [
          'Systematic desk, chair, filing cabinet & boardroom transport',
          'Zone and room labeling for organized destination setup',
          'Coordination with commercial property management & security',
        ],
      },
      {
        title: 'Small Business, Studio & Retail Moves',
        description:
          'Relocating local shops, clinics, creative studios, and growing small businesses.',
        bullets: [
          'Display fixtures, shelving, inventory boxes & back-office furniture',
          'Flexible scheduling to help reduce disruption to customer hours',
          'Careful protection for glass displays and commercial finishes',
        ],
      },
      {
        title: 'Equipment Transport & Workspace Reconfiguration',
        description:
          'Internal building moves, commercial furniture swaps, and B2B equipment transportation.',
        bullets: [
          'Point-to-point commercial equipment & furniture transportation',
          'Decommissioning and removal of outdated office furniture',
          'Combined commercial moving + office junk cleanouts',
        ],
      },
    ],
    checklistTitle: 'Commercial Relocation Execution Checklist',
    checklistSubtitle:
      'How we coordinate commercial and office moves from initial quote to final setup:',
    operationalChecklist: [
      'Review commercial scope, workstation count, and key equipment list',
      'Prepare itemized written quotation for management review and approval',
      'Confirm loading bay clearance, freight elevator dimensions, and building hours',
      'Verify parking and access rules at origin and destination facilities',
      'Coordinate zone/department labeling with your point of contact',
      'Protect commercial corridors, elevators, and office furniture during loading',
      'Transport and place desks, furniture, and crates into designated zones',
      'Remove any approved decommissioned office junk if requested',
      'Conduct final walkthrough with your site contact upon completion',
    ],
    preparationTipsTitle: 'Preparing Your Office or Business for Relocation',
    preparationTips: [
      {
        title: 'Assign a Single Internal Move Coordinator',
        detail:
          'Having one designated person on your team to confirm building access and floor-plan placement keeps moving day decisions fast and clear.',
      },
      {
        title: 'Confirm Commercial Building Rules Early',
        detail:
          'Many commercial towers in Downtown Calgary and business parks require advance notice for loading dock and freight elevator use.',
      },
      {
        title: 'Separate Items for Disposal Ahead of Time',
        detail:
          'Tag broken chairs, obsolete filing cabinets, or old fixtures so our team can clear them via our Commercial Junk Removal service.',
      },
    ],
    faqs: [
      {
        id: 'comm-faq-1',
        question: 'Do you provide itemized written quotations for business accounting?',
        answer:
          'Yes. Every commercial quotation is generated through our quotation system with clear line items, subtotal, applicable taxes, and terms in a printable PDF format.',
      },
      {
        id: 'comm-faq-2',
        question: 'Can you remove old office furniture while relocating our workspace?',
        answer:
          'Yes. We offer both commercial moving and full office junk removal, allowing you to relocate the furniture you are keeping and clear out the items you are replacing.',
      },
      {
        id: 'comm-faq-3',
        question: 'What if we only need a few commercial items or pieces of equipment transported?',
        answer:
          'For smaller commercial pickups or single-load furniture/equipment transport, you can also use our dedicated Delivery Services.',
      },
    ],
    relatedServices: [
      {
        name: 'Full Junk Removal',
        href: '/junk-removal',
        summary: 'Clear outdated office desks, chairs, and commercial storage clutter.',
      },
      {
        name: 'Delivery Services',
        href: '/delivery-services',
        summary: 'Point-to-point business deliveries and commercial furniture transport.',
      },
      {
        name: 'Long-Distance Moving',
        href: '/long-distance-moving',
        summary: 'Relocating business assets between Calgary, Red Deer, and Edmonton.',
      },
    ],
  },

  'local-moving': {
    slug: 'local-moving',
    title: 'Local Moving',
    metaTitle: 'Local Moving in Calgary & Surrounding Communities | QuickMove Solutions',
    metaDescription:
      'Dependable local moving across all Calgary quadrants (NW, NE, SW, SE) and surrounding communities including Airdrie and Strathmore.',
    eyebrow: 'Calgary & Area Local Movers',
    heroHeadline: 'Dependable Local Moving Across',
    heroHighlight: 'Calgary & Surrounding Communities.',
    heroDescription:
      'Whether you are moving three blocks over in the Beltline, upgrading to a family home in NW or SE Calgary, or relocating to nearby Airdrie or Strathmore, our local moving crew makes short-distance moves efficient and organized.',
    primaryCtaLabel: 'Get a Local Moving Quote',
    primaryCtaHref: '/get-a-quote?service=local-moving',
    overviewTitle: 'Local Knowledge That Saves Time on Moving Day',
    overviewParagraphs: [
      'A successful local move depends on preparation and local familiarity. Knowing how to plan for tight inner-city alleyways, condo loading zones, suburban cul-de-sacs, and seasonal Calgary weather ensures our crew arrives equipped for your exact street and property.',
      'Even when moving only a few kilometres away, your furniture deserves full long-transit protection. We blanket-wrap furniture, secure loads inside the truck, and protect floors at both your pickup and destination addresses.',
    ],
    scenariosTitle: 'Common Local Moves We Handle',
    scenarios: [
      {
        title: 'Neighbourhood-to-Neighbourhood Calgary Moves',
        description:
          'Moving across NW, NE, SW, and SE Calgary communities.',
        bullets: [
          'Inner-city condos, infills, heritage homes & suburban houses',
          'Same-day pickup and unloading within your scheduled window',
          'Careful handling of stairs, tight hallways & street parking',
        ],
      },
      {
        title: 'Calgary ↔ Airdrie & Strathmore Commuter Moves',
        description:
          'Seamless local relocations between Calgary and surrounding towns.',
        bullets: [
          'Direct transport along QEII and Highway 1 corridors',
          'Single-trip or multi-stage loading coordination',
          'Optional furniture delivery or pre-move cleanout support',
        ],
      },
      {
        title: 'In-Building & Short-Transfer Moves',
        description:
          'Moving between units in the same condo building or within the same complex.',
        bullets: [
          'Fast dolly and elevator transfer between floors',
          'Heavy furniture rearrangement and staging support',
          'Ideal for renovations, downsizing, or lease changes',
        ],
      },
    ],
    checklistTitle: 'Local Moving Day Workflow',
    checklistSubtitle: 'How we keep local Calgary and area moves on schedule:',
    operationalChecklist: [
      'Verify pickup and destination addresses, postal codes, and access notes',
      'Confirm preferred moving date and arrival time window',
      'Review property size, stairs/elevator access, and walking distances',
      'Dispatch local moving crew and appropriately sized truck',
      'Protect floors and doorways and wrap furniture prior to loading',
      'Secure all household or office items for safe local transit',
      'Unload and place items by room at your new local address',
      'Confirm customer satisfaction and complete job sign-off',
    ],
    preparationTipsTitle: 'Tips for a Faster Local Move',
    preparationTips: [
      {
        title: 'Clear a Parking Spot Close to the Entrance',
        detail:
          'Reducing the walking distance between your front door or loading zone and the moving truck significantly speeds up loading and unloading.',
      },
      {
        title: 'Pack Loose Items into Sealed Boxes',
        detail:
          'Even on a short local move, loose lamps, electronics, and kitchen items travel much faster and safer when boxed and labeled.',
      },
      {
        title: 'Keep Essentials With You',
        detail:
          'Keep keys, lease/closing documents, medications, and phone chargers in a personal bag so they are immediately accessible.',
      },
    ],
    faqs: [
      {
        id: 'loc-faq-1',
        question: 'Which areas count as local moving?',
        answer:
          'Local moving covers all quadrants of Calgary (NW, NE, SW, SE) as well as nearby surrounding communities such as Airdrie and Strathmore.',
      },
      {
        id: 'loc-faq-2',
        question: 'What if I have an extra stop to pick up or drop off furniture along the way?',
        answer:
          'Our Visual Moving Quote wizard includes an option for additional stops so you can mention any extra pickup or drop-off location in advance.',
      },
      {
        id: 'loc-faq-3',
        question: 'Do you still wrap furniture for short local moves?',
        answer:
          'Yes. Most furniture damage happens during carrying through doorways or shifting in transit, so we protect your furniture regardless of how short the drive is.',
      },
    ],
    relatedServices: [
      {
        name: 'Residential Moving',
        href: '/residential-moving',
        summary: 'Complete household moving for apartments, condos, and houses.',
      },
      {
        name: 'Long-Distance Moving',
        href: '/long-distance-moving',
        summary: 'Moving further across Alberta to Red Deer, Edmonton, and beyond.',
      },
      {
        name: 'Packing & Unpacking',
        href: '/packing-unpacking',
        summary: 'Let our team help pack and wrap your household before moving day.',
      },
    ],
  },

  'long-distance-moving': {
    slug: 'long-distance-moving',
    title: 'Long-Distance Moving',
    metaTitle: 'Long-Distance Moving Across Alberta (Calgary, Red Deer, Edmonton) | QuickMove Solutions',
    metaDescription:
      'Coordinated city-to-city long-distance moving between Calgary, Airdrie, Strathmore, Red Deer, Edmonton, and confirmed destinations.',
    eyebrow: 'Inter-City Relocation Specialists',
    heroHeadline: 'Coordinated Long-Distance Moving',
    heroHighlight: 'Between Calgary, Red Deer, Edmonton & Beyond.',
    heroDescription:
      'Moving to a new city requires dependable timing, highway-ready load securing, and clear communication from pickup to final delivery. QuickMove Solutions coordinates inter-city relocations across our confirmed Alberta corridors.',
    primaryCtaLabel: 'Plan Your Long-Distance Move',
    primaryCtaHref: '/get-a-quote?service=long-distance-moving',
    overviewTitle: 'Dedicated Planning for City-to-City Relocations',
    overviewParagraphs: [
      'Long-distance moves demand higher standards of load preparation and scheduling than local moves. Items spend hours on highway corridors like the QEII (Highway 2) between Calgary, Red Deer, and Edmonton, meaning every piece of furniture and stacked box must be tightly padded, tiered, and strapped.',
      'Before confirming any long-distance booking, our team verifies your origin and destination cities, property access at both ends, inventory volume, and target delivery schedule so there are no surprises on moving day.',
    ],
    scenariosTitle: 'Primary Long-Distance Corridors & Services',
    scenarios: [
      {
        title: 'Calgary ↔ Edmonton Relocations',
        description:
          'Structured household and commercial moves connecting Alberta’s two largest metropolitan areas.',
        bullets: [
          'Coordinated loading and highway transit scheduling',
          'Full furniture padding and high-stability truck tiering',
          'Available for apartments, family homes, and offices',
        ],
      },
      {
        title: 'Calgary ↔ Red Deer & Central Alberta',
        description:
          'Reliable moving along the Highway 2 corridor serving Red Deer and surrounding communities.',
        bullets: [
          'Direct pickup and delivery coordination',
          'Flexible scheduling for possession date handoffs',
          'Optional packing and unpacking support',
        ],
      },
      {
        title: 'Confirmed Regional Destinations',
        description:
          'Relocating to or from other Alberta destinations confirmed by our dispatch team.',
        bullets: [
          'Custom route and mileage quotation reviewed by an administrator',
          'Combine with pre-move junk removal at your origin property',
          'Clear contact with dispatch throughout your move',
        ],
      },
    ],
    checklistTitle: 'Long-Distance Relocation Checklist',
    checklistSubtitle: 'How we prepare and execute inter-city moves safely:',
    operationalChecklist: [
      'Confirm origin city, destination city, and exact street addresses',
      'Verify service corridor eligibility and preferred travel dates',
      'Audit complete household or commercial inventory and special items',
      'Confirm packing, fragile wrapping, and protective material needs',
      'Issue itemized written quotation detailing long-distance scope',
      'Assign experienced long-distance crew and inspected moving vehicle',
      'Perform highway-grade blanket wrapping and multi-point tie-down loading',
      'Communicate arrival window prior to reaching destination address',
      'Unload, place items by room, and verify completion checklist',
    ],
    preparationTipsTitle: 'How to Prepare for a Long-Distance Move',
    preparationTips: [
      {
        title: 'Use Sturdy, Uniform Moving Boxes',
        detail:
          'For highway transport, uniform, double-walled boxes stack much more securely inside the truck than mismatched grocery boxes or open bins.',
      },
      {
        title: 'Downsize Heavy Unwanted Items First',
        detail:
          'Before moving hundreds of kilometres, use our Junk Removal service to clear out worn-out sofas, old mattresses, or garage items you will not use in your new city.',
      },
      {
        title: 'Confirm Key Possession Times at Destination',
        detail:
          'Make sure your realtor, landlord, or building manager at your destination city has confirmed when keys and elevator access will be ready.',
      },
    ],
    faqs: [
      {
        id: 'ld-faq-1',
        question: 'Which long-distance cities do you serve?',
        answer:
          'We regularly serve Calgary, Airdrie, Strathmore, Red Deer, and Edmonton, as well as other destinations that our dispatch team confirms based on your route and schedule.',
      },
      {
        id: 'ld-faq-2',
        question: 'How is a long-distance move quoted?',
        answer:
          'Once you submit your origin, destination, property size, and inventory through our Visual Moving Quote wizard, an administrator reviews the distance, crew requirements, and vehicle scope to prepare an itemized written quotation.',
      },
      {
        id: 'ld-faq-3',
        question: 'Can you help pack before a Calgary to Edmonton move?',
        answer:
          'Yes. You can include Packing and Unpacking services in your quote request so your fragile kitchenware, electronics, and furniture are properly prepared for highway transit.',
      },
    ],
    relatedServices: [
      {
        name: 'Packing & Unpacking',
        href: '/packing-unpacking',
        summary: 'Highway-ready packing and furniture protection for inter-city moves.',
      },
      {
        name: 'Residential Moving',
        href: '/residential-moving',
        summary: 'Household relocation for condos, townhouses, and family homes.',
      },
      {
        name: 'Full Junk Removal',
        href: '/junk-removal',
        summary: 'Lighten your load before moving out of town.',
      },
    ],
  },

  'packing-unpacking': {
    slug: 'packing-unpacking',
    title: 'Packing & Unpacking',
    metaTitle: 'Packing & Unpacking Services in Calgary & Alberta | QuickMove Solutions',
    metaDescription:
      'Professional packing assistance, unpacking support, fragile item preparation, and furniture protection in Calgary and across Alberta.',
    eyebrow: 'Move Preparation & Unpacking Support',
    heroHeadline: 'Professional Packing, Wrapping &',
    heroHighlight: 'Unpacking Assistance.',
    heroDescription:
      'Packing an entire home or office often takes days longer than expected. QuickMove Solutions provides flexible packing assistance, furniture protection, and destination unpacking so you can focus on your move.',
    primaryCtaLabel: 'Request Packing & Moving Quote',
    primaryCtaHref: '/get-a-quote?service=packing-unpacking',
    overviewTitle: 'From Fragile Kitchens to Full-Household Preparation',
    overviewParagraphs: [
      'Proper packing is the single best defense against transit damage. Whether you want our team to prepare your entire household or simply need help wrapping fragile kitchenware, artwork, mirrors, and large furniture, we adapt our packing service to your needs.',
      'Once we arrive at your new property, our unpacking assistance helps get boxes off the floor, items placed onto counters or shelves, and packing debris cleared away so your new space feels livable right away.',
    ],
    scenariosTitle: 'Flexible Packing & Unpacking Options',
    scenarios: [
      {
        title: 'Full-Household or Office Packing',
        description:
          'Comprehensive room-by-room packing prior to or alongside your move.',
        bullets: [
          'Systematic kitchen, living room, bedroom & office box preparation',
          'Clear room and content labeling on every box',
          'Ideal for busy families, professionals, and seniors',
        ],
      },
      {
        title: 'Partial & Fragile-Only Packing',
        description:
          'Focused assistance for the hardest-to-pack rooms and delicate belongings.',
        bullets: [
          'Dishware, glassware, china & kitchen pantry packing',
          'Mirrors, framed art, lamps & delicate decor preparation',
          'You pack clothes and books; we handle the fragile items',
        ],
      },
      {
        title: 'Furniture Protection & Destination Unpacking',
        description:
          'Protective wrapping before loading and organized unpacking at your new address.',
        bullets: [
          'Blanket padding and stretch-wrapping for upholstered & wood furniture',
          'Unpacking boxes onto surfaces and organizing rooms at destination',
          'Consolidating empty boxes and wrapping materials after setup',
        ],
      },
    ],
    checklistTitle: 'Packing & Protection Quality Checklist',
    checklistSubtitle: 'How we prepare household and commercial items for safe relocation:',
    operationalChecklist: [
      'Confirm scope of packing required (Full, Partial/Fragile, or Unpacking)',
      'Verify packing materials needed where applicable',
      'Separate fragile, high-priority, and essentials items first',
      'Wrap breakables individually and cushion box bottoms and tops',
      'Label every box clearly by destination room and handling priority',
      'Pad and stretch-wrap furniture, mattresses, and cabinetry',
      'Load packed boxes by weight and fragility tier',
      'Deliver boxes to matching rooms and assist with requested unpacking',
    ],
    preparationTipsTitle: 'How to Get Ready Before Our Packing Crew Arrives',
    preparationTips: [
      {
        title: 'Set Aside Personal & Essential Items',
        detail:
          'Place passports, jewelry, medications, laptops, and daily essentials in a designated "Do Not Pack" area or suitcase that stays with you.',
      },
      {
        title: 'Clear Out Perishables & Liquids',
        detail:
          'Open bottles, cleaning chemicals, and perishable refrigerator food should not be sealed into moving boxes.',
      },
      {
        title: 'Identify High-Value or Delicate Pieces',
        detail:
          'Point out any heirloom china, glass tabletops, or fragile items during our initial walkthrough so they receive extra attention.',
      },
    ],
    faqs: [
      {
        id: 'pack-faq-1',
        question: 'Can I book packing assistance together with my residential or commercial move?',
        answer:
          'Yes. In Step 5 of our Visual Moving Quote wizard, you can select Packing, Unpacking, and Fragile Item requirements so everything is included in one coordinated quotation.',
      },
      {
        id: 'pack-faq-2',
        question: 'Do I have to book full-house packing, or can you just pack my kitchen and fragile items?',
        answer:
          'You can choose either! Many customers pack their own clothing and linens while having our team pack the kitchen, fragile items, and wrap all large furniture.',
      },
      {
        id: 'pack-faq-3',
        question: 'Are packing materials available?',
        answer:
          'Yes, packing materials can be included in your quotation where available. Let us know what materials or box support you need when requesting your quote.',
      },
    ],
    relatedServices: [
      {
        name: 'Residential Moving',
        href: '/residential-moving',
        summary: 'Combine packing with complete apartment, condo, or house moving.',
      },
      {
        name: 'Long-Distance Moving',
        href: '/long-distance-moving',
        summary: 'Essential protective preparation for inter-city Alberta moves.',
      },
      {
        name: 'Full Junk Removal',
        href: '/junk-removal',
        summary: 'Clear out unwanted items before packing begins.',
      },
    ],
  },

  'delivery-services': {
    slug: 'delivery-services',
    title: 'Delivery Services',
    metaTitle: 'Furniture & Large-Item Delivery in Calgary & Alberta | QuickMove Solutions',
    metaDescription:
      'Reliable furniture delivery, large-item transportation, household pickup & drop-off, and commercial deliveries in Calgary and surrounding areas.',
    eyebrow: 'Scheduled Pickup & Drop-Off',
    heroHeadline: 'Furniture, Appliance & Large-Item',
    heroHighlight: 'Delivery Services.',
    heroDescription:
      'Need a heavy sectional sofa, dining table, appliance, or commercial order picked up and delivered safely? QuickMove Solutions provides professional pickup, blanket-wrapped transport, and room-of-choice placement.',
    primaryCtaLabel: 'Request a Delivery Quote',
    primaryCtaHref: '/get-a-quote?service=delivery-services',
    overviewTitle: 'The Easy Way to Transport Heavy Items Without Renting a Truck',
    overviewParagraphs: [
      'Buying a large piece of furniture from a retail showroom, warehouse outlet, or online marketplace often leaves you with a major challenge: how to get it home and up the stairs safely. Curbside courier drops leave heavy items outside on the driveway, and renting a truck still leaves you doing all the heavy lifting.',
      'QuickMove Solutions bridges the gap between a parcel courier and a full household move. We dispatch a trained moving crew and equipped vehicle to pick up your items, wrap them securely, transport them to your destination, and bring them inside.',
    ],
    scenariosTitle: 'Delivery Requests We Handle',
    scenarios: [
      {
        title: 'Store-to-Home & Showroom Furniture Delivery',
        description:
          'Pickup from furniture stores, clearance centres, or warehouses with in-home placement.',
        bullets: [
          'Sofas, sectionals, dining tables, bed frames & dressers',
          'Protective blanket wrapping and corner protection',
          'Careful carry-in and placement in your chosen room',
        ],
      },
      {
        title: 'Marketplace & Household Item Transportation',
        description:
          'Moving furniture or appliances between residences or from private sellers.',
        bullets: [
          'Coordinated pickup window with seller or family member',
          'Appliances, pianos/heavy pieces (subject to access verification) & gym gear',
          'Optional removal of the old sofa or mattress being replaced',
        ],
      },
      {
        title: 'Business & Commercial Deliveries',
        description:
          'Scheduled B2B pickup and drop-off for offices, designers, stagers, and retailers.',
        bullets: [
          'Office furniture, commercial fixtures & boxed equipment deliveries',
          'Home staging furniture placement and pickup support',
          'Clear written quotations and delivery confirmation',
        ],
      },
    ],
    checklistTitle: 'Delivery Service Execution Checklist',
    checklistSubtitle: 'How every pickup and delivery job is managed:',
    operationalChecklist: [
      'Confirm item descriptions, dimensions/weight category, and quantity',
      'Verify pickup address, contact person, and order/pickup reference',
      'Verify drop-off address, stairs/elevator access, and doorway clearance',
      'Confirm scheduled pickup and delivery time window',
      'Inspect and blanket-wrap items prior to loading into the vehicle',
      'Secure items with heavy-duty transit straps during transport',
      'Deliver items inside to the designated room or commercial area',
      'Record successful delivery completion with customer',
    ],
    preparationTipsTitle: 'How to Prepare for a Smooth Furniture or Item Delivery',
    preparationTips: [
      {
        title: 'Measure Doorways, Hallways & Stair Turns',
        detail:
          'Before purchasing or scheduling delivery of an oversized sofa or armoire, measure the width and height of your entry doors, elevator doors, and tight stair corners.',
      },
      {
        title: 'Confirm Item Readiness at Pickup',
        detail:
          'If we are picking up from a retail warehouse or private seller, confirm that the item is paid for, released for pickup, and that the seller knows our arrival window.',
      },
      {
        title: 'Need the Old Item Gone Too?',
        detail:
          'Let us know if you are replacing an old couch, mattress, or appliance—we can remove the old item via our Junk Removal service on the same visit.',
      },
    ],
    faqs: [
      {
        id: 'del-faq-1',
        question: 'Do you bring delivered furniture inside the house or condo?',
        answer:
          'Yes! Unlike curbside freight carriers, our delivery crew brings approved furniture and large household items inside your home or office, provided doorways and stairs have safe clearance.',
      },
      {
        id: 'del-faq-2',
        question: 'Can you pick up furniture I bought on Kijiji, Facebook Marketplace, or a local store?',
        answer:
          'Yes. Just provide the pickup address, seller or store contact details, and item description when requesting your quote.',
      },
      {
        id: 'del-faq-3',
        question: 'Can you haul away my old couch or mattress when delivering the new one?',
        answer:
          'Yes. Mention that you also want old-item removal and we can include Junk Removal in your quotation.',
      },
    ],
    relatedServices: [
      {
        name: 'Full Junk Removal',
        href: '/junk-removal',
        summary: 'Remove the old sofa, mattress, or appliance you are replacing.',
      },
      {
        name: 'Residential Moving',
        href: '/residential-moving',
        summary: 'Moving more than a few items? Explore our full residential moving service.',
      },
      {
        name: 'Commercial Moving',
        href: '/commercial-moving',
        summary: 'Full office and workspace relocation services.',
      },
    ],
  },

  'junk-removal': {
    slug: 'junk-removal',
    title: 'Full Junk Removal',
    metaTitle: 'Junk Removal in Calgary & Alberta (Photo-First Estimates) | QuickMove Solutions',
    metaDescription:
      'Complete residential and commercial junk removal in Calgary, Airdrie, Strathmore, Red Deer, and Edmonton. Upload photos from your phone for a fast estimate.',
    eyebrow: 'Standalone Full-Service Line • Photo-First Quotes',
    heroHeadline: 'Full Junk Removal & Cleanouts:',
    heroHighlight: 'Space Made Clear.',
    heroDescription:
      'Junk removal is a complete standalone service line at QuickMove Solutions. From single-item furniture, sofa, and mattress removal to full garage, basement, office, and move-out property cleanouts—upload photos from your phone for a clear estimate.',
    primaryCtaLabel: 'Start Photo-First Junk Quote',
    primaryCtaHref: '/get-a-quote?service=junk-removal',
    secondaryCtaLabel: 'View Junk Removal Policy',
    secondaryCtaHref: '/junk-removal-policy',
    isJunkRemoval: true,
    overviewTitle: 'You Snap the Photos. Our Crew Does All the Heavy Lifting.',
    overviewParagraphs: [
      'Clearing out heavy furniture, broken appliances, or years of accumulated garage and basement clutter shouldn’t require renting a dump trailer or spending your weekend hauling loads. QuickMove Solutions provides full-service junk removal where our team lifts, loads, and clears approved items directly from indoors or outdoors.',
      'Even better, our Photo-First Junk Removal Quote experience means you never have to write out a tedious item-by-item inventory. Simply select your categories, take or upload photos with your smartphone, choose an approximate volume range, and receive a reviewed quotation.',
    ],
    scenariosTitle: 'Residential, Commercial & Property Cleanout Services',
    scenarios: [
      {
        title: 'Furniture, Sofa, Mattress & Appliance Removal',
        description:
          'Fast removal of bulky household pieces that do not fit in regular municipal bins.',
        bullets: [
          'Couches, sectionals, recliners, tables, dressers & bed frames',
          'Mattress and box spring removal',
          'Refrigerators, washers, dryers, stoves & household appliances',
        ],
      },
      {
        title: 'Garage, Basement & Storage Cleanouts',
        description:
          'Reclaim valuable living and parking space in your home or storage locker.',
        bullets: [
          'Boxes, broken household goods, electronics & general clutter',
          'Basement, attic, shed & backyard approved-item cleanouts',
          'Storage unit cleanouts so you can stop paying monthly locker fees',
        ],
      },
      {
        title: 'Move-Out, Office & Property Cleanouts',
        description:
          'Comprehensive space clearing for homeowners, tenants, landlords, realtors, and offices.',
        bullets: [
          'Pre-move and post-move property cleanouts',
          'Rental turnover, estate & property management cleanouts',
          'Office furniture, cubicles, chairs & commercial junk removal',
        ],
      },
    ],
    checklistTitle: 'Our 7-Point Junk Removal Operational Checklist',
    checklistSubtitle:
      'Every junk removal request is reviewed by an administrator and executed systematically:',
    operationalChecklist: [
      'Review customer-uploaded photos and selected item categories',
      'Confirm all items meet approved non-hazardous acceptance guidelines',
      'Confirm preliminary volume category and prepare written quotation',
      'Confirm indoor/outdoor location, stairs/elevator access, and parking',
      'Assign collection crew and truck upon quotation acceptance',
      'Perform full lifting, loading, and broom-clean collection on site',
      'Record job completion and send customer confirmation',
    ],
    preparationTipsTitle: 'How to Prepare for Your Junk Removal Estimate & Pickup',
    preparationTips: [
      {
        title: 'Take Clear Photos From a Few Angles',
        detail:
          'When using our Photo-First Junk Quote wizard, step back so our team can see the overall pile or furniture piece, and include a second angle if items are stacked deep in a garage or room.',
      },
      {
        title: 'No Need to Carry Everything to the Curb',
        detail:
          'We offer both indoor and outdoor pickup. Just let us know in Step 4 of the quote form whether items are in the basement, upstairs, in the garage, or outside.',
      },
      {
        title: 'Check Our Hazardous Materials Policy',
        detail:
          'Please keep chemicals, paints, solvents, asbestos, medical waste, or pressurized tanks separate, as we do not collect regulated hazardous waste without verified authorization.',
      },
    ],
    faqs: [
      {
        id: 'junk-faq-1',
        question: 'How does the Photo-First Junk Removal quote work?',
        answer:
          'In 6 quick steps, you select item categories, upload photos from your phone or computer, pick an approximate load size (from a few items to a full property cleanout), enter access details, and submit. Our administrator reviews your photos and sends a clear quotation.',
      },
      {
        id: 'junk-faq-2',
        question: 'Are the volume options on the form a locked-in price?',
        answer:
          'The volume options (A few items, Small load, Medium load, Large load, Full property cleanout) are preliminary descriptions to help you describe the job. An administrator reviews your uploaded photos and access details before providing your final quotation.',
      },
      {
        id: 'junk-faq-3',
        question: 'What materials are NOT accepted in junk removal?',
        answer:
          'We do not promise or perform collection of hazardous waste, asbestos, medical waste, chemicals, fuels, or regulated materials without verified authorization and appropriate disposal arrangements.',
      },
    ],
    relatedServices: [
      {
        name: 'Residential Moving',
        href: '/residential-moving',
        summary: 'Clearing clutter before a move? Pair junk removal with residential moving.',
      },
      {
        name: 'Commercial Moving',
        href: '/commercial-moving',
        summary: 'Relocating an office while clearing out old desks and fixtures.',
      },
      {
        name: 'Delivery Services',
        href: '/delivery-services',
        summary: 'Have your new furniture delivered while we haul away the old pieces.',
      },
    ],
  },
};

