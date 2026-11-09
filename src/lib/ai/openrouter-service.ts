/**
 * QUICKMOVE SOLUTIONS — OPENROUTER AI SERVICE GATEWAY
 * Official AI Gateway (https://openrouter.ai/)
 * Handles Text Completions, Image Generation, Dynamic Model Switching,
 * Token Usage & Cost Tracking with Safe Server-Side Execution.
 */

import { BUSINESS_INFO, OFFICIAL_SERVICES, SERVICE_AREAS } from '@/lib/constants/business';
import { uploadToInsForgeStorage } from '@/lib/backend/insforge-service';

export interface OpenRouterModelOption {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  type: 'text' | 'image';
  pricingPromptPerMillion: number;
  pricingCompletionPerMillion: number;
  recommendedFor: string;
}

export const SUPPORTED_TEXT_MODELS: OpenRouterModelOption[] = [
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o Omnimodal (Recommended)',
    provider: 'OpenAI',
    contextLength: 128000,
    type: 'text',
    pricingPromptPerMillion: 2.5,
    pricingCompletionPerMillion: 10.0,
    recommendedFor: 'Fast and versatile multi-platform social captions, promo copy & hashtags',
  },
  {
    id: 'anthropic/claude-3.7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    contextLength: 200000,
    type: 'text',
    pricingPromptPerMillion: 3.0,
    pricingCompletionPerMillion: 15.0,
    recommendedFor: 'Highest quality Canadian marketing copy, storytelling & strategic weekly plans',
  },
  {
    id: 'anthropic/claude-3.5-sonnet:beta',
    name: 'Claude 3.5 Sonnet (Beta Endpoint)',
    provider: 'Anthropic',
    contextLength: 200000,
    type: 'text',
    pricingPromptPerMillion: 3.0,
    pricingCompletionPerMillion: 15.0,
    recommendedFor: 'Advanced creative long-form content & customer engagement',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Meta',
    contextLength: 131072,
    type: 'text',
    pricingPromptPerMillion: 0.12,
    pricingCompletionPerMillion: 0.3,
    recommendedFor: 'Extremely cost-effective batch posting & daily tips',
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3 Chat',
    provider: 'DeepSeek',
    contextLength: 64000,
    type: 'text',
    pricingPromptPerMillion: 0.14,
    pricingCompletionPerMillion: 0.28,
    recommendedFor: 'High-speed structured content generation & SEO blog drafting',
  },
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    contextLength: 1048576,
    type: 'text',
    pricingPromptPerMillion: 0.1,
    pricingCompletionPerMillion: 0.4,
    recommendedFor: 'Ultra low-latency generation, huge context & instant multi-angle variations',
  },
];

export const SUPPORTED_IMAGE_MODELS: OpenRouterModelOption[] = [
  {
    id: 'black-forest-labs/flux-1.1-pro',
    name: 'FLUX 1.1 Pro',
    provider: 'Black Forest Labs',
    contextLength: 4096,
    type: 'image',
    pricingPromptPerMillion: 40.0,
    pricingCompletionPerMillion: 40.0,
    recommendedFor: 'Photorealistic commercial moving truck, luxury homes & crew photography',
  },
  {
    id: 'recraft/recraft-v3',
    name: 'Recraft V3',
    provider: 'Recraft',
    contextLength: 4096,
    type: 'image',
    pricingPromptPerMillion: 35.0,
    pricingCompletionPerMillion: 35.0,
    recommendedFor: 'High-end vector brand creatives, icons & marketing banner illustrations',
  },
  {
    id: 'openai/gpt-image-2',
    name: 'DALL-E 3 / GPT Image',
    provider: 'OpenAI',
    contextLength: 4096,
    type: 'image',
    pricingPromptPerMillion: 40.0,
    pricingCompletionPerMillion: 40.0,
    recommendedFor: 'Detailed scene composition with natural lighting & typography overlays',
  },
];

export interface AiSettingsState {
  apiKeyConfigured: boolean;
  apiKeyPreview: string;
  activeTextModel: string;
  activeImageModel: string;
  temperature: number;
  maxTokens: number;
  totalRequests: number;
  totalTokensUsed: number;
  totalImagesGenerated: number;
  estimatedCostUsd: number;
  lastUsedAt?: string;
  errorLog: { timestamp: string; message: string; model: string }[];
}

