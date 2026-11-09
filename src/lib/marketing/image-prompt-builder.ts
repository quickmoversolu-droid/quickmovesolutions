/**
 * QuickMove Solutions — Moving Visual Scene Synthesizer
 * Generates photorealistic, authentic moving & cleanout prompts that resonate
 * with real customers (real moving trucks, protective blankets, boxes, crews, clean garages).
 * Prevents abstract AI text, logos, or disconnected scenes.
 */

export interface MovingScenePreset {
  id: string;
  name: string;
  service: string;
  description: string;
  prompt: string;
}

export const MOVING_SCENE_PRESETS: MovingScenePreset[] = [
  {
    id: 'residential-truck-driveway',
    name: 'QuickMove Truck on Calgary Driveway',
    service: 'Residential Moving',
    description: 'Clean white moving box truck with navy blue & flame-orange branding parked on a sunny paved driveway.',
    prompt:
      'Commercial documentary photograph of a modern clean white moving box truck parked on a paved suburban house driveway on a bright sunny day in Calgary, Alberta. The truck body features deep navy blue side panels with vibrant safety flame-orange striping and bold "QuickMove Solutions" typography in flame orange. The roll-up back door is open with an aluminum walk ramp extended. Neatly stacked deep navy blue quilted moving blankets and an orange moving dolly are visible. Pristine residential neighborhood, natural sunlight, photorealistic 8k, sharp focus. Color palette strictly deep navy blue, bright flame orange, and crisp white.',
  },
  {
    id: 'movers-carrying-sofa',
    name: 'Movers Carrying Wrapped Couch',
    service: 'Residential Moving',
    description: 'Two professional movers in navy blue work shirts with flame-orange trim carrying a protected sofa.',
    prompt:
      'Commercial documentary photograph of two friendly athletic professional movers wearing matching dark navy blue work polo shirts with bright safety flame-orange collars and orange chest logos, and dark work pants. They are carefully carrying a sofa protected in deep navy blue quilted moving blankets with bright flame-orange tie-down straps. Sunny daylight outside an upscale residential home in Calgary Alberta, authentic moving day craftsmanship, realistic photography, sharp focus 8k. High-contrast color scheme: deep navy blue, vibrant safety flame orange, and clean white.',
  },
  {
    id: 'living-room-moving-boxes',
    name: 'Living Room Packed with Boxes',
    service: 'Packing & Supplies',
    description: 'Neatly organized kraft cardboard moving boxes with orange QuickMove labels stacked in a sunlit living room.',
    prompt:
      'High-resolution interior photography of a bright, sunlit modern living room with neatly stacked heavy-duty kraft brown cardboard moving boxes with vibrant flame-orange label accents. Rolls of packaging tape, clear bubble wrap, and deep navy blue quilted moving pads on polished hardwood floors in Calgary Alberta. Contemporary Alberta home aesthetic, authentic moving preparation, realistic 8k, natural light.',
  },
  {
    id: 'junk-removal-clean-garage',
    name: 'Spotless Swept Garage After Cleanout',
    service: 'Junk Removal',
    description: 'Completely cleared and swept spacious two-car garage floor with sunlight beaming in.',
    prompt:
      'Bright architectural photograph of a spacious two-car residential garage that has just been completely cleared, cleaned, and swept after professional junk removal in Calgary Alberta. Spotless concrete floor, organized clean walls, sunbeams streaming through windows toward a paved driveway. A clean white QuickMove truck with deep navy blue and bright flame-orange side decals parked in the driveway. Clean, spacious, and organized feeling, realistic 8k.',
  },
  {
    id: 'furniture-blanket-pad-wrap',
    name: 'Furniture Pad & Shrink Wrap Care',
    service: 'Furniture Care & Protection',
    description: 'Movers carefully wrapping a wooden dining table or cabinet with padded quilted furniture pads.',
    prompt:
      'Close-up documentary shot of professional movers in dark navy blue work shirts with bright flame-orange collars carefully wrapping a solid wood furniture piece with thick dark navy blue quilted moving blankets and bright flame-orange ratchet bands, sealed in clear stretch wrap. Attentive property care and professional relocation craftsmanship, soft natural indoor daylight, realistic 8k.',
  },
  {
    id: 'heavy-appliance-dolly',
    name: 'Appliance Delivery with Dolly',
    service: 'Furniture & Appliance Delivery',
    description: 'Movers using a heavy-duty two-wheel hand truck to deliver a new appliance safely.',
    prompt:
      'Professional moving crew in dark navy blue uniforms with bright flame-orange logos using a heavy-duty aluminum appliance hand truck with bright orange safety straps to maneuver a large wrapped household appliance carefully up an entryway in Alberta. Sunny daylight, realistic photography 8k. Primary colors: deep navy blue, flame orange, clean metallic aluminum.',
  },
];

