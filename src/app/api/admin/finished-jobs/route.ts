import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  getFinishedJobs,
  saveFinishedJob,
  deleteFinishedJob,
  type FinishedJobRecord,
} from '@/lib/db/platform-store';
import { syncRecordToInsForge } from '@/lib/backend/insforge-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get('featured') === 'true';

  let jobs = getFinishedJobs();
  if (featuredOnly) {
    jobs = jobs.filter((j) => j.featuredOnHome);
  }

  return NextResponse.json({ ok: true, data: jobs });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action = 'CREATE', job, id } = body;

    if (action === 'DELETE') {
      if (!id) {
        return NextResponse.json({ ok: false, error: 'Job ID is required to delete.' }, { status: 400 });
      }
      const deleted = deleteFinishedJob(id);
      return NextResponse.json({ ok: true, deleted });
    }

    if (action === 'TOGGLE_FEATURED') {
      if (!id) {
        return NextResponse.json({ ok: false, error: 'Job ID is required.' }, { status: 400 });
      }
      const all = getFinishedJobs();
      const existing = all.find((j) => j.id === id);
      if (!existing) {
        return NextResponse.json({ ok: false, error: 'Job not found.' }, { status: 404 });
      }
      existing.featuredOnHome = !existing.featuredOnHome;
      saveFinishedJob(existing);
      return NextResponse.json({ ok: true, data: existing });
    }

    if (!job || !job.title || !job.afterPhotoUrl) {
      return NextResponse.json(
        { ok: false, error: 'Title and completed job photo URL are required.' },
        { status: 400 }
      );
    }

    const newJob: FinishedJobRecord = {
      id: job.id || `job_fin_${crypto.randomBytes(4).toString('hex')}`,
      title: job.title.trim(),
      serviceType: job.serviceType || 'RESIDENTIAL_MOVING',
      location: job.location || 'Calgary, AB',
      completionDate: job.completionDate || new Date().toISOString().slice(0, 10),
      description: job.description || '',
      beforePhotoUrl: job.beforePhotoUrl || '',
      afterPhotoUrl: job.afterPhotoUrl,
      featuredOnHome: Boolean(job.featuredOnHome ?? true),
      createdAt: job.createdAt || new Date().toISOString(),
    };

    const saved = saveFinishedJob(newJob);

    // Sync to InsForge Postgres backend
    await syncRecordToInsForge('job_requests', {
      id: saved.id,
      notes: `[Finished Job Showcase] ${saved.title} - ${saved.location}`,
      status: 'COMPLETED',
    });

    return NextResponse.json({ ok: true, data: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save finished job.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
