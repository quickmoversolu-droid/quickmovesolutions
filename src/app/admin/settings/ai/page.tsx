'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Key,
  Cpu,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Database,
  ExternalLink,
  Save,
  Check,
  Zap,
} from 'lucide-react';
import type {
  AiSettingsState,
  OpenRouterModelOption,
} from '@/lib/ai/openrouter-service';
import type { InsForgeConfig } from '@/lib/backend/insforge-service';

export default function AdminAiSettingsPage() {
  const [aiSettings, setAiSettings] = useState<AiSettingsState | null>(null);
  const [insforgeConfig, setInsforgeConfig] = useState<InsForgeConfig | null>(null);
  const [textModels, setTextModels] = useState<OpenRouterModelOption[]>([]);
  const [imageModels, setImageModels] = useState<OpenRouterModelOption[]>([]);

  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedTextModel, setSelectedTextModel] = useState('');
  const [selectedImageModel, setSelectedImageModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1200);

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/ai/settings');
      const json = await res.json();
      if (json.ok && json.data) {
        setAiSettings(json.data.aiSettings);
        setInsforgeConfig(json.data.insforgeConfig);
        setTextModels(json.data.supportedTextModels || []);
        setImageModels(json.data.supportedImageModels || []);

        setSelectedTextModel(json.data.aiSettings.activeTextModel);
        setSelectedImageModel(json.data.aiSettings.activeImageModel);
        setTemperature(json.data.aiSettings.temperature);
        setMaxTokens(json.data.aiSettings.maxTokens);
      }
    } catch (err) {
      console.error('Error loading AI settings:', err);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/ai/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKeyInput.trim() || undefined,
          activeTextModel: selectedTextModel,
          activeImageModel: selectedImageModel,
          temperature: Number(temperature),
          maxTokens: Number(maxTokens),
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setFeedback('AI & OpenRouter settings updated and active.');
        setApiKeyInput('');
        await loadSettings();
      } else {
        setFeedback(data.error || 'Failed to update settings');
      }
    } catch (err) {
      setFeedback('Error connecting to settings API');
    } finally {
      setIsSaving(false);
    }
  };

  if (!aiSettings) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0A1324] p-12 text-center text-sm font-bold text-white/80 shadow-dark-card">
        Loading OpenRouter AI &amp; InsForge Backend Settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#060C18] via-[#0B162A] to-[#08101E] p-6 sm:p-8 shadow-dark-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/35 bg-brand-orange/15 px-3.5 py-1 text-xs font-bold text-brand-orange">
              <Sparkles className="h-3.5 w-3.5" />
              Phase 8B • Official Infrastructure
            </span>
            <h1 className="mt-2 font-heading text-2xl font-extrabold text-white sm:text-3xl">
              OpenRouter AI Gateway &amp; InsForge Backend
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-white/65">
              Configure models for the AI Marketing Manager, manage API credentials securely on the
              server, and monitor generation token usage and cost metrics.
            </p>
          </div>

          <Link
            href="/admin/marketing"
            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:border-brand-orange"
          >
            ← Open AI Marketing Manager
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-brand-orange/40 bg-brand-orange/15 px-5 py-3.5 text-xs font-bold text-white shadow-orange-glow">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-orange" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Infrastructure Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* OpenRouter Status */}
        <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 shadow-dark-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              AI Gateway
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                aiSettings.apiKeyConfigured
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {aiSettings.apiKeyConfigured ? 'Connected' : 'Demo Engine'}
            </span>
          </div>
          <div className="mt-2 font-heading text-lg font-bold text-white">OpenRouter API</div>
          <p className="text-xs text-white/55">
            Key: {aiSettings.apiKeyPreview || 'Deterministic Brand Fallback Active'}
          </p>
        </div>

        {/* InsForge Status */}
        <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 shadow-dark-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Backend BaaS
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                insforgeConfig?.isConnected
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-sky-500/20 text-sky-300'
              }`}
            >
              {insforgeConfig?.isConnected ? 'Live Cloud' : 'Local Storage Mode'}
            </span>
          </div>
          <div className="mt-2 font-heading text-lg font-bold text-white">InsForge DB &amp; Buckets</div>
          <p className="truncate text-xs text-white/55">
            {insforgeConfig?.baseUrl || 'insforge.dev'}
          </p>
        </div>

        {/* Requests & Tokens */}
        <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 shadow-dark-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              AI Activity
            </span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-heading text-lg font-bold text-white">
            {aiSettings.totalRequests} Requests
          </div>
          <p className="text-xs text-white/55">
            {aiSettings.totalTokensUsed.toLocaleString()} Tokens Processed
          </p>
        </div>

        {/* Estimated Cost */}
        <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 shadow-dark-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Cost Tracking
            </span>
            <span className="text-xs font-bold text-emerald-400">Low Cost</span>
          </div>
          <div className="mt-2 font-heading text-lg font-bold text-white">
            ${aiSettings.estimatedCostUsd.toFixed(3)} USD
          </div>
          <p className="text-xs text-white/55">
            {aiSettings.totalImagesGenerated} AI Images Generated
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: API Key & Model Selectors */}
        <div className="space-y-6 lg:col-span-7">
          {/* OpenRouter API Key Input */}
          <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-6 shadow-dark-card">
            <div className="flex items-center gap-2.5 pb-4">
              <Key className="h-5 w-5 text-brand-orange" />
              <h2 className="font-heading text-lg font-bold text-white">OpenRouter API Key</h2>
            </div>

            <p className="text-xs leading-relaxed text-white/65">
              Enter your secret API key from{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-sky-400 hover:underline"
              >
                openrouter.ai/keys <ExternalLink className="inline h-3 w-3" />
              </a>
              . Keys are stored strictly on the server environment and never exposed to the client.
            </p>

            <div className="mt-4">
              <input
                type="password"
                placeholder={aiSettings.apiKeyConfigured ? '•••••••••••••••••••••••••••••• (Active)' : 'sk-or-v1-...'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#060C18] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-orange focus:outline-none"
              />
            </div>
          </div>

          {/* Text Model Selection */}
          <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-6 shadow-dark-card">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <Cpu className="h-5 w-5 text-brand-orange" />
                <h2 className="font-heading text-lg font-bold text-white">
                  Text Generation Model
                </h2>
              </div>
              <span className="rounded-full bg-brand-orange/15 px-3 py-0.5 text-xs font-bold text-brand-orange">
                Configurable
              </span>
            </div>

            <div className="space-y-3">
              {textModels.map((model) => {
                const isSelected = selectedTextModel === model.id;
                return (
                  <div
                    key={model.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTextModel(model.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setSelectedTextModel(model.id);
                    }}
                    className={`flex items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-brand-orange bg-brand-orange/15 shadow-orange-glow'
                        : 'border-white/10 bg-[#060C18] hover:border-white/25'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{model.name}</span>
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
                          {model.provider}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/65">{model.recommendedFor}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-emerald-400">
                        ${model.pricingPromptPerMillion}/M in
                      </div>
                      {isSelected && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-bold text-white">
                          <Check className="h-2.5 w-2.5" /> Selected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image Generation Model Selection */}
          <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-6 shadow-dark-card">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="h-5 w-5 text-brand-orange" />
                <h2 className="font-heading text-lg font-bold text-white">
                  Image Generation Model
                </h2>
              </div>
              <span className="rounded-full bg-brand-orange/15 px-3 py-0.5 text-xs font-bold text-brand-orange">
                Visual Studio
              </span>
            </div>

            <div className="space-y-3">
              {imageModels.map((model) => {
                const isSelected = selectedImageModel === model.id;
                return (
                  <div
                    key={model.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedImageModel(model.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setSelectedImageModel(model.id);
                    }}
                    className={`flex items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-brand-orange bg-brand-orange/15 shadow-orange-glow'
                        : 'border-white/10 bg-[#060C18] hover:border-white/25'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{model.name}</span>
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
                          {model.provider}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/65">{model.recommendedFor}</p>
                    </div>

                    <div className="text-right shrink-0">
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-bold text-white">
                          <Check className="h-2.5 w-2.5" /> Selected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Generation Settings & InsForge Connection */}
        <div className="space-y-6 lg:col-span-5">
          {/* Generation Settings */}
          <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-6 shadow-dark-card space-y-4">
            <h3 className="font-heading text-base font-bold text-white">Generation Parameters</h3>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-white/70">Creativity (Temperature)</span>
                <span className="font-bold text-brand-orange">{temperature}</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={1.0}
                step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="mt-2 w-full accent-brand-orange"
              />
              <div className="flex justify-between text-[10px] text-white/40">
                <span>0.2 (Precise)</span>
                <span>0.7 (Balanced)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-white/70">Max Tokens</span>
                <span className="font-bold text-brand-orange">{maxTokens}</span>
              </div>
              <input
                type="number"
                min={400}
                max={4000}
                step={100}
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#060C18] px-3.5 py-2 text-xs font-semibold text-white focus:border-brand-orange focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F47732] to-[#ff8c4a] px-5 py-3 text-sm font-bold text-white shadow-orange-glow transition-all hover:brightness-110 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save AI Configuration'}
            </button>
          </div>

          {/* InsForge Architecture Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-6 shadow-dark-card space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-brand-orange" />
              <h3 className="font-heading text-sm font-bold text-white">InsForge Architecture</h3>
            </div>
            <p className="text-xs text-white/65 leading-relaxed">
              QuickMove Solutions uses InsForge (<code>https://insforge.dev</code>) for relational
              PostgreSQL data, customer quote photos, and generated marketing creatives.
            </p>
            <div className="rounded-xl border border-white/10 bg-[#060C18] p-3 text-xs text-white/75 space-y-1">
              <div>• Storage Bucket: <code>customer-photos</code></div>
              <div>• Storage Bucket: <code>marketing-creatives</code></div>
              <div>• SDK: <code>@insforge/sdk</code></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