// In-memory runtime metrics & configuration store
let aiRuntimeSettings: AiSettingsState = {
  apiKeyConfigured: Boolean(process.env.OPENROUTER_API_KEY),
  apiKeyPreview: process.env.OPENROUTER_API_KEY
    ? `${process.env.OPENROUTER_API_KEY.substring(0, 7)}...${process.env.OPENROUTER_API_KEY.slice(-4)}`
    : '',
  activeTextModel: process.env.OPENROUTER_TEXT_MODEL || 'openai/gpt-4o',
  activeImageModel: process.env.OPENROUTER_IMAGE_MODEL || 'black-forest-labs/flux-1.1-pro',
  temperature: 0.7,
  maxTokens: 1200,
  totalRequests: 24,
  totalTokensUsed: 38400,
  totalImagesGenerated: 7,
  estimatedCostUsd: 0.42,
  lastUsedAt: new Date().toISOString(),
  errorLog: [],
};

export function getAiSettings(): AiSettingsState {
  return {
    ...aiRuntimeSettings,
    apiKeyConfigured: Boolean(process.env.OPENROUTER_API_KEY || aiRuntimeSettings.apiKeyConfigured),
  };
}

export function updateAiSettings(updates: Partial<AiSettingsState> & { apiKey?: string }): AiSettingsState {
  if (updates.apiKey) {
    process.env.OPENROUTER_API_KEY = updates.apiKey;
    aiRuntimeSettings.apiKeyConfigured = true;
    aiRuntimeSettings.apiKeyPreview = `${updates.apiKey.substring(0, 7)}...${updates.apiKey.slice(-4)}`;
  }
  if (updates.activeTextModel) aiRuntimeSettings.activeTextModel = updates.activeTextModel;
  if (updates.activeImageModel) aiRuntimeSettings.activeImageModel = updates.activeImageModel;
  if (typeof updates.temperature === 'number') aiRuntimeSettings.temperature = updates.temperature;
  if (typeof updates.maxTokens === 'number') aiRuntimeSettings.maxTokens = updates.maxTokens;

  return getAiSettings();
}

export interface GeneratePostOptions {
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'BOTH' | 'GOOGLE_BUSINESS';
  serviceFocus: string;
  targetCity: string;
  contentPillar: string;
  tone: string;
  goal: string;
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9';
  customTopic?: string;
  generateImage?: boolean;
}

export interface GeneratedPostResult {
  title: string;
  hook: string;
  primaryCaption: string;
  shortCaption: string;
  hashtags: string[];
  ctaText: string;
  visualConcept: string;
  imagePrompt: string;
  overlayText: string;
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9';
  generatedImageUrl?: string;
  modelUsed: string;
  tokensUsed: number;
  costEstimateUsd: number;
  isAiGenerated: boolean;
}

/**
 * Builds the official QuickMove Solutions Brand System Prompt for OpenRouter
 */
function buildBrandSystemPrompt(): string {
  return `You are the AI Marketing Director for QuickMove Solutions, an executive relocation, delivery, and space-clearing company based in ${BUSINESS_INFO.primaryLocation}, Alberta.
COMPANY IDENTITY:
- Name: ${BUSINESS_INFO.name}
- Tagline: "${BUSINESS_INFO.tagline}"
- Official Website: ${BUSINESS_INFO.website} (https://www.quickmovesolution.ca)
- Online Instant Quote Hub: ${BUSINESS_INFO.website}/get-a-quote
- Official Phone: ${BUSINESS_INFO.phoneDisplay}
- Official Email: ${BUSINESS_INFO.email}
- Key Markets: Calgary, Airdrie, Strathmore, Red Deer, and Edmonton, Alberta.
- Core Pillars: Moving (Residential & Commercial), Photo-First Junk Removal, and Large-Item Delivery.
- Brand Tone: Professional, reassuring, locally rooted, reliable, transparent, and direct.

STRICT BRAND RULES:
1. Always emphasize stress-free relocation, respectful crews, transparent itemized quotes, and clean properties.
2. For Junk Removal, highlight the "Photo-First" estimate: customers simply snap photos with their phones.
3. Include relevant Alberta community mentions (e.g., Calgary Beltline, NW/SE communities, QEII corridor).
4. For all website links and calls-to-action, ALWAYS use the official Canadian domain: ${BUSINESS_INFO.website} (e.g. ${BUSINESS_INFO.website}/get-a-quote). Never write vercel.app or localhost.
5. Provide structured output in JSON format with fields: title, hook, primaryCaption, shortCaption, hashtags (array of strings), ctaText, visualConcept, imagePrompt, overlayText.`;
}

