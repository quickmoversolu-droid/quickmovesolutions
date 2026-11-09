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
    name: 'Moving Truck on Driveway',
    service: 'Residential Moving',
    description: 'Clean white moving box truck parked on a suburban residential driveway with ramp down and moving equipment.',
    prompt:
      'Editorial commercial documentary photography of a clean white moving box truck parked on a paved suburban house driveway on a bright sunny day. The roll-up door is open with an aluminum walk ramp extended. Neatly stacked moving blankets and dolly visible. Pristine residential neighborhood, realistic 8k, natural light, no text, no logos.',
  },
  {
    id: 'movers-carrying-sofa',
    name: 'Movers Carrying Wrapped Couch',
    service: 'Residential Moving',
    description: 'Two professional movers in navy blue shirts carrying a protected sofa with moving blankets.',
    prompt:
      'Commercial documentary photograph of two friendly athletic professional movers wearing matching dark navy blue work polo shirts and sturdy work pants carefully lifting a sofa wrapped in dark blue quilted moving blankets with heavy-duty bands. Sunny daylight, outside a residential home, authentic moving day action, realistic photography, sharp focus 8k, no text, no illustration.',
  },
  {
    id: 'living-room-moving-boxes',
    name: 'Living Room Packed with Boxes',
    service: 'Packing & Supplies',
    description: 'Neatly organized and taped brown cardboard moving boxes stacked in a sunlit living room.',
    prompt:
      'High-resolution interior photography of a bright, sunlit modern living room with neatly stacked heavy-duty kraft brown cardboard moving boxes. Rolls of brown packaging tape, clear bubble wrap, and a black marker pen resting on top of a box. Hardwood floors, clean contemporary home aesthetic, authentic moving preparation, realistic 8k, no text.',
  },
  {
    id: 'junk-removal-clean-garage',
    name: 'Spotless Swept Garage After Cleanout',
    service: 'Junk Removal',
    description: 'Completely cleared and swept spacious two-car garage floor with sunlight beaming in.',
    prompt:
      'Bright architectural photograph of a spacious two-car residential garage that has just been completely cleared, cleaned, and swept. Spotless concrete floor, organized empty walls, sunbeams streaming through windows. Looking out to a paved driveway. Extremely satisfying clean and organized feeling, realistic 8k, no text.',
  },
  {
    id: 'furniture-blanket-pad-wrap',
    name: 'Furniture Pad & Shrink Wrap Care',
    service: 'Furniture Care & Protection',
    description: 'Movers carefully wrapping a wooden dining table or cabinet with padded quilted furniture pads.',
    prompt:
      'Close-up documentary shot of professional movers carefully wrapping a solid wood furniture piece with thick dark blue quilted moving blankets and clear plastic stretch film. Shows precision, attentive property care, and professional relocation craftsmanship. Soft natural indoor daylight, realistic 8k, no text.',
  },
  {
    id: 'heavy-appliance-dolly',
    name: 'Appliance Delivery with Dolly',
    service: 'Furniture & Appliance Delivery',
    description: 'Movers using a heavy-duty two-wheel hand truck to deliver a new appliance safely.',
    prompt:
      'Professional moving crew using a heavy-duty aluminum appliance hand truck with safety straps to maneuver a large wrapped household appliance carefully up an entryway. Focused teamwork, clean work gear, sunny daylight, realistic photography 8k, no text.',
  },
];

/**
 * Builds a concrete, photorealistic prompt that tightly resonates with moving & space-clearing.
 * Completely strips abstract campaign buzzwords (e.g. "Week 4 wrap-up").
 */
export function buildResonantMovingPrompt(
  serviceFocus: string = 'Residential Moving',
  titleOrConcept: string = '',
  targetCity: string = 'Calgary'
): string {
  const text = `${serviceFocus} ${titleOrConcept}`.toLowerCase();

  if (text.includes('junk') || text.includes('cleanout') || text.includes('clear') || text.includes('rubbish')) {
    return `Editorial documentary photography of an empty, completely swept and spotless two-car garage with sunbeams shining onto the clean floor after a full junk removal clearout in ${targetCity} Alberta. Pristine, organized, natural daylight, photorealistic 8k, no text, no illustration, no watermark.`;
  }

  if (text.includes('pack') || text.includes('box') || text.includes('supply')) {
    return `Interior photography of a sunlit modern living room with neatly stacked, sealed kraft cardboard moving boxes, rolls of bubble wrap, and packing tape on hardwood floors in ${targetCity} Alberta. Authentic organized moving day, realistic photography 8k, natural light, no text, no illustration.`;
  }

  if (text.includes('delivery') || text.includes('appliance') || text.includes('furniture')) {
    return `Commercial documentary photograph of two professional movers in navy blue work polo shirts carefully placing a pristine protected furniture piece with moving blankets inside a bright contemporary home in ${targetCity} Alberta. Attentive property care, realistic photography 8k, sharp focus, no text.`;
  }

  if (text.includes('commercial') || text.includes('office')) {
    return `Professional commercial movers using flat platform dollies to carefully transport office equipment and packed files through a modern bright corporate building hallway in ${targetCity} Alberta. Organized, trustworthy, realistic 8k, no text.`;
  }

  // Default: Residential Moving
  return `Commercial documentary photography of two friendly professional movers wearing dark navy blue work shirts loading furniture wrapped in protective quilted moving blankets into a clean white moving box truck with walk ramp extended outside a suburban residential house in ${targetCity} Alberta on a sunny day. Realistic authentic moving company, sharp focus 8k, natural lighting, no text, no illustration.`;
}

/**
 * Generates an image URL using the resonant moving prompt with a unique seed.
 */
export function generateResonantMovingImageUrl(
  serviceFocus: string,
  titleOrConcept: string,
  targetCity: string = 'Calgary',
  seed?: number
): string {
  const prompt = buildResonantMovingPrompt(serviceFocus, titleOrConcept, targetCity);
  const encodedPrompt = encodeURIComponent(prompt);
  const randomSeed = seed ?? Math.floor(Math.random() * 899999) + 100000;
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1080&nologo=true&seed=${randomSeed}`;
}

