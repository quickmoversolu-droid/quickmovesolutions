import { NextResponse } from 'next/server';
import {
  getAiSettings,
  updateAiSettings,
  SUPPORTED_TEXT_MODELS,
  SUPPORTED_IMAGE_MODELS,
} from '@/lib/ai/openrouter-service';
import { getInsForgeConfig } from '@/lib/backend/insforge-service';

export async function GET() {
  const aiSettings = getAiSettings();
  const insforgeConfig = getInsForgeConfig();

  return NextResponse.json({
    ok: true,
    data: {
      aiSettings,
      insforgeConfig,
      supportedTextModels: SUPPORTED_TEXT_MODELS,
      supportedImageModels: SUPPORTED_IMAGE_MODELS,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const updated = updateAiSettings({
      apiKey: body.apiKey ? String(body.apiKey).trim() : undefined,
      activeTextModel: body.activeTextModel ? String(body.activeTextModel) : undefined,
      activeImageModel: body.activeImageModel ? String(body.activeImageModel) : undefined,
      temperature: typeof body.temperature === 'number' ? body.temperature : undefined,
      maxTokens: typeof body.maxTokens === 'number' ? body.maxTokens : undefined,
    });

    return NextResponse.json({
      ok: true,
      message: 'AI and OpenRouter settings updated successfully.',
      data: updated,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 400 }
    );
  }
}