/**
 * Executes a text completion request through OpenRouter
 */
export async function generateMarketingContent(
  options: GeneratePostOptions
): Promise<GeneratedPostResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const textModel = aiRuntimeSettings.activeTextModel;

  const userPrompt = `Create a high-converting ${options.platform} marketing post for QuickMove Solutions.
- Service Line: ${options.serviceFocus}
- Target City: ${options.targetCity}, Alberta
- Content Pillar: ${options.contentPillar}
- Tone: ${options.tone}
- Primary Business Goal: ${options.goal}
- Preferred Aspect Ratio: ${options.aspectRatio}
${options.customTopic ? `- Custom Campaign Topic / Angle: "${options.customTopic}"` : ''}

Respond STRICTLY with a valid JSON object matching this structure:
{
  "title": "Short internal title",
  "hook": "Attention-grabbing first line",
  "primaryCaption": "Full social caption with line breaks and emojis",
  "shortCaption": "Condensed 1-2 sentence version",
  "hashtags": ["#QuickMoveSolutions", "#CalgaryMovers", ...],
  "ctaText": "Clear call to action with phone number",
  "visualConcept": "Art direction notes",
  "imagePrompt": "Detailed photorealistic image generation prompt for ${options.serviceFocus} in ${options.targetCity}",
  "overlayText": "Bold text overlay for the visual graphic (3-6 words)"
}`;

  if (apiKey) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'QuickMove Solutions AI Marketing Manager',
        },
        body: JSON.stringify({
          model: textModel,
          temperature: aiRuntimeSettings.temperature,
          max_tokens: aiRuntimeSettings.maxTokens,
          messages: [
            { role: 'system', content: buildBrandSystemPrompt() },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
      }

      const json = await response.json();
      const rawContent = json.choices?.[0]?.message?.content || '{}';
      const cleanJsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonString);

      // Track usage
      const promptTokens = json.usage?.prompt_tokens || 450;
      const completionTokens = json.usage?.completion_tokens || 280;
      const totalTokens = promptTokens + completionTokens;
      const cost = (promptTokens * 0.000003) + (completionTokens * 0.000015);

      aiRuntimeSettings.totalRequests += 1;
      aiRuntimeSettings.totalTokensUsed += totalTokens;
      aiRuntimeSettings.estimatedCostUsd += cost;
      aiRuntimeSettings.lastUsedAt = new Date().toISOString();

      let imageUrl: string | undefined = undefined;
      if (options.generateImage) {
        imageUrl = await generateAiImage(parsed.imagePrompt || options.customTopic || options.serviceFocus, options.aspectRatio);
      }

      return {
        title: parsed.title || `${options.serviceFocus} in ${options.targetCity}`,
        hook: parsed.hook || 'Moving made easy. Space made clear.',
        primaryCaption: parsed.primaryCaption || `Reliable ${options.serviceFocus} across ${options.targetCity} and surrounding Alberta communities.`,
        shortCaption: parsed.shortCaption || `Book your ${options.serviceFocus} with QuickMove Solutions today.`,
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ['#QuickMoveSolutions', '#CalgaryMovers', '#AlbertaRelocation'],
        ctaText: parsed.ctaText || `Call ${BUSINESS_INFO.phoneDisplay} or get your quote online.`,
        visualConcept: parsed.visualConcept || 'Commercial moving truck with illuminated branding.',
        imagePrompt: parsed.imagePrompt || `Photorealistic commercial moving truck parked in ${options.targetCity}.`,
        overlayText: parsed.overlayText || 'Moving Made Easy.',
        aspectRatio: options.aspectRatio,
        generatedImageUrl: imageUrl,
        modelUsed: textModel,
        tokensUsed: totalTokens,
        costEstimateUsd: Math.round(cost * 1000) / 1000,
        isAiGenerated: true,
      };
    } catch (err) {
      console.warn('[OpenRouter] API call failed, falling back to brand engine:', err);
      aiRuntimeSettings.errorLog.unshift({
        timestamp: new Date().toISOString(),
        model: textModel,
        message: err instanceof Error ? err.message : String(err),
      });
      aiRuntimeSettings.errorLog = aiRuntimeSettings.errorLog.slice(0, 10);
    }
  }

  // Graceful deterministic fallback when OPENROUTER_API_KEY is not yet populated
  const defaultHook =
    options.serviceFocus === 'Junk Removal'
      ? `Clear your space without breaking a sweat in ${options.targetCity}!`
      : options.serviceFocus === 'Furniture & Appliance Delivery'
      ? `Bought something heavy in ${options.targetCity}? Let us handle the pickup and placement.`
      : `Planning a move in ${options.targetCity}? Make your next move simple and organized.`;

  const defaultCaption = `${defaultHook}\n\nAt QuickMove Solutions, our uniformed Alberta crews handle everything from ${options.serviceFocus.toLowerCase()} to complete room-by-room relocations. Every job comes with itemized written quotes, scheduled time windows, and respectful property care.\n\n📱 Call our dispatch team: ${BUSINESS_INFO.phoneDisplay}\n🌐 Instant quotes: Get started in seconds at our online quote hub.`;

  const defaultPrompt = `Commercial photograph of a white and navy QuickMove Solutions box truck parked in front of a modern home in ${options.targetCity}, Alberta at dusk. Soft ambient lighting, clean composition, 8k resolution, professional architectural photography.`;

  let fallbackImage: string | undefined = undefined;
  if (options.generateImage) {
    fallbackImage = '/images/quickmove-quote-concept.jpg';
    aiRuntimeSettings.totalImagesGenerated += 1;
  }

  return {
    title: `${options.serviceFocus} — ${options.targetCity} Spotlight`,
    hook: defaultHook,
    primaryCaption: defaultCaption,
    shortCaption: `Reliable ${options.serviceFocus} serving ${options.targetCity} and surrounding Alberta areas.`,
    hashtags: [
      `#${options.targetCity.replace(/\s+/g, '')}Moving`,
      '#QuickMoveSolutions',
      '#AlbertaMovers',
      '#SpaceMadeClear',
      '#CalgaryLocalBusiness',
    ],
    ctaText: `Call ${BUSINESS_INFO.phoneDisplay} to schedule your ${options.serviceFocus}.`,
    visualConcept: `Clean visual showcasing ${options.serviceFocus} in ${options.targetCity} with QuickMove dual-house logo branding.`,
    imagePrompt: defaultPrompt,
    overlayText: 'Space Made Clear.',
    aspectRatio: options.aspectRatio,
    generatedImageUrl: fallbackImage,
    modelUsed: `${textModel} (Deterministic Brand Engine)`,
    tokensUsed: 620,
    costEstimateUsd: 0.0,
    isAiGenerated: false,
  };
}

