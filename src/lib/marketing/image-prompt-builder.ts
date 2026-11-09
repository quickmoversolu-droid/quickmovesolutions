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
    description: 'Clean white moving box truck with navy blue (#101D35) & flame-orange (#F47732) branding parked on a sunny paved driveway.',
    prompt:
      'Editorial commercial documentary photography of a modern clean white moving box truck parked on a paved suburban house driveway on a bright sunny day in Calgary, Alberta. The truck body features clean dark navy blue (#101D35) side panels with vibrant safety flame-orange (#F47732) striping and "QuickMove Solutions" typography. The roll-up back door is open with an aluminum walk ramp extended. Neatly stacked dark navy blue quilted moving blankets and an orange moving dolly are visible. Pristine residential neighborhood, natural sunlight, photorealistic 8k, sharp focus.',
  },
  {
    id: 'movers-carrying-sofa',
    name: 'Movers Carrying Wrapped Couch',
    service: 'Residential Moving',
    description: 'Two professional movers in navy blue work shirts with flame-orange trim carrying a protected sofa.',
    prompt:
      'Commercial documentary photograph of two friendly athletic professional movers wearing matching dark navy blue (#101D35) work polo shirts with subtle flame-orange (#F47732) trim and durable work pants. They are carefully carrying a sofa protected in dark navy blue quilted moving blankets with safety orange tie-down straps. Sunny daylight outside an upscale residential home in Calgary Alberta, authentic moving day craftsmanship, realistic photography, sharp focus 8k.',
  },
  {
    id: 'living-room-moving-boxes',
    name: 'Living Room Packed with Boxes',
    service: 'Packing & Supplies',
    description: 'Neatly organized kraft cardboard moving boxes with orange QuickMove labels stacked in a sunlit living room.',
    prompt:
      'High-resolution interior photography of a bright, sunlit modern living room with neatly stacked heavy-duty kraft brown cardboard moving boxes with clean orange label accents. Rolls of packing tape, clear bubble wrap, and dark navy quilted padding in the background on polished hardwood floors. Contemporary Alberta home aesthetic, authentic moving preparation, realistic 8k, natural light.',
  },
  {
    id: 'junk-removal-clean-garage',
    name: 'Spotless Swept Garage After Cleanout',
    service: 'Junk Removal',
    description: 'Completely cleared and swept spacious two-car garage floor with sunlight beaming in.',
    prompt:
      'Bright architectural photograph of a spacious two-car residential garage that has just been completely cleared, cleaned, and swept after professional junk removal in Calgary. Spotless concrete floor, organized clean walls, sunbeams streaming through windows toward a paved driveway. Clean, spacious, and organized feeling, realistic 8k, authentic documentary photography.',
  },
  {
    id: 'furniture-blanket-pad-wrap',
    name: 'Furniture Pad & Shrink Wrap Care',
    service: 'Furniture Care & Protection',
    description: 'Movers carefully wrapping a wooden dining table or cabinet with padded quilted furniture pads.',
    prompt:
      'Close-up documentary shot of professional movers in dark navy blue work shirts with orange trim carefully wrapping a solid wood furniture piece with thick dark navy quilted moving blankets and clear stretch wrap. Precision property care and professional relocation craftsmanship, soft natural indoor daylight, realistic 8k.',
  },
  {
    id: 'heavy-appliance-dolly',
    name: 'Appliance Delivery with Dolly',
    service: 'Furniture & Appliance Delivery',
    description: 'Movers using a heavy-duty two-wheel hand truck to deliver a new appliance safely.',
    prompt:
      'Professional moving crew using a heavy-duty aluminum appliance hand truck with bright orange safety straps to maneuver a large wrapped household appliance carefully up an entryway in Alberta. Clean dark navy uniforms with flame-orange branding accents, sunny daylight, realistic photography 8k.',
  },
];

/**
 * Builds a concrete, photorealistic prompt that tightly resonates with moving & space-clearing.
 * Injects QuickMove brand colors: Dark Navy (#101D35), Flame Orange (#F47732), and clean white truck.
 */
export function buildResonantMovingPrompt(
  serviceFocus: string = 'Residential Moving',
  titleOrConcept: string = '',
  targetCity: string = 'Calgary'
): string {
  const text = `${serviceFocus} ${titleOrConcept}`.toLowerCase();

  if (text.includes('junk') || text.includes('cleanout') || text.includes('clear') || text.includes('rubbish')) {
    return `Editorial commercial documentary photography of an empty, completely swept and spotless two-car garage with sunbeams shining onto the clean floor after a full junk removal clearout in ${targetCity} Alberta. A clean white truck with dark navy blue (#101D35) and flame-orange (#F47732) QuickMove Solutions branding parked outside on the sunny driveway. Pristine, organized, natural daylight, photorealistic 8k.`;
  }

  if (text.includes('pack') || text.includes('box') || text.includes('supply')) {
    return `Interior photography of a sunlit modern living room with neatly stacked, sealed kraft cardboard moving boxes with orange QuickMove labeling, rolls of bubble wrap, and dark navy blue protective quilted pads on hardwood floors in ${targetCity} Alberta. Authentic organized moving day, realistic photography 8k, natural light.`;
  }

  if (text.includes('delivery') || text.includes('appliance') || text.includes('furniture')) {
    return `Commercial documentary photograph of two professional movers wearing dark navy blue (#101D35) work shirts with bright flame-orange (#F47732) collars carefully placing a protected furniture piece with dark navy moving blankets inside a bright contemporary home in ${targetCity} Alberta. Attentive property care, realistic photography 8k, sharp focus.`;
  }

  if (text.includes('commercial') || text.includes('office')) {
    return `Professional commercial movers in dark navy blue (#101D35) uniforms with orange trim using heavy-duty platform dollies to carefully transport office equipment and packed files through a modern bright corporate building hallway in ${targetCity} Alberta. A clean white QuickMove box truck visible through glass windows outside. Realistic 8k documentary photography.`;
  }

  // Default: Residential Moving
  return `Commercial documentary photography of two friendly athletic professional movers wearing dark navy blue (#101D35) work polo shirts with subtle flame-orange (#F47732) accents loading furniture wrapped in dark navy quilted moving blankets into a clean white moving box truck with navy and flame-orange QuickMove Solutions side graphics and walk ramp extended outside a suburban residential house in ${targetCity} Alberta on a bright sunny day. Realistic authentic moving company, sharp focus 8k, natural lighting.`;
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

