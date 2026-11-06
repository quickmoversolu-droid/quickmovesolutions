'use client';

import * as React from 'react';
import {
  Camera,
  Upload,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardPhotoItem {
  id: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  dataUrl: string;
  caption: string;
  storageKey?: string;
}

export type UploadedPhotoItem = WizardPhotoItem;

export interface PhotoUploadManagerProps {
  photos: WizardPhotoItem[];
  onChange: (photos: WizardPhotoItem[]) => void;
  maxPhotos?: number;
  title?: string;
  label?: string;
  helperText?: string;
}

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

export function PhotoUploadManager({
  photos,
  onChange,
  maxPhotos = 12,
  title = 'Upload or Snap Photos',
  label,
  helperText = 'Take photos with your smartphone camera or drag and drop images from your device (JPEG, PNG, WebP up to 10 MB each).',
}: PhotoUploadManagerProps) {
  const headingText = label || title;
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const replaceInputRef = React.useRef<HTMLInputElement>(null);
  const [replaceTargetId, setReplaceTargetId] = React.useState<string | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });

  const handleFilesSelected = async (
    fileList: FileList | null,
    replaceId?: string | null
  ) => {
    if (!fileList || fileList.length === 0) return;
    setUploadError(null);

    const files = Array.from(fileList);

    if (!replaceId && photos.length + files.length > maxPhotos) {
      setUploadError(`You can upload up to ${maxPhotos} photos per request.`);
      return;
    }

    const newItems: WizardPhotoItem[] = [];

    for (const file of files) {
      const mime = file.type || 'image/jpeg';
      if (!ALLOWED_TYPES.includes(mime.toLowerCase())) {
        setUploadError(
          `"${file.name}" is not a supported image type. Please use JPG, PNG, WebP, or HEIC.`
        );
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds the 10 MB file size limit.`);
        continue;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        newItems.push({
          id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          originalFilename: file.name,
          mimeType: mime,
          fileSizeBytes: file.size,
          dataUrl,
          caption: '',
        });
      } catch {
        setUploadError(`Could not preview "${file.name}".`);
      }
    }

    if (replaceId && newItems.length > 0) {
      const replacement = newItems[0];
      onChange(
        photos.map((p) =>
          p.id === replaceId
            ? { ...replacement, id: p.id, caption: p.caption }
            : p
        )
      );
      setReplaceTargetId(null);
    } else if (newItems.length > 0) {
      onChange([...photos, ...newItems]);
    }
  };

  const removePhoto = (id: string) => {
    onChange(photos.filter((p) => p.id !== id));
  };

  const updateCaption = (id: string, caption: string) => {
    onChange(photos.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  const triggerReplace = (id: string) => {
    setReplaceTargetId(id);
    replaceInputRef.current?.click();
  };

  return (
    <div className="space-y-5">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFilesSelected(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          handleFilesSelected(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={(e) => {
          handleFilesSelected(e.target.files, replaceTargetId);
          e.target.value = '';
        }}
      />

      {/* Premium Dark-Mode Drag-and-Drop Zone & Camera Trigger */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFilesSelected(e.dataTransfer.files);
        }}
        className={cn(
          'rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all',
          isDragging
            ? 'border-brand-orange bg-brand-orange/15 shadow-orange-glow'
            : 'border-white/15 bg-[#09111E]/85 hover:border-brand-orange/50'
        )}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-orange/40 bg-brand-orange/20 text-brand-orange mb-3 shadow-md">
          <Camera className="h-7 w-7" />
        </div>
        <h4 className="font-heading text-base sm:text-lg font-extrabold text-white">
          {headingText}
        </h4>
        <p className="mt-1 text-xs sm:text-sm text-white/65 max-w-lg mx-auto">
          {helperText}
        </p>

        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="qm-orange-pill inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-heading text-sm font-extrabold text-white transition-all hover:scale-[1.02]"
          >
            <Camera className="h-4 w-4" />
            <span>Take Photo with Phone</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-heading text-sm font-bold text-white transition-all hover:border-brand-orange hover:bg-white/15"
          >
            <Upload className="h-4 w-4 text-brand-orange" />
            <span>Upload Photos from Device</span>
          </button>
        </div>

        <p className="mt-3 text-[11px] font-semibold text-white/50">
          {photos.length} of {maxPhotos} photos added
        </p>
      </div>

      {uploadError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-xs sm:text-sm font-medium text-red-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Uploaded Photo Previews with Replace, Remove & Optional Description */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="rounded-2xl border border-white/15 bg-[#0D1627] p-3.5 shadow-lg flex flex-col gap-3"
            >
              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-[#070C16]">
                {photo.dataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.dataUrl}
                    alt={photo.caption || `Uploaded job photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/40">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}

                <span className="absolute left-2.5 top-2.5 rounded-lg bg-[#05080D]/85 border border-white/15 px-2.5 py-1 text-[11px] font-mono font-bold text-brand-orange">
                  Photo #{index + 1}
                </span>

                <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => triggerReplace(photo.id)}
                    title="Replace image"
                    className="inline-flex items-center gap-1 rounded-lg bg-[#0B1322]/90 border border-white/20 px-2.5 py-1.5 text-xs font-heading font-bold text-white shadow hover:border-brand-orange"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-brand-orange" />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    title="Remove image"
                    className="inline-flex items-center gap-1 rounded-lg bg-red-600/90 px-2.5 py-1.5 text-xs font-heading font-bold text-white shadow hover:bg-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span className="truncate max-w-[200px] font-medium">
                    {photo.originalFilename}
                  </span>
                  <span>{Math.max(1, Math.round(photo.fileSizeBytes / 1024))} KB</span>
                </div>
                <input
                  type="text"
                  placeholder="Optional description (e.g., basement sectional sofa, garage boxes)..."
                  value={photo.caption}
                  onChange={(e) => updateCaption(photo.id, e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#080E1A] px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:border-brand-orange focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