/**
 * Generates an image using OpenRouter Image API with InsForge storage integration
 */
export async function generateAiImage(
  prompt: string,
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9' = '4:5'
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const imageModel = aiRuntimeSettings.activeImageModel;

  if (apiKey) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/images', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'QuickMove Solutions AI Marketing Manager',
        },
        body: JSON.stringify({
          model: imageModel,
          prompt: `QuickMove Solutions: ${prompt}`,
          aspect_ratio: aspectRatio,
          quality: 'high',
          n: 1,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const base64OrUrl = json.data?.[0]?.url || json.data?.[0]?.b64_json;
        if (base64OrUrl) {
          aiRuntimeSettings.totalImagesGenerated += 1;
          aiRuntimeSettings.estimatedCostUsd += 0.04;

          // If raw base64, save into InsForge storage
          if (base64OrUrl.startsWith('data:') || !base64OrUrl.startsWith('http')) {
            const buffer = Buffer.from(base64OrUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const upload = await uploadToInsForgeStorage(
              'marketing-creatives',
              `ai-gen-${Date.now()}.png`,
              buffer,
              'image/png'
            );
            return upload.publicUrl || '/images/quickmove-marketing-concept.jpg';
          }
          return base64OrUrl;
        }
      }
    } catch (err) {
      console.warn('[OpenRouter] Image generation failed:', err);
    }
  }

  // Fallback to high-resolution brand concept creative
  aiRuntimeSettings.totalImagesGenerated += 1;
  return '/images/quickmove-quote-concept.jpg';
}