/**
 * Builds a concrete, photorealistic prompt that tightly resonates with moving & space-clearing.
 * Injects QuickMove brand colors: Deep Navy Blue, Safety Flame Orange, and clean white truck.
 */
export function buildResonantMovingPrompt(
  serviceFocus: string = 'Residential Moving',
  titleOrConcept: string = '',
  targetCity: string = 'Calgary'
): string {
  const text = `${serviceFocus} ${titleOrConcept}`.toLowerCase();

  const brandDirective =
    'Color palette strictly dominated by deep navy blue, vibrant safety flame orange, and crisp white. Movers wear dark navy blue work shirts with bright flame-orange collars and chest logos. Moving truck has dark navy blue side graphics with bold bright flame-orange "QuickMove Solutions" lettering. Quilted moving blankets are deep navy blue with flame-orange straps. Photorealistic 8k, natural sunlight, sharp commercial documentary photography, authentic human anatomy, no distorted faces or hands.';

  if (text.includes('junk') || text.includes('cleanout') || text.includes('clear') || text.includes('rubbish')) {
    return `Commercial documentary photography of a spotless, completely cleared and swept two-car residential garage after a full junk removal clearout in ${targetCity} Alberta. Sunbeams shining onto the clean swept floor. Outside on the paved sunny driveway, a clean white moving truck with deep navy blue side wraps and bright safety flame-orange "QuickMove Solutions" branding. ${brandDirective}`;
  }

  if (text.includes('pack') || text.includes('box') || text.includes('supply')) {
    return `Interior photography of a sunlit modern living room with neatly stacked, sealed kraft cardboard moving boxes with bright flame-orange QuickMove labeling, rolls of bubble wrap, and deep navy blue protective quilted pads on hardwood floors in ${targetCity} Alberta. Authentic organized moving day, realistic photography 8k, natural light. ${brandDirective}`;
  }

  if (text.includes('delivery') || text.includes('appliance') || text.includes('furniture')) {
    return `Commercial documentary photograph of two friendly professional movers wearing dark navy blue athletic work polo shirts with bright safety flame-orange collars carefully placing a protected furniture piece with deep navy blue moving blankets inside a bright contemporary home in ${targetCity} Alberta. Attentive property care, realistic photography 8k, sharp focus. ${brandDirective}`;
  }

  if (text.includes('commercial') || text.includes('office')) {
    return `Professional commercial movers in dark navy blue uniforms with flame-orange trim using heavy-duty platform dollies to carefully transport office workstations and packed equipment through a modern bright corporate building hallway in ${targetCity} Alberta. A clean white QuickMove box truck with navy and orange decals visible outside. ${brandDirective}`;
  }

  // Default: Residential Moving
  return `Commercial documentary photography of two friendly athletic professional movers wearing dark navy blue work polo shirts with bright safety flame-orange collars and chest logos loading furniture wrapped in deep navy blue quilted moving blankets into a clean white moving box truck with navy blue side panels and bright flame-orange "QuickMove Solutions" graphics and extended walk ramp outside a suburban residential house in ${targetCity} Alberta on a bright sunny day. ${brandDirective}`;
}

/**
 * Returns a static fallback image (zero 402 pollinations dependency).
 */
export function generateResonantMovingImageUrl(
  serviceFocus: string,
  titleOrConcept: string,
  targetCity: string = 'Calgary',
  seed?: number
): string {
  return '/images/quickmove-quote-concept.jpg';
}

